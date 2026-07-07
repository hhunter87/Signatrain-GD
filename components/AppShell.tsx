"use client";

import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  PauseCircle,
  ClipboardCheck,
  CreditCard,
  Download,
  Eye,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  MessageSquare,
  MessageSquarePlus,
  MousePointerClick,
  PlayCircle,
  RotateCcw,
  Scale,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  Upload,
  Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { CustomScreen, hasCustomScreen } from "@/components/screens";
import { canAccessRoute, getAvailableProducts, isInternalUser, productLabel } from "@/lib/access";
import { routeProduct, findRoute, resolveDemoPath, routes } from "@/lib/routes";
import { DemoStoreProvider, useDemoStore } from "@/lib/store";
import { DemoPrefsProvider, useDemoPrefs } from "@/lib/prefs";
import type { DemoStoreData, ProductContext, RouteDefinition } from "@/lib/types";
import { canViewLegalMessage, visibleLegalRequestsForUser } from "@/lib/privacy";

const TOUR_STORAGE_KEY = "gd_st_demo_tour_step";

const TOUR_STEPS = [
  {
    title: "Enterprise structure",
    body: "Maya (Company Owner) sees one shared account with two products — GD and Signatrain — and no hidden infrastructure brand.",
    personaId: "persona_maya",
    route: "/app/products"
  },
  {
    title: "Company administration",
    body: "Jordan (HR Admin) manages users and seats but cannot see billing — roles are additive and scoped.",
    personaId: "persona_jordan",
    route: "/app/company/users"
  },
  {
    title: "HR learning",
    body: "Elena (HR Subscriber) tracks course progress and the 95% unique-watch video rule.",
    personaId: "persona_elena",
    route: "/app/signatrain/progress"
  },
  {
    title: "Live sessions",
    body: "Elena registers for a Masterclass — try the Register button to see the simulated confirmation.",
    personaId: "persona_elena",
    route: "/app/signatrain/live"
  },
  {
    title: "Manager experience",
    body: "Marcus (Manager) gets the manager program and scenarios; HR Masterclasses, Bot, and Legislative Tracking are absent.",
    personaId: "persona_marcus",
    route: "/app/signatrain"
  },
  {
    title: "GD front door",
    body: "Maya reviews legal requests — restricted requests stay hidden from non-participants.",
    personaId: "persona_maya",
    route: "/app/gd/requests"
  },
  {
    title: "GD operations",
    body: "Dana triages the request work queue; internal notes never reach the client.",
    personaId: "persona_dana",
    route: "/admin/gd/requests"
  },
  {
    title: "Legislative Tracking",
    body: "Sam manages the attorney-reviewed alert pipeline from draft to distribution.",
    personaId: "persona_sam",
    route: "/admin/alerts"
  },
  {
    title: "Commercial path",
    body: "The prospect persona sees pricing and the simulated self-service checkout.",
    personaId: "persona_prospect",
    route: "/pricing"
  }
];

const scenarioShortcuts = [
  { label: "E2E-01 Maya owner", personaId: "persona_maya", route: "/app/products" },
  { label: "E2E-05 Marcus guardrails", personaId: "persona_marcus", route: "/app/signatrain" },
  { label: "GD operations", personaId: "persona_dana", route: "/admin/gd" },
  { label: "Alert review", personaId: "persona_rachel", route: "/admin/alerts" },
  { label: "Pricing prospect", personaId: "persona_prospect", route: "/pricing" }
];

export function AppShell() {
  return (
    <DemoStoreProvider>
      <DemoPrefsProvider>
        <ShellContent />
      </DemoPrefsProvider>
    </DemoStoreProvider>
  );
}

function ShellContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    store,
    hydrated,
    activePersona,
    activeUser,
    activeOrganization,
    permissionDiagnostics,
    setPermissionDiagnostics,
    switchPersona,
    switchOrganization,
    switchProduct,
    resetDemo
  } = useDemoStore();
  const prefs = useDemoPrefs();
  const [controlsOpen, setControlsOpen] = useState(false);
  const [outboxOpen, setOutboxOpen] = useState(false);
  const [tourStep, setTourStepState] = useState<number | null>(null);

  // The page component remounts on every navigation, so the tour position
  // is kept in sessionStorage and restored after each route change.
  useEffect(() => {
    const raw = window.sessionStorage.getItem(TOUR_STORAGE_KEY);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isInteger(parsed) && parsed >= 0 && parsed < TOUR_STEPS.length) {
        setTourStepState(parsed);
      }
    }
  }, []);

  const setTourStep = (value: number | null) => {
    setTourStepState(value);
    if (typeof window === "undefined") {
      return;
    }
    if (value === null) {
      window.sessionStorage.removeItem(TOUR_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(TOUR_STORAGE_KEY, String(value));
    }
  };
  const route = findRoute(pathname);
  const routePlacement = route ? sidebarPlacement(route) : null;
  const routeHiddenByPrefs = Boolean(
    route &&
      routePlacement &&
      (prefs.isGroupDisabled(routePlacement.group) || prefs.isRouteDisabled(route.path))
  );
  const restrictedFrom = searchParams.get("from");
  const isRestrictedPage = pathname === "/restricted";
  const access = canAccessRoute(route, activeUser, store);
  const productForTheme = isRestrictedPage ? store.activeProduct : routeProduct(pathname);
  const visualProduct =
    pathname === "/"
      ? "signatrain"
      : productForTheme === "shared"
        ? store.activeProduct
        : productForTheme;
  const themeClassName = themeClassForPath(pathname, visualProduct);

  useEffect(() => {
    if (!hydrated || isRestrictedPage || !route || access.allowed) {
      return undefined;
    }

    const redirectTimer = window.setTimeout(() => {
      router.replace(`/restricted?from=${encodeURIComponent(pathname)}`);
    }, 120);

    return () => window.clearTimeout(redirectTimer);
  }, [access.allowed, hydrated, isRestrictedPage, pathname, route, router]);

  const handlePersonaChange = (personaId: string) => {
    let startRoute = "/";
    // Flush the persona switch synchronously so the store (and its
    // localStorage snapshot) is updated before navigation remounts the page.
    flushSync(() => {
      startRoute = switchPersona(personaId);
    });
    router.push(startRoute);
  };

  const handleProductSwitch = (product: ProductContext) => {
    switchProduct(product);
    if (product === "gd") {
      router.push("/app/gd");
    } else if (product === "signatrain") {
      router.push("/app/signatrain");
    } else if (product === "admin") {
      router.push(activePersona.startRoute.startsWith("/admin") ? activePersona.startRoute : "/admin/gd");
    } else {
      router.push("/app/products");
    }
  };

  const availableProducts = getAvailableProducts(activeUser, store);
  const showSidebar = !["/", "/pricing"].includes(pathname) && !pathname.startsWith("/checkout");

  const goToTourStep = (index: number | null) => {
    setTourStep(index);
    if (index === null) {
      return;
    }
    const step = TOUR_STEPS[index];
    if (store.activePersonaId !== step.personaId) {
      // Synchronous flush: the persona must be persisted before router.push
      // remounts the page, otherwise the access guard sees the old persona.
      flushSync(() => {
        switchPersona(step.personaId);
      });
    }
    router.push(step.route);
  };

  return (
    <div data-product={visualProduct} className={`app-root ${themeClassName}`}>
      <header className="topbar sticky top-0 z-30">
        <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 lg:px-6">
          <Link href="/app/products" className="flex items-center gap-2.5 font-semibold tracking-tight">
            {visualProduct === "signatrain" ? (
              <>
                <Image
                  src="/brand/signatrain/signatrain-icon-white.svg"
                  alt="SignaTrain"
                  width={30}
                  height={30}
                  unoptimized
                  priority
                />
                <span className="brand-wordmark text-lg">
                  <span className="wm-signa">Signa</span>
                  <span className="wm-train">Train</span>
                </span>
              </>
            ) : (
              <>
                <span className="brand-tile">
                  <ShieldCheck className="brand-mark h-4 w-4" aria-hidden="true" />
                </span>
                <span>GD & Signatrain</span>
              </>
            )}
          </Link>
          <ProductSwitcher
            availableProducts={availableProducts}
            currentProduct={store.activeProduct}
            onSwitch={handleProductSwitch}
          />
          <div className="ml-auto flex flex-wrap items-center gap-2 text-sm">
            <span className="control-chip inline-flex items-center gap-2 px-3 py-2">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              {activeOrganization?.name ?? "No organization"}
            </span>
            <span className="control-chip inline-flex items-center gap-2 px-3 py-2">
              <Users className="h-4 w-4" aria-hidden="true" />
              {activePersona.name}
            </span>
            <NotificationBell />
            <button
              type="button"
              className="ds-button ds-button-primary px-3 py-2 text-sm"
              onClick={() => setControlsOpen(true)}
            >
              <Settings2 className="h-4 w-4" aria-hidden="true" />
              Demo Controls
            </button>
          </div>
        </div>
      </header>
      <div className="flex">
        {showSidebar ? <Sidebar pathname={pathname} /> : null}
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">
          <div key={pathname} className="page-enter">
            {!hydrated ? (
              <LoadingDemoContext />
            ) : isRestrictedPage ? (
              <RestrictedView from={restrictedFrom} />
            ) : routeHiddenByPrefs ? (
              <HiddenByPrefsView onOpenControls={() => setControlsOpen(true)} />
            ) : route && access.allowed ? (
              <RouteView route={route} pathname={pathname} onStartTour={() => goToTourStep(0)} />
            ) : route ? (
              <LoadingDemoContext />
            ) : (
              <NotInManifest pathname={pathname} />
            )}
          </div>
        </main>
      </div>
      {tourStep !== null ? (
        <TourCard
          stepIndex={tourStep}
          onNavigate={goToTourStep}
          onEnd={() => setTourStep(null)}
        />
      ) : null}
      <FeedbackWidget route={route} pathname={pathname} />
      <DemoControls
        open={controlsOpen}
        onStartTour={() => {
          setControlsOpen(false);
          goToTourStep(0);
        }}
        onClose={() => setControlsOpen(false)}
        outboxOpen={outboxOpen}
        onOutboxOpen={() => setOutboxOpen(true)}
        onOutboxClose={() => setOutboxOpen(false)}
        onPersonaChange={handlePersonaChange}
        onOrganizationChange={switchOrganization}
        onProductSwitch={handleProductSwitch}
        onReset={resetDemo}
        permissionDiagnostics={permissionDiagnostics}
        setPermissionDiagnostics={setPermissionDiagnostics}
      />
    </div>
  );
}

function themeClassForPath(pathname: string, product: ProductContext): string {
  if (pathname === "/") {
    return "theme-st";
  }
  if (pathname.startsWith("/app/gd") || pathname.startsWith("/admin/gd")) {
    return "theme-gd";
  }
  if (pathname.startsWith("/app/signatrain") || pathname.startsWith("/admin/signatrain")) {
    return "theme-st";
  }
  if (product === "gd") {
    return "theme-gd";
  }
  if (product === "signatrain") {
    return "theme-st";
  }
  return "theme-shared";
}

function LoadingDemoContext() {
  return (
    <div className="narrow-shell">
      <section className="ds-card p-6">
        <p className="page-eyebrow text-sm font-bold uppercase tracking-wide">
          Checking access
        </p>
        <h1 className="page-title mt-2 text-3xl font-bold">Loading workspace</h1>
        <p className="mt-2 text-muted">
          Applying the selected persona, organization, and product permissions.
        </p>
      </section>
    </div>
  );
}

function ProductSwitcher({
  availableProducts,
  currentProduct,
  onSwitch
}: {
  availableProducts: ProductContext[];
  currentProduct: ProductContext;
  onSwitch: (product: ProductContext) => void;
}) {
  const products: ProductContext[] = ["shared", ...availableProducts];

  return (
    <nav className="flex flex-wrap items-center gap-1" aria-label="Product switcher">
      {products.map((product) => (
        <button
          key={product}
          type="button"
          onClick={() => onSwitch(product)}
          className={[
            "product-tab inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold",
            currentProduct === product ? "product-tab-active" : ""
          ].join(" ")}
          title={`Switch to ${productLabel(product)}`}
        >
          {product === "gd" ? (
            <Image
              src="/brand/gd/gd-icon-white.svg"
              alt=""
              width={16}
              height={16}
              unoptimized
            />
          ) : null}
          {product === "signatrain" ? (
            <Image
              src="/brand/signatrain/signatrain-icon-white.svg"
              alt=""
              width={16}
              height={16}
              unoptimized
            />
          ) : null}
          {product === "shared" ? <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> : null}
          {product === "admin" ? <ShieldCheck className="h-4 w-4" aria-hidden="true" /> : null}
          {productLabel(product)}
        </button>
      ))}
    </nav>
  );
}

function useModalA11y(active: boolean, onClose: () => void) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () => {
      const panel = ref.current;
      if (!panel) {
        return [] as HTMLElement[];
      }
      return Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("disabled"));
    };

    focusables()[0]?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const list = focusables();
      if (list.length === 0) {
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previouslyFocused?.focus();
    };
  }, [active, onClose]);

  return ref;
}

function TourCard({
  stepIndex,
  onNavigate,
  onEnd
}: {
  stepIndex: number;
  onNavigate: (index: number | null) => void;
  onEnd: () => void;
}) {
  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  return (
    <aside className="tour-card p-4" aria-label={`Demo tour step ${stepIndex + 1} of ${TOUR_STEPS.length}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="ds-pill px-2.5 py-0.5 text-xs">
          Step {stepIndex + 1} / {TOUR_STEPS.length}
        </span>
        <button
          type="button"
          className="text-xs font-bold uppercase tracking-wide text-muted transition hover:text-ink"
          onClick={onEnd}
        >
          End tour
        </button>
      </div>
      <h2 className="mt-3 text-base font-bold">{step.title}</h2>
      <p className="mt-1 text-sm text-muted">{step.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {stepIndex > 0 ? (
          <button
            type="button"
            className="ds-button ds-button-secondary px-3 py-1.5 text-sm"
            onClick={() => onNavigate(stepIndex - 1)}
          >
            Back
          </button>
        ) : null}
        {isLast ? (
          <button type="button" className="ds-button ds-button-primary px-3 py-1.5 text-sm" onClick={onEnd}>
            Finish tour
          </button>
        ) : (
          <button
            type="button"
            className="ds-button ds-button-primary px-3 py-1.5 text-sm"
            onClick={() => onNavigate(stepIndex + 1)}
          >
            Next step
          </button>
        )}
      </div>
    </aside>
  );
}

function NotificationBell() {
  const router = useRouter();
  const { store, activeUser, markNotificationRead, markAllNotificationsRead } = useDemoStore();
  const [open, setOpen] = useState(false);
  const notifications = useMemo(
    () =>
      store.notifications
        .filter((notification) => notification.userId === activeUser?.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [activeUser?.id, store.notifications]
  );
  const unreadCount = notifications.filter((notification) => !notification.readAt).length;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        className="notif-button"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {unreadCount > 0 ? <span className="notif-badge">{unreadCount}</span> : null}
      </button>
      {open ? (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            className="fixed inset-0 z-50 cursor-default"
            onClick={() => setOpen(false)}
          />
          <section className="notif-panel" aria-label="Notifications">
            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="text-sm font-bold">Notifications</h2>
              {unreadCount > 0 ? (
                <button
                  type="button"
                  className="text-xs font-bold text-[color:var(--brand-accent)] hover:underline"
                  onClick={markAllNotificationsRead}
                >
                  Mark all read ({unreadCount})
                </button>
              ) : (
                <span className="text-xs text-muted">All caught up</span>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="notif-item text-sm text-muted">No notifications for this persona yet.</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className="notif-item"
                  onClick={() => {
                    markNotificationRead(notification.id);
                    setOpen(false);
                    if (notification.href) {
                      router.push(notification.href);
                    }
                  }}
                >
                  <span className="flex items-start gap-2.5">
                    {!notification.readAt ? <span className="notif-dot mt-1.5" aria-hidden="true" /> : <span className="mt-1.5 inline-block h-2 w-2 flex-none" aria-hidden="true" />}
                    <span className="min-w-0">
                      <span className={`block text-sm ${notification.readAt ? "font-semibold text-muted" : "font-bold"}`}>
                        {notification.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted">{notification.body}</span>
                      <span className="mt-1 block text-xs text-muted">
                        {new Date(notification.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </span>
                  </span>
                </button>
              ))
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}

const SIDEBAR_GROUP_ORDER = [
  "Shared",
  "Signatrain",
  "Greenwald Doherty",
  "Legislative Tracking",
  "Platform Admin"
] as const;

const SIDEBAR_SECTION_ORDER: Record<string, string[]> = {
  Shared: ["General"],
  Signatrain: ["Learning", "Live sessions & cohorts", "My records", "Administration"],
  "Greenwald Doherty": ["Client portal", "Requests & matters", "Services & billing", "Operations"],
  "Legislative Tracking": ["Alerts", "Administration"],
  "Platform Admin": ["Platform"]
};

const SIDEBAR_GROUP_ICONS: Record<string, typeof GraduationCap> = {
  Shared: LayoutDashboard,
  Signatrain: GraduationCap,
  "Greenwald Doherty": BriefcaseBusiness,
  "Legislative Tracking": Scale,
  "Platform Admin": ShieldCheck
};

function sidebarPlacement(route: RouteDefinition): { group: string; section: string } | null {
  const { domain, path } = route;

  if (domain === "Shared") {
    return { group: "Shared", section: "General" };
  }
  if (domain === "Signatrain") {
    if (path.includes("/live") || path.includes("/cohorts")) {
      return { group: "Signatrain", section: "Live sessions & cohorts" };
    }
    if (path.includes("/progress") || path.includes("/certificates") || path.includes("/bot")) {
      return { group: "Signatrain", section: "My records" };
    }
    return { group: "Signatrain", section: "Learning" };
  }
  if (domain === "Signatrain Admin") {
    return { group: "Signatrain", section: "Administration" };
  }
  if (domain === "GD") {
    if (path.includes("/requests") || path.includes("/matters")) {
      return { group: "Greenwald Doherty", section: "Requests & matters" };
    }
    if (
      path.includes("/schedule") ||
      path.includes("/templates") ||
      path.includes("/projects") ||
      path.includes("/billing") ||
      path.includes("/signatrain-seats")
    ) {
      return { group: "Greenwald Doherty", section: "Services & billing" };
    }
    return { group: "Greenwald Doherty", section: "Client portal" };
  }
  if (domain === "GD Admin") {
    return { group: "Greenwald Doherty", section: "Operations" };
  }
  if (domain === "Legislative") {
    return { group: "Legislative Tracking", section: "Alerts" };
  }
  if (domain === "Legislative Admin") {
    return { group: "Legislative Tracking", section: "Administration" };
  }
  if (domain === "Platform Admin") {
    return { group: "Platform Admin", section: "Platform" };
  }
  return null;
}

function Sidebar({ pathname }: { pathname: string }) {
  const { store, activeUser } = useDemoStore();
  const { isGroupDisabled, isRouteDisabled } = useDemoPrefs();
  const activeRoutePath = findRoute(pathname)?.path;

  const tree = useMemo(() => {
    const groups = new Map<string, Map<string, Array<{ route: RouteDefinition; href: string }>>>();

    routes
      .filter((route) => canAccessRoute(route, activeUser, store).allowed)
      .forEach((route) => {
        const placement = sidebarPlacement(route);
        if (!placement) {
          return;
        }
        if (isGroupDisabled(placement.group) || isRouteDisabled(route.path)) {
          return;
        }
        const sections = groups.get(placement.group) ?? new Map();
        const items = sections.get(placement.section) ?? [];
        items.push({ route, href: resolveDemoPath(route.path) });
        sections.set(placement.section, items);
        groups.set(placement.group, sections);
      });

    return SIDEBAR_GROUP_ORDER.filter((group) => groups.has(group)).map((group) => ({
      group,
      sections: (SIDEBAR_SECTION_ORDER[group] ?? [])
        .filter((section) => groups.get(group)?.has(section))
        .map((section) => ({
          section,
          items: groups.get(group)?.get(section) ?? []
        }))
    }));
  }, [activeUser, store, isGroupDisabled, isRouteDisabled]);

  const activePlacement = useMemo(() => {
    const route = routes.find((item) => item.path === activeRoutePath);
    return route ? sidebarPlacement(route) : null;
  }, [activeRoutePath]);

  // Inside a product context the sidebar shows only that product plus Shared.
  const sidebarContext = routeProduct(pathname);
  const allowedGroups =
    sidebarContext === "signatrain"
      ? ["Shared", "Signatrain"]
      : sidebarContext === "gd"
        ? ["Shared", "Greenwald Doherty"]
        : null;
  const visibleTree = allowedGroups
    ? tree.filter(({ group }) => allowedGroups.includes(group))
    : tree;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [closedSections, setClosedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activePlacement && activePlacement.group !== "Shared") {
      setOpenGroups((current) => ({ ...current, [activePlacement.group]: true }));
      setClosedSections((current) => ({
        ...current,
        [`${activePlacement.group}/${activePlacement.section}`]: false
      }));
    }
  }, [activePlacement]);

  return (
    <aside className="shell-sidebar sticky top-16 hidden h-[calc(100vh-64px)] w-72 shrink-0 overflow-y-auto p-4 lg:block">
      <nav aria-label="Primary" className="space-y-2">
        {visibleTree.map(({ group, sections }) => {
          const GroupIcon = SIDEBAR_GROUP_ICONS[group] ?? LayoutDashboard;
          const alwaysOpen = group === "Shared";
          const isOpen = alwaysOpen || Boolean(openGroups[group]);
          const itemCount = sections.reduce((total, section) => total + section.items.length, 0);

          return (
            <section key={group}>
              {alwaysOpen ? (
                <h2 className="nav-group-header px-3 py-2 text-xs font-bold uppercase tracking-wide">
                  <GroupIcon className="h-4 w-4" aria-hidden="true" />
                  {group}
                </h2>
              ) : (
                <button
                  type="button"
                  className="nav-group-btn px-3 py-2 text-xs font-bold uppercase tracking-wide"
                  aria-expanded={isOpen}
                  onClick={() => setOpenGroups((current) => ({ ...current, [group]: !isOpen }))}
                >
                  {group === "Signatrain" ? (
                    <Image
                      src="/brand/signatrain/signatrain-icon-white.svg"
                      alt=""
                      width={16}
                      height={16}
                      unoptimized
                    />
                  ) : group === "Greenwald Doherty" ? (
                    <Image
                      src="/brand/gd/gd-icon-white.svg"
                      alt=""
                      width={16}
                      height={16}
                      unoptimized
                    />
                  ) : (
                    <GroupIcon className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="flex-1 text-left">{group}</span>
                  <span className="nav-count">{itemCount}</span>
                  <ChevronDown
                    className={`chev h-4 w-4 ${isOpen ? "chev-open" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              )}
              {isOpen ? (
                <div className="nav-group-body">
                  {sections.map(({ section, items }) => {
                    const sectionKey = `${group}/${section}`;
                    const showSubheader = sections.length > 1;
                    const sectionOpen = !showSubheader || !closedSections[sectionKey];

                    return (
                      <div key={sectionKey}>
                        {showSubheader ? (
                          <button
                            type="button"
                            className="nav-sub-btn px-3 py-1.5 text-xs font-semibold"
                            aria-expanded={sectionOpen}
                            onClick={() =>
                              setClosedSections((current) => ({
                                ...current,
                                [sectionKey]: sectionOpen
                              }))
                            }
                          >
                            <span className="flex-1 text-left">{section}</span>
                            <ChevronDown
                              className={`chev h-3.5 w-3.5 ${sectionOpen ? "chev-open" : ""}`}
                              aria-hidden="true"
                            />
                          </button>
                        ) : null}
                        {sectionOpen ? (
                          <ul className={`space-y-0.5 ${showSubheader ? "nav-children" : "mt-1"}`}>
                            {items.map(({ route, href }) => (
                              <li key={route.path}>
                                <Link
                                  href={href}
                                  className={[
                                    "nav-link px-3 py-1.5 text-sm",
                                    activeRoutePath === route.path ? "nav-link-active" : ""
                                  ].join(" ")}
                                >
                                  {route.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
      </nav>
    </aside>
  );
}

function DemoControls({
  open,
  onClose,
  onStartTour,
  outboxOpen,
  onOutboxOpen,
  onOutboxClose,
  onPersonaChange,
  onOrganizationChange,
  onProductSwitch,
  onReset,
  permissionDiagnostics,
  setPermissionDiagnostics
}: {
  open: boolean;
  onClose: () => void;
  onStartTour: () => void;
  outboxOpen: boolean;
  onOutboxOpen: () => void;
  onOutboxClose: () => void;
  onPersonaChange: (personaId: string) => void;
  onOrganizationChange: (organizationId: string) => void;
  onProductSwitch: (product: ProductContext) => void;
  onReset: () => void;
  permissionDiagnostics: boolean;
  setPermissionDiagnostics: (enabled: boolean) => void;
}) {
  const router = useRouter();
  const { store, activePersona, activeUser } = useDemoStore();
  const canSwitchOrganization = isInternalUser(activeUser);
  const availableProducts = getAvailableProducts(activeUser, store);
  const panelRef = useModalA11y(open && !outboxOpen, onClose);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Demo Controls">
      <button
        type="button"
        aria-label="Close Demo Controls"
        className="absolute inset-0 h-full w-full bg-black/30"
        onClick={onClose}
      />
      <section ref={panelRef} className="modal-panel absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] p-5">
          <div>
            <h2 className="text-xl font-bold">Demo Controls</h2>
            <p className="text-sm text-muted">Switch personas, products, scenarios, and reset workspace data.</p>
          </div>
          <button type="button" className="ds-button ds-button-secondary px-3 py-2 text-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="space-y-6 p-5">
          <button
            type="button"
            className="ds-button ds-button-primary w-full px-4 py-2.5"
            onClick={onStartTour}
          >
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            Start demo tour ({TOUR_STEPS.length} steps)
          </button>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Persona</span>
            <select
              className="ds-field w-full px-3 py-2"
              value={activePersona.id}
              onChange={(event) => {
                onPersonaChange(event.target.value);
                onClose();
              }}
            >
              {store.personas.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.name} - {persona.description}
                </option>
              ))}
            </select>
          </label>

          {canSwitchOrganization ? (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Organization context</span>
              <select
                className="ds-field w-full px-3 py-2"
                value={store.activeOrganizationId}
                onChange={(event) => onOrganizationChange(event.target.value)}
              >
                {store.organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <section>
            <h3 className="mb-2 text-sm font-semibold">Product context</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="ds-button ds-button-secondary px-3 py-2 text-sm"
                onClick={() => onProductSwitch("shared")}
              >
                My Products
              </button>
              {availableProducts.map((product) => (
                <button
                  key={product}
                  type="button"
                  className="ds-button ds-button-secondary px-3 py-2 text-sm"
                  onClick={() => onProductSwitch(product)}
                >
                  {productLabel(product)}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold">Scenario shortcuts</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {scenarioShortcuts.map((shortcut) => (
                <button
                  key={shortcut.label}
                  type="button"
                  className="ds-button ds-button-secondary justify-start px-3 py-2 text-left text-sm"
                  onClick={() => {
                    onPersonaChange(shortcut.personaId);
                    router.push(shortcut.route);
                    onClose();
                  }}
                >
                  {shortcut.label}
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              className="ds-button ds-button-primary px-3 py-2 text-sm"
              onClick={onOutboxOpen}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              Open email outbox
            </button>
            <button
              type="button"
              className="ds-button ds-button-danger px-3 py-2 text-sm"
              onClick={() => {
                if (window.confirm("Reset this workspace to its starting state?")) {
                  onReset();
                  router.push("/app/products");
                  onClose();
                }
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset workspace
            </button>
          </section>

          <label className="ds-card-muted flex items-center gap-3 p-3 text-sm">
            <input
              type="checkbox"
              checked={permissionDiagnostics}
              onChange={(event) => setPermissionDiagnostics(event.target.checked)}
            />
            Show permission diagnostics on route placeholders
          </label>

          <VisibilitySettings />

          <FeedbackList />
        </div>
      </section>
      {outboxOpen ? <OutboxModal onClose={onOutboxClose} /> : null}
    </div>
  );
}

function VisibilitySettings() {
  const {
    isGroupDisabled,
    isRouteDisabled,
    isActionDisabled,
    toggleGroup,
    toggleRoute,
    toggleAction,
    resetVisibility
  } = useDemoPrefs();

  const allTree = useMemo(() => {
    const groups = new Map<string, Map<string, RouteDefinition[]>>();

    routes.forEach((route) => {
      const placement = sidebarPlacement(route);
      if (!placement) {
        return;
      }
      const sections = groups.get(placement.group) ?? new Map();
      const items = sections.get(placement.section) ?? [];
      items.push(route);
      sections.set(placement.section, items);
      groups.set(placement.group, sections);
    });

    return SIDEBAR_GROUP_ORDER.filter((group) => groups.has(group)).map((group) => ({
      group,
      sections: (SIDEBAR_SECTION_ORDER[group] ?? [])
        .filter((section) => groups.get(group)?.has(section))
        .map((section) => ({
          section,
          items: groups.get(group)?.get(section) ?? []
        }))
    }));
  }, []);

  return (
    <section>
      <h3 className="mb-1 text-sm font-semibold">Demo visibility</h3>
      <p className="mb-3 text-xs text-muted">
        Turn entire tabs, individual screens, or single actions on and off. The client sees only what
        is enabled here. Settings persist in this browser.
      </p>
      <div className="prefs-tree space-y-1.5">
        {allTree.map(({ group, sections }) => {
          const groupOff = isGroupDisabled(group);
          return (
            <details key={group} className="prefs-node">
              <summary>
                <ChevronDown className="chev h-3.5 w-3.5" aria-hidden="true" />
                <label
                  className={`prefs-check ${groupOff ? "prefs-off" : ""}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <input type="checkbox" checked={!groupOff} onChange={() => toggleGroup(group)} />
                  <span className="font-bold">{group}</span>
                </label>
              </summary>
              <div className="prefs-children">
                {sections.map(({ section, items }) => (
                  <div key={section}>
                    {sections.length > 1 ? <p className="prefs-section-label">{section}</p> : null}
                    {items.map((route) => {
                      const routeOff = groupOff || isRouteDisabled(route.path);
                      return (
                        <details key={route.path} className="prefs-node">
                          <summary>
                            <ChevronDown className="chev h-3.5 w-3.5" aria-hidden="true" />
                            <label
                              className={`prefs-check ${routeOff ? "prefs-off" : ""}`}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={!isRouteDisabled(route.path)}
                                disabled={groupOff}
                                onChange={() => toggleRoute(route.path)}
                              />
                              {route.name}
                            </label>
                          </summary>
                          <div className="prefs-children">
                            {route.primaryActions.map((action) => {
                              const actionOff = routeOff || isActionDisabled(route.path, action);
                              return (
                                <label
                                  key={action}
                                  className={`prefs-check ${actionOff ? "prefs-off" : ""}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={!isActionDisabled(route.path, action)}
                                    disabled={routeOff}
                                    onChange={() => toggleAction(route.path, action)}
                                  />
                                  {action}
                                </label>
                              );
                            })}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </div>
      <button
        type="button"
        className="ds-button ds-button-secondary mt-3 px-3 py-2 text-sm"
        onClick={resetVisibility}
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Show everything again
      </button>
    </section>
  );
}

function FeedbackList() {
  const { comments, removeComment, clearComments } = useDemoPrefs();

  const feedbackText = useMemo(
    () =>
      comments
        .map(
          (comment) =>
            `[${comment.routeName}] ${comment.persona}, ${new Date(comment.createdAt).toLocaleString("en-US")}\n${comment.body}`
        )
        .join("\n\n"),
    [comments]
  );

  const mailtoHref = `mailto:milan@proconsult.rs?subject=${encodeURIComponent(
    "GD & Signatrain demo feedback"
  )}&body=${encodeURIComponent(feedbackText)}`;

  const downloadFeedback = () => {
    const blob = new Blob([feedbackText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "demo-feedback.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <h3 className="mb-1 text-sm font-semibold">Client feedback ({comments.length})</h3>
      {comments.length === 0 ? (
        <p className="text-xs text-muted">
          No comments yet. Use the Comment button at the bottom-right of any screen to capture client
          feedback — it is stored in this browser and can be sent from here.
        </p>
      ) : (
        <>
          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {comments.map((comment) => (
              <article key={comment.id} className="ds-card-muted p-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold text-muted">
                    {comment.routeName} · {comment.persona} ·{" "}
                    {new Date(comment.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                  <button
                    type="button"
                    className="text-muted transition hover:text-[color:var(--status-danger)]"
                    aria-label="Delete comment"
                    onClick={() => removeComment(comment.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap">{comment.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="ds-button ds-button-primary px-3 py-2 text-sm" href={mailtoHref}>
              Send to Milan
            </a>
            <button
              type="button"
              className="ds-button ds-button-secondary px-3 py-2 text-sm"
              onClick={downloadFeedback}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download .txt
            </button>
            <button
              type="button"
              className="ds-button ds-button-danger px-3 py-2 text-sm"
              onClick={() => {
                if (window.confirm("Delete all saved comments?")) {
                  clearComments();
                }
              }}
            >
              Clear all
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function FeedbackWidget({ route, pathname }: { route: RouteDefinition | undefined; pathname: string }) {
  const { activePersona } = useDemoStore();
  const { addComment } = useDemoPrefs();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);
  const panelRef = useModalA11y(open, () => setOpen(false));

  const submit = () => {
    const trimmed = body.trim();
    if (!trimmed) {
      return;
    }

    addComment({
      routePath: pathname,
      routeName: route?.name ?? pathname,
      persona: activePersona.name,
      body: trimmed
    });
    setBody("");
    setSaved(true);
    window.setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 1300);
  };

  return (
    <>
      <button
        type="button"
        className="feedback-fab"
        onClick={() => setOpen(true)}
        aria-label="Leave a comment about this screen"
      >
        <MessageSquarePlus className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">Comment</span>
      </button>
      {open ? (
        <div
          className="modal-scrim fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Leave a comment"
        >
          <section ref={panelRef} className="modal-panel w-full max-w-lg p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Leave a comment</h2>
                <p className="mt-1 text-sm text-muted">About: {route?.name ?? pathname}</p>
              </div>
              <button
                type="button"
                className="ds-button ds-button-secondary px-3 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            {saved ? (
              <p className="mt-5 flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2
                  className="h-5 w-5 text-[color:var(--brand-accent)]"
                  aria-hidden="true"
                />
                Comment saved — it is available in Demo Controls.
              </p>
            ) : (
              <>
                <textarea
                  className="ds-field mt-4 w-full px-3 py-2 text-sm"
                  rows={4}
                  placeholder="What should be added or changed on this screen?"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                />
                <button
                  type="button"
                  className="ds-button ds-button-primary mt-4 px-4 py-2 text-sm"
                  onClick={submit}
                  disabled={!body.trim()}
                >
                  Save comment
                </button>
              </>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}

function HiddenByPrefsView({ onOpenControls }: { onOpenControls: () => void }) {
  return (
    <div className="narrow-shell">
      <section className="ds-card p-6">
        <Eye className="brand-mark h-9 w-9 opacity-40" aria-hidden="true" />
        <h1 className="page-title mt-4 text-3xl font-bold">Screen turned off for this demo</h1>
        <p className="mt-2 text-muted">
          This screen is hidden by the Demo visibility settings. Re-enable it to include it in the
          walkthrough.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="ds-button ds-button-primary px-4 py-2" onClick={onOpenControls}>
            Open Demo Controls
          </button>
          <Link href="/app/products" className="ds-button ds-button-secondary px-4 py-2">
            Go to My Products
          </Link>
        </div>
      </section>
    </div>
  );
}

function OutboxModal({ onClose }: { onClose: () => void }) {
  const { store } = useDemoStore();
  const panelRef = useModalA11y(true, onClose);
  return (
    <div className="modal-scrim absolute inset-0 z-10 flex items-center justify-center p-4">
      <section ref={panelRef} className="modal-panel max-h-[80vh] w-full max-w-3xl overflow-y-auto p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Email outbox</h2>
          <button type="button" className="ds-button ds-button-secondary px-3 py-2 text-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="space-y-3">
          {store.emailOutbox.map((email) => (
            <article key={email.id} className="ds-card p-4">
              <p className="text-sm text-muted">{email.createdAt}</p>
              <h3 className="font-semibold">{email.subject}</h3>
              <p className="text-sm">To: {email.recipient}</p>
              <p className="mt-2 text-sm text-muted">{email.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function RouteView({
  route,
  pathname,
  onStartTour
}: {
  route: RouteDefinition;
  pathname: string;
  onStartTour: () => void;
}) {
  if (pathname === "/") {
    return <LandingView onStartTour={onStartTour} />;
  }

  if (pathname === "/pricing") {
    return <PricingView />;
  }

  if (route.path === "/checkout/[sku]") {
    return <CheckoutPlaceholder pathname={pathname} />;
  }

  if (route.path === "/certificate/[certificateId]") {
    return <CertificateView pathname={pathname} />;
  }

  if (pathname === "/app/products") {
    return <ProductsView />;
  }

  if (hasCustomScreen(route.path)) {
    return <CustomScreen route={route} pathname={pathname} />;
  }

  return <ManifestPlaceholder route={route} pathname={pathname} />;
}

function LandingView({ onStartTour }: { onStartTour: () => void }) {
  const router = useRouter();
  const { store, switchPersona } = useDemoStore();
  const grouped = {
    External: store.personas.filter((persona) => persona.organizationId !== "org_internal"),
    "Signatrain Internal": store.personas.filter((persona) =>
      persona.roles.some((role) => ["SSA", "SOC", "FCR"].includes(role))
    ),
    "GD/Internal Admin": store.personas.filter((persona) =>
      persona.roles.some((role) => ["GDO", "GDA", "GDC", "PSA"].includes(role))
    )
  };

  return (
    <div className="content-shell">
      <section className="hero-panel mb-10 p-8 lg:p-12">
        <p className="hero-eyebrow px-3 py-1.5 text-xs font-bold uppercase tracking-widest">
          <Image
            src="/brand/signatrain/signatrain-icon-white.svg"
            alt=""
            width={14}
            height={14}
            unoptimized
          />
          Workspace access
        </p>
        <h1 className="hero-title mt-5 max-w-3xl text-4xl font-extrabold leading-tight lg:text-5xl">
          One platform. Two products. Every role, exactly as it should look.
        </h1>
        <p className="hero-muted mt-4 max-w-2xl text-lg">
          Select a persona to experience GD client services and Signatrain learning with
          role-specific navigation, entitlements, and strict data boundaries.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" className="ds-button ds-button-primary px-5 py-2.5" onClick={onStartTour}>
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            Start demo tour
          </button>
          <Link className="ds-button ds-button-secondary px-5 py-2.5" href="/pricing">
            Open pricing
          </Link>
          <Link className="ds-button ds-button-secondary px-5 py-2.5" href="/app/products">
            My Products
          </Link>
          <a className="ds-button ds-button-secondary px-5 py-2.5" href="/website">
            SignaTrain website
          </a>
          <a className="ds-button ds-button-secondary px-5 py-2.5" href="/gd-website">
            GD website
          </a>
        </div>
      </section>
      <div className="marketing-grid">
        {Object.entries(grouped).map(([group, personas]) => (
          <section key={group} className="marketing-span-4">
            <h2 className="group-label mb-4 text-sm font-bold uppercase tracking-wide text-muted">{group}</h2>
            <div className="stagger space-y-3">
              {personas.map((persona) => (
                <article key={persona.id} className="ds-card persona-card p-5">
                  <div className="flex items-start gap-3">
                    <span className="persona-avatar" aria-hidden="true">
                      {personaInitials(persona.name)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold">{persona.name}</h3>
                      <p className="mt-1 text-sm text-muted">{persona.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ds-button ds-button-primary mt-5 px-3 py-2 text-sm"
                    onClick={() => {
                      let startRoute = "/";
                      flushSync(() => {
                        startRoute = switchPersona(persona.id);
                      });
                      router.push(startRoute);
                    }}
                  >
                    Enter as {persona.name.split(" ")[0]}
                  </button>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function personaInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function PricingView() {
  const { store } = useDemoStore();
  return (
    <div className="content-shell">
      <PageHeading
        eyebrow="Public"
        title="Pricing and plan comparison"
        description="Compare plans and start the checkout flow for the product that fits your team."
      />
      <div className="marketing-grid stagger">
        {store.catalogSkus.map((sku) => (
          <article key={sku.id} className="ds-card plan-card marketing-span-4 p-6">
            <h2 className="text-lg font-bold">{sku.name}</h2>
            <p className="plan-price mt-3">{sku.priceDisplay}</p>
            {sku.additionalSeatDisplay ? <p className="mt-1 text-sm text-muted">{sku.additionalSeatDisplay}</p> : null}
            <div className="mt-auto pt-6">
              {sku.selfService ? (
                <Link
                  className="ds-button ds-button-primary w-full px-4 py-2"
                  href={`/checkout/${sku.id}`}
                >
                  Open checkout
                </Link>
              ) : (
                <p className="ds-pill w-full justify-center px-3 py-2 text-sm">
                  Admin-assisted purchase
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function CheckoutPlaceholder({ pathname }: { pathname: string }) {
  const { store } = useDemoStore();
  const skuId = pathname.split("/").pop();
  const sku = store.catalogSkus.find((item) => item.id === skuId);
  return (
    <div className="narrow-shell">
      <PageHeading
        eyebrow="Public / Shared"
        title="Checkout"
        description="Review the selected plan and billing preferences before purchase."
      />
      <article className="ds-card p-5">
        <h2 className="text-xl font-bold">{sku?.name ?? "Unknown SKU"}</h2>
        <p className="mt-2 text-muted">{sku?.priceDisplay ?? "The selected plan is not available."}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="ds-button ds-button-secondary px-4 py-2" href="/pricing">
            Back to pricing
          </Link>
          <Link className="ds-button ds-button-primary px-4 py-2" href="/app/products">
            View current products
          </Link>
        </div>
      </article>
    </div>
  );
}

function CertificateView({ pathname }: { pathname: string }) {
  const { store } = useDemoStore();
  const certificateId = decodeURIComponent(pathname.split("/").pop() ?? "");
  const certificate = store.certificates.find((item) => item.id === certificateId);
  const recipient = store.users.find((user) => user.id === certificate?.userId);

  return (
    <div className="narrow-shell">
      <PageHeading
        eyebrow="Public verification"
        title="Certificate verification"
        description="Public verification shows limited non-sensitive certificate metadata."
      />
      <article className="ds-card p-5">
        {certificate ? (
          <>
            <StatusBadge label={certificate.status} />
            <h2 className="mt-4 text-2xl font-bold">{certificate.title}</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <Meta label="Recipient" value={recipient?.name ?? "Learner"} />
              <Meta label="Certificate ID" value={certificate.id} />
              <Meta label="Issued" value={certificate.issuedAt} />
              <Meta label="Verification slug" value={certificate.verificationSlug} />
            </dl>
          </>
        ) : (
          <p className="text-muted">No certificate matches this verification link.</p>
        )}
      </article>
    </div>
  );
}

function ProductsView() {
  const { store, activeUser, switchProduct } = useDemoStore();
  const products = getAvailableProducts(activeUser, store).filter((product) => product !== "admin");
  return (
    <div className="content-shell">
      <PageHeading
        eyebrow="Shared Core"
        title="My Products"
        description="Only products backed by the active organization entitlement and persona role are shown."
      />
      {products.length === 0 ? (
        <EmptyState title="No active products" body="This persona can use pricing or an admin workflow to activate products." />
      ) : (
        <div className="stagger grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <Link
              key={product}
              href={product === "gd" ? "/app/gd" : "/app/signatrain"}
              onClick={() => switchProduct(product)}
              className="ds-card group block p-6"
            >
              <span className="action-icon inline-flex h-11 w-11 items-center justify-center">
                {product === "gd" ? (
                  <Image src="/brand/gd/gd-icon.svg" alt="" width={22} height={22} unoptimized />
                ) : (
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
              <h2 className="mt-4 text-2xl font-bold">{productLabel(product)}</h2>
              <p className="mt-2 text-muted">
                Open the entitled {productLabel(product)} portal with navigation and route guards for this persona.
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ManifestPlaceholder({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  const { store, activeUser, activeOrganization, permissionDiagnostics } = useDemoStore();
  const { isActionDisabled } = useDemoPrefs();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const showContextCards = route.path === "/app/profile";
  const visibleActions = route.primaryActions.filter((action) => !isActionDisabled(route.path, action));
  const singleAction = visibleActions.length === 1 ? visibleActions[0] : null;
  const visibleRequests = visibleLegalRequestsForUser(activeUser, store);
  const visibleMessages = store.legalMessages.filter((message) => {
    const request = store.legalRequests.find((item) => item.id === message.requestId);
    return request ? canViewLegalMessage(activeUser, request, message, store) : false;
  });

  return (
    <div className="content-shell">
      <PageHeading
        eyebrow={`${route.domain} / ${route.priority}`}
        title={route.name}
        description="Use this workspace to review key activity, permissions, and next actions for the selected product."
      />
      {showContextCards ? (
        <div className="stagger mb-8 grid gap-4 lg:grid-cols-4">
          <MetricCard label="Persona" value={activeUser?.name ?? "None"} />
          <MetricCard label="Organization" value={activeOrganization?.name ?? "None"} />
          <MetricCard label="Visible requests" value={String(visibleRequests.length)} />
          <MetricCard label="Safe messages" value={String(visibleMessages.length)} />
        </div>
      ) : null}
      {singleAction ? (
        <InlineActionView action={singleAction} route={route} />
      ) : visibleActions.length === 0 ? (
        <EmptyState
          title="Actions hidden for this demo"
          body="All actions on this screen are turned off in Demo Controls. Re-enable them under Demo visibility."
        />
      ) : (
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Available actions</h2>
            <span className="ds-pill px-3 py-1 text-xs uppercase tracking-wide">Ready</span>
          </div>
          <div className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleActions.map((action) => (
              <ActionCard key={action} action={action} route={route} onOpen={() => setActiveAction(action)} />
            ))}
          </div>
        </section>
      )}
      <section className="ds-card mt-8 p-5">
        <h2 className="text-xl font-bold">Workspace snapshot</h2>
        <SnapshotGrid route={route} />
      </section>
      {permissionDiagnostics ? (
        <section className="ds-card mt-6 p-5">
          <h2 className="text-xl font-bold">Permission diagnostics</h2>
          <dl className="mt-3 grid gap-3 md:grid-cols-3">
            <Meta label="Path" value={pathname} />
            <Meta label="Allowed roles" value={route.allowedRoles.join(", ") || "Public"} />
            <Meta label="Required entitlements" value={route.requiredEntitlementsAny.join(", ") || "None"} />
          </dl>
        </section>
      ) : null}
      {activeAction ? (
        <ActionSimulationModal
          action={activeAction}
          route={route}
          onClose={() => setActiveAction(null)}
        />
      ) : null}
    </div>
  );
}

function ActionCard({
  action,
  route,
  onOpen
}: {
  action: string;
  route: RouteDefinition;
  onOpen: () => void;
}) {
  const { store, activeUser } = useDemoStore();
  const Icon = iconForAction(action, route);
  const tint = tintForAction(action, route);
  const simulation = buildActionSimulation(action, route, store, activeUser?.id);
  const previewItems = simulation.items.slice(0, 2);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`action-card group flex flex-col p-5 ${tint}`}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="action-icon inline-flex h-11 w-11 items-center justify-center">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="tint-chip px-2.5 py-1 text-xs uppercase tracking-wide">
          {simulation.items.length} {simulation.items.length === 1 ? "item" : "items"}
        </span>
      </span>
      <span className="mt-4 block text-lg font-bold text-ink">{action}</span>
      <span className="mt-1.5 block text-sm text-muted">{simulation.summary}</span>
      <span className="mt-4 block space-y-2">
        {previewItems.map((item) => (
          <span key={`${item.title}-${item.detail}`} className="action-meta-row text-sm">
            <span className="min-w-0 truncate font-semibold">{item.title}</span>
            {item.meta ? <span className="shrink-0 text-xs font-semibold text-muted">{item.meta}</span> : null}
          </span>
        ))}
      </span>
      <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-bold text-[color:var(--tint,var(--brand-accent))]">
        Open workspace
        <MousePointerClick className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </button>
  );
}

function tintForAction(action: string, route: RouteDefinition): string {
  const normalized = action.toLowerCase();
  if (normalized.includes("video") || normalized.includes("watch") || normalized.includes("play") || normalized.includes("zoom")) {
    return "tint-violet";
  }
  if (normalized.includes("session") || normalized.includes("date") || normalized.includes("schedule") || normalized.includes("appointment")) {
    return "tint-amber";
  }
  if (normalized.includes("checkout") || normalized.includes("billing") || normalized.includes("invoice") || normalized.includes("payment") || normalized.includes("card")) {
    return "tint-emerald";
  }
  if (normalized.includes("invite") || normalized.includes("assign") || normalized.includes("transfer") || normalized.includes("user") || normalized.includes("seat")) {
    return "tint-blue";
  }
  if (normalized.includes("download") || normalized.includes("export") || normalized.includes("upload") || normalized.includes("attach")) {
    return "tint-cyan";
  }
  if (normalized.includes("message") || normalized.includes("note")) {
    return "tint-cyan";
  }
  if (normalized.includes("approve") || normalized.includes("submit") || normalized.includes("publish") || normalized.includes("issue")) {
    return "tint-emerald";
  }
  if (normalized.includes("revoke") || normalized.includes("archive")) {
    return "tint-rose";
  }
  if (normalized.includes("alert") || route.domain.includes("Legislative")) {
    return "tint-rose";
  }
  if (normalized.includes("certificate") || normalized.includes("verify")) {
    return "tint-amber";
  }
  return "tint-brand";
}

function InlineActionView({ action, route }: { action: string; route: RouteDefinition }) {
  const { store, activeUser, activeOrganization } = useDemoStore();
  const simulation = buildActionSimulation(action, route, store, activeUser?.id);
  const Icon = iconForAction(action, route);
  const tint = tintForAction(action, route);

  return (
    <section className={`inline-action ${tint}`}>
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <span className="action-icon inline-flex h-12 w-12 shrink-0 items-center justify-center">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-bold">{simulation.title}</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted">{simulation.summary}</p>
        </div>
        <span className="tint-chip ml-auto px-2.5 py-1 text-xs uppercase tracking-wide">
          {simulation.items.length} {simulation.items.length === 1 ? "item" : "items"}
        </span>
      </div>
      <div className="stagger grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <ActionWorkflow action={action} route={route} />
        <aside className="space-y-4">
          <section className="ds-card p-4">
            <h3 className="font-bold">Context</h3>
            <dl className="mt-3 grid gap-2">
              <Meta label="Persona" value={activeUser?.name ?? "Selected persona"} />
              <Meta label="Organization" value={activeOrganization?.name ?? "Selected organization"} />
              <Meta label="Screen" value={route.path} />
            </dl>
          </section>
          <section className="ds-card p-4">
            <h3 className="font-bold">Workflow status</h3>
            <p className="mt-2 text-sm text-muted">
              Walk through the steps on the left to simulate the full process — choose an option,
              review the details, and confirm to see the recorded outcome.
            </p>
          </section>
        </aside>
      </div>
    </section>
  );
}

function ActionSimulationModal({
  action,
  route,
  onClose
}: {
  action: string;
  route: RouteDefinition;
  onClose: () => void;
}) {
  const { store, activeUser, activeOrganization } = useDemoStore();
  const simulation = buildActionSimulation(action, route, store, activeUser?.id);
  const Icon = iconForAction(action, route);
  const panelRef = useModalA11y(true, onClose);

  return (
    <div className="modal-scrim fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <section ref={panelRef} className={`modal-panel max-h-[88vh] w-full max-w-5xl overflow-y-auto ${tintForAction(action, route)}`}>
        <div className="border-b border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-4">
              <span className="action-icon inline-flex h-12 w-12 shrink-0 items-center justify-center">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="page-eyebrow text-sm font-bold uppercase tracking-wide">
                  {route.name}
                </p>
                <h2 className="page-title mt-1 text-2xl font-bold">{simulation.title}</h2>
                <p className="mt-2 max-w-3xl text-sm text-muted">{simulation.summary}</p>
              </div>
            </div>
            <button type="button" className="ds-button ds-button-secondary px-3 py-2 text-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <ActionWorkflow action={action} route={route} />
          <aside className="space-y-4">
            <section className="ds-card p-4">
              <h3 className="font-bold">Context</h3>
              <dl className="mt-3 grid gap-2">
                <Meta label="Persona" value={activeUser?.name ?? "Selected persona"} />
                <Meta label="Organization" value={activeOrganization?.name ?? "Selected organization"} />
                <Meta label="Screen" value={route.path} />
              </dl>
            </section>
            <section className="ds-card p-4">
              <h3 className="font-bold">Workflow status</h3>
              <p className="mt-2 text-sm text-muted">
                Walk through the steps on the left to simulate the full process — choose an option,
                review the details, and confirm to see the recorded outcome.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}

interface ActionSimulation {
  title: string;
  summary: string;
  kind: "video" | "sessions" | "cards" | "form" | "status" | "certificates";
  items: Array<{ title: string; detail: string; meta?: string; progress?: number }>;
}

type WorkflowStep = "choose" | "review" | "processing" | "done";

function verbForAction(action: string): string {
  const normalized = action.toLowerCase();
  if (normalized.includes("register")) {
    return "Register";
  }
  if (normalized.includes("assign")) {
    return "Assign";
  }
  if (normalized.includes("invite")) {
    return "Send invite";
  }
  if (normalized.includes("transfer")) {
    return "Transfer";
  }
  if (normalized.includes("approve")) {
    return "Approve";
  }
  if (normalized.includes("publish")) {
    return "Publish";
  }
  if (normalized.includes("submit")) {
    return "Submit";
  }
  if (normalized.includes("upload") || normalized.includes("attach")) {
    return "Upload";
  }
  if (normalized.includes("download") || normalized.includes("export")) {
    return "Download";
  }
  if (normalized.includes("issue")) {
    return "Issue";
  }
  if (normalized.includes("revoke")) {
    return "Revoke";
  }
  if (normalized.includes("archive")) {
    return "Archive";
  }
  if (normalized.includes("schedule") || normalized.includes("book")) {
    return "Schedule";
  }
  if (normalized.includes("verify")) {
    return "Verify";
  }
  return "Confirm";
}

function workflowSideEffects(
  simulation: ActionSimulation,
  route: RouteDefinition,
  subject: string
): string[] {
  if (simulation.kind === "sessions") {
    return [
      `${subject} added to the attendee roster`,
      "Confirmation email queued in the outbox",
      "Attendance tracking armed at the 90% threshold",
      "Audit event recorded"
    ];
  }
  if (simulation.kind === "certificates") {
    return [
      `Verification link generated for ${subject}`,
      "PDF download prepared (simulated)",
      "Audit event recorded"
    ];
  }
  if (simulation.kind === "form") {
    return [
      "Entry created with the selected details",
      route.domain.includes("GD")
        ? "GD operations queue notified with a client-safe summary"
        : "Reviewer queue notified",
      "Confirmation email queued in the outbox",
      "Audit event recorded"
    ];
  }
  if (simulation.kind === "status") {
    return [
      `${subject} moved to the next workflow state`,
      "Attorney review checkpoint satisfied",
      "Distribution targeting prepared for eligible recipients",
      "Audit event recorded"
    ];
  }
  if (route.domain.includes("Signatrain")) {
    return [
      `Progress updated for ${subject}`,
      "Next step unlocked in the learning sequence",
      "Learner record synchronized"
    ];
  }
  if (route.domain.includes("GD")) {
    return [
      `${subject} updated in the client workspace`,
      "Client-safe activity entry added",
      "Audit event recorded"
    ];
  }
  return [`${subject} processed`, "Notification queued", "Audit event recorded"];
}

function ActionWorkflow({ action, route }: { action: string; route: RouteDefinition }) {
  const { store, activeUser, activeOrganization, recordSimulation } = useDemoStore();
  const simulation = buildActionSimulation(action, route, store, activeUser?.id);
  const tint = tintForAction(action, route);
  const verb = verbForAction(action);
  const isForm = simulation.kind === "form";
  const [step, setStep] = useState<WorkflowStep>("choose");
  const [selected, setSelected] = useState<ActionSimulation["items"][number] | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const subjectForRecord = isForm ? simulation.title : selected?.title ?? simulation.title;

  useEffect(() => {
    if (step !== "processing") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      recordSimulation({
        title: `${verb} complete`,
        body: `${subjectForRecord} — ${route.name}.`,
        href: resolveDemoPath(route.path),
        emailSubject: `${verb} confirmation — ${subjectForRecord}`,
        emailBody: `This simulated email confirms the action "${action}" for ${subjectForRecord} on the ${route.name} screen.`,
        action: `${verb.toLowerCase().replaceAll(" ", "_")}_simulated`,
        objectType: simulation.kind,
        objectId: route.path
      });
      setStep("done");
    }, 750);
    return () => window.clearTimeout(timer);
  }, [step, recordSimulation, verb, subjectForRecord, route.name, route.path, action, simulation.kind]);

  if (simulation.kind === "video") {
    return <VideoWorkflow simulation={simulation} tint={tint} route={route} />;
  }

  const stepIndex = step === "choose" ? 0 : step === "review" ? 1 : 2;
  const subject = subjectForRecord;
  const reset = () => {
    setStep("choose");
    setSelected(null);
  };

  return (
    <section className={`ds-card p-5 ${tint}`}>
      <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Workflow progress">
        {["Choose", "Review", "Done"].map((label, index) => (
          <span
            key={label}
            className={`step-chip px-2.5 py-1 text-xs font-bold ${index <= stepIndex ? "step-chip-active" : ""}`}
          >
            <span className="step-num">{index + 1}</span>
            {label}
          </span>
        ))}
      </div>

      {step === "choose" && !isForm ? (
        <>
          <h3 className="text-lg font-bold">Choose an option</h3>
          <p className="mt-1 text-sm text-muted">{simulation.summary}</p>
          <div className="stagger mt-4 grid gap-2.5">
            {simulation.items.map((item) => (
              <button
                key={`${item.title}-${item.detail}`}
                type="button"
                className="option-card p-3.5 text-left"
                onClick={() => {
                  setSelected(item);
                  setStep("review");
                }}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-bold">{item.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{item.detail}</span>
                  </span>
                  {item.meta ? (
                    <span className="tint-chip shrink-0 px-2 py-0.5 text-xs">{item.meta}</span>
                  ) : null}
                </span>
                {typeof item.progress === "number" ? (
                  <ProgressBar value={item.progress} label="Progress" />
                ) : null}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {step === "choose" && isForm ? (
        <>
          <h3 className="text-lg font-bold">Complete the details</h3>
          <p className="mt-1 text-sm text-muted">{simulation.summary}</p>
          <div className="mt-4 space-y-3">
            {simulation.items.map((item) => (
              <label key={item.title} className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
                  {item.title}
                </span>
                <input
                  className="ds-field w-full px-3 py-2 text-sm font-semibold"
                  value={formValues[item.title] ?? item.detail}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, [item.title]: event.target.value }))
                  }
                />
                {item.meta ? <span className="mt-1 block text-xs text-muted">{item.meta}</span> : null}
              </label>
            ))}
          </div>
          <button
            type="button"
            className="ds-button ds-button-primary mt-5 px-4 py-2 text-sm"
            onClick={() => setStep("review")}
          >
            Continue
          </button>
        </>
      ) : null}

      {step === "review" ? (
        <>
          <h3 className="text-lg font-bold">Review & confirm</h3>
          <div className="ds-card-muted mt-4 p-4">
            <p className="font-bold">{subject}</p>
            <p className="mt-1 text-sm text-muted">
              {isForm ? "The details below will be submitted." : selected?.detail}
            </p>
            {isForm ? (
              <dl className="mt-3 grid gap-2">
                {simulation.items.map((item) => (
                  <Meta
                    key={item.title}
                    label={item.title}
                    value={formValues[item.title] ?? item.detail}
                  />
                ))}
              </dl>
            ) : null}
          </div>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            <Meta label="Persona" value={activeUser?.name ?? "Selected persona"} />
            <Meta label="Organization" value={activeOrganization?.name ?? "Selected organization"} />
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="ds-button ds-button-primary px-4 py-2 text-sm"
              onClick={() => setStep("processing")}
            >
              {verb}
            </button>
            <button
              type="button"
              className="ds-button ds-button-secondary px-4 py-2 text-sm"
              onClick={reset}
            >
              Back
            </button>
          </div>
        </>
      ) : null}

      {step === "processing" ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="spinner" aria-hidden="true" />
          <p className="text-sm font-semibold text-muted">Processing…</p>
        </div>
      ) : null}

      {step === "done" ? (
        <div className="py-1">
          <div className="flex items-center gap-3">
            <span className="success-icon">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg font-bold">{verb} complete</h3>
              <p className="text-sm text-muted">{subject} — simulated successfully.</p>
            </div>
          </div>
          <ul className="stagger mt-5 space-y-2">
            {workflowSideEffects(simulation, route, subject).map((effect) => (
              <li key={effect} className="flex items-start gap-2 text-sm">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--tint,var(--brand-accent))]"
                  aria-hidden="true"
                />
                {effect}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="ds-button ds-button-secondary px-4 py-2 text-sm"
              onClick={reset}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Run again
            </button>
            <span className="text-xs text-muted">Demo simulation — no real data was changed.</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function VideoWorkflow({
  simulation,
  tint,
  route
}: {
  simulation: ActionSimulation;
  tint: string;
  route: RouteDefinition;
}) {
  const { recordSimulation } = useDemoStore();
  const [progress, setProgress] = useState(72);
  const [playing, setPlaying] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const item = simulation.items[0];
  const complete = progress >= 95;

  useEffect(() => {
    if (!playing) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setProgress((current) => Math.min(current + 1, 100));
    }, 90);
    return () => window.clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    if (progress >= 100) {
      setPlaying(false);
    }
  }, [progress]);

  useEffect(() => {
    if (!complete || recorded) {
      return;
    }
    setRecorded(true);
    recordSimulation({
      title: "Completion recorded",
      body: `${item?.title ?? "Training video"} reached the 95% watch threshold.`,
      href: resolveDemoPath(route.path),
      emailSubject: `Completion recorded — ${item?.title ?? "Training video"}`,
      emailBody: `This simulated email confirms that ${item?.title ?? "the training video"} reached 95% unique watch coverage and completion was recorded.`,
      action: "video_completion_simulated",
      objectType: "video",
      objectId: route.path
    });
  }, [complete, recorded, recordSimulation, item?.title, route.path]);

  return (
    <section className={`ds-card p-4 ${tint}`}>
      <div className="video-stage flex aspect-video items-center justify-center">
        <div className="text-center">
          <button
            type="button"
            className="video-play"
            onClick={() => setPlaying((current) => !current)}
            aria-label={playing ? "Pause simulated video" : "Play simulated video"}
          >
            {playing ? (
              <PauseCircle className="h-16 w-16" aria-hidden="true" />
            ) : (
              <PlayCircle className="h-16 w-16" aria-hidden="true" />
            )}
          </button>
          <p className="mt-3 text-lg font-bold text-white">{item?.title ?? "Training video"}</p>
          <p className="video-muted-text mt-1 text-sm">
            {playing ? "Playing — unique watch coverage is being recorded" : item?.detail ?? "Video player"}
          </p>
        </div>
      </div>
      <ProgressBar value={progress} label="Unique watch coverage" />
      {complete ? (
        <div className="stagger mt-4 space-y-2">
          <p className="flex items-start gap-2 text-sm font-semibold">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--tint,var(--brand-accent))]"
              aria-hidden="true"
            />
            95% unique watch coverage reached — completion recorded.
          </p>
          <p className="flex items-start gap-2 text-sm text-muted">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 opacity-60" aria-hidden="true" />
            Certificate eligibility updated for this learner.
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">
          Press play to simulate watching. Completion is recorded at 95% unique coverage.
        </p>
      )}
    </section>
  );
}

function ProgressBar({ value, label, inverse = false }: { value: number; label: string; inverse?: boolean }) {
  return (
    <div className="mt-4">
      <div className={[
        "mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wide",
        inverse ? "video-muted-text" : "text-muted"
      ].join(" ")}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function iconForAction(action: string, route: RouteDefinition) {
  const normalized = action.toLowerCase();
  if (normalized.includes("video") || normalized.includes("watch") || normalized.includes("play") || normalized.includes("zoom")) {
    return PlayCircle;
  }
  if (normalized.includes("session") || normalized.includes("date") || normalized.includes("schedule") || normalized.includes("appointment")) {
    return CalendarDays;
  }
  if (normalized.includes("checkout") || normalized.includes("billing") || normalized.includes("invoice") || normalized.includes("payment") || normalized.includes("card")) {
    return CreditCard;
  }
  if (normalized.includes("invite") || normalized.includes("assign") || normalized.includes("transfer") || normalized.includes("user")) {
    return Users;
  }
  if (normalized.includes("download") || normalized.includes("export")) {
    return Download;
  }
  if (normalized.includes("upload") || normalized.includes("attach")) {
    return Upload;
  }
  if (normalized.includes("message") || normalized.includes("note")) {
    return MessageSquare;
  }
  if (normalized.includes("approve") || normalized.includes("submit") || normalized.includes("publish") || normalized.includes("issue") || normalized.includes("revoke")) {
    return ClipboardCheck;
  }
  if (normalized.includes("filter") || normalized.includes("review")) {
    return Search;
  }
  if (normalized.includes("view") || normalized.includes("open")) {
    return Eye;
  }
  if (route.domain.includes("Signatrain")) {
    return GraduationCap;
  }
  if (route.domain.includes("GD")) {
    return BriefcaseBusiness;
  }
  return ListChecks;
}

function buildActionSimulation(
  action: string,
  route: RouteDefinition,
  store: DemoStoreData,
  activeUserId?: string
): ActionSimulation {
  const normalized = action.toLowerCase();

  if (normalized.includes("open sessions") || normalized.includes("sessions, scenarios, progress")) {
    return {
      title: "Sessions, scenarios, and progress",
      summary: "A compact learner view showing the next session, eligible scenario, and current progress state.",
      kind: "sessions",
      items: [
        ...store.liveSessions.slice(0, 2).map((session) => ({
          title: session.title,
          detail: `${session.status.replaceAll("_", " ")} - ${new Date(session.startsAt).toLocaleDateString("en-US")}`,
          meta: session.audience
        })),
        ...store.scenarios.slice(0, 2).map((scenario) => ({
          title: scenario.title,
          detail: scenario.summary,
          meta: scenario.audiences.join(" + ")
        })),
        {
          title: "Progress summary",
          detail: activeUserId ? `Progress is scoped to learner record ${activeUserId}.` : "Progress is scoped to the selected learner.",
          meta: "In progress"
        }
      ]
    };
  }

  if (normalized.includes("video") || normalized.includes("watch") || normalized.includes("play") || normalized.includes("join live session")) {
    const course = store.courses[0];
    return {
      title: normalized.includes("zoom") ? "Live session room" : "Training video",
      summary: "Open the session experience, confirm attendance readiness, and continue progress tracking.",
      kind: "video",
      items: [
        {
          title: course?.title ?? "Training video",
          detail: normalized.includes("zoom")
            ? "Join flow with roster status, attendance readiness, and session controls."
            : "Video shell with poster, controls, and progress affordance."
        }
      ]
    };
  }

  if (normalized.includes("continue learning") || route.domain.includes("Signatrain")) {
    return {
      title: "Learning path",
      summary: "Course progress, practical next steps, and scenario-based modules for the selected learner.",
      kind: "cards",
      items: store.courses.slice(0, 3).map((course, index) => ({
        title: course.title,
        detail: `${course.topic} - ${course.audience} path - ${course.moduleIds.length} modules`,
        meta: index === 0 ? "Recommended next" : "Learning path",
        progress: [68, 42, 24][index] ?? 30
      }))
    };
  }

  if (normalized.includes("choose") || normalized.includes("enter") || normalized.includes("edit") || normalized.includes("toggle") || normalized.includes("describe")) {
    return {
      title: "Request details",
      summary: "Complete the required fields and review validation guidance before submitting.",
      kind: "form",
      items: [
        { title: "Primary field", detail: action, meta: "Required" },
        { title: "Visibility", detail: route.domain.includes("GD") ? "Company-visible or restricted" : "Learner workspace" },
        { title: "Result", detail: "Ready for review" }
      ]
    };
  }

  if (normalized.includes("request") || route.domain.includes("GD")) {
    return {
      title: "GD service workspace",
      summary: "Shows the client-facing service surface while preserving request privacy boundaries.",
      kind: "cards",
      items: store.legalRequests.slice(0, 2).map((request) => ({
        title: request.subject,
        detail: `${request.topic} - ${request.status.replaceAll("_", " ")} - ${request.privacy.replaceAll("_", " ")}`,
        meta: request.clientVisibleSummary ?? "Client-safe summary"
      }))
    };
  }

  if (normalized.includes("alert") || route.domain.includes("Legislative")) {
    return {
      title: "Legislative alert workspace",
      summary: "Review the alert pipeline and recipient experience with attorney-reviewed content.",
      kind: "status",
      items: store.alerts.slice(0, 3).map((alert) => ({
        title: alert.title,
        detail: `${alert.status.replaceAll("_", " ")} - ${alert.jurisdictionIds.join(", ")}`,
        meta: alert.audiences.join(" + ")
      }))
    };
  }

  if (normalized.includes("certificate") || normalized.includes("download") || normalized.includes("verify")) {
    return {
      title: "Certificate and export",
      summary: "Review the certificate metadata available for verification and download.",
      kind: "certificates",
      items: store.certificates.map((certificate) => ({
        title: certificate.title,
        detail: `${certificate.id} - ${certificate.status}`,
        meta: certificate.issuedAt
      }))
    };
  }

  if (normalized.includes("invite") || normalized.includes("assign") || normalized.includes("seat") || normalized.includes("user")) {
    return {
      title: "People and seat management",
      summary: "Review available users, role assignments, and seat pools.",
      kind: "cards",
      items: [
        ...store.users.slice(0, 3).map((user) => ({
          title: user.name,
          detail: `${user.status} - ${user.roles.join(", ")}`,
          meta: user.email
        })),
        ...store.seatPools.slice(0, 2).map((pool) => ({
          title: pool.entitlementCode,
          detail: `${pool.capacity} seats from ${pool.source}`,
          meta: pool.organizationId
        }))
      ]
    };
  }

  return {
    title: action,
    summary: "Review key details and related records for this action.",
    kind: "cards",
    items: [
      { title: "Current screen", detail: route.name, meta: route.domain },
      { title: "Workflow", detail: action, meta: route.priority },
      { title: "Status", detail: "Ready for review" }
    ]
  };
}

function SnapshotGrid({ route }: { route: RouteDefinition }) {
  const { store } = useDemoStore();
  const cards = [
    { label: "Users", value: store.users.length },
    { label: "Entitlements", value: store.entitlements.length },
    { label: "Seat pools", value: store.seatPools.length },
    { label: "Notifications", value: store.notifications.length }
  ];

  if (route.domain.includes("Signatrain")) {
    cards.push(
      { label: "Courses", value: store.courses.length },
      { label: "Scenarios", value: store.scenarios.length },
      { label: "Live sessions", value: store.liveSessions.length }
    );
  }

  if (route.domain.includes("GD")) {
    cards.push(
      { label: "GD plans", value: store.gdPlans.length },
      { label: "Benefits", value: store.gdBenefits.length },
      { label: "Legal requests", value: store.legalRequests.length }
    );
  }

  if (route.domain.includes("Legislative")) {
    cards.push({ label: "Alerts", value: store.alerts.length });
  }

  const tints = ["tint-blue", "tint-violet", "tint-cyan", "tint-emerald", "tint-amber", "tint-rose", "tint-brand"];

  return (
    <div className="stagger mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <MetricCard key={card.label} label={card.label} value={String(card.value)} tint={tints[index % tints.length]} />
      ))}
    </div>
  );
}

function RestrictedView({ from }: { from: string | null }) {
  const { store, activeUser } = useDemoStore();
  const route = from ? findRoute(from) : undefined;
  const access = canAccessRoute(route, activeUser, store);

  return (
    <div className="narrow-shell">
      <section className="ds-card p-6">
        <LockKeyhole className="brand-mark h-9 w-9" aria-hidden="true" />
        <h1 className="page-title mt-4 text-3xl font-bold">Restricted access</h1>
        <p className="mt-2 text-muted">
          {access.reason ?? "The active persona cannot open this screen."} Hidden content is not displayed.
        </p>
        {route ? (
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <Meta label="Requested screen" value={route.name} />
            <Meta label="Required roles" value={route.allowedRoles.join(", ") || "Public"} />
            <Meta label="Required entitlements" value={route.requiredEntitlementsAny.join(", ") || "None"} />
            <Meta label="Current persona" value={activeUser?.name ?? "None"} />
          </dl>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/app/products" className="ds-button ds-button-primary px-4 py-2">
            Go to My Products
          </Link>
          <Link href="/" className="ds-button ds-button-secondary px-4 py-2">
            Select persona
          </Link>
        </div>
      </section>
    </div>
  );
}

function NotInManifest({ pathname }: { pathname: string }) {
  return (
    <div className="narrow-shell">
      <EmptyState
        title="Screen unavailable"
        body={`The path ${pathname} is not available in this workspace.`}
      />
    </div>
  );
}

function PageHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-6">
      <p className="page-eyebrow text-sm font-bold uppercase tracking-wide">{eyebrow}</p>
      <h1 className="page-title mt-1 text-3xl font-bold lg:text-4xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-muted">{description}</p>
    </header>
  );
}

function MetricCard({ label, value, tint = "tint-brand" }: { label: string; value: string; tint?: string }) {
  return (
    <article className={`ds-card stat-card p-4 ${tint}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="stat-value mt-1.5 text-2xl font-extrabold">
        <AnimatedValue value={value} />
      </p>
    </article>
  );
}

function AnimatedValue({ value }: { value: string }) {
  const numeric = /^\d+$/.test(value.trim()) ? Number(value.trim()) : null;
  const [display, setDisplay] = useState<number>(0);

  useEffect(() => {
    if (numeric === null) {
      return undefined;
    }

    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(numeric);
      return undefined;
    }

    let frame = 0;
    const duration = 750;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(numeric * eased));
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [numeric]);

  return <>{numeric === null ? value : display}</>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="ds-card-muted p-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold">{value}</dd>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="ds-pill px-3 py-1 text-sm">
      {label}
    </span>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <section className="ds-card p-6 text-center">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-muted">{body}</p>
    </section>
  );
}
