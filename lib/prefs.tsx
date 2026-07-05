"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

const VISIBILITY_KEY = "gd_st_demo_visibility_v1";
const COMMENTS_KEY = "gd_st_demo_comments_v1";

export interface DemoComment {
  id: string;
  routePath: string;
  routeName: string;
  persona: string;
  body: string;
  createdAt: string;
}

interface VisibilityState {
  disabledGroups: string[];
  disabledRoutes: string[];
  disabledActions: Record<string, string[]>;
}

const emptyVisibility: VisibilityState = {
  disabledGroups: [],
  disabledRoutes: [],
  disabledActions: {}
};

interface DemoPrefsValue {
  prefsHydrated: boolean;
  visibility: VisibilityState;
  toggleGroup: (group: string) => void;
  toggleRoute: (path: string) => void;
  toggleAction: (path: string, action: string) => void;
  isGroupDisabled: (group: string) => boolean;
  isRouteDisabled: (path: string) => boolean;
  isActionDisabled: (path: string, action: string) => boolean;
  resetVisibility: () => void;
  comments: DemoComment[];
  addComment: (comment: Omit<DemoComment, "id" | "createdAt">) => void;
  removeComment: (id: string) => void;
  clearComments: () => void;
}

const DemoPrefsContext = createContext<DemoPrefsValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function DemoPrefsProvider({ children }: { children: ReactNode }) {
  const [prefsHydrated, setPrefsHydrated] = useState(false);
  const [visibility, setVisibility] = useState<VisibilityState>(emptyVisibility);
  const [comments, setComments] = useState<DemoComment[]>([]);

  useEffect(() => {
    setVisibility(readJson(VISIBILITY_KEY, emptyVisibility));
    setComments(readJson(COMMENTS_KEY, [] as DemoComment[]));
    setPrefsHydrated(true);
  }, []);

  useEffect(() => {
    if (prefsHydrated) {
      writeJson(VISIBILITY_KEY, visibility);
    }
  }, [prefsHydrated, visibility]);

  useEffect(() => {
    if (prefsHydrated) {
      writeJson(COMMENTS_KEY, comments);
    }
  }, [prefsHydrated, comments]);

  const toggleGroup = useCallback((group: string) => {
    setVisibility((current) => ({
      ...current,
      disabledGroups: toggleInList(current.disabledGroups, group)
    }));
  }, []);

  const toggleRoute = useCallback((path: string) => {
    setVisibility((current) => ({
      ...current,
      disabledRoutes: toggleInList(current.disabledRoutes, path)
    }));
  }, []);

  const toggleAction = useCallback((path: string, action: string) => {
    setVisibility((current) => {
      const forRoute = current.disabledActions[path] ?? [];
      return {
        ...current,
        disabledActions: {
          ...current.disabledActions,
          [path]: toggleInList(forRoute, action)
        }
      };
    });
  }, []);

  const isGroupDisabled = useCallback(
    (group: string) => visibility.disabledGroups.includes(group),
    [visibility.disabledGroups]
  );

  const isRouteDisabled = useCallback(
    (path: string) => visibility.disabledRoutes.includes(path),
    [visibility.disabledRoutes]
  );

  const isActionDisabled = useCallback(
    (path: string, action: string) => (visibility.disabledActions[path] ?? []).includes(action),
    [visibility.disabledActions]
  );

  const resetVisibility = useCallback(() => {
    setVisibility(emptyVisibility);
  }, []);

  const addComment = useCallback((comment: Omit<DemoComment, "id" | "createdAt">) => {
    setComments((current) => [
      {
        ...comment,
        id: `comment_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString()
      },
      ...current
    ]);
  }, []);

  const removeComment = useCallback((id: string) => {
    setComments((current) => current.filter((comment) => comment.id !== id));
  }, []);

  const clearComments = useCallback(() => {
    setComments([]);
  }, []);

  return (
    <DemoPrefsContext.Provider
      value={{
        prefsHydrated,
        visibility,
        toggleGroup,
        toggleRoute,
        toggleAction,
        isGroupDisabled,
        isRouteDisabled,
        isActionDisabled,
        resetVisibility,
        comments,
        addComment,
        removeComment,
        clearComments
      }}
    >
      {children}
    </DemoPrefsContext.Provider>
  );
}

export function useDemoPrefs(): DemoPrefsValue {
  const context = useContext(DemoPrefsContext);
  if (!context) {
    throw new Error("useDemoPrefs must be used within DemoPrefsProvider");
  }
  return context;
}
