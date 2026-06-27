"use client";

import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Download,
  Eye,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  MessageSquare,
  MousePointerClick,
  PlayCircle,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  Upload,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { canAccessRoute, getAvailableProducts, isInternalUser, productLabel } from "@/lib/access";
import { routeGroup, routeProduct, findRoute, resolveDemoPath, routes } from "@/lib/routes";
import { DemoStoreProvider, useDemoStore } from "@/lib/store";
import type { DemoStoreData, ProductContext, RouteDefinition } from "@/lib/types";
import { canViewLegalMessage, visibleLegalRequestsForUser } from "@/lib/privacy";

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
      <ShellContent />
    </DemoStoreProvider>
  );
}

function ShellContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
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
  } = useDemoStore();
  const [controlsOpen, setControlsOpen] = useState(false);
  const [outboxOpen, setOutboxOpen] = useState(false);
  const route = findRoute(pathname);
  const restrictedFrom = searchParams.get("from");
  const isRestrictedPage = pathname === "/restricted";
  const access = canAccessRoute(route, activeUser, store);
  const productForTheme = isRestrictedPage ? store.activeProduct : routeProduct(pathname);
  const visualProduct = productForTheme === "shared" ? store.activeProduct : productForTheme;

  useEffect(() => {
    if (!isRestrictedPage && route && !access.allowed) {
      router.replace(`/restricted?from=${encodeURIComponent(pathname)}`);
    }
  }, [access.allowed, isRestrictedPage, pathname, route, router]);

  const handlePersonaChange = (personaId: string) => {
    const startRoute = switchPersona(personaId);
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

  return (
    <div data-product={visualProduct} className="min-h-screen bg-canvas text-ink">
      <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm font-semibold text-amber-950">
        Demo - fictional data only. No production integrations, no real legal, payment, or customer data.
      </div>
      <header className="sticky top-0 z-30 border-b border-line bg-panel/95 backdrop-blur">
        <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 lg:px-6">
          <Link href="/app/products" className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5 text-[color:var(--theme-accent)]" aria-hidden="true" />
            <span>GD & Signatrain Demo</span>
          </Link>
          <ProductSwitcher
            availableProducts={availableProducts}
            currentProduct={store.activeProduct}
            onSwitch={handleProductSwitch}
          />
          <div className="ml-auto flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded border border-line bg-white px-3 py-2">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              {activeOrganization?.name ?? "No organization"}
            </span>
            <span className="inline-flex items-center gap-2 rounded border border-line bg-white px-3 py-2">
              <Users className="h-4 w-4" aria-hidden="true" />
              {activePersona.name}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded bg-[color:var(--theme-strong)] px-3 py-2 font-semibold text-white"
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
          {isRestrictedPage ? (
            <RestrictedView from={restrictedFrom} />
          ) : route && access.allowed ? (
            <RouteView route={route} pathname={pathname} />
          ) : route ? (
            <RestrictedView from={pathname} />
          ) : (
            <NotInManifest pathname={pathname} />
          )}
        </main>
      </div>
      <DemoControls
        open={controlsOpen}
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
            "inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold transition",
            currentProduct === product
              ? "bg-[color:var(--theme-soft)] text-[color:var(--theme-strong)]"
              : "text-muted hover:bg-slate-100"
          ].join(" ")}
          title={`Switch to ${productLabel(product)}`}
        >
          {product === "gd" ? <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" /> : null}
          {product === "signatrain" ? <GraduationCap className="h-4 w-4" aria-hidden="true" /> : null}
          {product === "shared" ? <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> : null}
          {product === "admin" ? <ShieldCheck className="h-4 w-4" aria-hidden="true" /> : null}
          {productLabel(product)}
        </button>
      ))}
    </nav>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  const { store, activeUser } = useDemoStore();
  const visibleRoutes = useMemo(
    () =>
      routes
        .filter((route) => route.domain !== "Public" && route.domain !== "Public/Shared")
        .filter((route) => canAccessRoute(route, activeUser, store).allowed)
        .map((route) => ({ route, href: resolveDemoPath(route.path), group: routeGroup(route) })),
    [activeUser, store]
  );
  const grouped = visibleRoutes.reduce<Record<string, typeof visibleRoutes>>((accumulator, item) => {
    accumulator[item.group] = [...(accumulator[item.group] ?? []), item];
    return accumulator;
  }, {});

  return (
    <aside className="sticky top-[104px] hidden h-[calc(100vh-104px)] w-72 shrink-0 overflow-y-auto border-r border-line bg-white p-4 lg:block">
      <nav aria-label="Primary">
        {Object.entries(grouped).map(([group, items]) => (
          <section key={group} className="mb-5">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{group}</h2>
            <ul className="space-y-1">
              {items.map(({ route, href }) => (
                <li key={route.path}>
                  <Link
                    href={href}
                    className={[
                      "block rounded px-3 py-2 text-sm",
                      findRoute(pathname)?.path === route.path
                        ? "bg-[color:var(--theme-soft)] font-semibold text-[color:var(--theme-strong)]"
                        : "text-ink hover:bg-slate-100"
                    ].join(" ")}
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </aside>
  );
}

function DemoControls({
  open,
  onClose,
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
      <section className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-line p-5">
          <div>
            <h2 className="text-xl font-bold">Demo Controls</h2>
            <p className="text-sm text-muted">Switch personas, products, scenarios, and reset fixture data.</p>
          </div>
          <button type="button" className="rounded border border-line px-3 py-2 text-sm font-semibold" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="space-y-6 p-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Persona</span>
            <select
              className="w-full rounded border border-line bg-white px-3 py-2"
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
                className="w-full rounded border border-line bg-white px-3 py-2"
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
                className="rounded border border-line px-3 py-2 text-sm font-semibold"
                onClick={() => onProductSwitch("shared")}
              >
                My Products
              </button>
              {availableProducts.map((product) => (
                <button
                  key={product}
                  type="button"
                  className="rounded border border-line px-3 py-2 text-sm font-semibold"
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
                  className="rounded border border-line px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50"
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
              className="inline-flex items-center justify-center gap-2 rounded bg-[color:var(--theme-strong)] px-3 py-2 text-sm font-semibold text-white"
              onClick={onOutboxOpen}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              Open email outbox
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded border border-red-200 px-3 py-2 text-sm font-semibold text-red-700"
              onClick={() => {
                if (window.confirm("Reset all local demo data to the checked-in fixtures?")) {
                  onReset();
                  router.push("/app/products");
                  onClose();
                }
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset demo data
            </button>
          </section>

          <label className="flex items-center gap-3 rounded border border-line p-3 text-sm">
            <input
              type="checkbox"
              checked={permissionDiagnostics}
              onChange={(event) => setPermissionDiagnostics(event.target.checked)}
            />
            Show permission diagnostics on route placeholders
          </label>
        </div>
      </section>
      {outboxOpen ? <OutboxModal onClose={onOutboxClose} /> : null}
    </div>
  );
}

function OutboxModal({ onClose }: { onClose: () => void }) {
  const { store } = useDemoStore();
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 p-4">
      <section className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Simulated email outbox</h2>
          <button type="button" className="rounded border border-line px-3 py-2 text-sm font-semibold" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="space-y-3">
          {store.emailOutbox.map((email) => (
            <article key={email.id} className="rounded border border-line p-4">
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

function RouteView({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  if (pathname === "/") {
    return <LandingView />;
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

  return <ManifestPlaceholder route={route} pathname={pathname} />;
}

function LandingView() {
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
    <div className="mx-auto max-w-7xl">
      <section className="mb-8 rounded border border-line bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--theme-accent)]">
          Disposable demo
        </p>
        <h1 className="mt-2 text-4xl font-bold">Select a persona to enter the GD & Signatrain demo</h1>
        <p className="mt-3 max-w-3xl text-muted">
          This local demo validates shared product access, role-specific navigation, and strict data boundaries using only fictional fixture data.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded bg-[color:var(--theme-strong)] px-4 py-2 font-semibold text-white" href="/pricing">
            Open pricing
          </Link>
          <Link className="rounded border border-line px-4 py-2 font-semibold" href="/app/products">
            My Products
          </Link>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-3">
        {Object.entries(grouped).map(([group, personas]) => (
          <section key={group}>
            <h2 className="mb-3 text-lg font-bold">{group}</h2>
            <div className="space-y-3">
              {personas.map((persona) => (
                <article key={persona.id} className="rounded border border-line bg-white p-4">
                  <h3 className="font-semibold">{persona.name}</h3>
                  <p className="mt-1 text-sm text-muted">{persona.description}</p>
                  <button
                    type="button"
                    className="mt-4 rounded bg-[color:var(--theme-strong)] px-3 py-2 text-sm font-semibold text-white"
                    onClick={() => {
                      const startRoute = switchPersona(persona.id);
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

function PricingView() {
  const { store } = useDemoStore();
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeading
        eyebrow="Public"
        title="Pricing and plan comparison"
        description="Self-service choices open the simulated checkout route. Integration behavior remains fixture-backed for the demo."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {store.catalogSkus.map((sku) => (
          <article key={sku.id} className="rounded border border-line bg-white p-5 shadow-soft">
            <h2 className="text-xl font-bold">{sku.name}</h2>
            <p className="mt-2 text-muted">{sku.priceDisplay}</p>
            {sku.additionalSeatDisplay ? <p className="mt-1 text-sm text-muted">{sku.additionalSeatDisplay}</p> : null}
            {sku.selfService ? (
              <Link
                className="mt-5 inline-block rounded bg-[color:var(--theme-strong)] px-4 py-2 font-semibold text-white"
                href={`/checkout/${sku.id}`}
              >
                Open simulated checkout
              </Link>
            ) : (
              <p className="mt-5 rounded bg-slate-100 px-3 py-2 text-sm font-semibold text-muted">
                Admin-assisted purchase in this demo phase
              </p>
            )}
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
    <div className="mx-auto max-w-4xl">
      <PageHeading
        eyebrow="Public / Shared"
        title="Simulated checkout"
        description="Phase 1 exposes the route and safe context. Checkout mutations are implemented in the shared company and checkout phase."
      />
      <article className="rounded border border-line bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold">{sku?.name ?? "Unknown SKU"}</h2>
        <p className="mt-2 text-muted">{sku?.priceDisplay ?? "The selected SKU is not in the fixture catalog."}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded border border-line px-4 py-2 font-semibold" href="/pricing">
            Back to pricing
          </Link>
          <Link className="rounded bg-[color:var(--theme-strong)] px-4 py-2 font-semibold text-white" href="/app/products">
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
    <div className="mx-auto max-w-4xl">
      <PageHeading
        eyebrow="Public verification"
        title="Certificate verification"
        description="Public verification exposes only limited non-sensitive demo metadata."
      />
      <article className="rounded border border-line bg-white p-5 shadow-soft">
        {certificate ? (
          <>
            <StatusBadge label={certificate.status} />
            <h2 className="mt-4 text-2xl font-bold">{certificate.title}</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <Meta label="Recipient" value={recipient?.name ?? "Demo learner"} />
              <Meta label="Certificate ID" value={certificate.id} />
              <Meta label="Issued" value={certificate.issuedAt} />
              <Meta label="Verification slug" value={certificate.verificationSlug} />
            </dl>
          </>
        ) : (
          <p className="text-muted">No certificate fixture matches this verification route.</p>
        )}
      </article>
    </div>
  );
}

function ProductsView() {
  const { store, activeUser, switchProduct } = useDemoStore();
  const products = getAvailableProducts(activeUser, store).filter((product) => product !== "admin");
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeading
        eyebrow="Shared Core"
        title="My Products"
        description="Only products backed by the active organization entitlement and persona role are shown."
      />
      {products.length === 0 ? (
        <EmptyState title="No active products" body="This persona can use pricing or an admin workflow to activate products in later phases." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <Link
              key={product}
              href={product === "gd" ? "/app/gd" : "/app/signatrain"}
              onClick={() => switchProduct(product)}
              className="rounded border border-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5"
            >
              <h2 className="text-2xl font-bold">{productLabel(product)}</h2>
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
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const visibleRequests = visibleLegalRequestsForUser(activeUser, store);
  const visibleMessages = store.legalMessages.filter((message) => {
    const request = store.legalRequests.find((item) => item.id === message.requestId);
    return request ? canViewLegalMessage(activeUser, request, message, store) : false;
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow={`${route.domain} / ${route.priority}`}
        title={route.name}
        description="Phase 1 placeholder with real navigation, central route guards, fixture context, and no external integrations."
      />
      <div className="grid gap-4 lg:grid-cols-4">
        <MetricCard label="Persona" value={activeUser?.name ?? "None"} />
        <MetricCard label="Organization" value={activeOrganization?.name ?? "None"} />
        <MetricCard label="Visible requests" value={String(visibleRequests.length)} />
        <MetricCard label="Safe messages" value={String(visibleMessages.length)} />
      </div>
      <section className="mt-6 rounded border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Documented actions</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted">
              Interactive demo actions from the route manifest. Each card opens a safe simulation using fixture data; full workflow mutations begin in later phases.
            </p>
          </div>
          <span className="rounded bg-[color:var(--theme-soft)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[color:var(--theme-strong)]">
            Simulated
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {route.primaryActions.map((action) => (
            <ActionCard key={action} action={action} route={route} onOpen={() => setActiveAction(action)} />
          ))}
        </div>
      </section>
      <section className="mt-6 rounded border border-line bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold">Fixture snapshot</h2>
        <SnapshotGrid route={route} />
      </section>
      {permissionDiagnostics ? (
        <section className="mt-6 rounded border border-line bg-white p-5 shadow-soft">
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
  const Icon = iconForAction(action, route);
  const hint = actionHint(action, route);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group min-h-36 rounded border border-line bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-[color:var(--theme-accent)] hover:bg-white hover:shadow-soft"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded bg-[color:var(--theme-soft)] text-[color:var(--theme-strong)]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="mt-4 block text-base font-bold text-ink">{action}</span>
      <span className="mt-2 block text-sm text-muted">{hint}</span>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[color:var(--theme-strong)]">
        Open simulation
        <MousePointerClick className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </button>
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <section className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded bg-white shadow-soft">
        <div className="border-b border-line bg-slate-50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded bg-[color:var(--theme-soft)] text-[color:var(--theme-strong)]">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[color:var(--theme-accent)]">
                  {route.name} simulation
                </p>
                <h2 className="mt-1 text-2xl font-bold">{simulation.title}</h2>
                <p className="mt-2 max-w-3xl text-sm text-muted">{simulation.summary}</p>
              </div>
            </div>
            <button type="button" className="rounded border border-line bg-white px-3 py-2 text-sm font-semibold" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <SimulationPreview simulation={simulation} />
          <aside className="space-y-4">
            <section className="rounded border border-line p-4">
              <h3 className="font-bold">Fixture context</h3>
              <dl className="mt-3 grid gap-2">
                <Meta label="Persona" value={activeUser?.name ?? "Demo persona"} />
                <Meta label="Organization" value={activeOrganization?.name ?? "Demo organization"} />
                <Meta label="Route" value={route.path} />
              </dl>
            </section>
            <section className="rounded border border-line p-4">
              <h3 className="font-bold">What changes in a later phase</h3>
              <p className="mt-2 text-sm text-muted">
                This modal previews the user experience without writing workflow state. The real mutation will be added in the phase that owns this workflow.
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
  kind: "video" | "sessions" | "cards" | "form" | "status";
  items: Array<{ title: string; detail: string; meta?: string }>;
}

function SimulationPreview({ simulation }: { simulation: ActionSimulation }) {
  if (simulation.kind === "video") {
    return (
      <section className="rounded border border-line bg-slate-950 p-4 text-white">
        <div className="flex aspect-video items-center justify-center rounded bg-gradient-to-br from-slate-900 to-slate-700">
          <div className="text-center">
            <PlayCircle className="mx-auto h-16 w-16 text-white" aria-hidden="true" />
            <p className="mt-3 text-lg font-bold">{simulation.items[0]?.title ?? "Demo video"}</p>
            <p className="mt-1 text-sm text-slate-300">{simulation.items[0]?.detail ?? "Video player simulation"}</p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded bg-slate-700">
          <div className="h-full w-[72%] rounded bg-[color:var(--theme-accent)]" />
        </div>
        <p className="mt-3 text-sm text-slate-300">Preview only: later phases add watched-interval tracking and completion logic.</p>
      </section>
    );
  }

  if (simulation.kind === "form") {
    return (
      <section className="rounded border border-line bg-white p-4">
        <h3 className="text-lg font-bold">Simulated form preview</h3>
        <div className="mt-4 space-y-3">
          {simulation.items.map((item) => (
            <div key={item.title} className="rounded border border-line bg-slate-50 p-3">
              <label className="text-xs font-bold uppercase tracking-wide text-muted">{item.title}</label>
              <div className="mt-2 rounded border border-line bg-white px-3 py-2 text-sm font-semibold">{item.detail}</div>
              {item.meta ? <p className="mt-2 text-xs text-muted">{item.meta}</p> : null}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded border border-line bg-white p-4">
      <h3 className="text-lg font-bold">What opens in the demo</h3>
      <div className="mt-4 grid gap-3">
        {simulation.items.map((item) => (
          <article key={`${item.title}-${item.detail}`} className="rounded border border-line bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--theme-accent)]" aria-hidden="true" />
              <div>
                <h4 className="font-bold">{item.title}</h4>
                <p className="mt-1 text-sm text-muted">{item.detail}</p>
                {item.meta ? <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--theme-accent)]">{item.meta}</p> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
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

function actionHint(action: string, route: RouteDefinition): string {
  const normalized = action.toLowerCase();
  if (normalized.includes("video") || normalized.includes("play") || normalized.includes("watch")) {
    return "Preview the learning-player surface with a safe video frame.";
  }
  if (normalized.includes("sessions") || normalized.includes("session") || normalized.includes("date")) {
    return "Preview upcoming sessions, registration state, and schedule context.";
  }
  if (normalized.includes("checkout") || normalized.includes("billing")) {
    return "Preview the commercial screen without storing payment details.";
  }
  if (normalized.includes("request") || route.domain.includes("GD")) {
    return "Preview the GD client-service interaction with privacy-safe fixture data.";
  }
  if (normalized.includes("alert") || route.domain.includes("Legislative")) {
    return "Preview the attorney-reviewed alert workflow and recipient view.";
  }
  return "Open a modal that shows how this action will feel in the demo.";
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
      title: "Sessions, scenarios, and progress preview",
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
          detail: activeUserId ? `Progress is scoped to ${activeUserId} and remains fixture-backed in Phase 1.` : "Progress is scoped to the selected persona.",
          meta: "No mutation"
        }
      ]
    };
  }

  if (normalized.includes("video") || normalized.includes("watch") || normalized.includes("play") || normalized.includes("join simulated zoom")) {
    const course = store.courses[0];
    return {
      title: normalized.includes("zoom") ? "Simulated Zoom handoff" : "Training video preview",
      summary: "A safe media surface opens without external video hosting. Completion logic stays in the later Signatrain phase.",
      kind: "video",
      items: [
        {
          title: course?.title ?? "Demo training video",
          detail: normalized.includes("zoom")
            ? "Branded modal for join flow; no external URL is opened."
            : "Video shell with poster, controls, and progress affordance."
        }
      ]
    };
  }

  if (normalized.includes("choose") || normalized.includes("enter") || normalized.includes("edit") || normalized.includes("toggle") || normalized.includes("describe")) {
    return {
      title: "Form interaction preview",
      summary: "The action opens a guided form state with safe fields and validation treatment.",
      kind: "form",
      items: [
        { title: "Primary field", detail: action, meta: "Required" },
        { title: "Visibility", detail: route.domain.includes("GD") ? "company_visible or restricted" : "Persona-scoped demo data" },
        { title: "Result", detail: "Preview state only; no records are written in this phase." }
      ]
    };
  }

  if (normalized.includes("request") || route.domain.includes("GD")) {
    return {
      title: "GD portal action preview",
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
      title: "Legislative alert preview",
      summary: "Shows the alert pipeline or recipient experience with attorney-reviewed fixture content.",
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
      title: "Certificate and export preview",
      summary: "Shows the safe metadata that can be displayed or downloaded in a later phase.",
      kind: "cards",
      items: store.certificates.map((certificate) => ({
        title: certificate.title,
        detail: `${certificate.id} - ${certificate.status}`,
        meta: certificate.issuedAt
      }))
    };
  }

  if (normalized.includes("invite") || normalized.includes("assign") || normalized.includes("seat") || normalized.includes("user")) {
    return {
      title: "People and seat action preview",
      summary: "Shows available users and seat pools without changing assignments yet.",
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
    title: `${action} preview`,
    summary: "A safe modal simulation of the documented primary action.",
    kind: "cards",
    items: [
      { title: "Current route", detail: route.name, meta: route.domain },
      { title: "Action source", detail: "config/route-manifest.json", meta: route.priority },
      { title: "Demo behavior", detail: "Visual simulation now; workflow mutation in its build phase." }
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

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <MetricCard key={card.label} label={card.label} value={String(card.value)} />
      ))}
    </div>
  );
}

function RestrictedView({ from }: { from: string | null }) {
  const { store, activeUser } = useDemoStore();
  const route = from ? findRoute(from) : undefined;
  const access = canAccessRoute(route, activeUser, store);

  return (
    <div className="mx-auto max-w-3xl">
      <section className="rounded border border-line bg-white p-6 shadow-soft">
        <LockKeyhole className="h-9 w-9 text-[color:var(--theme-accent)]" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-bold">Restricted access</h1>
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
          <Link href="/app/products" className="rounded bg-[color:var(--theme-strong)] px-4 py-2 font-semibold text-white">
            Go to My Products
          </Link>
          <Link href="/" className="rounded border border-line px-4 py-2 font-semibold">
            Select persona
          </Link>
        </div>
      </section>
    </div>
  );
}

function NotInManifest({ pathname }: { pathname: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <EmptyState
        title="Route not in manifest"
        body={`The path ${pathname} is not included in config/route-manifest.json.`}
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
      <p className="text-sm font-bold uppercase tracking-wide text-[color:var(--theme-accent)]">{eyebrow}</p>
      <h1 className="mt-1 text-3xl font-bold lg:text-4xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-muted">{description}</p>
    </header>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded border border-line bg-white p-4 shadow-soft">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-slate-50 p-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold">{value}</dd>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded bg-[color:var(--theme-soft)] px-3 py-1 text-sm font-bold text-[color:var(--theme-strong)]">
      {label}
    </span>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded border border-dashed border-line bg-white p-6 text-center">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-muted">{body}</p>
    </section>
  );
}
