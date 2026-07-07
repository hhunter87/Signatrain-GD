"use client";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  CreditCard,
  Download,
  FileText,
  GraduationCap,
  ListChecks,
  LockKeyhole,
  Paperclip,
  Scale,
  Search,
  Send,
  Sparkles,
  UserPlus,
  Users,
  Video
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import gdDataJson from "@/mock-data/gd-data.json";
import learningProgressJson from "@/mock-data/learning-progress.json";
import { isInternalUser } from "@/lib/access";
import { canViewLegalMessage, visibleLegalRequestsForUser } from "@/lib/privacy";
import { useDemoStore } from "@/lib/store";
import type { RouteDefinition } from "@/lib/types";
import type { LiveSession } from "@/schemas/domain-types";

interface MatterRef {
  id: string;
  organizationId: string;
  requestId?: string;
  externalReference: string;
  type: string;
  status: string;
  responsibleAttorneyUserId?: string;
  approvedSummary?: string;
  updatedAt: string;
}

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  startedAt?: string;
}

interface VideoProgress {
  id: string;
  userId: string;
  videoId: string;
  uniqueSeconds: number;
  percent: number;
  completed: boolean;
}

const matterReferences = gdDataJson.matterReferences as MatterRef[];
const enrollments = learningProgressJson.enrollments as Enrollment[];
const videoProgress = learningProgressJson.videoProgress as VideoProgress[];

const CUSTOM_SCREEN_PATHS = [
  "/app/gd",
  "/app/gd/onboarding",
  "/app/gd/benefits",
  "/app/gd/requests",
  "/app/gd/requests/[requestId]",
  "/app/gd/matters",
  "/app/signatrain/live",
  "/app/signatrain/library",
  "/app/signatrain/progress",
  "/admin/alerts",
  "/app/company/billing",
  "/app/company/reports"
];

export function hasCustomScreen(path: string): boolean {
  return CUSTOM_SCREEN_PATHS.includes(path);
}

export function CustomScreen({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  switch (route.path) {
    case "/app/gd":
      return <GdDashboardView route={route} />;
    case "/app/gd/onboarding":
      return <GdOnboardingView route={route} />;
    case "/app/gd/benefits":
      return <GdBenefitsView route={route} />;
    case "/app/gd/requests":
      return <RequestListView route={route} />;
    case "/app/gd/requests/[requestId]":
      return <RequestThreadView route={route} pathname={pathname} />;
    case "/app/gd/matters":
      return <MattersView route={route} />;
    case "/app/signatrain/live":
      return <LiveCatalogView route={route} />;
    case "/app/signatrain/library":
      return <LibraryView route={route} />;
    case "/app/signatrain/progress":
      return <ProgressView route={route} />;
    case "/admin/alerts":
      return <AlertPipelineView route={route} />;
    case "/app/company/billing":
      return <BillingView route={route} />;
    case "/app/company/reports":
      return <ReportsView route={route} />;
    default:
      return null;
  }
}

/* ------------------------------- shared bits ------------------------------- */

function ScreenHeading({
  route,
  description
}: {
  route: RouteDefinition;
  description: string;
}) {
  return (
    <header className="mb-6">
      <p className="page-eyebrow text-sm font-bold uppercase tracking-wide">
        {route.domain} / {route.priority}
      </p>
      <h1 className="page-title mt-1 text-3xl font-bold lg:text-4xl">{route.name}</h1>
      <p className="mt-2 max-w-3xl text-muted">{description}</p>
    </header>
  );
}

function statusTint(status: string): string {
  const normalized = status.toLowerCase();
  if (["resolved", "closed", "completed", "published", "approved", "active"].some((s) => normalized.includes(s))) {
    return "tint-emerald";
  }
  if (["in_progress", "assigned", "in_review", "registration_open", "scheduled"].some((s) => normalized.includes(s))) {
    return "tint-blue";
  }
  if (["waiting", "triage", "submitted", "draft", "not_started"].some((s) => normalized.includes(s))) {
    return "tint-amber";
  }
  if (["cancelled", "archived", "revoked", "urgent"].some((s) => normalized.includes(s))) {
    return "tint-rose";
  }
  return "tint-brand";
}

function StatusChip({ value }: { value: string }) {
  return (
    <span className={`tint-chip px-2 py-0.5 text-xs uppercase tracking-wide ${statusTint(value)}`}>
      {value.replaceAll("_", " ")}
    </span>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function MiniStat({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <article className={`ds-card stat-card p-4 ${tint}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="stat-value mt-1.5 text-2xl font-extrabold">{value}</p>
    </article>
  );
}


/* --------------------------- GD: shared datasets --------------------------- */

interface OnboardingTask {
  id: string;
  organizationId: string;
  title: string;
  status: string;
  assignedToUserId?: string;
  dueAt?: string;
  attachments: { id: string; name: string; size: number; type: string }[];
  section: string;
  requirement: string;
}
interface GdAppointment {
  id: string;
  organizationId: string;
  type: string;
  attorneyUserId?: string;
  withUserId?: string;
  startsAt: string;
  durationMinutes: number;
  relatedRequestId?: string | null;
  topic: string;
  includedInPlan: boolean;
  location: string;
  status: string;
}
interface ActionItem {
  id: string;
  organizationId: string;
  title: string;
  detail: string;
  dueAt?: string;
  severity: string;
  ctaLabel: string;
  href: string;
}
interface ActivityItem {
  id: string;
  organizationId: string;
  at: string;
  kind: string;
  text: string;
}
interface PlanDetail {
  organizationId: string;
  planName: string;
  startsAt: string;
  renewsAt: string;
  billingModel: string;
  monthlyDisplay: string;
  primaryContactName: string;
  primaryContactRole: string;
  responseSla: string;
  includedSupport: string[];
}
interface BenefitUsage {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  used: number | null;
  allowance: number | null;
  unit: string;
  period: string;
}
interface CompanyProfile {
  organizationId: string;
  legalName: string;
  dba: string;
  entityType: string;
  stateOfFormation: string;
  headquarters: string;
  website: string;
  primaryActivity: string;
  jurisdictions: string[];
}

const onboardingTasks = gdDataJson.onboardingTasks as unknown as OnboardingTask[];
const gdAppointments = gdDataJson.appointments as unknown as GdAppointment[];
const gdActionItems = gdDataJson.actionItems as unknown as ActionItem[];
const gdActivity = gdDataJson.activity as unknown as ActivityItem[];
const gdPlanDetails = gdDataJson.planDetails as unknown as PlanDetail[];
const gdBenefitUsage = gdDataJson.benefitUsage as unknown as BenefitUsage[];
const gdCompanyProfile = gdDataJson.companyProfile as unknown as CompanyProfile;

function severityTint(sev: string): string {
  if (sev === "high") return "tint-rose";
  if (sev === "medium") return "tint-amber";
  return "tint-blue";
}

function requirementTint(req: string): string {
  if (req === "required") return "tint-rose";
  if (req === "recommended") return "tint-amber";
  return "tint-blue";
}

function shortMeeting(value: string): string {
  return new Date(value).toLocaleString("en-US", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* ----------------------------- GD: dashboard ------------------------------ */

function GdDashboardView({ route }: { route: RouteDefinition }) {
  const { store, activeUser } = useDemoStore();
  const orgId = activeUser?.organizationId;
  const org = store.organizations.find((o) => o.id === orgId);

  const requests = visibleLegalRequestsForUser(activeUser, store);
  const openRequests = requests.filter((r) =>
    ["submitted", "triage", "assigned", "in_progress", "waiting_for_client"].includes(r.status)
  );
  const orgMatters = matterReferences.filter((m) => m.organizationId === orgId);
  const activeMatters = orgMatters.filter((m) => !/closed|completed/i.test(m.status));
  const orgTasks = onboardingTasks.filter((t) => t.organizationId === orgId);
  const doneTasks = orgTasks.filter((t) => t.status === "accepted");
  const onbPct = orgTasks.length ? Math.round((doneTasks.length / orgTasks.length) * 100) : 0;
  const actions = gdActionItems.filter((a) => a.organizationId === orgId);
  const activity = [...gdActivity]
    .filter((a) => a.organizationId === orgId)
    .sort((a, b) => b.at.localeCompare(a.at));
  const plan = store.gdPlans.find((pl) => pl.organizationId === orgId);
  const detail = gdPlanDetails.find((pl) => pl.organizationId === orgId);
  const seatsIncluded = plan?.includedHrSeats ?? 0;
  const seatUsage = gdBenefitUsage.find((b) => b.organizationId === orgId && /seat/i.test(b.name));
  const seatsUsed = typeof seatUsage?.used === "number" ? seatUsage.used : 0;
  const nextAppt = [...gdAppointments]
    .filter((a) => a.organizationId === orgId)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="Where things stand across your Greenwald Doherty relationship — what is active, what needs you, and where to pick up next."
      />

      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Building2 className="h-4 w-4" aria-hidden="true" />
        <span className="font-bold text-[color:var(--page-title,inherit)]">{org?.name ?? "Your company"}</span>
        {plan ? <span className="ds-pill px-2 py-0.5 text-xs">{detail?.planName ?? `${plan.tier} plan`}</span> : null}
      </div>

      <div className="stagger mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MiniStat label="Open legal requests" value={String(openRequests.length)} tint="tint-blue" />
        <MiniStat label="Active matters" value={String(activeMatters.length)} tint="tint-violet" />
        <MiniStat label="Action required" value={String(actions.length)} tint="tint-amber" />
        <MiniStat label="Onboarding complete" value={`${onbPct}%`} tint="tint-emerald" />
        <MiniStat label="Signatrain seats used" value={`${seatsUsed} of ${seatsIncluded}`} tint="tint-cyan" />
        <MiniStat
          label="Next attorney meeting"
          value={nextAppt ? shortMeeting(nextAppt.startsAt) : "None scheduled"}
          tint="tint-brand"
        />
      </div>

      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[color:var(--brand-warm)]" aria-hidden="true" />
          <h2 className="text-xl font-bold">Action required</h2>
        </div>
        {actions.length === 0 ? (
          <div className="ds-card p-5 text-muted">Nothing needs your attention right now.</div>
        ) : (
          <div className="stagger grid gap-3 md:grid-cols-2">
            {actions.map((a) => (
              <Link key={a.id} href={a.href} className={`ds-card ds-card-interactive block p-4 ${severityTint(a.severity)}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {a.severity === "high" ? (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    <div>
                      <p className="font-bold">{a.title}</p>
                      <p className="mt-1 text-sm text-muted">{a.detail}</p>
                    </div>
                  </div>
                  <StatusChip value={a.severity} />
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--brand-accent)]">
                  {a.ctaLabel}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {a.dueAt ? <p className="mt-1 text-xs text-muted">Due {formatDate(a.dueAt)}</p> : null}
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-xl font-bold">Recent activity</h2>
          <div className="ds-card p-5">
            <ul className="space-y-4">
              {activity.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[color:var(--brand-accent)]" aria-hidden="true" />
                  <div>
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-muted">{formatDateTime(item.at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <div className="ds-card p-5">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" />
              <h3 className="font-bold">Your plan</h3>
            </div>
            <p className="text-sm text-muted">{detail?.planName ?? plan?.tier ?? "No active plan"}</p>
            {plan ? <p className="mt-1 text-sm">Renews {formatDate(plan.renewsAt)}</p> : null}
            {detail ? <p className="mt-1 text-sm text-muted">Primary contact: {detail.primaryContactName}</p> : null}
            <Link href="/app/gd/benefits" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--brand-accent)]">
              View plan & benefits
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="ds-card p-5">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" />
              <h3 className="font-bold">Quick links</h3>
            </div>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Submit a legal request", href: "/app/gd/requests/new", icon: Send },
                { label: "Continue onboarding", href: "/app/gd/onboarding", icon: ListChecks },
                { label: "Browse template library", href: "/app/gd/templates", icon: FileText }
              ].map((q) => (
                <li key={q.href}>
                  <Link href={q.href} className="inline-flex items-center gap-2 font-semibold text-[color:var(--brand-accent)] hover:underline">
                    <q.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {q.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------------------- GD: onboarding ------------------------------ */

const ONBOARDING_SECTION_ORDER = [
  "Company profile",
  "Main contacts",
  "Authorization & communication",
  "Document collection",
  "Portal setup"
];

function GdOnboardingView({ route }: { route: RouteDefinition }) {
  const { activeUser } = useDemoStore();
  const orgId = activeUser?.organizationId;
  const tasks = onboardingTasks.filter((t) => t.organizationId === orgId);
  const done = tasks.filter((t) => t.status === "accepted").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const profile = gdCompanyProfile.organizationId === orgId ? gdCompanyProfile : undefined;

  const sections = ONBOARDING_SECTION_ORDER.map((name) => ({
    name,
    items: tasks.filter((t) => t.section === name)
  })).filter((s) => s.items.length > 0);

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="Complete these steps so Greenwald Doherty has everything needed to represent you well."
      />

      <section className="ds-card mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-[color:var(--brand-accent)]" aria-hidden="true" />
            <h2 className="text-lg font-bold">
              {done} of {tasks.length} steps completed
            </h2>
          </div>
          <span className="text-sm font-bold">{pct}%</span>
        </div>
        <div className="progress-track mt-3 h-2">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </section>

      {profile ? (
        <section className="ds-card mb-6 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" />
            <h3 className="font-bold">Company profile</h3>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Legal name", profile.legalName],
              ["DBA", profile.dba],
              ["Entity type", profile.entityType],
              ["State of formation", profile.stateOfFormation],
              ["Headquarters", profile.headquarters],
              ["Website", profile.website],
              ["Primary activity", profile.primaryActivity],
              ["Jurisdictions", profile.jurisdictions.join(", ")]
            ].map(([label, value]) => (
              <div key={label as string}>
                <dt className="text-xs font-bold uppercase tracking-wide text-muted">{label}</dt>
                <dd className="mt-0.5 text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <div className="stagger space-y-6">
        {sections.map((section) => (
          <section key={section.name}>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">{section.name}</h3>
            <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))]">
              {section.items.map((task) => {
                const complete = task.status === "accepted";
                return (
                  <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="flex items-start gap-3">
                      {complete ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                      )}
                      <div>
                        <p className="font-semibold">{task.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                          <span className={`tint-chip px-2 py-0.5 uppercase tracking-wide ${requirementTint(task.requirement)}`}>
                            {task.requirement}
                          </span>
                          {task.dueAt ? <span>Due {formatDate(task.dueAt)}</span> : null}
                          {task.attachments.length > 0 ? (
                            <span className="inline-flex items-center gap-1">
                              <Paperclip className="h-3 w-3" aria-hidden="true" />
                              {task.attachments.length} file{task.attachments.length > 1 ? "s" : ""}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <StatusChip value={task.status} />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/* ------------------------- GD: plan & benefit usage ------------------------ */

function GdBenefitsView({ route }: { route: RouteDefinition }) {
  const { store, activeUser } = useDemoStore();
  const orgId = activeUser?.organizationId;
  const plan = store.gdPlans.find((pl) => pl.organizationId === orgId);
  const detail = gdPlanDetails.find((pl) => pl.organizationId === orgId);
  const usage = gdBenefitUsage.filter((b) => b.organizationId === orgId);

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="What is included in your Greenwald Doherty relationship and how much of it you have used."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="ds-card p-5 lg:col-span-1">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" />
            <h2 className="text-lg font-bold">Current plan</h2>
          </div>
          {plan ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted">Plan</dt><dd className="font-semibold">{detail?.planName ?? plan.tier}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Started</dt><dd>{formatDate(plan.startsAt)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Renews</dt><dd>{formatDate(plan.renewsAt)}</dd></div>
              {detail ? <div className="flex justify-between gap-3"><dt className="text-muted">Billing</dt><dd className="text-right">{detail.billingModel}</dd></div> : null}
              {detail ? <div className="flex justify-between gap-3"><dt className="text-muted">Retainer</dt><dd className="font-semibold">{detail.monthlyDisplay}</dd></div> : null}
              {detail ? <div className="flex justify-between gap-3"><dt className="text-muted">Primary contact</dt><dd className="text-right">{detail.primaryContactName}<br /><span className="text-xs text-muted">{detail.primaryContactRole}</span></dd></div> : null}
              {detail ? <div className="flex justify-between gap-3"><dt className="text-muted">Response time</dt><dd>{detail.responseSla}</dd></div> : null}
            </dl>
          ) : (
            <p className="text-muted">No active plan for this organization.</p>
          )}
        </section>

        <section className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold">Included benefits</h2>
          <div className="ds-card p-5">
            {detail && detail.includedSupport.length > 0 ? (
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {detail.includedSupport.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No included benefits listed.</p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[color:var(--brand-accent)]" aria-hidden="true" />
          <h2 className="text-lg font-bold">Usage overview</h2>
        </div>
        <div className="stagger grid gap-4 md:grid-cols-2">
          {usage.map((b) => {
            const unlimited = b.allowance === null;
            const used = typeof b.used === "number" ? b.used : null;
            const pct = unlimited || used === null || !b.allowance ? 0 : Math.min(100, Math.round((used / b.allowance) * 100));
            return (
              <article key={b.id} className="ds-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{b.name}</p>
                  <span className="text-xs uppercase tracking-wide text-muted">{b.period}</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {unlimited || used === null
                    ? "Included"
                    : `${used} of ${b.allowance} ${b.unit} used`}
                </p>
                {!unlimited && used !== null && b.allowance ? (
                  <div className="progress-track mt-2 h-2">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs text-muted">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Usage is a benefit estimate for planning only and is not an official invoice or financial statement.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------ GD: requests ------------------------------ */

function RequestListView({ route }: { route: RouteDefinition }) {
  const { store, activeUser } = useDemoStore();
  const all = visibleLegalRequestsForUser(activeUser, store);
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [query, setQuery] = useState("");

  const userName = (id?: string) => store.users.find((u) => u.id === id)?.name ?? "Unassigned";
  const lastUpdate = (requestId: string) => {
    const times = store.legalMessages
      .filter((m) => m.requestId === requestId)
      .map((m) => m.createdAt);
    return times.length ? times.sort().slice(-1)[0] : undefined;
  };

  const openCount = all.filter((r) =>
    ["submitted", "triage", "assigned", "in_progress"].includes(r.status)
  ).length;
  const waitingCount = all.filter((r) => r.status === "waiting_for_client").length;
  const resolvedCount = all.filter((r) =>
    ["resolved", "converted_to_matter", "closed"].includes(r.status)
  ).length;

  const requests = all.filter(
    (r) =>
      (status === "all" || r.status === status) &&
      (priority === "all" || r.priority === priority) &&
      (query.trim() === "" ||
        `${r.subject} ${r.topic}`.toLowerCase().includes(query.trim().toLowerCase()))
  );

  const statusOptions = [
    "all",
    "submitted",
    "triage",
    "assigned",
    "in_progress",
    "waiting_for_client",
    "resolved",
    "converted_to_matter",
    "closed"
  ];
  const priorityOptions = ["all", "low", "medium", "high"];

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="Every legal request you have sent, in one structured place. Restricted requests are hidden from non-participants."
      />
      <div className="stagger mb-6 grid gap-4 sm:grid-cols-3">
        <MiniStat label="Open" value={String(openCount)} tint="tint-blue" />
        <MiniStat label="Waiting for client" value={String(waitingCount)} tint="tint-amber" />
        <MiniStat label="Resolved" value={String(resolvedCount)} tint="tint-emerald" />
      </div>

      {all.length === 0 ? (
        <section className="ds-card p-6 text-center">
          <h2 className="text-xl font-bold">No visible requests</h2>
          <p className="mt-2 text-muted">This persona has no legal requests in view.</p>
          <Link href="/app/gd/requests/new" className="ds-button ds-button-primary mt-5 inline-flex px-4 py-2">
            <Send className="h-4 w-4" aria-hidden="true" />
            Submit a request
          </Link>
        </section>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="ds-field inline-flex items-center gap-2 px-3 py-2 text-sm">
              <Search className="h-4 w-4 opacity-60" aria-hidden="true" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search subject or category"
                className="w-56 bg-transparent outline-none"
              />
            </label>
            <select className="ds-field px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
              {statusOptions.map((o) => (
                <option key={o} value={o}>
                  {o === "all" ? "All statuses" : o.replaceAll("_", " ")}
                </option>
              ))}
            </select>
            <select className="ds-field px-3 py-2 text-sm" value={priority} onChange={(e) => setPriority(e.target.value)}>
              {priorityOptions.map((o) => (
                <option key={o} value={o}>
                  {o === "all" ? "All priorities" : o}
                </option>
              ))}
            </select>
            <Link href="/app/gd/requests/new" className="ds-button ds-button-primary ml-auto inline-flex px-4 py-2 text-sm">
              <Send className="h-4 w-4" aria-hidden="true" />
              New request
            </Link>
          </div>

          <section className="ds-card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Assigned to</th>
                  <th>Status</th>
                  <th>Privacy</th>
                  <th>Priority</th>
                  <th>Last update</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted">
                      No requests match these filters.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => {
                    const updated = lastUpdate(request.id) ?? request.createdAt;
                    return (
                      <tr key={request.id}>
                        <td>
                          <Link
                            href={`/app/gd/requests/${request.id}`}
                            className="font-bold text-[color:var(--brand-accent)] hover:underline"
                          >
                            {request.subject}
                          </Link>
                        </td>
                        <td className="text-muted">{request.topic}</td>
                        <td className="text-sm">{userName(request.assignedAttorneyUserId)}</td>
                        <td>
                          <StatusChip value={request.status} />
                        </td>
                        <td>
                          {request.privacy === "restricted" ? (
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                              <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                              Restricted
                            </span>
                          ) : (
                            <span className="text-sm text-muted">Company visible</span>
                          )}
                        </td>
                        <td>
                          <StatusChip value={request.priority} />
                        </td>
                        <td className="text-sm text-muted">{formatDate(updated)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}

function RequestThreadView({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  const { store, activeUser, addLegalMessage } = useDemoStore();
  const requestId = decodeURIComponent(pathname.split("/").pop() ?? "");
  const visible = visibleLegalRequestsForUser(activeUser, store);
  const request = visible.find((item) => item.id === requestId);
  const internal = isInternalUser(activeUser);
  const [draft, setDraft] = useState("");
  const [visibilityChoice, setVisibilityChoice] = useState<"client_visible" | "internal_only">(
    "client_visible"
  );

  if (!request) {
    return (
      <div className="narrow-shell">
        <section className="ds-card p-6">
          <LockKeyhole className="h-8 w-8 opacity-40" aria-hidden="true" />
          <h1 className="page-title mt-3 text-2xl font-bold">Request not visible</h1>
          <p className="mt-2 text-muted">
            This request does not exist or is restricted for the active persona.
          </p>
          <Link href="/app/gd/requests" className="ds-button ds-button-primary mt-5 px-4 py-2">
            Back to requests
          </Link>
        </section>
      </div>
    );
  }

  const messages = store.legalMessages
    .filter((message) => message.requestId === request.id)
    .filter((message) => canViewLegalMessage(activeUser, request, message, store))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const authorName = (userId: string) =>
    store.users.find((user) => user.id === userId)?.name ?? "Team member";

  const send = () => {
    const body = draft.trim();
    if (!body) {
      return;
    }
    addLegalMessage(request.id, body, internal ? visibilityChoice : "client_visible");
    setDraft("");
  };

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Secure request thread with client-safe messages." />
      <section className="ds-card mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{request.subject}</h2>
            <p className="mt-1 text-sm text-muted">{request.clientVisibleSummary ?? request.topic}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusChip value={request.status} />
            <StatusChip value={request.priority} />
            {request.privacy === "restricted" ? <StatusChip value="restricted" /> : null}
          </div>
        </div>
      </section>
      <section className="stagger space-y-3">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`ds-card p-4 ${message.visibility === "internal_only" ? "note-internal" : ""}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold">{authorName(message.authorUserId)}</p>
              <p className="text-xs text-muted">{formatDateTime(message.createdAt)}</p>
            </div>
            {message.visibility === "internal_only" ? (
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[color:var(--brand-warm)]">
                Internal note — not visible to the client
              </p>
            ) : null}
            <p className="mt-2 whitespace-pre-wrap text-sm">{message.body}</p>
          </article>
        ))}
        {messages.length === 0 ? (
          <p className="text-sm text-muted">No messages visible to this persona yet.</p>
        ) : null}
      </section>
      <section className="ds-card mt-6 p-5">
        <h3 className="font-bold">Reply</h3>
        <textarea
          className="ds-field mt-3 w-full px-3 py-2 text-sm"
          rows={3}
          placeholder="Write a message…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {internal ? (
            <select
              className="ds-field px-3 py-2 text-sm"
              value={visibilityChoice}
              onChange={(event) =>
                setVisibilityChoice(event.target.value as "client_visible" | "internal_only")
              }
              aria-label="Message visibility"
            >
              <option value="client_visible">Client visible</option>
              <option value="internal_only">Internal note</option>
            </select>
          ) : null}
          <button
            type="button"
            className="ds-button ds-button-primary px-4 py-2 text-sm"
            onClick={send}
            disabled={!draft.trim()}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Send message
          </button>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------- GD: matters ------------------------------- */

function MattersView({ route }: { route: RouteDefinition }) {
  const { store, activeOrganization } = useDemoStore();
  const matters = matterReferences.filter(
    (matter) => matter.organizationId === activeOrganization?.id
  );
  const attorneyName = (userId?: string) =>
    store.users.find((user) => user.id === userId)?.name ?? "Assigned attorney";

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="Limited Centerbase matter references with attorney-approved summaries only."
      />
      {matters.length === 0 ? (
        <section className="ds-card p-6 text-center">
          <h2 className="text-xl font-bold">No matter references</h2>
          <p className="mt-2 text-muted">This organization has no linked matters.</p>
        </section>
      ) : (
        <div className="stagger grid gap-4 md:grid-cols-2">
          {matters.map((matter) => (
            <article key={matter.id} className="ds-card p-5 tint-blue">
              <div className="flex items-start justify-between gap-3">
                <span className="action-icon inline-flex h-10 w-10 items-center justify-center">
                  <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
                </span>
                <StatusChip value={matter.status} />
              </div>
              <h2 className="mt-4 text-lg font-bold">{matter.externalReference}</h2>
              <p className="mt-1 text-sm font-semibold text-muted">{matter.type}</p>
              {matter.approvedSummary ? (
                <p className="mt-2 text-sm text-muted">{matter.approvedSummary}</p>
              ) : null}
              <div className="action-meta-row mt-4 text-sm">
                <span className="font-semibold">{attorneyName(matter.responsibleAttorneyUserId)}</span>
                <span className="text-xs text-muted">Updated {formatDate(matter.updatedAt)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------- Signatrain: live ------------------------------ */

const SESSION_TYPE_LABELS: Record<LiveSession["type"], string> = {
  HR_MASTERCLASS: "HR Masterclass",
  RISK_ROUNDTABLE: "Risk Roundtable",
  MANAGER_CORE: "Manager Core",
  PRIVATE_COHORT: "Private Cohort"
};

function LiveCatalogView({ route }: { route: RouteDefinition }) {
  const { store } = useDemoStore();
  const sessions = [...store.liveSessions].sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="Upcoming live sessions. Completion requires at least 90% attendance."
      />
      <div className="stagger grid gap-4 md:grid-cols-2">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: LiveSession }) {
  const { recordSimulation } = useDemoStore();
  const [state, setState] = useState<"idle" | "confirm" | "registered">("idle");
  const canRegister = ["registration_open", "scheduled"].includes(session.status);

  const register = () => {
    recordSimulation({
      title: "Registration confirmed",
      body: `You are registered for ${session.title}.`,
      href: `/app/signatrain/live/${session.id}`,
      emailSubject: `Registration confirmed — ${session.title}`,
      emailBody: `This simulated email confirms your registration for ${session.title} on ${formatDateTime(session.startsAt)}. Attendance is tracked toward the 90% completion threshold.`,
      action: "live_session_registration_simulated",
      objectType: "live_session",
      objectId: session.id
    });
    setState("registered");
  };

  return (
    <article className="ds-card p-5 tint-amber">
      <div className="flex items-start justify-between gap-3">
        <span className="action-icon inline-flex h-10 w-10 items-center justify-center">
          <Video className="h-5 w-5" aria-hidden="true" />
        </span>
        <StatusChip value={session.status} />
      </div>
      <h2 className="mt-4 text-lg font-bold">{session.title}</h2>
      <p className="mt-1 text-sm font-semibold text-muted">
        {SESSION_TYPE_LABELS[session.type]} · {session.audience}
      </p>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          {formatDateTime(session.startsAt)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {session.durationMinutes} min
        </span>
      </div>
      {session.zoomReference ? (
        <p className="mt-2 text-xs text-muted">Zoom reference: {session.zoomReference} (simulated)</p>
      ) : null}
      <div className="mt-4">
        {state === "registered" ? (
          <p className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--tint)]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Registered — confirmation sent to your outbox
          </p>
        ) : state === "confirm" ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" className="ds-button ds-button-primary px-3 py-2 text-sm" onClick={register}>
              Confirm registration
            </button>
            <button
              type="button"
              className="ds-button ds-button-secondary px-3 py-2 text-sm"
              onClick={() => setState("idle")}
            >
              Cancel
            </button>
          </div>
        ) : canRegister ? (
          <button
            type="button"
            className="ds-button ds-button-secondary px-3 py-2 text-sm"
            onClick={() => setState("confirm")}
          >
            Register
          </button>
        ) : (
          <p className="text-xs text-muted">Registration is not open for this session.</p>
        )}
      </div>
    </article>
  );
}

/* -------------------------- Signatrain: library ---------------------------- */

function LibraryView({ route }: { route: RouteDefinition }) {
  const { store } = useDemoStore();

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="Courses and standalone scenarios available to this audience."
      />
      <h2 className="group-label mb-4 text-sm font-bold uppercase tracking-wide text-muted">Courses</h2>
      <div className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {store.courses.map((course) => (
          <Link
            key={course.id}
            href={`/app/signatrain/courses/${course.id}`}
            className="ds-card block p-5 tint-brand"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="action-icon inline-flex h-10 w-10 items-center justify-center">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <StatusChip value={course.status} />
            </div>
            <h3 className="mt-4 text-lg font-bold">{course.title}</h3>
            <p className="mt-1 text-sm text-muted">
              {course.topic} · {course.audience} path
            </p>
            <p className="action-meta-row mt-4 text-sm">
              <span className="font-semibold">{course.moduleIds.length} modules</span>
              <span className="text-xs text-muted">Ordered sequence</span>
            </p>
          </Link>
        ))}
      </div>
      <h2 className="group-label mb-4 mt-10 text-sm font-bold uppercase tracking-wide text-muted">
        Standalone scenarios
      </h2>
      <div className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {store.scenarios.map((scenario) => (
          <Link
            key={scenario.id}
            href={`/app/signatrain/scenarios/${scenario.id}`}
            className="ds-card block p-5 tint-cyan"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="tint-chip px-2 py-0.5 text-xs">{scenario.audiences.join(" + ")}</span>
              <span className="text-xs font-semibold text-muted">{scenario.durationMinutes} min</span>
            </div>
            <h3 className="mt-3 text-base font-bold">{scenario.title}</h3>
            <p className="mt-1 text-sm text-muted">{scenario.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* -------------------------- Signatrain: progress --------------------------- */

function ProgressView({ route }: { route: RouteDefinition }) {
  const { store, activeUser } = useDemoStore();
  const myEnrollments = enrollments.filter((enrollment) => enrollment.userId === activeUser?.id);
  const myVideos = videoProgress.filter((progress) => progress.userId === activeUser?.id);
  const myCertificates = store.certificates.filter(
    (certificate) => certificate.userId === activeUser?.id
  );
  const completedVideos = myVideos.filter((video) => video.completed).length;

  const courseTitle = (courseId: string) =>
    store.courses.find((course) => course.id === courseId)?.title ?? courseId;

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="Personal learning record: course enrollment, unique watch coverage, and certificates."
      />
      <div className="stagger mb-6 grid gap-4 sm:grid-cols-3">
        <MiniStat label="Enrolled courses" value={String(myEnrollments.length)} tint="tint-blue" />
        <MiniStat
          label="Videos completed"
          value={`${completedVideos}/${myVideos.length}`}
          tint="tint-violet"
        />
        <MiniStat label="Certificates" value={String(myCertificates.length)} tint="tint-emerald" />
      </div>
      {myEnrollments.length === 0 && myVideos.length === 0 ? (
        <section className="ds-card p-6 text-center">
          <h2 className="text-xl font-bold">No learning activity yet</h2>
          <p className="mt-2 text-muted">This persona has no enrollments or video progress.</p>
        </section>
      ) : (
        <>
          <section className="ds-card p-5">
            <h2 className="text-xl font-bold">Courses</h2>
            <div className="stagger mt-4 space-y-3">
              {myEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="ds-card-muted flex flex-wrap items-center justify-between gap-3 p-3">
                  <div>
                    <p className="font-bold">{courseTitle(enrollment.courseId)}</p>
                    {enrollment.startedAt ? (
                      <p className="text-xs text-muted">Started {formatDate(enrollment.startedAt)}</p>
                    ) : null}
                  </div>
                  <StatusChip value={enrollment.status} />
                </div>
              ))}
            </div>
          </section>
          <section className="ds-card mt-6 p-5 tint-violet">
            <h2 className="text-xl font-bold">Video watch coverage</h2>
            <p className="mt-1 text-sm text-muted">
              Completion is recorded at 95% unique watch coverage.
            </p>
            <div className="stagger mt-4 space-y-4">
              {myVideos.map((video) => {
                const percent = Math.round(video.percent * 100);
                return (
                  <div key={video.id}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-semibold">{video.videoId.replaceAll("_", " ")}</span>
                      <span className={`text-xs font-bold ${video.completed ? "text-[color:var(--tint)]" : "text-muted"}`}>
                        {video.completed ? "Completed" : `${percent}% — below threshold`}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          {myCertificates.length > 0 ? (
            <section className="ds-card mt-6 p-5">
              <h2 className="text-xl font-bold">Certificates</h2>
              <div className="stagger mt-4 grid gap-3 md:grid-cols-2">
                {myCertificates.map((certificate) => (
                  <Link
                    key={certificate.id}
                    href={`/certificate/${certificate.id}`}
                    className="certificate-card block p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="page-eyebrow text-xs font-bold uppercase tracking-wide">Certificate</p>
                        <h3 className="mt-1 font-bold">{certificate.title}</h3>
                        <p className="mt-1 text-xs text-muted">Issued {formatDate(certificate.issuedAt)}</p>
                      </div>
                      <StatusChip value={certificate.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}

/* ------------------------------ Shared: billing ---------------------------- */

const MONTHS_2026 = ["January", "February", "March", "April", "May", "June"];

interface InvoiceLine {
  id: string;
  month: string;
  monthIndex: number;
  description: string;
  amount: number;
  status: "paid" | "due";
}

function firstAmount(display: string): number {
  const match = display.replaceAll(",", "").match(/\$(\d+)/);
  return match ? Number(match[1]) : 0;
}

function money(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

function BillingView({ route }: { route: RouteDefinition }) {
  const { store, activeOrganization, recordSimulation } = useDemoStore();
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const subs = store.subscriptions.filter(
    (sub) => sub.organizationId === activeOrganization?.id
  );
  const pools = store.seatPools.filter(
    (pool) => pool.organizationId === activeOrganization?.id
  );
  const poolCapacity = (code: string) =>
    pools.find((pool) => pool.entitlementCode === code)?.capacity ?? 1;

  const invoices: InvoiceLine[] = [];
  subs.forEach((sub) => {
    const base = firstAmount(sub.amountDisplay);
    if (sub.cadence === "monthly") {
      MONTHS_2026.forEach((month, index) => {
        invoices.push({
          id: `${sub.id}_${index}`,
          month,
          monthIndex: index,
          description: `${sub.product.replaceAll("_", " ")} — monthly subscription`,
          amount: base,
          status: index < 5 ? "paid" : "due"
        });
      });
      if (sub.amountDisplay.toLowerCase().includes("setup")) {
        invoices.push({
          id: `${sub.id}_setup`,
          month: "January",
          monthIndex: 0,
          description: `${sub.product.replaceAll("_", " ")} — one-time setup fee`,
          amount: 2500,
          status: "paid"
        });
      }
    } else {
      const anniversaryIndex = Math.min(new Date(sub.renewsAt).getMonth(), 5);
      const capacity = poolCapacity(sub.product);
      const amount =
        sub.product === "SIGNATRAIN_HR" ? 3500 + 2000 * Math.max(capacity - 1, 0) : base * capacity;
      invoices.push({
        id: `${sub.id}_annual`,
        month: MONTHS_2026[anniversaryIndex],
        monthIndex: anniversaryIndex,
        description: `${sub.product.replaceAll("_", " ")} — annual (${capacity} ${capacity === 1 ? "seat" : "seats"})`,
        amount,
        status: anniversaryIndex < 5 ? "paid" : "due"
      });
    }
  });
  invoices.sort((a, b) => b.monthIndex - a.monthIndex);

  const monthlySpend = subs
    .filter((sub) => sub.cadence === "monthly")
    .reduce((total, sub) => total + firstAmount(sub.amountDisplay), 0);
  const ytdTotal = invoices.filter((line) => line.status === "paid").reduce((t, l) => t + l.amount, 0);
  const nextRenewal = subs
    .map((sub) => sub.renewsAt)
    .sort()[0];

  const downloadInvoice = (line: InvoiceLine) => {
    setDownloaded((current) => ({ ...current, [line.id]: true }));
    recordSimulation({
      title: "Invoice downloaded",
      body: `${line.month} 2026 — ${line.description}`,
      href: "/app/company/billing",
      emailSubject: `Invoice copy — ${line.month} 2026`,
      emailBody: `This simulated email contains the invoice copy for ${line.description} (${money(line.amount)}).`,
      action: "invoice_download_simulated",
      objectType: "invoice",
      objectId: line.id
    });
  };

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="Subscriptions, payment method, and monthly invoice history for this organization."
      />
      <div className="stagger mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Monthly spend" value={money(monthlySpend)} tint="tint-emerald" />
        <MiniStat label="Paid year to date" value={money(ytdTotal)} tint="tint-blue" />
        <MiniStat label="Active subscriptions" value={String(subs.length)} tint="tint-violet" />
        <MiniStat
          label="Next renewal"
          value={nextRenewal ? formatDate(nextRenewal) : "—"}
          tint="tint-amber"
        />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="ds-card p-5">
          <h2 className="text-xl font-bold">Subscriptions</h2>
          <div className="stagger mt-4 space-y-3">
            {subs.map((sub) => (
              <div key={sub.id} className="ds-card-muted flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-bold">{sub.product.replaceAll("_", " ")}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    {sub.amountDisplay} · {sub.cadence} · via {sub.source.replaceAll("_", " ")}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">Renews {formatDate(sub.renewsAt)}</p>
                </div>
                <StatusChip value={sub.status} />
              </div>
            ))}
            {subs.length === 0 ? (
              <p className="text-sm text-muted">No subscriptions for this organization.</p>
            ) : null}
          </div>
        </section>
        <div className="space-y-4">
          <section className="ds-card p-5 tint-blue">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold">Payment method</h2>
              <span className="action-icon inline-flex h-9 w-9 items-center justify-center">
                <CreditCard className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 font-mono text-sm font-semibold tracking-widest">•••• •••• •••• 4242</p>
            <p className="mt-1 text-sm text-muted">Visa corporate · expires 08/28</p>
            <p className="mt-2 text-xs text-muted">Billing contact: billing@{activeOrganization?.id.replace("org_", "")}.com</p>
          </section>
          <AddSeatsPanel />
        </div>
      </div>

      <section className="ds-card overflow-x-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-3">
          <h2 className="text-xl font-bold">Invoice history — 2026</h2>
          <span className="text-xs text-muted">Simulated billing data</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((line, index) => (
              <tr key={line.id}>
                <td className="font-semibold">{line.month}</td>
                <td className="text-muted">{line.description}</td>
                <td className="font-bold">{money(line.amount)}</td>
                <td>
                  <StatusChip value={line.status} />
                </td>
                <td>
                  {downloaded[line.id] ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[color:var(--brand-accent)]">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Sent to outbox
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[color:var(--brand-accent)] hover:underline"
                      onClick={() => downloadInvoice(line)}
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      INV-2026-{String(100 + index)}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* ------------------------------ Add seats wizard --------------------------- */

const SEAT_ROLES = [
  {
    code: "HR" as const,
    label: "HR seat",
    detail: "Full HR training library, Masterclasses, Risk Roundtable, HR Bot",
    annualCost: 2000,
    costNote: "$2,000 / year (additional seat)"
  },
  {
    code: "MANAGER" as const,
    label: "Manager seat",
    detail: "Manager core program, scenario library, private cohort access",
    annualCost: 1000,
    costNote: "$1,000 / year per manager"
  }
];

function AddSeatsPanel() {
  const { recordSimulation } = useDemoStore();
  const [step, setStep] = useState<"idle" | "role" | "details" | "processing" | "done">("idle");
  const [role, setRole] = useState<(typeof SEAT_ROLES)[number] | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const reset = () => {
    setStep("idle");
    setRole(null);
    setFullName("");
    setEmail("");
  };

  const confirm = () => {
    setStep("processing");
    window.setTimeout(() => {
      if (role) {
        recordSimulation({
          title: "Seat added",
          body: `${fullName} (${role.label}) — invitation queued.`,
          href: "/app/company/seats",
          emailSubject: `You have been invited — ${role.label}`,
          emailBody: `This simulated email invites ${fullName} <${email}> to activate a ${role.label}. Billing adds ${money(role.annualCost)}/year at the next invoice.`,
          action: "seat_added_simulated",
          objectType: "seat",
          objectId: email || "new_seat"
        });
      }
      setStep("done");
    }, 750);
  };

  const detailsValid = fullName.trim().length > 1 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

  return (
    <section className="ds-card p-5 tint-emerald">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold">Add seats</h2>
        <span className="action-icon inline-flex h-9 w-9 items-center justify-center">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      {step === "idle" ? (
        <>
          <p className="mt-2 text-sm text-muted">
            Add an HR or Manager seat — cost is calculated before you confirm.
          </p>
          <button
            type="button"
            className="ds-button ds-button-primary mt-4 w-full px-4 py-2 text-sm"
            onClick={() => setStep("role")}
          >
            Add seats
          </button>
        </>
      ) : null}

      {step === "role" ? (
        <div className="mt-3 space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">1 / 2 — Choose role</p>
          {SEAT_ROLES.map((option) => (
            <button
              key={option.code}
              type="button"
              className="option-card p-3.5 text-left"
              onClick={() => {
                setRole(option);
                setStep("details");
              }}
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block font-bold">{option.label}</span>
                  <span className="mt-0.5 block text-sm text-muted">{option.detail}</span>
                </span>
                <span className="tint-chip shrink-0 px-2 py-0.5 text-xs">{money(option.annualCost)}/yr</span>
              </span>
            </button>
          ))}
          <button type="button" className="text-xs font-bold text-muted hover:underline" onClick={reset}>
            Cancel
          </button>
        </div>
      ) : null}

      {step === "details" && role ? (
        <div className="mt-3">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">2 / 2 — User details</p>
          <label className="mt-2 block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Full name</span>
            <input
              className="ds-field w-full px-3 py-2 text-sm"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Jane Smith"
            />
          </label>
          <label className="mt-2.5 block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Email</span>
            <input
              className="ds-field w-full px-3 py-2 text-sm"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jane@company.com"
            />
          </label>
          <div className="ds-card-muted mt-3 p-3 text-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Cost summary</p>
            <p className="mt-1.5 flex items-baseline justify-between">
              <span className="font-semibold">{role.label}</span>
              <span className="font-bold">{money(role.annualCost)}/yr</span>
            </p>
            <p className="mt-1 text-xs text-muted">{role.costNote} · added to the next invoice</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="ds-button ds-button-primary px-4 py-2 text-sm"
              onClick={confirm}
              disabled={!detailsValid}
            >
              Add user
            </button>
            <button
              type="button"
              className="ds-button ds-button-secondary px-3 py-2 text-sm"
              onClick={() => setStep("role")}
            >
              Back
            </button>
          </div>
        </div>
      ) : null}

      {step === "processing" ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="spinner" aria-hidden="true" />
          <p className="text-sm font-semibold text-muted">Adding seat…</p>
        </div>
      ) : null}

      {step === "done" && role ? (
        <div className="mt-3">
          <p className="flex items-start gap-2 text-sm font-semibold">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--tint)]" aria-hidden="true" />
            {fullName} added as {role.label} — invitation email queued in the outbox.
          </p>
          <p className="mt-2 text-xs text-muted">
            Simulation only — no real user was created. {money(role.annualCost)}/year lands on the next invoice.
          </p>
          <button
            type="button"
            className="ds-button ds-button-secondary mt-3 px-3 py-2 text-sm"
            onClick={reset}
          >
            Add another seat
          </button>
        </div>
      ) : null}
    </section>
  );
}

/* ------------------------------ Shared: reports ---------------------------- */

function seededPercent(seed: string, min: number, max: number): number {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997;
  }
  return min + (hash % (max - min + 1));
}

function ReportsView({ route }: { route: RouteDefinition }) {
  const { store, activeOrganization } = useDemoStore();
  const orgUsers = store.users.filter((user) => user.organizationId === activeOrganization?.id);
  const learners = orgUsers.filter((user) =>
    user.roles.some((role) => ["HRS", "MGR", "CO", "CHA"].includes(role))
  );

  const rows = learners.flatMap((user) =>
    store.courses
      .filter((course) =>
        course.audience === "MANAGER"
          ? user.roles.includes("MGR")
          : user.roles.some((role) => ["HRS", "CO", "CHA"].includes(role))
      )
      .map((course) => {
        const progress = seededPercent(`${user.id}:${course.id}`, 24, 100);
        return { user, course, progress, completed: progress >= 95 };
      })
  );

  const avgProgress = rows.length
    ? Math.round(rows.reduce((total, row) => total + row.progress, 0) / rows.length)
    : 0;
  const completionRate = rows.length
    ? Math.round((rows.filter((row) => row.completed).length / rows.length) * 100)
    : 0;
  const certificates = store.certificates.filter((certificate) =>
    orgUsers.some((user) => user.id === certificate.userId)
  ).length;

  const monthly = MONTHS_2026.map((month) => ({
    month: month.slice(0, 3),
    value: seededPercent(`${activeOrganization?.id}:${month}`, 2, 12)
  }));
  const monthlyMax = Math.max(...monthly.map((item) => item.value));

  const courseStats = store.courses.map((course) => {
    const courseRows = rows.filter((row) => row.course.id === course.id);
    return {
      course,
      enrolled: courseRows.length,
      avg: courseRows.length
        ? Math.round(courseRows.reduce((total, row) => total + row.progress, 0) / courseRows.length)
        : 0
    };
  });

  const exportCsv = () => {
    const header = "User,Email,Course,Progress %,Completed\n";
    const body = rows
      .map(
        (row) =>
          `${row.user.name},${row.user.email},${row.course.title},${row.progress},${row.completed ? "yes" : "no"}`
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `training-report-${activeOrganization?.id ?? "org"}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="Company-wide training metrics: completion, watch coverage, and learner activity."
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="tint-chip px-2.5 py-1 text-xs uppercase tracking-wide tint-blue">
          {activeOrganization?.name ?? "Organization"} · 2026 YTD
        </span>
        <button type="button" className="ds-button ds-button-secondary px-3 py-2 text-sm" onClick={exportCsv}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </button>
      </div>
      <div className="stagger mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Active learners" value={String(learners.length)} tint="tint-blue" />
        <MiniStat label="Completion rate" value={`${completionRate}%`} tint="tint-emerald" />
        <MiniStat label="Avg watch coverage" value={`${avgProgress}%`} tint="tint-violet" />
        <MiniStat label="Certificates issued" value={String(certificates)} tint="tint-amber" />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <section className="ds-card p-5 tint-emerald">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold">Completions per month</h2>
            <span className="action-icon inline-flex h-9 w-9 items-center justify-center">
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-5 flex items-end justify-between gap-2" style={{ height: 140 }}>
            {monthly.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs font-bold">{item.value}</span>
                <div
                  className="report-bar w-full"
                  style={{ height: `${Math.max((item.value / monthlyMax) * 100, 8)}%` }}
                />
                <span className="text-xs text-muted">{item.month}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="ds-card p-5">
          <h2 className="text-lg font-bold">Course performance</h2>
          <div className="stagger mt-4 space-y-4">
            {courseStats.map(({ course, enrolled, avg }) => (
              <div key={course.id}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-semibold">{course.title}</span>
                  <span className="shrink-0 text-xs text-muted">
                    {enrolled} learners · avg {avg}%
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${avg}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="ds-card overflow-x-auto">
        <div className="p-5 pb-3">
          <h2 className="text-xl font-bold">Learner detail</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Learner</th>
              <th>Course</th>
              <th>Watch coverage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.user.id}-${row.course.id}`}>
                <td>
                  <p className="font-semibold">{row.user.name}</p>
                  <p className="text-xs text-muted">{row.user.email}</p>
                </td>
                <td className="text-muted">{row.course.title}</td>
                <td style={{ minWidth: 160 }}>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${row.progress}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted">{row.progress}%</p>
                </td>
                <td>
                  <StatusChip value={row.completed ? "completed" : "in_progress"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* --------------------------- Legislative: pipeline ------------------------- */

const ALERT_STATUS_ORDER = ["draft", "in_review", "approved", "published", "archived"];

function AlertPipelineView({ route }: { route: RouteDefinition }) {
  const { store } = useDemoStore();
  const statuses = [
    ...ALERT_STATUS_ORDER.filter((status) => store.alerts.some((alert) => alert.status === status)),
    ...Array.from(new Set(store.alerts.map((alert) => alert.status))).filter(
      (status) => !ALERT_STATUS_ORDER.includes(status)
    )
  ];

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="Attorney-reviewed alert pipeline from draft to publication and distribution."
      />
      <div className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statuses.map((status) => {
          const alerts = store.alerts.filter((alert) => alert.status === status);
          return (
            <section key={status} className="ds-card-muted p-3">
              <div className="mb-3 flex items-center justify-between gap-2 px-1">
                <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
                  {status.replaceAll("_", " ")}
                </h2>
                <span className={`tint-chip px-2 py-0.5 text-xs ${statusTint(status)}`}>
                  {alerts.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {alerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={`/admin/alerts/${alert.id}`}
                    className="ds-card block p-3.5 tint-rose"
                  >
                    <div className="flex items-start gap-2.5">
                      <Scale className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--tint)]" aria-hidden="true" />
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold">{alert.title}</h3>
                        <p className="mt-1 text-xs text-muted">
                          {alert.jurisdictionIds.join(", ")} · {alert.audiences.join(" + ")}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          Effective {formatDate(alert.effectiveDate)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                {alerts.length === 0 ? (
                  <p className="px-1 text-xs text-muted">Empty</p>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
