"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { cloneStore, createSeedStore, demoConfig, inferProductFromRoute } from "@/lib/fixtures";
import type { DemoStoreData, ProductContext } from "@/lib/types";

interface DemoStoreContextValue {
  store: DemoStoreData;
  activePersona: DemoStoreData["personas"][number];
  activeUser: DemoStoreData["users"][number] | undefined;
  activeOrganization: DemoStoreData["organizations"][number] | undefined;
  permissionDiagnostics: boolean;
  setPermissionDiagnostics: (enabled: boolean) => void;
  switchPersona: (personaId: string) => string;
  switchOrganization: (organizationId: string) => void;
  switchProduct: (product: ProductContext) => void;
  resetDemo: () => void;
}

const DemoStoreContext = createContext<DemoStoreContextValue | null>(null);

function saveStore(store: DemoStoreData): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(demoConfig.storageKey, JSON.stringify(store));
}

function loadStore(): DemoStoreData {
  const seed = createSeedStore();
  if (typeof window === "undefined") {
    return seed;
  }

  const raw = window.localStorage.getItem(demoConfig.storageKey);
  if (!raw) {
    saveStore(seed);
    return seed;
  }

  try {
    const parsed = JSON.parse(raw) as DemoStoreData;
    if (parsed.schemaVersion !== demoConfig.schemaVersion) {
      window.localStorage.removeItem(demoConfig.storageKey);
      saveStore(seed);
      return seed;
    }
    return parsed;
  } catch {
    window.localStorage.removeItem(demoConfig.storageKey);
    saveStore(seed);
    return seed;
  }
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<DemoStoreData>(() => createSeedStore());
  const [permissionDiagnostics, setPermissionDiagnostics] = useState(
    demoConfig.enablePermissionDiagnostics
  );

  useEffect(() => {
    setStore(loadStore());
  }, []);

  const updateStore = useCallback((updater: (current: DemoStoreData) => DemoStoreData) => {
    setStore((current) => {
      const next = updater(cloneStore(current));
      saveStore(next);
      return next;
    });
  }, []);

  const activePersona =
    store.personas.find((persona) => persona.id === store.activePersonaId) ?? store.personas[0];
  const activeUser = store.users.find((user) => user.personaId === activePersona.id);
  const activeOrganization = store.organizations.find(
    (organization) => organization.id === store.activeOrganizationId
  );

  const switchPersona = useCallback(
    (personaId: string) => {
      const persona = store.personas.find((item) => item.id === personaId) ?? store.personas[0];
      updateStore((current) => ({
        ...current,
        activePersonaId: persona.id,
        activeOrganizationId: persona.organizationId,
        activeProduct: inferProductFromRoute(persona.startRoute)
      }));
      return persona.startRoute;
    },
    [store.personas, updateStore]
  );

  const switchOrganization = useCallback(
    (organizationId: string) => {
      updateStore((current) => ({
        ...current,
        activeOrganizationId: organizationId
      }));
    },
    [updateStore]
  );

  const switchProduct = useCallback(
    (product: ProductContext) => {
      updateStore((current) => ({
        ...current,
        activeProduct: product
      }));
    },
    [updateStore]
  );

  const resetDemo = useCallback(() => {
    const seed = createSeedStore();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(demoConfig.storageKey);
      saveStore(seed);
    }
    setStore(seed);
  }, []);

  const value = useMemo<DemoStoreContextValue>(
    () => ({
      store,
      activePersona,
      activeUser,
      activeOrganization,
      permissionDiagnostics,
      setPermissionDiagnostics,
      switchPersona,
      switchOrganization,
      switchProduct,
      resetDemo
    }),
    [
      activeOrganization,
      activePersona,
      activeUser,
      permissionDiagnostics,
      resetDemo,
      store,
      switchOrganization,
      switchPersona,
      switchProduct
    ]
  );

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore(): DemoStoreContextValue {
  const context = useContext(DemoStoreContext);
  if (!context) {
    throw new Error("useDemoStore must be used within DemoStoreProvider");
  }
  return context;
}
