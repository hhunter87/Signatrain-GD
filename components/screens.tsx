"use client";

import {
  AlertTriangle,
  ArrowRight,
  Award,
  Bell,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Inbox,
  ListChecks,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Paperclip,
  Phone,
  PlayCircle,
  Plus,
  Scale,
  Target,
  Search,
  Send,
  Share2,
  Settings,
  Shield,
  Sparkles,
  Upload,
  UserPlus,
  Users,
  X,
  Video
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import gdDataJson from "@/mock-data/gd-data.json";
import learningProgressJson from "@/mock-data/learning-progress.json";
import signatrainContentJson from "@/mock-data/signatrain-content.json";
import sessionsCohortsJson from "@/mock-data/sessions-cohorts.json";
import usersJson from "@/mock-data/users.json";
import legislativeAlertsJson from "@/mock-data/legislative-alerts.json";
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
  "/app/gd/requests/new",
  "/app/gd/requests/[requestId]",
  "/app/gd/matters",
  "/app/gd/matters/[matterId]",
  "/app/gd/schedule",
  "/app/gd/templates",
  "/app/gd/projects",
  "/app/gd/projects/new",
  "/app/gd/billing",
  "/app/gd/signatrain-seats",
  "/app/signatrain",
  "/app/signatrain/courses/[courseId]",
  "/app/signatrain/learn/[courseId]/[moduleId]",
  "/app/signatrain/scenarios/[scenarioId]",
  "/app/signatrain/programs/[programId]",
  "/app/signatrain/live",
  "/app/signatrain/live/[sessionId]",
  "/app/signatrain/cohorts/[cohortId]",
  "/app/signatrain/certificates",
  "/app/signatrain/bot",
  "/app/signatrain/library",
  "/app/signatrain/progress",
  "/admin/gd",
  "/admin/gd/clients",
  "/admin/gd/onboarding",
  "/admin/gd/requests",
  "/admin/gd/requests/[requestId]",
  "/admin/gd/projects",
  "/admin/gd/templates",
  "/admin/alerts",
  "/app/company/billing",
  "/app/company/reports",
  "/app/profile",
  "/app/company",
  "/app/company/users",
  "/app/company/seats",
  "/app/alerts",
  "/app/alerts/[alertId]",
  "/app/alerts/coverage"
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
    case "/app/gd/requests/new":
      return <SubmitLegalRequestView route={route} />;
    case "/app/gd/requests/[requestId]":
      return <RequestThreadView route={route} pathname={pathname} />;
    case "/app/gd/matters":
      return <MattersView route={route} />;
    case "/app/gd/matters/[matterId]":
      return <MatterSummaryView route={route} pathname={pathname} />;
    case "/app/gd/schedule":
      return <ScheduleView route={route} />;
    case "/app/gd/templates":
      return <TemplatesView route={route} />;
    case "/app/gd/projects":
      return <ProjectsView route={route} />;
    case "/app/gd/projects/new":
      return <SubmitProjectView route={route} />;
    case "/app/gd/billing":
      return <BillingRefView route={route} />;
    case "/app/gd/signatrain-seats":
      return <SeatsView route={route} />;
    case "/app/signatrain":
      return <SignatrainDashboardView route={route} />;
    case "/app/signatrain/courses/[courseId]":
      return <CourseOverviewView route={route} pathname={pathname} />;
    case "/app/signatrain/learn/[courseId]/[moduleId]":
      return <LearningPlayerView route={route} pathname={pathname} />;
    case "/app/signatrain/scenarios/[scenarioId]":
      return <ScenarioDetailView route={route} pathname={pathname} />;
    case "/app/signatrain/programs/[programId]":
      return <ProgramProgressView route={route} pathname={pathname} />;
    case "/app/signatrain/live":
      return <LiveCatalogView route={route} />;
    case "/app/signatrain/live/[sessionId]":
      return <LiveSessionDetailView route={route} pathname={pathname} />;
    case "/app/signatrain/cohorts/[cohortId]":
      return <PrivateCohortView route={route} pathname={pathname} />;
    case "/app/signatrain/certificates":
      return <MyCertificatesView route={route} />;
    case "/app/signatrain/bot":
      return <HrBotView route={route} />;
    case "/app/signatrain/library":
      return <LibraryView route={route} />;
    case "/app/signatrain/progress":
      return <ProgressView route={route} />;
    case "/admin/gd":
      return <GdOpsDashboardView route={route} />;
    case "/admin/gd/clients":
      return <GdClientAdminView route={route} />;
    case "/admin/gd/onboarding":
      return <GdOnboardingOpsView route={route} />;
    case "/admin/gd/requests":
      return <GdRequestQueueView route={route} />;
    case "/admin/gd/requests/[requestId]":
      return <GdRequestTriageView route={route} pathname={pathname} />;
    case "/admin/gd/projects":
      return <GdProjectAdminView route={route} />;
    case "/admin/gd/templates":
      return <GdTemplateAdminView route={route} />;
    case "/admin/alerts":
      return <AlertPipelineView route={route} />;
    case "/app/alerts":
      return <EligibleAlertsView route={route} />;
    case "/app/alerts/[alertId]":
      return <AlertDetailView route={route} pathname={pathname} />;
    case "/app/alerts/coverage":
      return <JurisdictionCoverageView route={route} />;
    case "/app/profile":
      return <ProfileView route={route} />;
    case "/app/company":
      return <CompanyOverviewView route={route} />;
    case "/app/company/users":
      return <CompanyUsersView route={route} />;
    case "/app/company/seats":
      return <SeatsEntitlementsView route={route} />;
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
  const { store, activeUser } = useDemoStore();
  const orgId = activeUser?.organizationId;
  const tasks = onboardingTasks.filter((t) => t.organizationId === orgId);
  const profile = gdCompanyProfile.organizationId === orgId ? gdCompanyProfile : undefined;
  const orgUsers = store.users.filter((u) => u.organizationId === orgId);

  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [modal, setModal] = useState<{ type: "upload" | "schedule" | "generic"; taskId: string; title: string } | null>(null);
  // upload modal
  const [fileName, setFileName] = useState("");
  // schedule modal
  const [invitees, setInvitees] = useState<string[]>([]);
  const [callDate, setCallDate] = useState("");
  const [callTime, setCallTime] = useState("");
  const [scheduleDone, setScheduleDone] = useState(false);

  const statusOf = (t: { id: string; status: string }) => overrides[t.id] ?? t.status;
  const done = tasks.filter((t) => statusOf(t) === "accepted").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const sections = ONBOARDING_SECTION_ORDER.map((name) => ({
    name,
    items: tasks.filter((t) => t.section === name)
  })).filter((sec) => sec.items.length > 0);

  const actionType = (title: string): "upload" | "schedule" | "generic" => {
    const t = title.toLowerCase();
    if (t.includes("termination")) return "upload";
    if (t.includes("kickoff")) return "schedule";
    return "generic";
  };
  const openModal = (taskId: string, title: string) => {
    setFileName(""); setInvitees([]); setCallDate(""); setCallTime(""); setScheduleDone(false);
    setModal({ type: actionType(title), taskId, title });
  };
  const closeModal = () => setModal(null);
  const confirmUpload = () => {
    if (!modal || !fileName) return;
    setUploads((u) => ({ ...u, [modal.taskId]: fileName }));
    setOverrides((o) => ({ ...o, [modal.taskId]: "in_review" }));
    closeModal();
  };
  const confirmSchedule = () => {
    if (!modal) return;
    setOverrides((o) => ({ ...o, [modal.taskId]: "accepted" }));
    setScheduleDone(true);
  };
  const confirmGeneric = () => {
    if (!modal) return;
    setOverrides((o) => ({ ...o, [modal.taskId]: "submitted" }));
    closeModal();
  };
  const toggleInvitee = (id: string) => setInvitees((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Complete these steps so Greenwald Doherty has everything needed to represent you well." />

      <section className="ds-card mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-[color:var(--brand-accent)]" aria-hidden="true" />
            <h2 className="text-lg font-bold">{done} of {tasks.length} steps completed</h2>
          </div>
          <span className="text-sm font-bold">{pct}%</span>
        </div>
        <div className="progress-track mt-3 h-2"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
      </section>

      {profile ? (
        <section className="ds-card mb-6 p-5">
          <div className="mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h3 className="font-bold">Company profile</h3></div>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Legal name", profile.legalName],["DBA", profile.dba],["Entity type", profile.entityType],
              ["State of formation", profile.stateOfFormation],["Headquarters", profile.headquarters],["Website", profile.website],
              ["Primary activity", profile.primaryActivity],["Jurisdictions", profile.jurisdictions.join(", ")]
            ].map(([label, value]) => (
              <div key={label as string}><dt className="text-xs font-bold uppercase tracking-wide text-muted">{label}</dt><dd className="mt-0.5 text-sm">{value}</dd></div>
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
                const st = statusOf(task);
                const complete = st === "accepted";
                const fileCount = task.attachments.length + (uploads[task.id] ? 1 : 0);
                const Row = (
                  <>
                    <div className="flex items-start gap-3">
                      {complete ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                      )}
                      <div className="text-left">
                        <p className="font-semibold">{task.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                          <span className={`tint-chip px-2 py-0.5 uppercase tracking-wide ${requirementTint(task.requirement)}`}>{task.requirement}</span>
                          {task.dueAt ? <span>Due {formatDate(task.dueAt)}</span> : null}
                          {fileCount > 0 ? <span className="inline-flex items-center gap-1"><Paperclip className="h-3 w-3" aria-hidden="true" />{fileCount} file{fileCount > 1 ? "s" : ""}</span> : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusChip value={st} />
                      {!complete ? <ChevronRight className="h-4 w-4 text-muted" aria-hidden="true" /> : null}
                    </div>
                  </>
                );
                return complete ? (
                  <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 p-4">{Row}</div>
                ) : (
                  <button key={task.id} type="button" onClick={() => openModal(task.id, task.title)} className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-[color:var(--surface-hover,rgba(0,0,0,0.03))]">{Row}</button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {modal ? createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} aria-hidden="true" />
          <div className="ds-card relative z-10 w-full max-w-lg p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold">{modal.title}</h3>
              <button type="button" onClick={closeModal} aria-label="Close" className="text-muted hover:text-[color:var(--page-title,inherit)]"><X className="h-5 w-5" aria-hidden="true" /></button>
            </div>

            {modal.type === "upload" ? (
              <div>
                <p className="text-sm text-muted">Upload the requested documents. This is a simulation — no files leave your device.</p>
                <div className="mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[color:var(--hairline,rgba(0,0,0,0.15))] p-8 text-center">
                  <Upload className="h-8 w-8 text-muted" aria-hidden="true" />
                  <p className="mt-2 text-sm text-muted">Drag &amp; drop or choose a file</p>
                  <button type="button" className="ds-button ds-button-secondary mt-3 px-4 py-2 text-sm" onClick={() => setFileName("Termination_Documents.pdf")}>Choose file</button>
                  {fileName ? <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"><Paperclip className="h-4 w-4" aria-hidden="true" />{fileName}</p> : null}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" className="ds-button ds-button-secondary px-4 py-2 text-sm" onClick={closeModal}>Cancel</button>
                  <button type="button" className="ds-button ds-button-primary px-4 py-2 text-sm" onClick={confirmUpload} disabled={!fileName}><Upload className="h-4 w-4" aria-hidden="true" />Upload</button>
                </div>
              </div>
            ) : null}

            {modal.type === "schedule" ? (
              scheduleDone ? (
                <div>
                  <CheckCircle2 className="h-10 w-10 text-[color:var(--brand-accent)]" aria-hidden="true" />
                  <h4 className="mt-2 font-bold">Kickoff call scheduled</h4>
                  <p className="mt-1 text-sm text-muted">{callDate ? formatDate(callDate) : "Date TBD"}{callTime ? ` at ${callTime}` : ""} · {invitees.length} invitee{invitees.length === 1 ? "" : "s"}. Calendar invites sent (simulation).</p>
                  <div className="mt-4 flex justify-end"><button type="button" className="ds-button ds-button-primary px-4 py-2 text-sm" onClick={closeModal}>Done</button></div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted">Pick a time and invite people from your company. This is a simulation.</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <div><label className="block text-xs font-bold uppercase tracking-wide text-muted">Date</label><input type="date" className="ds-field mt-1 px-3 py-2 text-sm" value={callDate} onChange={(e) => setCallDate(e.target.value)} /></div>
                    <div><label className="block text-xs font-bold uppercase tracking-wide text-muted">Time</label><input type="time" className="ds-field mt-1 px-3 py-2 text-sm" value={callTime} onChange={(e) => setCallTime(e.target.value)} /></div>
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted">Invite attendees</p>
                  <div className="mt-1 max-h-52 space-y-1 overflow-y-auto">
                    {orgUsers.map((u) => (
                      <label key={u.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[color:var(--hairline,rgba(0,0,0,0.08))] px-3 py-2 text-sm">
                        <input type="checkbox" checked={invitees.includes(u.id)} onChange={() => toggleInvitee(u.id)} />
                        <span className="flex-1"><span className="font-semibold">{u.name}</span><span className="text-muted"> — {u.title ?? u.roles.join(", ")}</span></span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button type="button" className="ds-button ds-button-secondary px-4 py-2 text-sm" onClick={closeModal}>Cancel</button>
                    <button type="button" className="ds-button ds-button-primary px-4 py-2 text-sm" onClick={confirmSchedule} disabled={invitees.length === 0 || !callDate}><CalendarDays className="h-4 w-4" aria-hidden="true" />Schedule &amp; invite</button>
                  </div>
                </div>
              )
            ) : null}

            {modal.type === "generic" ? (
              <div>
                <p className="text-sm text-muted">Mark this step as submitted for Greenwald Doherty to review. This is a simulation.</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" className="ds-button ds-button-secondary px-4 py-2 text-sm" onClick={closeModal}>Cancel</button>
                  <button type="button" className="ds-button ds-button-primary px-4 py-2 text-sm" onClick={confirmGeneric}><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Submit for review</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      , document.body) : null}
    </div>
  );
}

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
        <section className="lg:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" />
            <h2 className="text-lg font-bold">Current plan</h2>
          </div>
          <div className="ds-card p-5">
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
          </div>
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
        <dl className="mt-4 grid gap-3 border-t border-[color:var(--hairline,rgba(0,0,0,0.08))] pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Request ID</dt><dd className="mt-0.5 text-sm">{request.id}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Category</dt><dd className="mt-0.5 text-sm">{request.topic}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Submitted by</dt><dd className="mt-0.5 text-sm">{authorName(request.submittedByUserId)}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Assigned to</dt><dd className="mt-0.5 text-sm">{request.assignedAttorneyUserId ? authorName(request.assignedAttorneyUserId) : "Unassigned"}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Created</dt><dd className="mt-0.5 text-sm">{formatDate(request.createdAt)}</dd></div>
        </dl>
      </section>
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <section className="ds-card p-5 lg:col-span-2">
          <h3 className="font-bold">Decision & next steps</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" /><span><span className="font-semibold">What GD is working on:</span> {requestWorkingOn(request.status)}</span></li>
            <li className="flex items-start gap-2"><UserPlus className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" /><span><span className="font-semibold">What GD needs from you:</span> {requestNeedsFromYou(request.status)}</span></li>
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" /><span><span className="font-semibold">Recommended next step:</span> {request.clientVisibleSummary ?? "Await the attorney's next update."}</span></li>
          </ul>
        </section>
        <section className="ds-card p-5">
          <div className="mb-2 flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" />
            <h3 className="font-bold">Attachments</h3>
          </div>
          <p className="text-sm text-muted">No attachments have been shared in the portal for this request.</p>
        </section>
      </div>
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
  const matters = matterReferences.filter((matter) => matter.organizationId === activeOrganization?.id);
  const attorneyName = (userId?: string) =>
    store.users.find((user) => user.id === userId)?.name ?? "Assigned attorney";
  const detailFor = (matterId: string) => gdMatterDetails.find((det) => det.id === matterId);

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="A client-safe view of your matters. Internal notes, billing entries, and strategy stay inside Greenwald Doherty."
      />
      {matters.length === 0 ? (
        <section className="ds-card p-6 text-center">
          <h2 className="text-xl font-bold">No matter references</h2>
          <p className="mt-2 text-muted">This organization has no linked matters.</p>
        </section>
      ) : (
        <div className="stagger grid gap-4 md:grid-cols-2">
          {matters.map((matter) => {
            const det = detailFor(matter.id);
            return (
              <Link key={matter.id} href={`/app/gd/matters/${matter.id}`} className="ds-card ds-card-interactive block p-5 tint-blue">
                <div className="flex items-start justify-between gap-3">
                  <span className="action-icon inline-flex h-10 w-10 items-center justify-center">
                    <Scale className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <StatusChip value={matter.status} />
                </div>
                <h2 className="mt-4 text-lg font-bold">{matter.externalReference}</h2>
                <p className="mt-1 text-sm font-semibold text-muted">{matter.type}</p>
                {matter.approvedSummary ? <p className="mt-2 text-sm text-muted">{matter.approvedSummary}</p> : null}
                {det?.nextMilestone ? (
                  <p className="mt-3 text-sm">
                    <span className="font-semibold">Next:</span> {det.nextMilestone}
                    {det.nextMilestoneDate ? ` — ${formatDate(det.nextMilestoneDate)}` : ""}
                  </p>
                ) : null}
                <div className="action-meta-row mt-4 text-sm">
                  <span className="font-semibold">{attorneyName(matter.responsibleAttorneyUserId)}</span>
                  <span className="text-xs text-muted">Updated {formatDate(matter.updatedAt)}</span>
                </div>
              </Link>
            );
          })}
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
  const [type, setType] = useState("all");
  const [audience, setAudience] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [query, setQuery] = useState("");

  const sessions = [...store.liveSessions]
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .filter((sn) => {
      if (type !== "all" && sn.type !== type) return false;
      if (audience !== "all" && sn.audience !== audience) return false;
      if (availability === "upcoming" && !["registration_open", "scheduled"].includes(sn.status)) return false;
      if (availability === "replay" && sn.recordingStatus !== "recording_published") return false;
      if (query.trim() && !sn.title.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Upcoming live sessions and replays. Completion requires at least 90% attendance." />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="ds-field inline-flex items-center gap-2 px-3 py-2 text-sm">
          <Search className="h-4 w-4 opacity-60" aria-hidden="true" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sessions" className="w-48 bg-transparent outline-none" />
        </label>
        <select className="ds-field px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All types</option>
          <option value="HR_MASTERCLASS">HR Masterclass</option>
          <option value="RISK_ROUNDTABLE">Risk Roundtable</option>
          <option value="MANAGER_CORE">Manager Core</option>
        </select>
        <select className="ds-field px-3 py-2 text-sm" value={audience} onChange={(e) => setAudience(e.target.value)}>
          <option value="all">All roles</option>
          <option value="HR">HR</option>
          <option value="MANAGER">Manager</option>
        </select>
        <select className="ds-field px-3 py-2 text-sm" value={availability} onChange={(e) => setAvailability(e.target.value)}>
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="replay">Replay available</option>
        </select>
      </div>
      {sessions.length === 0 ? (
        <p className="text-muted">No sessions match these filters.</p>
      ) : (
        <div className="stagger grid gap-4 md:grid-cols-2">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({ session }: { session: LiveSession }) {
  const { recordSimulation } = useDemoStore();
  const [state, setState] = useState<"idle" | "confirm" | "registered">("idle");
  const canRegister = ["registration_open", "scheduled"].includes(session.status);
  const meta = sessionMetaList.find((m) => m.sessionId === session.id);

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
      {meta ? (
        <div className="mt-2 space-y-0.5 text-xs text-muted">
          <p>Facilitator: {meta.facilitatorName}</p>
          <p>
            {meta.seatsAvailable > 0 ? `${meta.seatsAvailable} seats available` : "No open seats"}
            {meta.certificateCredit ? " · Certificate credit" : ""}
          </p>
        </div>
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
      <Link
        href={`/app/signatrain/live/${session.id}`}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--brand-accent)]"
      >
        View details
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </article>
  );
}

/* -------------------------- Signatrain: library ---------------------------- */

function LibraryView({ route }: { route: RouteDefinition }) {
  const { store } = useDemoStore();
  const [topic, setTopic] = useState("all");
  const [audience, setAudience] = useState("all");
  const [format, setFormat] = useState("all");
  const [query, setQuery] = useState("");

  const meta = (id: string) => courseMetaList.find((m) => m.courseId === id);
  const topics = ["all", ...Array.from(new Set(store.courses.map((c) => c.topic)))];

  const courses = store.courses.filter(
    (c) =>
      (topic === "all" || c.topic === topic) &&
      (audience === "all" || c.audience === audience) &&
      (query.trim() === "" || c.title.toLowerCase().includes(query.trim().toLowerCase()))
  );
  const scenarios = store.scenarios.filter(
    (sc) =>
      (audience === "all" || (sc.audiences as string[]).includes(audience)) &&
      (query.trim() === "" || sc.title.toLowerCase().includes(query.trim().toLowerCase()))
  );
  const showCourses = format === "all" || format === "course";
  const showScenarios = format === "all" || format === "scenario";

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Browse courses, scenarios, and resources available to your audience. Filter by topic, role, or format." />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="ds-field inline-flex items-center gap-2 px-3 py-2 text-sm">
          <Search className="h-4 w-4 opacity-60" aria-hidden="true" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search content" className="w-48 bg-transparent outline-none" />
        </label>
        <select className="ds-field px-3 py-2 text-sm" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {topics.map((t) => <option key={t} value={t}>{t === "all" ? "All topics" : t}</option>)}
        </select>
        <select className="ds-field px-3 py-2 text-sm" value={audience} onChange={(e) => setAudience(e.target.value)}>
          <option value="all">All roles</option>
          <option value="HR">HR</option>
          <option value="MANAGER">Manager</option>
        </select>
        <select className="ds-field px-3 py-2 text-sm" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="all">All formats</option>
          <option value="course">Courses</option>
          <option value="scenario">Scenarios</option>
        </select>
      </div>

      {showCourses ? (
        <>
          <h2 className="group-label mb-4 text-sm font-bold uppercase tracking-wide text-muted">Courses</h2>
          <div className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => {
              const m = meta(course.id);
              return (
                <Link key={course.id} href={`/app/signatrain/courses/${course.id}`} className="ds-card ds-card-interactive flex flex-col p-5 tint-brand">
                  <div className="flex items-start justify-between gap-3">
                    <span className="action-icon inline-flex h-10 w-10 items-center justify-center"><GraduationCap className="h-5 w-5" aria-hidden="true" /></span>
                    {m?.certificate ? <span className="tint-chip tint-emerald px-2 py-0.5 text-xs uppercase tracking-wide">Certificate</span> : null}
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{course.title}</h3>
                  <p className="mt-1 text-sm text-muted">{course.topic} · {m?.audienceLabel ?? course.audience}</p>
                  {m?.description ? <p className="mt-2 text-sm text-muted">{m.description}</p> : null}
                  <p className="action-meta-row mt-auto pt-4 text-sm">
                    <span className="font-semibold">{(m?.moduleTitles?.length ?? course.moduleIds.length)} modules</span>
                    <span className="text-xs text-muted">{m?.durationMinutes ? `${m.durationMinutes} min` : "Ordered sequence"}</span>
                  </p>
                </Link>
              );
            })}
          </div>
          {courses.length === 0 ? <p className="mt-3 text-sm text-muted">No courses match these filters.</p> : null}
        </>
      ) : null}

      {showScenarios ? (
        <>
          <h2 className="group-label mb-4 mt-10 text-sm font-bold uppercase tracking-wide text-muted">Standalone scenarios</h2>
          <div className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {scenarios.map((scenario) => (
              <Link key={scenario.id} href={`/app/signatrain/scenarios/${scenario.id}`} className="ds-card ds-card-interactive block p-5 tint-cyan">
                <div className="flex items-start justify-between gap-3">
                  <span className="tint-chip px-2 py-0.5 text-xs">{scenario.audiences.join(" + ")}</span>
                  <span className="text-xs font-semibold text-muted">{scenario.durationMinutes} min</span>
                </div>
                <h3 className="mt-3 text-base font-bold">{scenario.title}</h3>
                <p className="mt-1 text-sm text-muted">{scenario.summary}</p>
              </Link>
            ))}
          </div>
          {scenarios.length === 0 ? <p className="mt-3 text-sm text-muted">No scenarios match these filters.</p> : null}
        </>
      ) : null}
    </div>
  );
}

function ProgressView({ route }: { route: RouteDefinition }) {
  const { store, activeUser } = useDemoStore();
  const myEnrollments = enrollments.filter((e) => e.userId === activeUser?.id);
  const myVideos = videoProgress.filter((v) => v.userId === activeUser?.id);
  const myCertificates = store.certificates.filter((c) => c.userId === activeUser?.id);
  const myAssignments = stAssignments.filter((a) => a.userId === activeUser?.id);
  const myProgram = myAssignments.find((a) => a.kind === "program");
  const pMeta = myProgram ? programMetaList.find((m) => m.programId === myProgram.refId) : undefined;

  const completedCourses = myAssignments.filter((a) => a.kind === "course" && a.status === "completed").length;
  const activeCourses = myAssignments.filter((a) => a.kind === "course" && a.status === "in_progress").length;
  const overdue = myAssignments.filter((a) => a.status === "overdue").length;
  const courseTitle = (id: string) => store.courses.find((c) => c.id === id)?.title ?? id;
  void myEnrollments;

  const history = myAssignments
    .filter((a) => a.kind === "course")
    .map((a) => {
      const cert = myCertificates.find((c) => c.courseId === a.refId);
      return { id: a.id, title: courseTitle(a.refId), status: a.status, score: cert || a.status === "completed" ? "Passed" : "—", completed: cert ? cert.issuedAt : undefined };
    });

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Your personal learning record across the whole platform." />
      <div className="stagger mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MiniStat label="Completed courses" value={String(completedCourses)} tint="tint-emerald" />
        <MiniStat label="Active courses" value={String(activeCourses)} tint="tint-blue" />
        <MiniStat label="Certificates" value={String(myCertificates.length)} tint="tint-violet" />
        <MiniStat label="Overdue" value={String(overdue)} tint={overdue > 0 ? "tint-rose" : "tint-brand"} />
        <MiniStat label="Avg. score" value="89%" tint="tint-cyan" />
      </div>

      {history.length === 0 && myVideos.length === 0 ? (
        <section className="ds-card p-6 text-center">
          <h2 className="text-xl font-bold">No learning activity yet</h2>
          <p className="mt-2 text-muted">This persona has no assignments or video progress.</p>
        </section>
      ) : (
        <>
          <section className="mb-6">
            <h2 className="mb-3 text-lg font-bold">Training history</h2>
            <div className="ds-card overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Training</th><th>Status</th><th>Score</th><th>Completed</th></tr></thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id}>
                      <td className="font-semibold">{h.title}</td>
                      <td><StatusChip value={h.status} /></td>
                      <td className="text-sm">{h.score}</td>
                      <td className="text-sm text-muted">{h.completed ? formatDate(h.completed) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <h2 className="mb-3 text-lg font-bold">Video watch coverage</h2>
              <div className="ds-card p-5 tint-violet">
                <p className="text-sm text-muted">Completion is recorded at 95% unique watch coverage.</p>
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
                        <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
                      </div>
                    );
                  })}
                  {myVideos.length === 0 ? <p className="text-sm text-muted">No video progress yet.</p> : null}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              {pMeta ? (
                <div>
                  <div className="mb-2 flex items-center gap-2"><Target className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Skill areas</h2></div>
                  <div className="ds-card space-y-2 p-4">
                    {pMeta.skillAreas.map((sk) => (
                      <div key={sk.name} className="flex items-center justify-between gap-3 text-sm">
                        <span>{sk.name}</span>
                        <span className={`tint-chip px-2 py-0.5 text-xs uppercase tracking-wide ${skillTint(sk.level)}`}>{sk.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {pMeta?.recommended?.length ? (
                <div>
                  <h2 className="mb-2 text-lg font-bold">Recommended learning</h2>
                  <ul className="ds-card space-y-2 p-4 text-sm">
                    {pMeta.recommended.map((r) => <li key={r} className="flex items-start gap-2"><ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />{r}</li>)}
                  </ul>
                </div>
              ) : null}
            </section>
          </div>

          {myCertificates.length > 0 ? (
            <section className="ds-card mt-6 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold">Certificates</h2>
                <Link href="/app/signatrain/certificates" className="text-sm font-bold text-[color:var(--brand-accent)] hover:underline">View all</Link>
              </div>
              <div className="stagger mt-4 grid gap-3 md:grid-cols-2">
                {myCertificates.map((certificate) => (
                  <Link key={certificate.id} href="/app/signatrain/certificates" className="certificate-card block p-4">
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

  const MONTH_LABELS_12 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthly = MONTH_LABELS_12.map((month) => ({
    month,
    value: seededPercent(`${activeOrganization?.id}:completions:${month}`, 3, 19)
  }));
  const monthlyMax = Math.max(...monthly.map((item) => item.value), 1);
  const monthlyTotal = monthly.reduce((t, i) => t + i.value, 0);

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
          <p className="mt-1 text-sm text-muted">{monthlyTotal} completions across 2026</p>
          <div className="mt-5">
            <div
              className="tint-blue flex items-end gap-1.5 border-b border-[color:var(--hairline,rgba(0,0,0,0.08))]"
              style={{ height: 180 }}
            >
              {monthly.map((item) => (
                <div
                  key={item.month}
                  title={`${item.month}: ${item.value} completions`}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-1 text-xs font-bold">{item.value}</span>
                  <div
                    className="report-bar w-full rounded-t-md"
                    style={{ height: `${Math.max((item.value / monthlyMax) * 100, 4)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex gap-1.5">
              {monthly.map((item) => (
                <span key={item.month} className="flex-1 text-center text-[10px] text-muted">{item.month}</span>
              ))}
            </div>
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
      <CompanyReportExtras />
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


/* =============================== GD: Batch 2 =============================== */

interface MatterDetail {
  id: string;
  matterType: string;
  clientContactUserId?: string;
  teamUserIds: string[];
  nextMilestone: string;
  nextMilestoneDate?: string;
  relatedRequestIds: string[];
  description: string;
  focus: string;
  timeline: { at: string; label: string }[];
  openItems: { owner: string; text: string }[];
  documents: { name: string; kind: string; status: string }[];
}
interface AppointmentType {
  id: string;
  name: string;
  durationMinutes: number;
  participants: string;
  includedInPlan: boolean;
  extraCharge: boolean;
  prep: string;
}
interface SchedulingSlot { id: string; date: string; time: string }
interface GdTemplate {
  id: string;
  title: string;
  category: string;
  status: string;
  fileName: string;
  audiencePlans: string[];
  description?: string;
  lastUpdated?: string;
  intendedUse?: string;
  attorneyReview?: string;
}
interface ProjectCatalogItem {
  id: string;
  name: string;
  includes: string[];
  excludes: string[];
  timeline: string;
  priceDisplay: string;
  requiredDocuments: string[];
  planNote: string;
}
interface ProjectRequest {
  id: string;
  organizationId: string;
  submittedByUserId: string;
  type: string;
  title: string;
  description: string;
  status: string;
  assignedAttorneyUserId?: string;
  adobeSignReference?: string | null;
  createdAt: string;
}
interface BillingContact { role: string; name: string; email: string; phone: string }
interface BillingReference {
  arrangement: string;
  retainerDisplay: string;
  flatFeeTerms: string;
  hourlyReference: string;
  paymentSchedule: string;
}
interface Invoice {
  id: string;
  number: string;
  date: string;
  amountDisplay: string;
  dueDate: string;
  status: string;
  external: boolean;
}
interface SeatUser {
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  program: string;
  progress: number;
}
interface SeatSummary {
  organizationId: string;
  totalIncluded: number;
  assigned: number;
  available: number;
  pendingInvites: number;
  additionalAvailable: boolean;
  assignedUsers: SeatUser[];
}

const gdMatterDetails = gdDataJson.matterDetails as unknown as MatterDetail[];
const gdAppointmentTypes = gdDataJson.appointmentTypes as unknown as AppointmentType[];
const gdSchedulingSlots = gdDataJson.schedulingSlots as unknown as SchedulingSlot[];
const gdTemplates = gdDataJson.templates as unknown as GdTemplate[];
const gdProjectCatalog = gdDataJson.projectCatalog as unknown as ProjectCatalogItem[];
const gdProjectRequestsData = gdDataJson.projectRequests as unknown as ProjectRequest[];
const gdProjectTypes = gdDataJson.projectTypes as unknown as string[];
const gdBillingContacts = gdDataJson.billingContacts as unknown as BillingContact[];
const gdBillingReference = gdDataJson.billingReference as unknown as BillingReference;
const gdInvoices = gdDataJson.invoices as unknown as Invoice[];
const gdBillingPolicies = gdDataJson.billingPolicies as unknown as string[];
const gdSeats = gdDataJson.signatrainSeats as unknown as SeatSummary;

function requestWorkingOn(status: string): string {
  switch (status) {
    case "submitted":
    case "triage":
      return "Reviewing and routing your request to the right attorney.";
    case "assigned":
      return "Your attorney is getting up to speed on the request.";
    case "in_progress":
      return "Preparing guidance and next steps.";
    case "waiting_for_client":
      return "Paused pending information from your side.";
    case "resolved":
    case "converted_to_matter":
    case "closed":
      return "This request has been addressed.";
    default:
      return "Reviewing your request.";
  }
}
function requestNeedsFromYou(status: string): string {
  return status === "waiting_for_client"
    ? "Please provide the requested information or documents to continue."
    : "Nothing right now — we'll reach out if we need anything.";
}

/* ---------------------------- Matter summary ------------------------------ */

function MatterSummaryView({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  const { store, activeUser } = useDemoStore();
  const matterId = decodeURIComponent(pathname.split("/").pop() ?? "");
  const matter = matterReferences.find(
    (m) => m.id === matterId && m.organizationId === activeUser?.organizationId
  );
  const det = gdMatterDetails.find((m) => m.id === matterId);
  const userName = (id?: string) => store.users.find((u) => u.id === id)?.name ?? "Team member";
  const visible = visibleLegalRequestsForUser(activeUser, store);

  if (!matter) {
    return (
      <div className="narrow-shell">
        <section className="ds-card p-6">
          <LockKeyhole className="h-8 w-8 opacity-40" aria-hidden="true" />
          <h1 className="page-title mt-3 text-2xl font-bold">Matter not visible</h1>
          <p className="mt-2 text-muted">This matter does not exist or is not visible to the active persona.</p>
          <Link href="/app/gd/matters" className="ds-button ds-button-primary mt-5 inline-flex px-4 py-2">Back to matters</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="An executive summary of this matter — not a full legal file." />
      <section className="ds-card mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{matter.externalReference}</h2>
            <p className="mt-1 text-sm font-semibold text-muted">{det?.matterType ?? matter.type}</p>
          </div>
          <StatusChip value={matter.status} />
        </div>
        <dl className="mt-4 grid gap-3 border-t border-[color:var(--hairline,rgba(0,0,0,0.08))] pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Responsible attorney</dt><dd className="mt-0.5 text-sm">{userName(matter.responsibleAttorneyUserId)}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Client contact</dt><dd className="mt-0.5 text-sm">{userName(det?.clientContactUserId)}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Next milestone</dt><dd className="mt-0.5 text-sm">{det?.nextMilestone ?? "—"}{det?.nextMilestoneDate ? ` (${formatDate(det.nextMilestoneDate)})` : ""}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Updated</dt><dd className="mt-0.5 text-sm">{formatDate(matter.updatedAt)}</dd></div>
        </dl>
      </section>

      {det ? (
        <>
          <section className="ds-card mb-6 p-5">
            <h3 className="font-bold">Overview</h3>
            <p className="mt-2 text-sm text-muted">{det.description}</p>
            <p className="mt-2 text-sm"><span className="font-semibold">Current focus:</span> {det.focus}</p>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <h3 className="mb-3 text-lg font-bold">Timeline</h3>
              <div className="ds-card p-5">
                <ul className="space-y-4">
                  {det.timeline.map((ev, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[color:var(--brand-accent)]" aria-hidden="true" />
                      <div><p className="text-sm">{ev.label}</p><p className="text-xs text-muted">{formatDate(ev.at)}</p></div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            <section className="space-y-4">
              <div className="ds-card p-5">
                <h3 className="font-bold">Open items</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {det.openItems.map((it, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`tint-chip px-2 py-0.5 text-xs uppercase tracking-wide ${it.owner === "Client" ? "tint-amber" : "tint-blue"}`}>{it.owner}</span>
                      <span>{it.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <section className="mt-6">
            <h3 className="mb-3 text-lg font-bold">Documents</h3>
            <div className="ds-card overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Document</th><th>Type</th><th>Status</th></tr></thead>
                <tbody>
                  {det.documents.map((doc) => (
                    <tr key={doc.name}>
                      <td className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted" aria-hidden="true" />{doc.name}</td>
                      <td className="text-muted">{doc.kind}</td>
                      <td><StatusChip value={doc.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {det.relatedRequestIds.length > 0 ? (
            <section className="mt-6">
              <h3 className="mb-3 text-lg font-bold">Related requests</h3>
              <ul className="space-y-2 text-sm">
                {det.relatedRequestIds.map((rid) => {
                  const req = visible.find((r) => r.id === rid);
                  return (
                    <li key={rid}>
                      {req ? (
                        <Link href={`/app/gd/requests/${rid}`} className="inline-flex items-center gap-1.5 font-semibold text-[color:var(--brand-accent)] hover:underline">
                          {req.subject}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      ) : (
                        <span className="text-muted">{rid} (restricted)</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </>
      ) : (
        <section className="ds-card p-5"><p className="text-muted">{matter.approvedSummary ?? "Limited matter reference."}</p></section>
      )}
      <div className="mt-6"><Link href="/app/gd/matters" className="text-sm font-bold text-[color:var(--brand-accent)] hover:underline">← Back to matters</Link></div>
    </div>
  );
}

/* --------------------------- Attorney scheduling -------------------------- */

function ScheduleView({ route }: { route: RouteDefinition }) {
  const { activeUser } = useDemoStore();
  const orgId = activeUser?.organizationId;
  const upcoming = [...gdAppointments].filter((a) => a.organizationId === orgId).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const [typeId, setTypeId] = useState(gdAppointmentTypes[0]?.id ?? "");
  const [slotId, setSlotId] = useState("");
  const [topic, setTopic] = useState("");
  const [booked, setBooked] = useState<{ type: string; slot: string } | null>(null);
  const selectedType = gdAppointmentTypes.find((t) => t.id === typeId);

  const confirm = () => {
    const slot = gdSchedulingSlots.find((sl) => sl.id === slotId);
    if (!selectedType || !slot) return;
    setBooked({ type: selectedType.name, slot: `${formatDate(slot.date)} at ${slot.time}` });
  };

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Book time with your attorney team. Choose a meeting type, then a slot — this is a simulation." />

      {upcoming.length > 0 ? (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-bold">Upcoming meetings</h2>
          <div className="stagger grid gap-3 md:grid-cols-2">
            {upcoming.map((a) => (
              <article key={a.id} className="ds-card p-4 tint-blue">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">{a.type}</p>
                  <StatusChip value={a.status} />
                </div>
                <p className="mt-1 text-sm text-muted">{a.topic}</p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4" aria-hidden="true" />{formatDateTime(a.startsAt)} · {a.durationMinutes} min</p>
                <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted"><Video className="h-4 w-4" aria-hidden="true" />{a.location}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold">Meeting types</h2>
          <div className="stagger grid gap-3 md:grid-cols-2">
            {gdAppointmentTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTypeId(t.id)}
                className={`ds-card ds-card-interactive p-4 text-left ${typeId === t.id ? "tint-brand" : ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">{t.name}</p>
                  <span className="text-xs text-muted">{t.durationMinutes} min</span>
                </div>
                <p className="mt-1 text-sm text-muted">{t.participants}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`tint-chip px-2 py-0.5 text-xs uppercase tracking-wide ${t.includedInPlan ? "tint-emerald" : "tint-amber"}`}>
                    {t.includedInPlan ? "Included in plan" : "May be billable"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">Prepare: {t.prep}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">Book a time</h2>
          <div className="ds-card p-5">
            {booked ? (
              <div>
                <CheckCircle2 className="h-8 w-8 text-[color:var(--brand-accent)]" aria-hidden="true" />
                <h3 className="mt-2 font-bold">Appointment reference created</h3>
                <p className="mt-1 text-sm text-muted">{booked.type} — {booked.slot}. This is a simulation; no real booking was made.</p>
                <button type="button" className="ds-button ds-button-secondary mt-4 px-4 py-2 text-sm" onClick={() => setBooked(null)}>Book another</button>
              </div>
            ) : (
              <>
                <label className="block text-xs font-bold uppercase tracking-wide text-muted">Meeting type</label>
                <select className="ds-field mt-1 w-full px-3 py-2 text-sm" value={typeId} onChange={(e) => setTypeId(e.target.value)}>
                  {gdAppointmentTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-muted">Available slots</label>
                <div className="mt-1 grid grid-cols-1 gap-2">
                  {gdSchedulingSlots.map((sl) => (
                    <button
                      key={sl.id}
                      type="button"
                      onClick={() => setSlotId(sl.id)}
                      className={`ds-field px-3 py-2 text-left text-sm ${slotId === sl.id ? "tint-brand" : ""}`}
                    >
                      <Clock className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
                      {formatDate(sl.date)} · {sl.time}
                    </button>
                  ))}
                </div>
                <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-muted">Topic (optional)</label>
                <input type="text" className="ds-field mt-1 w-full px-3 py-2 text-sm" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What is this meeting about?" />
                <button type="button" className="ds-button ds-button-primary mt-4 w-full px-4 py-2 text-sm" onClick={confirm} disabled={!slotId}>
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  Confirm meeting
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------------------- Template library ---------------------------- */

function TemplatesView({ route }: { route: RouteDefinition }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const categories = ["all", ...Array.from(new Set(gdTemplates.map((t) => t.category)))];
  const templates = gdTemplates.filter(
    (t) =>
      (category === "all" || t.category === category) &&
      (query.trim() === "" || `${t.title} ${t.description ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()))
  );

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Templates and resources Greenwald Doherty makes available. Some are ready to use; others are best used after attorney review." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="ds-field inline-flex items-center gap-2 px-3 py-2 text-sm">
          <Search className="h-4 w-4 opacity-60" aria-hidden="true" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates" className="w-56 bg-transparent outline-none" />
        </label>
        <select className="ds-field px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>)}
        </select>
      </div>

      <div className="stagger grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <article key={t.id} className="ds-card flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="action-icon inline-flex h-10 w-10 items-center justify-center"><FileText className="h-5 w-5" aria-hidden="true" /></span>
              {t.attorneyReview === "recommended" ? <span className="tint-chip tint-amber px-2 py-0.5 text-xs uppercase tracking-wide">Attorney review</span> : null}
            </div>
            <h2 className="mt-3 text-base font-bold">{t.title}</h2>
            <p className="mt-1 text-xs font-semibold text-muted">{t.category}</p>
            {t.description ? <p className="mt-2 text-sm text-muted">{t.description}</p> : null}
            <p className="mt-2 text-xs text-muted">{t.intendedUse}{t.lastUpdated ? ` · Updated ${formatDate(t.lastUpdated)}` : ""}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              <button type="button" className="ds-button ds-button-primary px-3 py-1.5 text-sm" onClick={() => setDownloaded((d) => ({ ...d, [t.id]: true }))}>
                <Download className="h-4 w-4" aria-hidden="true" />
                {downloaded[t.id] ? "Downloaded" : "Download"}
              </button>
              <button type="button" className="ds-button ds-button-secondary px-3 py-1.5 text-sm">Request GD review</button>
            </div>
          </article>
        ))}
      </div>
      {templates.length === 0 ? <p className="mt-6 text-muted">No templates match these filters.</p> : null}
      <p className="mt-6 flex items-start gap-2 text-xs text-muted">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Templates are general resources and are not a substitute for specific legal advice.
      </p>
    </div>
  );
}

/* ------------------------ Flat-fee project requests ----------------------- */

function ProjectsView({ route }: { route: RouteDefinition }) {
  const { store, activeUser } = useDemoStore();
  const orgId = activeUser?.organizationId;
  const requests = gdProjectRequestsData.filter((pr) => pr.organizationId === orgId);
  const attorney = (id?: string) => store.users.find((u) => u.id === id)?.name ?? "Unassigned";

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Standardized, scoped legal work at a predictable price. Review a package, then submit a request." />

      {requests.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Your project requests</h2>
          <div className="ds-card overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Project</th><th>Type</th><th>Assigned to</th><th>Status</th><th>Submitted</th></tr></thead>
              <tbody>
                {requests.map((pr) => (
                  <tr key={pr.id}>
                    <td className="font-semibold">{pr.title}</td>
                    <td className="text-muted">{pr.type}</td>
                    <td className="text-sm">{attorney(pr.assignedAttorneyUserId)}</td>
                    <td><StatusChip value={pr.status} /></td>
                    <td className="text-sm text-muted">{formatDate(pr.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Available packages</h2>
        <Link href="/app/gd/projects/new" className="ds-button ds-button-primary inline-flex px-4 py-2 text-sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Submit project request
        </Link>
      </div>
      <div className="stagger grid gap-4 md:grid-cols-2">
        {gdProjectCatalog.map((pc) => (
          <article key={pc.id} className="ds-card flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-bold">{pc.name}</h3>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-[color:var(--brand-accent)]"><DollarSign className="h-3.5 w-3.5" aria-hidden="true" />{pc.priceDisplay}</span>
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">Includes</p>
            <ul className="mt-1 space-y-1 text-sm">
              {pc.includes.map((it) => <li key={it} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />{it}</li>)}
            </ul>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">Not included</p>
            <p className="mt-1 text-sm text-muted">{pc.excludes.join("; ")}</p>
            <p className="mt-3 text-sm"><span className="font-semibold">Timeline:</span> {pc.timeline}</p>
            <p className="mt-1 text-sm text-muted">Required: {pc.requiredDocuments.join(", ")}</p>
            {pc.planNote ? <p className="mt-1 text-xs font-semibold text-[color:var(--brand-accent)]">{pc.planNote}</p> : null}
            <Link href="/app/gd/projects/new" className="ds-button ds-button-secondary mt-auto inline-flex px-3 py-1.5 pt-1.5 text-sm" style={{ marginTop: "1rem" }}>
              Request this project<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- Submit project ------------------------------- */

function SubmitProjectView({ route }: { route: RouteDefinition }) {
  const [type, setType] = useState(gdProjectTypes[0] ?? "");
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState("");
  const [deadline, setDeadline] = useState("");
  const [hardDeadline, setHardDeadline] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const reference = `PRJ-2026-${String(gdProjectRequestsData.length + 1).padStart(3, "0")}`;

  if (submitted) {
    return (
      <div className="narrow-shell">
        <section className="ds-card p-6">
          <CheckCircle2 className="h-10 w-10 text-[color:var(--brand-accent)]" aria-hidden="true" />
          <h1 className="page-title mt-3 text-2xl font-bold">Project request submitted</h1>
          <p className="mt-2 text-muted">This is a simulation; no real project was created.</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Reference</dt><dd className="mt-0.5 text-sm">{submitted}</dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Status</dt><dd className="mt-0.5"><StatusChip value="submitted" /></dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Type</dt><dd className="mt-0.5 text-sm">{type}</dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Next step</dt><dd className="mt-0.5 text-sm">GD will send scope, cost, and timeline for your approval.</dd></div>
          </dl>
          <div className="mt-5 flex gap-2">
            <Link href="/app/gd/projects" className="ds-button ds-button-primary px-4 py-2 text-sm">Back to projects</Link>
            <button type="button" className="ds-button ds-button-secondary px-4 py-2 text-sm" onClick={() => setSubmitted(null)}>Submit another</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="narrow-shell">
      <ScreenHeading route={route} description="Describe the project. GD will scope it and send cost and timeline before any work begins." />
      <section className="ds-card p-6">
        <label className="block text-xs font-bold uppercase tracking-wide text-muted">Project type</label>
        <select className="ds-field mt-1 w-full px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
          {gdProjectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-muted">Project goal</label>
        <textarea className="ds-field mt-1 w-full px-3 py-2 text-sm" rows={2} placeholder="What do you want completed?" value={goal} onChange={(e) => setGoal(e.target.value)} />

        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-muted">Business context</label>
        <textarea className="ds-field mt-1 w-full px-3 py-2 text-sm" rows={3} placeholder="Why is this needed? Who will use it? Is an external party waiting?" value={context} onChange={(e) => setContext(e.target.value)} />

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-muted">Desired completion date</label>
            <input type="date" className="ds-field mt-1 px-3 py-2 text-sm" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hardDeadline} onChange={(e) => setHardDeadline(e.target.checked)} />
            This is a hard deadline
          </label>
        </div>

        <p className="mt-4 text-xs text-muted">You can attach documents after submitting (simulation). GD provides scope and cost before work starts.</p>
        <button type="button" className="ds-button ds-button-primary mt-4 inline-flex px-4 py-2 text-sm" onClick={() => setSubmitted(reference)} disabled={!goal.trim()}>
          <Send className="h-4 w-4" aria-hidden="true" />
          Submit for GD review
        </button>
      </section>
    </div>
  );
}

/* --------------------------- Billing references --------------------------- */

function BillingRefView({ route }: { route: RouteDefinition }) {
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="A billing reference center. Detailed invoicing lives in Greenwald Doherty's billing system." />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="ds-card p-5">
          <div className="mb-3 flex items-center gap-2"><CreditCard className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Plan &amp; retainer reference</h2></div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-muted">Arrangement</dt><dd className="text-right">{gdBillingReference.arrangement}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Retainer</dt><dd className="inline-flex items-center gap-1 font-semibold"><DollarSign className="h-3.5 w-3.5" aria-hidden="true" />{gdBillingReference.retainerDisplay}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Flat-fee terms</dt><dd className="text-right">{gdBillingReference.flatFeeTerms}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Hourly</dt><dd className="text-right">{gdBillingReference.hourlyReference}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Payment schedule</dt><dd className="text-right">{gdBillingReference.paymentSchedule}</dd></div>
          </dl>
        </section>

        <section className="ds-card p-5">
          <div className="mb-3 flex items-center gap-2"><Mail className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Billing contacts</h2></div>
          <ul className="space-y-3">
            {gdBillingContacts.map((c) => (
              <li key={c.email} className="text-sm">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted">{c.role}</p>
                <p className="mt-1 inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" aria-hidden="true" />{c.email}</p>
                <p className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" aria-hidden="true" />{c.phone}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-bold">Invoice references</h2>
        <div className="ds-card overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Due</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {gdInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-semibold">{inv.number}</td>
                  <td className="text-sm text-muted">{inv.date ? formatDate(inv.date) : "—"}</td>
                  <td className="text-sm">{inv.amountDisplay}</td>
                  <td className="text-sm text-muted">{inv.dueDate ? formatDate(inv.dueDate) : "—"}</td>
                  <td><StatusChip value={inv.status} /></td>
                  <td>
                    {inv.external ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-accent)]"><ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />Open in Centerbase</span>
                    ) : (
                      <button type="button" className="ds-button ds-button-secondary px-3 py-1 text-xs" onClick={() => setDownloaded((d) => ({ ...d, [inv.id]: true }))}>
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />{downloaded[inv.id] ? "Downloaded" : "PDF"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 ds-card p-5">
        <h2 className="text-lg font-bold">Billing policies</h2>
        <ul className="mt-2 space-y-1.5 text-sm">
          {gdBillingPolicies.map((pol) => <li key={pol} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />{pol}</li>)}
        </ul>
      </section>
    </div>
  );
}

/* --------------------------- Included Signatrain seats -------------------- */

function SeatsView({ route }: { route: RouteDefinition }) {
  const { activeUser } = useDemoStore();
  const seats = gdSeats.organizationId === activeUser?.organizationId ? gdSeats : undefined;
  const [users, setUsers] = useState<SeatUser[]>(seats ? seats.assignedUsers : []);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [seatRole, setSeatRole] = useState("HR");
  const [notice, setNotice] = useState<string | null>(null);

  if (!seats) {
    return (
      <div className="content-shell">
        <ScreenHeading route={route} description="Included Signatrain seats." />
        <section className="ds-card p-6 text-center"><p className="text-muted">No included Signatrain seats for this organization.</p></section>
      </div>
    );
  }

  const assignedCount = users.filter((u) => u.status === "active").length;
  const pending = users.filter((u) => u.status === "invited").length;
  const available = Math.max(0, seats.totalIncluded - users.length);

  const invite = () => {
    if (!first.trim() || !email.trim() || available <= 0) return;
    setUsers((u) => [...u, { name: `${first} ${last}`.trim(), email, role: seatRole, status: "invited", lastLogin: "—", program: seatRole === "HR" ? "HR Compliance Path" : "Manager Core", progress: 0 }]);
    setNotice(`Invitation to ${email} added to the outbox (simulation).`);
    setFirst(""); setLast(""); setEmail("");
  };

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Signatrain seats included in your GD plan, and how they are assigned." />

      <div className="stagger mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Included seats" value={String(seats.totalIncluded)} tint="tint-brand" />
        <MiniStat label="Assigned" value={String(assignedCount)} tint="tint-blue" />
        <MiniStat label="Available" value={String(available)} tint="tint-emerald" />
        <MiniStat label="Pending invites" value={String(pending)} tint="tint-amber" />
      </div>

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold">Assigned users</h2>
        <div className="ds-card overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last login</th><th>Program</th><th>Progress</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email}>
                  <td className="font-semibold">{u.name}</td>
                  <td className="text-sm text-muted">{u.email}</td>
                  <td className="text-sm">{u.role}</td>
                  <td><StatusChip value={u.status} /></td>
                  <td className="text-sm text-muted">{u.lastLogin}</td>
                  <td className="text-sm">{u.program}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="progress-track h-2 w-24"><div className="progress-fill" style={{ width: `${u.progress}%` }} /></div>
                      <span className="text-xs text-muted">{u.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="ds-card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2"><UserPlus className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Invite a user to a seat</h2></div>
          {available <= 0 ? <p className="mb-3 text-sm text-[color:var(--brand-warm)]">All included seats are used. Request more below.</p> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="ds-field px-3 py-2 text-sm" placeholder="First name" value={first} onChange={(e) => setFirst(e.target.value)} />
            <input className="ds-field px-3 py-2 text-sm" placeholder="Last name" value={last} onChange={(e) => setLast(e.target.value)} />
            <input className="ds-field px-3 py-2 text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className="ds-field px-3 py-2 text-sm" value={seatRole} onChange={(e) => setSeatRole(e.target.value)}>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <button type="button" className="ds-button ds-button-primary mt-3 inline-flex px-4 py-2 text-sm" onClick={invite} disabled={available <= 0 || !first.trim() || !email.trim()}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add to seat
          </button>
          {notice ? <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[color:var(--brand-accent)]"><Mail className="h-3.5 w-3.5" aria-hidden="true" />{notice}</p> : null}
        </section>

        <section className="ds-card p-5">
          <div className="mb-2 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Need more?</h2></div>
          <p className="text-sm text-muted">Expand training access or manage learning in the Signatrain portal.</p>
          <button type="button" className="ds-button ds-button-secondary mt-3 w-full px-4 py-2 text-sm">Request additional seats</button>
          <Link href="/app/signatrain" className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--brand-accent)]"><ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />Open Signatrain portal</Link>
        </section>
      </div>
    </div>
  );
}


/* =========================== SignaTrain: Phase A ========================== */

interface CourseMeta {
  courseId: string;
  description: string;
  level: string;
  durationMinutes: number;
  audienceLabel: string;
  assignedBy: string;
  dueAt?: string | null;
  certificate: boolean;
  objectives: string[];
  moduleTitles: { title: string; type: string; durationMinutes: number }[];
  certificateCriteria: string[];
}
interface ScenarioOption { text: string; outcome: string; feedback: string; risk: boolean }
interface ScenarioMeta {
  scenarioId: string;
  difficulty: string;
  overview: string;
  objectives: string[];
  structure: string[];
  decisionPoints: { prompt: string; options: ScenarioOption[] }[];
  result: { score: number; strengths: string[]; riskAreas: string[]; recommended: string };
}
interface ProgramMeta {
  programId: string;
  description: string;
  skillAreas: { name: string; level: string }[];
  timeline: { label: string; done: boolean }[];
  recommended: string[];
}
interface Assignment {
  id: string;
  userId: string;
  kind: string;
  refId: string;
  status: string;
  dueAt?: string | null;
  assignedBy: string;
  progress: number;
}
interface StModule { id: string; courseId: string; order: number; title: string; contentBlocks: string[]; status: string }
interface StVideo { id: string; title: string; durationSeconds: number; poster?: string }
interface StProgram { id: string; title: string; audience: string; requiredCourseIds: string[]; requiredSessionTypes: string[]; certificateTemplate: string }
interface ModuleQuiz { moduleId: string; passScore: number; questions: { q: string; options: string[]; answer: number; feedback: string }[] }

const stModules = signatrainContentJson.modules as unknown as StModule[];
const stVideos = signatrainContentJson.videos as unknown as StVideo[];
const stPrograms = signatrainContentJson.programs as unknown as StProgram[];
const courseMetaList = signatrainContentJson.courseMeta as unknown as CourseMeta[];
const scenarioMetaList = signatrainContentJson.scenarioMeta as unknown as ScenarioMeta[];
const programMetaList = signatrainContentJson.programMeta as unknown as ProgramMeta[];
const moduleQuizzes = signatrainContentJson.moduleQuizzes as unknown as ModuleQuiz[];
const stAssignments = learningProgressJson.assignments as unknown as Assignment[];

function skillTint(level: string): string {
  const l = level.toLowerCase();
  if (l.includes("strong")) return "tint-emerald";
  if (l.includes("good")) return "tint-blue";
  return "tint-amber";
}

/* ---------------------------- SignaTrain dashboard ------------------------ */

function SignatrainDashboardView({ route }: { route: RouteDefinition }) {
  const { store, activeUser } = useDemoStore();
  const mine = stAssignments.filter((a) => a.userId === activeUser?.id);
  const programAsg = mine.filter((a) => a.kind === "program");
  const courseAsg = mine.filter((a) => a.kind === "course");
  const courseTitle = (id: string) => store.courses.find((c) => c.id === id)?.title ?? id;
  const programTitle = (id: string) => stPrograms.find((pr) => pr.id === id)?.title ?? id;
  const cMeta = (id: string) => courseMetaList.find((m) => m.courseId === id);

  const inProgress = courseAsg.filter((a) => a.status === "in_progress").sort((a, b) => b.progress - a.progress);
  const cont = inProgress[0];
  const contMeta = cont ? cMeta(cont.refId) : undefined;
  const nextModule =
    cont && contMeta && contMeta.moduleTitles.length
      ? contMeta.moduleTitles[Math.min(contMeta.moduleTitles.length - 1, Math.floor((cont.progress / 100) * contMeta.moduleTitles.length))]
      : undefined;

  const completed = courseAsg.filter((a) => a.status === "completed").length;
  const active = courseAsg.filter((a) => a.status === "in_progress").length;
  const overdue = courseAsg.filter((a) => a.status === "overdue").length;
  const certs = store.certificates.filter((c) => c.userId === activeUser?.id).length;
  const upcoming = [...store.liveSessions]
    .filter((ls) => ls.status === "registration_open" || ls.status === "scheduled")
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 3);

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Pick up where you left off, see what's assigned, and track your overall progress." />

      {cont ? (
        <section className="ds-card mb-6 p-5 tint-brand">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Continue learning</p>
              <h2 className="mt-1 text-xl font-bold">{courseTitle(cont.refId)}</h2>
              {nextModule ? <p className="mt-1 text-sm text-muted">Next: {nextModule.title} · {nextModule.durationMinutes} min</p> : null}
              <div className="progress-track mt-3 h-2 max-w-md"><div className="progress-fill" style={{ width: `${cont.progress}%` }} /></div>
              <p className="mt-1 text-xs text-muted">{cont.progress}% complete</p>
            </div>
            <Link href={`/app/signatrain/courses/${cont.refId}`} className="ds-button ds-button-primary inline-flex px-5 py-2.5">
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Continue
            </Link>
          </div>
        </section>
      ) : null}

      <div className="stagger mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MiniStat label="Completed" value={String(completed)} tint="tint-emerald" />
        <MiniStat label="Active courses" value={String(active)} tint="tint-blue" />
        <MiniStat label="Certificates" value={String(certs)} tint="tint-violet" />
        <MiniStat label="Overdue" value={String(overdue)} tint={overdue > 0 ? "tint-rose" : "tint-brand"} />
        <MiniStat label="Avg. score" value="89%" tint="tint-cyan" />
      </div>

      {programAsg.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Assigned programs</h2>
          <div className="stagger grid gap-4 md:grid-cols-2">
            {programAsg.map((a) => (
              <Link key={a.id} href={`/app/signatrain/programs/${a.refId}`} className="ds-card ds-card-interactive block p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2"><Award className="h-5 w-5 text-[color:var(--brand-accent)]" aria-hidden="true" /><h3 className="font-bold">{programTitle(a.refId)}</h3></div>
                  <StatusChip value={a.status} />
                </div>
                <div className="progress-track mt-3 h-2"><div className="progress-fill" style={{ width: `${a.progress}%` }} /></div>
                <p className="mt-1 text-xs text-muted">{a.progress}% complete{a.dueAt ? ` · due ${formatDate(a.dueAt)}` : ""}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold">Assigned courses</h2>
        <div className="ds-card overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Course</th><th>Status</th><th>Progress</th><th>Certificate</th><th>Due</th></tr></thead>
            <tbody>
              {courseAsg.map((a) => {
                const m = cMeta(a.refId);
                return (
                  <tr key={a.id}>
                    <td><Link href={`/app/signatrain/courses/${a.refId}`} className="font-bold text-[color:var(--brand-accent)] hover:underline">{courseTitle(a.refId)}</Link></td>
                    <td><StatusChip value={a.status} /></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-track h-2 w-24"><div className="progress-fill" style={{ width: `${a.progress}%` }} /></div>
                        <span className="text-xs text-muted">{a.progress}%</span>
                      </div>
                    </td>
                    <td>{m?.certificate ? <span className="inline-flex items-center gap-1 text-sm"><Award className="h-3.5 w-3.5" aria-hidden="true" />Yes</span> : <span className="text-sm text-muted">No</span>}</td>
                    <td className="text-sm text-muted">{a.dueAt ? formatDate(a.dueAt) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {upcoming.length > 0 ? (
        <section>
          <h2 className="mb-3 text-lg font-bold">Upcoming live sessions</h2>
          <div className="stagger grid gap-3 md:grid-cols-3">
            {upcoming.map((ls) => (
              <article key={ls.id} className="ds-card p-4 tint-cyan">
                <p className="font-bold">{ls.title}</p>
                <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted"><CalendarDays className="h-4 w-4" aria-hidden="true" />{formatDateTime(ls.startsAt)}</p>
                <p className="mt-1 text-xs text-muted">{ls.durationMinutes} min · {SESSION_TYPE_LABELS[ls.type]}</p>
                <Link href={`/app/signatrain/live/${ls.id}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--brand-accent)]">View details<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

/* ----------------------------- Course overview ---------------------------- */

function CourseOverviewView({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  const { store, activeUser } = useDemoStore();
  const courseId = decodeURIComponent(pathname.split("/").pop() ?? "");
  const course = store.courses.find((c) => c.id === courseId);
  const meta = courseMetaList.find((m) => m.courseId === courseId);
  const asg = stAssignments.find((a) => a.userId === activeUser?.id && a.refId === courseId);
  const progress = asg?.progress ?? 0;
  const realModules = stModules.filter((m) => m.courseId === courseId).sort((a, b) => a.order - b.order);
  const firstModule = realModules[0];

  if (!course) {
    return (
      <div className="narrow-shell">
        <section className="ds-card p-6">
          <BookOpen className="h-8 w-8 opacity-40" aria-hidden="true" />
          <h1 className="page-title mt-3 text-2xl font-bold">Course not found</h1>
          <Link href="/app/signatrain/library" className="ds-button ds-button-primary mt-5 inline-flex px-4 py-2">Back to library</Link>
        </section>
      </div>
    );
  }

  const moduleRows = realModules.length
    ? realModules.map((m) => ({ title: m.title, type: m.contentBlocks[0]?.split("_")[0] ?? "content", durationMinutes: 0, id: m.id }))
    : (meta?.moduleTitles ?? []).map((m, i) => ({ ...m, id: `m${i}` }));

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Everything in this course: what it covers, the modules, and how to earn the certificate." />

      <section className="ds-card mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{course.title}</h2>
            <p className="mt-1 text-sm text-muted">{course.topic} · {meta?.audienceLabel ?? course.audience}{meta?.level ? ` · ${meta.level}` : ""}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusChip value={asg?.status ?? course.status} />
            {meta?.certificate ? <span className="tint-chip tint-emerald px-2 py-0.5 text-xs uppercase tracking-wide">Certificate</span> : null}
          </div>
        </div>
        <div className="progress-track mt-4 h-2 max-w-md"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <p className="mt-1 text-xs text-muted">{progress}% complete</p>
        <dl className="mt-4 grid gap-3 border-t border-[color:var(--hairline,rgba(0,0,0,0.08))] pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Modules</dt><dd className="mt-0.5 text-sm">{moduleRows.length}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Duration</dt><dd className="mt-0.5 text-sm">{meta?.durationMinutes ?? "—"} min</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Assigned by</dt><dd className="mt-0.5 text-sm">{meta?.assignedBy ?? "—"}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Due date</dt><dd className="mt-0.5 text-sm">{meta?.dueAt ? formatDate(meta.dueAt) : "—"}</dd></div>
        </dl>
        <div className="mt-4">
          {firstModule ? (
            <Link href={`/app/signatrain/learn/${courseId}/${firstModule.id}`} className="ds-button ds-button-primary inline-flex px-5 py-2.5">
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              {progress > 0 ? "Continue course" : "Start course"}
            </Link>
          ) : (
            <span className="ds-button ds-button-secondary inline-flex px-5 py-2.5 opacity-60">Content coming soon</span>
          )}
        </div>
      </section>

      {meta?.description ? <section className="ds-card mb-6 p-5"><h3 className="font-bold">About this course</h3><p className="mt-2 text-sm text-muted">{meta.description}</p></section> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h3 className="mb-3 text-lg font-bold">Curriculum</h3>
          <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))]">
            {moduleRows.map((m, i) => (
              <div key={m.id} className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-accent)] text-xs font-bold text-white">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{m.title}</p>
                    <p className="text-xs uppercase tracking-wide text-muted">{m.type}{m.durationMinutes ? ` · ${m.durationMinutes} min` : ""}</p>
                  </div>
                </div>
                {realModules[i] ? (
                  <Link href={`/app/signatrain/learn/${courseId}/${realModules[i].id}`} className="text-sm font-bold text-[color:var(--brand-accent)] hover:underline">Open</Link>
                ) : (
                  <Circle className="h-4 w-4 text-muted" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-6">
          {meta?.objectives?.length ? (
            <div>
              <div className="mb-2 flex items-center gap-2"><Target className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h3 className="font-bold">Learning objectives</h3></div>
              <ul className="ds-card space-y-2 p-4 text-sm">
                {meta.objectives.map((o) => <li key={o} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />{o}</li>)}
              </ul>
            </div>
          ) : null}
          {meta?.certificate && meta.certificateCriteria.length ? (
            <div>
              <div className="mb-2 flex items-center gap-2"><Award className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h3 className="font-bold">Certificate criteria</h3></div>
              <ul className="ds-card space-y-2 p-4 text-sm">
                {meta.certificateCriteria.map((cc) => <li key={cc} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />{cc}</li>)}
              </ul>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

/* ----------------------------- Learning player ---------------------------- */

function LearningPlayerView({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  const parts = pathname.split("/");
  const moduleId = decodeURIComponent(parts[parts.length - 1] ?? "");
  const courseId = decodeURIComponent(parts[parts.length - 2] ?? "");
  const { store } = useDemoStore();
  const course = store.courses.find((c) => c.id === courseId);
  const modules = stModules.filter((m) => m.courseId === courseId).sort((a, b) => a.order - b.order);
  const idx = modules.findIndex((m) => m.id === moduleId);
  const mod = modules[idx];
  const prev = idx > 0 ? modules[idx - 1] : undefined;
  const next = idx >= 0 && idx < modules.length - 1 ? modules[idx + 1] : undefined;

  const quiz = moduleQuizzes.find((q) => q.moduleId === moduleId);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [graded, setGraded] = useState(false);

  if (!course || !mod) {
    return (
      <div className="narrow-shell">
        <section className="ds-card p-6">
          <PlayCircle className="h-8 w-8 opacity-40" aria-hidden="true" />
          <h1 className="page-title mt-3 text-2xl font-bold">Lesson not found</h1>
          <Link href="/app/signatrain/library" className="ds-button ds-button-primary mt-5 inline-flex px-4 py-2">Back to library</Link>
        </section>
      </div>
    );
  }

  const blocks = mod.contentBlocks;
  const hasVideo = blocks.some((b) => b.startsWith("video"));
  const hasReading = blocks.some((b) => b.startsWith("doc") || b.startsWith("text"));
  const video = stVideos.find((v) => blocks.includes(v.id));
  const score = quiz ? Math.round((quiz.questions.filter((q, i) => answers[i] === q.answer).length / quiz.questions.length) * 100) : 0;

  return (
    <div className="content-shell">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{course.title}</p>
          <h1 className="page-title text-2xl font-bold">{mod.title}</h1>
        </div>
        <Link href={`/app/signatrain/courses/${courseId}`} className="text-sm font-bold text-[color:var(--brand-accent)] hover:underline">Course overview</Link>
      </div>
      <div className="progress-track mb-6 h-2"><div className="progress-fill" style={{ width: `${Math.round(((idx + 1) / modules.length) * 100)}%` }} /></div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {hasVideo ? (
            <section className="ds-card overflow-hidden">
              <div className="flex aspect-video items-center justify-center bg-[color:var(--brand-shell,#0f1f3a)]">
                <PlayCircle className="h-16 w-16 text-white/80" aria-hidden="true" />
              </div>
              <div className="p-5">
                <h3 className="font-bold">{video?.title ?? "Lesson video"}</h3>
                <p className="mt-1 text-xs text-muted">{video ? `${Math.round(video.durationSeconds / 60)} min` : ""}</p>
                <p className="mt-3 text-sm text-muted">Transcript: In this lesson we walk through the key decision points and how to apply them on the job. Use the outline to revisit any section.</p>
              </div>
            </section>
          ) : null}

          {hasReading ? (
            <section className="ds-card p-5">
              <div className="mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h3 className="font-bold">Reading</h3></div>
              <p className="text-sm text-muted">This module includes a short reading with the core concepts, examples, and a downloadable reference. Review it before moving on.</p>
            </section>
          ) : null}

          {quiz ? (
            <section className="ds-card p-5">
              <h3 className="font-bold">Knowledge check</h3>
              <div className="mt-3 space-y-4">
                {quiz.questions.map((q, qi) => (
                  <div key={qi}>
                    <p className="text-sm font-semibold">{qi + 1}. {q.q}</p>
                    <div className="mt-2 space-y-1.5">
                      {q.options.map((opt, oi) => {
                        const selected = answers[qi] === oi;
                        const correct = graded && oi === q.answer;
                        const wrong = graded && selected && oi !== q.answer;
                        return (
                          <button key={oi} type="button" onClick={() => !graded && setAnswers((a) => ({ ...a, [qi]: oi }))}
                            className={`ds-field block w-full px-3 py-2 text-left text-sm ${selected ? "tint-brand" : ""} ${correct ? "tint-emerald" : ""} ${wrong ? "tint-rose" : ""}`}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {graded ? <p className="mt-1 text-xs text-muted">{q.feedback}</p> : null}
                  </div>
                ))}
              </div>
              {graded ? (
                <p className={`mt-4 font-bold ${score >= quiz.passScore ? "text-[color:var(--brand-accent)]" : "text-[color:var(--brand-warm)]"}`}>
                  Score: {score}% — {score >= quiz.passScore ? "Passed" : `Need ${quiz.passScore}% to pass`}
                </p>
              ) : (
                <button type="button" className="ds-button ds-button-primary mt-4 px-4 py-2 text-sm" onClick={() => setGraded(true)} disabled={Object.keys(answers).length < quiz.questions.length}>Submit answers</button>
              )}
            </section>
          ) : null}

          <div className="flex items-center justify-between">
            {prev ? (
              <Link href={`/app/signatrain/learn/${courseId}/${prev.id}`} className="ds-button ds-button-secondary inline-flex px-4 py-2 text-sm"><ChevronLeft className="h-4 w-4" aria-hidden="true" />Previous</Link>
            ) : <span />}
            {next ? (
              <Link href={`/app/signatrain/learn/${courseId}/${next.id}`} className="ds-button ds-button-primary inline-flex px-4 py-2 text-sm">Next<ChevronRight className="h-4 w-4" aria-hidden="true" /></Link>
            ) : (
              <Link href={`/app/signatrain/courses/${courseId}`} className="ds-button ds-button-primary inline-flex px-4 py-2 text-sm"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Finish</Link>
            )}
          </div>
        </div>

        <aside>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">Course outline</h3>
          <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))]">
            {modules.map((m, i) => (
              <Link key={m.id} href={`/app/signatrain/learn/${courseId}/${m.id}`} className={`flex items-center gap-3 p-3 text-sm ${m.id === moduleId ? "font-bold" : ""}`}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${i <= idx ? "bg-[color:var(--brand-accent)] text-white" : "bg-[color:var(--surface-muted,#e5e7eb)] text-muted"}`}>{i + 1}</span>
                {m.title}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* --------------------------- Standalone scenario -------------------------- */

function ScenarioDetailView({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  const { store } = useDemoStore();
  const scenarioId = decodeURIComponent(pathname.split("/").pop() ?? "");
  const scenario = store.scenarios.find((sc) => sc.id === scenarioId);
  const meta = scenarioMetaList.find((m) => m.scenarioId === scenarioId);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);

  if (!scenario) {
    return (
      <div className="narrow-shell">
        <section className="ds-card p-6">
          <h1 className="page-title text-2xl font-bold">Scenario not found</h1>
          <Link href="/app/signatrain/library" className="ds-button ds-button-primary mt-4 inline-flex px-4 py-2">Back to library</Link>
        </section>
      </div>
    );
  }

  const dp = meta?.decisionPoints ?? [];
  const current = dp[step];
  const chosen = choice !== null && current ? current.options[choice] : null;

  const advance = () => {
    if (step < dp.length - 1) { setStep(step + 1); setChoice(null); }
    else { setStarted(false); setStep(0); setChoice(null); }
  };

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Practice a realistic situation: make decisions, see the consequences, and get feedback." />

      <section className="ds-card mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{scenario.title}</h2>
            <p className="mt-1 text-sm text-muted">{scenario.topic} · {scenario.audiences.join(" + ")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {meta?.difficulty ? <span className="tint-chip tint-blue px-2 py-0.5 text-xs uppercase tracking-wide">{meta.difficulty}</span> : null}
            <span className="text-sm text-muted">{scenario.durationMinutes} min</span>
          </div>
        </div>
      </section>

      {!started ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="ds-card p-5"><h3 className="font-bold">Scenario overview</h3><p className="mt-2 text-sm text-muted">{meta?.overview ?? scenario.summary}</p></section>
            {meta?.structure?.length ? (
              <section className="ds-card p-5">
                <h3 className="font-bold">What this scenario includes</h3>
                <ol className="mt-2 flex flex-wrap gap-2 text-xs">
                  {meta.structure.map((st) => <li key={st} className="ds-pill px-2 py-1">{st}</li>)}
                </ol>
              </section>
            ) : null}
          </div>
          <section>
            {meta?.objectives?.length ? (
              <>
                <div className="mb-2 flex items-center gap-2"><Target className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h3 className="font-bold">You will learn to</h3></div>
                <ul className="ds-card space-y-2 p-4 text-sm">
                  {meta.objectives.map((o) => <li key={o} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />{o}</li>)}
                </ul>
              </>
            ) : null}
            <button type="button" className="ds-button ds-button-primary mt-4 inline-flex w-full justify-center px-5 py-2.5" onClick={() => { setStarted(true); setStep(0); setChoice(null); }} disabled={dp.length === 0}>
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              {dp.length ? "Start scenario" : "Coming soon"}
            </button>
          </section>
        </div>
      ) : (
        <section className="ds-card p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Decision point {step + 1} of {dp.length}</p>
          <h3 className="mt-1 text-lg font-bold">{current?.prompt}</h3>
          <div className="mt-3 space-y-2">
            {current?.options.map((opt, oi) => {
              const isChosen = choice === oi;
              return (
                <button key={oi} type="button" onClick={() => setChoice(oi)}
                  className={`ds-field block w-full px-3 py-2 text-left text-sm ${isChosen ? (opt.risk ? "tint-rose" : "tint-emerald") : ""}`}>
                  {opt.text}
                </button>
              );
            })}
          </div>
          {chosen ? (
            <div className={`mt-4 ds-card p-4 ${chosen.risk ? "tint-rose" : "tint-emerald"}`}>
              <p className="text-sm font-bold">{chosen.risk ? "Risky choice" : "Good choice"}</p>
              <p className="mt-1 text-sm">{chosen.feedback}</p>
              <button type="button" className="ds-button ds-button-primary mt-3 px-4 py-2 text-sm" onClick={advance}>
                {step < dp.length - 1 ? "Next decision" : "Finish scenario"}
              </button>
            </div>
          ) : null}
        </section>
      )}

      {meta && meta.result.score > 0 ? (
        <section className="ds-card mt-6 p-5">
          <h3 className="font-bold">Your last result</h3>
          <div className="mt-2 flex flex-wrap gap-6 text-sm">
            <div><p className="text-xs uppercase tracking-wide text-muted">Score</p><p className="text-2xl font-extrabold">{meta.result.score}%</p></div>
            <div><p className="text-xs uppercase tracking-wide text-muted">Strengths</p><p>{meta.result.strengths.join(", ") || "—"}</p></div>
            <div><p className="text-xs uppercase tracking-wide text-muted">Risk areas</p><p>{meta.result.riskAreas.join(", ") || "—"}</p></div>
          </div>
          <p className="mt-3 text-sm text-muted">Recommended next: {meta.result.recommended}</p>
        </section>
      ) : null}
    </div>
  );
}

/* ----------------------------- Program progress --------------------------- */

function ProgramProgressView({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  const { store, activeUser } = useDemoStore();
  const programId = decodeURIComponent(pathname.split("/").pop() ?? "");
  const program = stPrograms.find((pr) => pr.id === programId);
  const meta = programMetaList.find((m) => m.programId === programId);
  const asg = stAssignments.find((a) => a.userId === activeUser?.id && a.refId === programId);
  const progress = asg?.progress ?? 0;
  const courseTitle = (id: string) => store.courses.find((c) => c.id === id)?.title ?? id;

  if (!program) {
    return (
      <div className="narrow-shell">
        <section className="ds-card p-6">
          <h1 className="page-title text-2xl font-bold">Program not found</h1>
          <Link href="/app/signatrain" className="ds-button ds-button-primary mt-4 inline-flex px-4 py-2">Back to dashboard</Link>
        </section>
      </div>
    );
  }

  const doneSteps = meta?.timeline.filter((t) => t.done).length ?? 0;
  const totalSteps = meta?.timeline.length ?? 0;

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Your progress across the whole program — modules, sessions, skills, and what to do next." />

      <section className="ds-card mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2"><Award className="h-6 w-6 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-2xl font-bold">{program.title}</h2></div>
          <StatusChip value={asg?.status ?? "in_progress"} />
        </div>
        <div className="progress-track mt-4 h-2 max-w-md"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <p className="mt-1 text-xs text-muted">{progress}% complete · {doneSteps} of {totalSteps} steps done</p>
        {meta?.description ? <p className="mt-3 text-sm text-muted">{meta.description}</p> : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h3 className="mb-3 text-lg font-bold">Program timeline</h3>
          <div className="ds-card p-5">
            <ul className="space-y-4">
              {meta?.timeline.map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  {t.done ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />}
                  <span className={`text-sm ${t.done ? "" : "text-muted"}`}>{t.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="mb-3 mt-6 text-lg font-bold">Required courses</h3>
          <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))]">
            {program.requiredCourseIds.map((cid) => (
              <div key={cid} className="flex items-center justify-between gap-3 p-4">
                <span className="font-semibold">{courseTitle(cid)}</span>
                <Link href={`/app/signatrain/courses/${cid}`} className="text-sm font-bold text-[color:var(--brand-accent)] hover:underline">Open</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2"><Target className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h3 className="font-bold">Skill breakdown</h3></div>
            <div className="ds-card space-y-2 p-4">
              {meta?.skillAreas.map((sk) => (
                <div key={sk.name} className="flex items-center justify-between gap-3 text-sm">
                  <span>{sk.name}</span>
                  <span className={`tint-chip px-2 py-0.5 text-xs uppercase tracking-wide ${skillTint(sk.level)}`}>{sk.level}</span>
                </div>
              ))}
            </div>
          </div>
          {meta?.recommended?.length ? (
            <div>
              <h3 className="mb-2 font-bold">Recommended next steps</h3>
              <ul className="ds-card space-y-2 p-4 text-sm">
                {meta.recommended.map((r) => <li key={r} className="flex items-start gap-2"><ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />{r}</li>)}
              </ul>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}


/* =========================== SignaTrain: Phase B ========================== */

interface SessionMeta {
  sessionId: string;
  description: string;
  agenda: string[];
  whoShouldAttend: string[];
  prep: string[];
  facilitatorName: string;
  capacity: number;
  seatsAvailable: number;
  certificateCredit: boolean;
}
interface CohortRec {
  id: string;
  name: string;
  organizationId: string;
  status: string;
  participantUserIds: string[];
  sessionIds: string[];
  specialScenarioIds: string[];
  brandingMode: string;
}
interface Registration { id: string; sessionId: string; userId: string; status: string; zoomRegistrationId: string }
interface Attendance { id: string; sessionId: string; userId: string; scheduledMinutes: number; attendedMinutes: number; completion: boolean }
interface CohortMeta {
  cohortId: string;
  startDate: string;
  endDate: string;
  facilitatorName: string;
  currentWeek: number;
  participantsCount: number;
  progress: number;
  nextSessionId: string;
  schedule: { week: number; label: string; done: boolean }[];
  assignments: { title: string; status: string }[];
  announcements: { at: string; text: string }[];
}
interface BotPromptRec { prompt: string; answer: string; links: { label: string; href: string }[] }
interface CertDetail {
  certId: string;
  issuer: string;
  expiresAt: string;
  verificationId: string;
  score: number;
  durationMinutes: number;
  instructor: string;
  modulesCompleted: number;
  renewalNote: string;
}

const sessionMetaList = sessionsCohortsJson.sessionMeta as unknown as SessionMeta[];
const stCohorts = sessionsCohortsJson.cohorts as unknown as CohortRec[];
const stRegistrations = sessionsCohortsJson.registrations as unknown as Registration[];
const stAttendance = sessionsCohortsJson.attendance as unknown as Attendance[];
const cohortMetaList = sessionsCohortsJson.cohortMeta as unknown as CohortMeta[];
const botPromptList = signatrainContentJson.botPrompts as unknown as BotPromptRec[];
const certDetailsList = learningProgressJson.certDetails as unknown as CertDetail[];

/* --------------------------- Live-session detail -------------------------- */

function LiveSessionDetailView({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  const { store, activeUser } = useDemoStore();
  const sessionId = decodeURIComponent(pathname.split("/").pop() ?? "");
  const session = store.liveSessions.find((ls) => ls.id === sessionId);
  const meta = sessionMetaList.find((m) => m.sessionId === sessionId);
  const existingReg = stRegistrations.find((r) => r.sessionId === sessionId && r.userId === activeUser?.id);
  const attendance = stAttendance.find((a) => a.sessionId === sessionId && a.userId === activeUser?.id);
  const [registered, setRegistered] = useState(existingReg?.status === "registered");

  if (!session) {
    return (
      <div className="narrow-shell">
        <section className="ds-card p-6">
          <Video className="h-8 w-8 opacity-40" aria-hidden="true" />
          <h1 className="page-title mt-3 text-2xl font-bold">Session not found</h1>
          <Link href="/app/signatrain/live" className="ds-button ds-button-primary mt-5 inline-flex px-4 py-2">Back to catalog</Link>
        </section>
      </div>
    );
  }

  const faculty = session.facultyUserIds.map((id) => store.users.find((u) => u.id === id)?.name).filter(Boolean).join(", ") || meta?.facilitatorName || "Facilitator";
  const isCompleted = session.status === "completed";
  const canRegister = ["registration_open", "scheduled"].includes(session.status);

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Live-session details, agenda, preparation, and registration." />

      <section className="ds-card mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{session.title}</h2>
            <p className="mt-1 text-sm text-muted">{SESSION_TYPE_LABELS[session.type]} · {session.audience}</p>
          </div>
          <StatusChip value={session.status} />
        </div>
        <dl className="mt-4 grid gap-3 border-t border-[color:var(--hairline,rgba(0,0,0,0.08))] pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">When</dt><dd className="mt-0.5 text-sm">{formatDateTime(session.startsAt)}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Duration</dt><dd className="mt-0.5 text-sm">{session.durationMinutes} min</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Facilitator</dt><dd className="mt-0.5 text-sm">{faculty}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Seats</dt><dd className="mt-0.5 text-sm">{meta ? `${meta.seatsAvailable} of ${meta.capacity} open` : "—"}</dd></div>
        </dl>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {isCompleted ? (
            session.recordingStatus === "recording_published" ? (
              <button type="button" className="ds-button ds-button-primary inline-flex px-4 py-2 text-sm"><PlayCircle className="h-4 w-4" aria-hidden="true" />Watch replay</button>
            ) : <span className="text-sm text-muted">Recording not yet available.</span>
          ) : registered ? (
            <>
              <button type="button" className="ds-button ds-button-primary inline-flex px-4 py-2 text-sm"><Video className="h-4 w-4" aria-hidden="true" />Join session</button>
              <button type="button" className="ds-button ds-button-secondary px-4 py-2 text-sm" onClick={() => setRegistered(false)}>Cancel registration</button>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--brand-accent)]"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />You're registered</span>
            </>
          ) : canRegister ? (
            <button type="button" className="ds-button ds-button-primary inline-flex px-4 py-2 text-sm" onClick={() => setRegistered(true)}><CalendarDays className="h-4 w-4" aria-hidden="true" />Register</button>
          ) : <span className="text-sm text-muted">Registration is not open.</span>}
          {meta?.certificateCredit ? <span className="tint-chip tint-emerald px-2 py-0.5 text-xs uppercase tracking-wide">Certificate credit</span> : null}
        </div>
      </section>

      {meta ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="ds-card p-5"><h3 className="font-bold">About this session</h3><p className="mt-2 text-sm text-muted">{meta.description}</p></section>
            <section className="ds-card p-5">
              <h3 className="font-bold">Agenda</h3>
              <ol className="mt-2 space-y-1.5 text-sm">
                {meta.agenda.map((a, i) => <li key={a} className="flex gap-2"><span className="text-muted">{i + 1}.</span>{a}</li>)}
              </ol>
            </section>
            {isCompleted ? (
              <section className="ds-card p-5">
                <h3 className="font-bold">After the session</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-muted">
                  <li>Attendance: {attendance ? `${attendance.attendedMinutes}/${attendance.scheduledMinutes} min — ${attendance.completion ? "counts toward completion" : "below threshold"}` : "Not recorded"}</li>
                  <li>Resources and session notes are available with the replay.</li>
                </ul>
                <button type="button" className="ds-button ds-button-secondary mt-3 px-4 py-2 text-sm">Leave feedback</button>
              </section>
            ) : null}
          </div>
          <section className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-2"><Users className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h3 className="font-bold">Who should attend</h3></div>
              <ul className="ds-card space-y-1.5 p-4 text-sm">{meta.whoShouldAttend.map((w) => <li key={w}>{w}</li>)}</ul>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h3 className="font-bold">Preparation</h3></div>
              <ul className="ds-card space-y-1.5 p-4 text-sm">{meta.prep.map((w) => <li key={w} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />{w}</li>)}</ul>
            </div>
          </section>
        </div>
      ) : null}
      <div className="mt-6"><Link href="/app/signatrain/live" className="text-sm font-bold text-[color:var(--brand-accent)] hover:underline">← Back to catalog</Link></div>
    </div>
  );
}

/* ------------------------------ Private cohort ---------------------------- */

function PrivateCohortView({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  const { store, activeUser } = useDemoStore();
  const cohortId = decodeURIComponent(pathname.split("/").pop() ?? "");
  const cohort = stCohorts.find((c) => c.id === cohortId);
  const meta = cohortMetaList.find((m) => m.cohortId === cohortId);
  const org = store.organizations.find((o) => o.id === cohort?.organizationId);
  const internal = isInternalUser(activeUser);
  const nextSession = meta ? store.liveSessions.find((ls) => ls.id === meta.nextSessionId) : undefined;
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState(false);

  if (!cohort) {
    return (
      <div className="narrow-shell">
        <section className="ds-card p-6">
          <Users className="h-8 w-8 opacity-40" aria-hidden="true" />
          <h1 className="page-title mt-3 text-2xl font-bold">Cohort not found</h1>
          <Link href="/app/signatrain" className="ds-button ds-button-primary mt-5 inline-flex px-4 py-2">Back to dashboard</Link>
        </section>
      </div>
    );
  }

  const roster = cohort.participantUserIds.map((id) => store.users.find((u) => u.id === id)).filter(Boolean);

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="A private, company cohort moving through the program together." />

      <section className="ds-card mb-6 p-5">
        <h2 className="text-2xl font-bold">{cohort.name}</h2>
        <p className="mt-1 text-sm text-muted">{org?.name ?? "Company"} · Facilitator {meta?.facilitatorName ?? "—"}</p>
        <dl className="mt-4 grid gap-3 border-t border-[color:var(--hairline,rgba(0,0,0,0.08))] pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Dates</dt><dd className="mt-0.5 text-sm">{meta ? `${formatDate(meta.startDate)} – ${formatDate(meta.endDate)}` : "—"}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Participants</dt><dd className="mt-0.5 text-sm">{meta?.participantsCount ?? roster.length}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Current week</dt><dd className="mt-0.5 text-sm">Week {meta?.currentWeek ?? 1}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Next session</dt><dd className="mt-0.5 text-sm">{nextSession ? formatDate(nextSession.startsAt) : "—"}</dd></div>
        </dl>
        {meta ? <><div className="progress-track mt-4 h-2 max-w-md"><div className="progress-fill" style={{ width: `${meta.progress}%` }} /></div><p className="mt-1 text-xs text-muted">{meta.progress}% program progress</p></> : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-bold">Schedule</h3>
            <div className="ds-card p-5">
              <ul className="space-y-4">
                {meta?.schedule.map((w) => (
                  <li key={w.week} className="flex items-start gap-3">
                    {w.done ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />}
                    <span className={`text-sm ${w.done ? "" : "text-muted"}`}>Week {w.week}: {w.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-bold">Assignments</h3>
            <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))]">
              {meta?.assignments.map((a) => (
                <div key={a.title} className="flex items-center justify-between gap-3 p-4">
                  <span className="text-sm font-semibold">{a.title}</span>
                  <StatusChip value={a.status} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-bold">Announcements & Q&amp;A</h3>
            <div className="ds-card p-5">
              <ul className="space-y-3">
                {meta?.announcements.map((an, i) => (
                  <li key={i} className="text-sm"><p>{an.text}</p><p className="text-xs text-muted">{formatDateTime(an.at)}</p></li>
                ))}
              </ul>
              <div className="mt-4 border-t border-[color:var(--hairline,rgba(0,0,0,0.08))] pt-4">
                {asked ? (
                  <p className="inline-flex items-center gap-1.5 text-sm text-[color:var(--brand-accent)]"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Question sent to the facilitator (simulation).</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <input className="ds-field flex-1 px-3 py-2 text-sm" placeholder="Ask the facilitator a question" value={question} onChange={(e) => setQuestion(e.target.value)} />
                    <button type="button" className="ds-button ds-button-primary px-4 py-2 text-sm" onClick={() => setAsked(true)} disabled={!question.trim()}><Send className="h-4 w-4" aria-hidden="true" />Ask</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2"><Users className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h3 className="font-bold">Participants</h3></div>
          {internal ? (
            <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))]">
              {roster.map((u) => (
                <div key={u!.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                  <span className="font-semibold">{u!.name}</span>
                  <span className="text-xs text-muted">{u!.roles.join(", ")}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="ds-card p-4 text-sm text-muted">
              You can see your own participation. The full roster is visible to facilitators and administrators.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ------------------------------ My certificates --------------------------- */

function MyCertificatesView({ route }: { route: RouteDefinition }) {
  const { store, activeUser } = useDemoStore();
  const certs = store.certificates.filter((c) => c.userId === activeUser?.id);
  const detailFor = (id: string) => certDetailsList.find((d) => d.certId === id);
  const courseTitle = (id?: string) => store.courses.find((c) => c.id === id)?.title;

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="View, download, and share your certificates, and see when renewal is due." />
      {certs.length === 0 ? (
        <section className="ds-card p-6 text-center">
          <Award className="mx-auto h-8 w-8 opacity-40" aria-hidden="true" />
          <h2 className="mt-3 text-xl font-bold">No certificates yet</h2>
          <p className="mt-2 text-muted">Complete an assigned course to earn your first certificate.</p>
        </section>
      ) : (
        <div className="stagger grid gap-4 md:grid-cols-2">
          {certs.map((cert) => {
            const d = detailFor(cert.id);
            return (
              <article key={cert.id} className="ds-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2"><Award className="h-6 w-6 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">{cert.title}</h2></div>
                  <StatusChip value={cert.status} />
                </div>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                  <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Issuer</dt><dd className="mt-0.5">{d?.issuer ?? "Signatrain"}</dd></div>
                  <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Completed</dt><dd className="mt-0.5">{formatDate(cert.issuedAt)}</dd></div>
                  <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Expires</dt><dd className="mt-0.5">{d ? formatDate(d.expiresAt) : "—"}</dd></div>
                  <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Certificate ID</dt><dd className="mt-0.5">{cert.id}</dd></div>
                  {d ? <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Score</dt><dd className="mt-0.5">{d.score}%</dd></div> : null}
                  {courseTitle(cert.courseId) ? <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Course</dt><dd className="mt-0.5">{courseTitle(cert.courseId)}</dd></div> : null}
                </dl>
                {d ? <p className="mt-3 text-xs text-muted">{d.renewalNote}</p> : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="ds-button ds-button-primary px-3 py-1.5 text-sm"><Download className="h-4 w-4" aria-hidden="true" />Download PDF</button>
                  <button type="button" className="ds-button ds-button-secondary px-3 py-1.5 text-sm"><Share2 className="h-4 w-4" aria-hidden="true" />Share link</button>
                  <Link href={`/certificate/${cert.id}`} className="ds-button ds-button-secondary inline-flex px-3 py-1.5 text-sm">Verify</Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- HR bot embed ----------------------------- */

interface BotMessage { role: "user" | "bot"; text: string; links?: { label: string; href: string }[] }

function HrBotView({ route }: { route: RouteDefinition }) {
  const intro: BotMessage = {
    role: "bot",
    text: "Ask a workplace training or HR compliance question. I can help you find relevant learning resources, explain general policy concepts, and suggest when to escalate to HR or legal. I'm a learning assistant, not a substitute for legal advice."
  };
  const [messages, setMessages] = useState<BotMessage[]>([intro]);
  const [input, setInput] = useState("");

  const answerFor = (text: string): BotMessage => {
    const match = botPromptList.find((b) => b.prompt.toLowerCase() === text.toLowerCase())
      ?? botPromptList.find((b) => text.toLowerCase().split(" ").some((w) => w.length > 4 && b.prompt.toLowerCase().includes(w)));
    if (match) return { role: "bot", text: match.answer, links: match.links };
    return {
      role: "bot",
      text: "I can point you to relevant training and explain general concepts. If this relates to a real situation, escalate to your HR contact or legal team before acting. This assistant does not provide legal advice.",
      links: [{ label: "Browse the content library", href: "/app/signatrain/library" }]
    };
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }, answerFor(t)]);
    setInput("");
  };

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="A learning and HR-support assistant embedded in Signatrain. It suggests training and when to escalate — it does not give legal advice." />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="ds-card flex h-[28rem] flex-col p-5">
            <div className="flex-1 space-y-3 overflow-y-auto">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-[color:var(--brand-accent)] text-white" : "ds-card-muted"}`}>
                    {m.role === "bot" ? <span className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted"><MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />Assistant</span> : null}
                    <p className={m.role === "bot" ? "mt-0.5" : ""}>{m.text}</p>
                    {m.links?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.links.map((l) => <Link key={l.href} href={l.href} className="ds-pill inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-[color:var(--brand-accent)]">{l.label}<ArrowRight className="h-3 w-3" aria-hidden="true" /></Link>)}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-[color:var(--hairline,rgba(0,0,0,0.08))] pt-3">
              <input className="ds-field flex-1 px-3 py-2 text-sm" placeholder="Ask a question…" value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(input); }} />
              <button type="button" className="ds-button ds-button-primary px-4 py-2 text-sm" onClick={() => send(input)} disabled={!input.trim()}><Send className="h-4 w-4" aria-hidden="true" />Send</button>
            </div>
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs text-muted">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            This assistant does not provide legal advice or assess liability. For real situations, escalate to HR or your legal team.
          </p>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">Try asking</h3>
          <div className="space-y-2">
            {botPromptList.map((b) => (
              <button key={b.prompt} type="button" onClick={() => send(b.prompt)} className="ds-card ds-card-interactive block w-full p-3 text-left text-sm">
                {b.prompt}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}


/* ============================== Shared section ============================ */

interface UserMeta {
  userId: string;
  department: string;
  title: string;
  phone: string;
  lastLogin: string;
  permissionLevel: string;
  timezone: string;
}
const usersMetaList = usersJson.userMeta as unknown as UserMeta[];

const ENTITLEMENT_LABELS: Record<string, string> = {
  GD_CONCIERGE: "GD Concierge — legal client portal",
  GD_ALL_ACCESS: "GD All Access — legal client portal",
  SIGNATRAIN_HR: "Signatrain — HR learning",
  SIGNATRAIN_MANAGER: "Signatrain — Manager learning",
  LEGISLATIVE_TRACKING: "Legislative tracking",
  BOT_ACCESS: "HR Bot access"
};

const ROLE_LEGEND: { role: string; can: string }[] = [
  { role: "Company Admin", can: "Manage users, seats, settings, billing, and reports." },
  { role: "Legal Admin", can: "Submit legal requests, view matter summaries, message GD." },
  { role: "Billing Contact", can: "View billing overview, plan, and invoice references." },
  { role: "HR / Training Admin", can: "Manage Signatrain seats, courses, cohorts, and training reports." },
  { role: "Manager", can: "See their team's learning progress where permitted." },
  { role: "Learner / Employee", can: "Use Signatrain, view own courses, progress, and certificates." },
  { role: "Read-only Executive", can: "View overview, reports, and status; no edits or requests." }
];

/* ------------------------------ Profile ----------------------------------- */

function ProfileView({ route }: { route: RouteDefinition }) {
  const { store, activeUser, activeOrganization } = useDemoStore();
  const meta = usersMetaList.find((m) => m.userId === activeUser?.id);
  const [phone, setPhone] = useState(meta?.phone ?? "");
  const [timezone, setTimezone] = useState(meta?.timezone ?? "America/New_York");
  const [twoFa, setTwoFa] = useState(true);
  const [digest, setDigest] = useState("immediate_critical");
  const [prefs, setPrefs] = useState<Record<string, string>>({});
  const setPref = (k: string, v: string) => setPrefs((p) => ({ ...p, [k]: v }));

  const gdCats = ["New attorney reply", "Legal request status", "Document requested", "Matter update", "Upcoming attorney meeting", "Billing update", "Project proposal ready"];
  const stCats = ["New course assigned", "Course deadline approaching", "Overdue training", "Live session reminder", "Certificate earned", "Certificate expiring", "Cohort announcement"];
  void store;

  const NotifRow = ({ label }: { label: string }) => (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2">
      <span className="text-sm">{label}</span>
      <select className="ds-field px-2 py-1 text-xs" value={prefs[label] ?? "both"} onChange={(e) => setPref(label, e.target.value)}>
        <option value="off">Off</option>
        <option value="in_app">In-app</option>
        <option value="email">Email</option>
        <option value="both">In-app + email</option>
      </select>
    </div>
  );

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Manage your personal profile, security, and how you want to be notified." />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="ds-card p-5 lg:col-span-2">
          <h2 className="text-lg font-bold">Profile information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className="text-xs font-bold uppercase tracking-wide text-muted">Name</label><p className="mt-1 text-sm">{activeUser?.name}</p></div>
            <div><label className="text-xs font-bold uppercase tracking-wide text-muted">Job title</label><p className="mt-1 text-sm">{meta?.title ?? activeUser?.title ?? "—"}</p></div>
            <div><label className="text-xs font-bold uppercase tracking-wide text-muted">Email <span className="text-muted">(managed by admin)</span></label><p className="mt-1 text-sm">{activeUser?.email}</p></div>
            <div><label className="text-xs font-bold uppercase tracking-wide text-muted">Company <span className="text-muted">(managed by admin)</span></label><p className="mt-1 text-sm">{activeOrganization?.name}</p></div>
            <div><label className="text-xs font-bold uppercase tracking-wide text-muted">Department</label><p className="mt-1 text-sm">{meta?.department ?? "—"}</p></div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted">Phone</label>
              <input className="ds-field mt-1 w-full px-3 py-2 text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted">Timezone</label>
              <select className="ds-field mt-1 w-full px-3 py-2 text-sm" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Chicago">America/Chicago</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="Europe/Belgrade">Europe/Belgrade</option>
              </select>
            </div>
          </div>
          <button type="button" className="ds-button ds-button-primary mt-4 px-4 py-2 text-sm">Save changes</button>
        </section>

        <section className="ds-card p-5">
          <div className="mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Security</h2></div>
          <div className="flex items-center justify-between py-2 text-sm">
            <span>Two-factor authentication</span>
            <button type="button" onClick={() => setTwoFa((v) => !v)} className={`ds-pill px-3 py-1 text-xs font-bold ${twoFa ? "tint-emerald" : ""}`}>{twoFa ? "On" : "Off"}</button>
          </div>
          <button type="button" className="ds-button ds-button-secondary mt-2 w-full px-4 py-2 text-sm">Change password</button>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Active sessions</p>
            <p className="mt-1 text-sm">This device · {meta?.timezone ?? "—"}</p>
            <p className="text-xs text-muted">Last login {meta?.lastLogin ?? "—"}</p>
          </div>
        </section>
      </div>

      <section className="ds-card mt-6 p-5">
        <div className="mb-3 flex items-center gap-2"><Bell className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Notification preferences</h2></div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold">Digest</label>
          <select className="ds-field px-3 py-2 text-sm" value={digest} onChange={(e) => setDigest(e.target.value)}>
            <option value="immediate">Immediate notifications</option>
            <option value="daily">Daily summary</option>
            <option value="weekly">Weekly summary</option>
            <option value="immediate_critical">Immediate — critical only</option>
          </select>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-muted">Greenwald Doherty</h3>
            <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))] px-4">
              {gdCats.map((c) => <NotifRow key={c} label={c} />)}
            </div>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-muted">Signatrain</h3>
            <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))] px-4">
              {stCats.map((c) => <NotifRow key={c} label={c} />)}
            </div>
          </div>
        </div>
        <button type="button" className="ds-button ds-button-primary mt-4 px-4 py-2 text-sm">Save notification settings</button>
      </section>
    </div>
  );
}

/* --------------------------- Company overview ----------------------------- */

function CompanyOverviewView({ route }: { route: RouteDefinition }) {
  const { store, activeOrganization } = useDemoStore();
  const orgId = activeOrganization?.id;
  const ents = store.entitlements.filter((e) => e.organizationId === orgId && e.status === "active");
  const has = (code: string) => ents.some((e) => e.code === code);
  const orgUsers = store.users.filter((u) => u.organizationId === orgId);
  const plan = store.gdPlans.find((pl) => pl.organizationId === orgId);
  const detail = gdPlanDetails.find((pl) => pl.organizationId === orgId);
  const openReq = store.legalRequests.filter((r) => r.organizationId === orgId && !["resolved", "converted_to_matter", "closed"].includes(r.status)).length;
  const activeMatters = matterReferences.filter((m) => m.organizationId === orgId && !/closed|completed/i.test(m.status)).length;
  const seatPools = store.seatPools.filter((sp) => sp.organizationId === orgId);
  const learners = orgUsers.filter((u) => u.roles.some((r) => ["HRS", "MGR"].includes(r))).length;
  const certs = store.certificates.filter((c) => orgUsers.some((u) => u.id === c.userId)).length;

  const products = [
    { label: "GD Client Portal", on: has("GD_CONCIERGE") || has("GD_ALL_ACCESS") },
    { label: "Signatrain", on: has("SIGNATRAIN_HR") || has("SIGNATRAIN_MANAGER") },
    { label: "Legislative Tracking", on: has("LEGISLATIVE_TRACKING") },
    { label: "HR Bot", on: has("BOT_ACCESS") }
  ];
  const settings = [
    "Who can submit legal requests", "Who can approve project requests", "Who can manage Signatrain seats",
    "Who can view reports", "Who can view billing", "Default new-user role", "Allowed email domains"
  ];

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Company profile, enabled products, relationship summary, and administrative settings." />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="ds-card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Company profile</h2></div>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Legal name", activeOrganization?.name],
              ["Type", (activeOrganization as { type?: string } | undefined)?.type ?? "customer"],
              ["Industry", (activeOrganization as { industry?: string } | undefined)?.industry ?? "—"],
              ["Company size", `${(activeOrganization as { employeeCount?: number } | undefined)?.employeeCount ?? "—"} employees`],
              ["Primary state", (activeOrganization as { primaryState?: string } | undefined)?.primaryState ?? "—"],
              ["Users", String(orgUsers.length)]
            ].map(([l, v]) => (
              <div key={l as string}><dt className="text-xs font-bold uppercase tracking-wide text-muted">{l}</dt><dd className="mt-0.5 text-sm">{v}</dd></div>
            ))}
          </dl>
        </section>

        <section className="ds-card p-5">
          <h2 className="text-lg font-bold">Products enabled</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {products.map((pr) => (
              <li key={pr.label} className="flex items-center justify-between gap-3">
                <span>{pr.label}</span>
                <span className={`tint-chip px-2 py-0.5 text-xs uppercase tracking-wide ${pr.on ? "tint-emerald" : "tint-amber"}`}>{pr.on ? "Active" : "Inactive"}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="ds-card p-5">
          <div className="mb-3 flex items-center gap-2"><Scale className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Greenwald Doherty relationship</h2></div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-muted">Plan</dt><dd className="font-semibold">{detail?.planName ?? plan?.tier ?? "—"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Primary contact</dt><dd>{detail?.primaryContactName ?? "—"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Active legal requests</dt><dd>{openReq}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Active matters</dt><dd>{activeMatters}</dd></div>
          </dl>
        </section>
        <section className="ds-card p-5">
          <div className="mb-3 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Signatrain relationship</h2></div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-muted">Active learners</dt><dd>{learners}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Included seats</dt><dd>{seatPools.reduce((t, sp) => t + sp.capacity, 0)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Certificates earned</dt><dd>{certs}</dd></div>
          </dl>
        </section>
      </div>

      <section className="ds-card mt-6 p-5">
        <div className="mb-3 flex items-center gap-2"><Settings className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Company settings</h2></div>
        <div className="grid gap-2 sm:grid-cols-2">
          {settings.map((st) => (
            <div key={st} className="flex items-center justify-between gap-3 rounded-lg border border-[color:var(--hairline,rgba(0,0,0,0.08))] px-3 py-2 text-sm">
              <span>{st}</span>
              <button type="button" className="text-xs font-bold text-[color:var(--brand-accent)]">Configure</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------------------- Company users ------------------------------- */

function CompanyUsersView({ route }: { route: RouteDefinition }) {
  const { store, activeOrganization } = useDemoStore();
  const orgId = activeOrganization?.id;
  const baseUsers = store.users.filter((u) => u.organizationId === orgId);
  const metaFor = (id: string) => usersMetaList.find((m) => m.userId === id);
  const hasGd = store.entitlements.some((e) => e.organizationId === orgId && (e.code === "GD_CONCIERGE" || e.code === "GD_ALL_ACCESS") && e.status === "active");
  const seatUserIds = new Set(
    store.seatAssignments.filter((sa) => store.seatPools.some((sp) => sp.id === sa.seatPoolId && sp.organizationId === orgId)).map((sa) => sa.userId)
  );
  const productAccess = (u: { id: string; roles: string[] }) => {
    const list: string[] = [];
    if (hasGd && u.roles.some((r) => ["CO", "CHA", "GDCU"].includes(r))) list.push("GD");
    if (seatUserIds.has(u.id) || u.roles.some((r) => ["HRS", "MGR"].includes(r))) list.push("Signatrain");
    return list.length ? list.join(", ") : "—";
  };

  const [invited, setInvited] = useState<{ name: string; role: string }[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Learner / Employee");
  const [notice, setNotice] = useState<string | null>(null);
  const invite = () => {
    if (!name.trim() || !email.trim()) return;
    setInvited((v) => [...v, { name, role }]);
    setNotice(`Invitation sent to ${email} (simulation).`);
    setName(""); setEmail("");
  };

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Manage the people in your company account and what each can access across GD and Signatrain." />

      <section className="mb-6">
        <div className="ds-card overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Products</th><th>Status</th><th>Last login</th></tr></thead>
            <tbody>
              {baseUsers.map((u) => {
                const m = metaFor(u.id);
                return (
                  <tr key={u.id}>
                    <td className="font-semibold">{u.name}</td>
                    <td className="text-sm text-muted">{u.email}</td>
                    <td className="text-sm">{m?.permissionLevel ?? u.roles.join(", ")}</td>
                    <td className="text-sm">{m?.department ?? "—"}</td>
                    <td className="text-sm">{productAccess(u)}</td>
                    <td><StatusChip value={u.status} /></td>
                    <td className="text-sm text-muted">{m?.lastLogin ?? "—"}</td>
                  </tr>
                );
              })}
              {invited.map((iv, i) => (
                <tr key={`inv${i}`}>
                  <td className="font-semibold">{iv.name}</td>
                  <td className="text-sm text-muted">—</td>
                  <td className="text-sm">{iv.role}</td>
                  <td className="text-sm">—</td>
                  <td className="text-sm">—</td>
                  <td><StatusChip value="invited" /></td>
                  <td className="text-sm text-muted">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="ds-card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2"><UserPlus className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Invite a user</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="ds-field px-3 py-2 text-sm" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="ds-field px-3 py-2 text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className="ds-field px-3 py-2 text-sm sm:col-span-2" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLE_LEGEND.map((r) => <option key={r.role} value={r.role}>{r.role}</option>)}
            </select>
          </div>
          <button type="button" className="ds-button ds-button-primary mt-3 inline-flex px-4 py-2 text-sm" onClick={invite} disabled={!name.trim() || !email.trim()}>
            <Plus className="h-4 w-4" aria-hidden="true" />Send invite
          </button>
          {notice ? <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[color:var(--brand-accent)]"><Mail className="h-3.5 w-3.5" aria-hidden="true" />{notice}</p> : null}
        </section>
        <section className="ds-card p-5">
          <div className="mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Roles</h2></div>
          <ul className="space-y-2 text-sm">
            {ROLE_LEGEND.map((r) => <li key={r.role}><span className="font-semibold">{r.role}</span><span className="text-muted"> — {r.can}</span></li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ------------------------- Seats and entitlements ------------------------- */

function SeatsEntitlementsView({ route }: { route: RouteDefinition }) {
  const { store, activeOrganization } = useDemoStore();
  const orgId = activeOrganization?.id;
  const pools = store.seatPools.filter((sp) => sp.organizationId === orgId);
  const assignedIn = (poolId: string) => store.seatAssignments.filter((sa) => sa.seatPoolId === poolId && sa.status === "active").length;
  const ents = store.entitlements.filter((e) => e.organizationId === orgId);
  const gdUsers = store.users.filter((u) => u.organizationId === orgId && u.roles.some((r) => ["CO", "CHA", "GDCU"].includes(r))).length;

  const gdEnts = ents.filter((e) => e.code.startsWith("GD") || e.code === "LEGISLATIVE_TRACKING");
  const stEnts = ents.filter((e) => e.code.startsWith("SIGNATRAIN") || e.code === "BOT_ACCESS");

  const EntList = ({ items }: { items: typeof ents }) => (
    <ul className="space-y-2 text-sm">
      {items.map((e) => (
        <li key={e.id} className="flex items-center justify-between gap-3">
          <span>{ENTITLEMENT_LABELS[e.code] ?? e.code}</span>
          <span className="text-xs text-muted">{e.source.replaceAll("_", " ")}</span>
        </li>
      ))}
      {items.length === 0 ? <li className="text-muted">None</li> : null}
    </ul>
  );

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="What your company has purchased or been granted: seats, entitlements, and limits." />

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold">Signatrain seats</h2>
        <div className="stagger grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pools.map((sp) => {
            const used = assignedIn(sp.id);
            const pct = sp.capacity ? Math.round((used / sp.capacity) * 100) : 0;
            return (
              <article key={sp.id} className="ds-card p-4">
                <p className="font-semibold">{ENTITLEMENT_LABELS[sp.entitlementCode] ?? sp.entitlementCode}</p>
                <p className="mt-1 text-sm text-muted">{used} of {sp.capacity} seats assigned · {sp.capacity - used} available</p>
                <div className="progress-track mt-2 h-2"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                <p className="mt-1 text-xs text-muted">Source: {sp.source.replaceAll("_", " ")}</p>
              </article>
            );
          })}
          <article className="ds-card p-4 tint-blue">
            <p className="font-semibold">GD portal users</p>
            <p className="mt-1 text-sm text-muted">{gdUsers} users with legal portal access</p>
          </article>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="ds-card p-5">
          <div className="mb-3 flex items-center gap-2"><Scale className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">GD entitlements</h2></div>
          <EntList items={gdEnts} />
        </section>
        <section className="ds-card p-5">
          <div className="mb-3 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Signatrain entitlements</h2></div>
          <EntList items={stEnts} />
        </section>
      </div>

      <section className="ds-card mt-6 p-5">
        <h2 className="text-lg font-bold">Request changes</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Request more seats", "Request additional Signatrain access", "Upgrade plan", "Add private cohort", "Request additional legal portal users"].map((cta) => (
            <button key={cta} type="button" className="ds-button ds-button-secondary px-4 py-2 text-sm">{cta}</button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* --------------------- Company reports: extra sections -------------------- */

function CompanyReportExtras() {
  const { store, activeOrganization } = useDemoStore();
  const orgId = activeOrganization?.id;
  const reqs = store.legalRequests.filter((r) => r.organizationId === orgId);
  const openReq = reqs.filter((r) => !["resolved", "converted_to_matter", "closed"].includes(r.status)).length;
  const closedReq = reqs.length - openReq;
  const projects = gdProjectRequestsData.filter((pr) => pr.organizationId === orgId);
  const matters = matterReferences.filter((m) => m.organizationId === orgId);
  const activeMatters = matters.filter((m) => !/closed|completed/i.test(m.status)).length;
  const byCategory = Array.from(new Set(reqs.map((r) => r.topic))).map((t) => ({ topic: t, count: reqs.filter((r) => r.topic === t).length }));

  const pools = store.seatPools.filter((sp) => sp.organizationId === orgId);
  const totalSeats = pools.reduce((t, sp) => t + sp.capacity, 0);
  const assignedSeats = store.seatAssignments.filter((sa) => pools.some((sp) => sp.id === sa.seatPoolId) && sa.status === "active").length;

  const actions = gdActionItems.filter((a) => a.organizationId === orgId);
  const overdueTraining = stAssignments.filter((a) => a.status === "overdue").length;

  return (
    <>
      <section className="mt-10">
        <div className="mb-3 flex items-center gap-2"><Scale className="h-5 w-5 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-xl font-bold">GD legal service report</h2></div>
        <div className="stagger mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat label="Legal requests" value={String(reqs.length)} tint="tint-blue" />
          <MiniStat label="Open / closed" value={`${openReq} / ${closedReq}`} tint="tint-amber" />
          <MiniStat label="Active matters" value={String(activeMatters)} tint="tint-violet" />
          <MiniStat label="Project requests" value={String(projects.length)} tint="tint-emerald" />
        </div>
        <div className="ds-card p-5">
          <h3 className="font-bold">Requests by category</h3>
          <div className="mt-3 space-y-2">
            {byCategory.map((c) => (
              <div key={c.topic} className="flex items-center justify-between gap-3 text-sm">
                <span>{c.topic}</span>
                <span className="font-semibold">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-xl font-bold">Usage &amp; entitlements</h2></div>
        <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MiniStat label="Signatrain seats" value={`${assignedSeats} / ${totalSeats}`} tint="tint-blue" />
          <MiniStat label="Available seats" value={String(Math.max(0, totalSeats - assignedSeats))} tint="tint-emerald" />
          <MiniStat label="Template downloads" value="3" tint="tint-cyan" />
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2"><Sparkles className="h-5 w-5 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-xl font-bold">Executive summary</h2></div>
        <div className="ds-card p-5">
          <h3 className="font-bold">Key action items</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {overdueTraining > 0 ? <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-warm)]" aria-hidden="true" />{overdueTraining} learner(s) overdue on assigned training</li> : null}
            {reqs.filter((r) => r.status === "waiting_for_client").length > 0 ? <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-warm)]" aria-hidden="true" />{reqs.filter((r) => r.status === "waiting_for_client").length} legal request(s) waiting on client documents</li> : null}
            {actions.map((a) => <li key={a.id} className="flex items-start gap-2"><ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />{a.title}</li>)}
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />{Math.max(0, totalSeats - assignedSeats)} unused Signatrain seat(s) available</li>
          </ul>
        </div>
      </section>
    </>
  );
}


/* ========================= Legislative Tracking =========================== */

interface AlertMeta {
  alertId: string;
  relevance: string;
  riskLevel: string;
  affectedDepartments: string[];
  lastReviewedBy: string;
  lastReviewedAt: string;
  whatChanged: string[];
  whoAffected: string[];
  businessImpact: string[];
  nextSteps: string[];
  relatedGdServices: string[];
  relatedTraining: { label: string; href: string }[];
  sourceType: string;
  sourceTitle: string;
  sourceDate: string;
}
interface Jurisdiction { id: string; name: string; type: string; parentId?: string | null }
interface CoverageRec { id: string; organizationId: string; jurisdictionIds: string[]; status: string }
interface CoverageDetail { organizationId: string; jurisdictionId: string; status: string; topics: string[]; relevance: string; lastReviewed: string; notes: string }
interface OperatingLocation { organizationId: string; location: string; kind: string }
interface AlertRecipient { id: string; alertId: string; organizationId: string; userId: string; deliveryStatus: string; readAt?: string | null }

const alertMetaList = legislativeAlertsJson.alertMeta as unknown as AlertMeta[];
const jurisdictionsList = legislativeAlertsJson.jurisdictions as unknown as Jurisdiction[];
const coverageList = legislativeAlertsJson.coverage as unknown as CoverageRec[];
const coverageDetailList = legislativeAlertsJson.coverageDetail as unknown as CoverageDetail[];
const operatingLocationsList = legislativeAlertsJson.operatingLocations as unknown as OperatingLocation[];
const alertRecipients = legislativeAlertsJson.recipients as unknown as AlertRecipient[];

function jurisdictionName(id: string): string {
  return jurisdictionsList.find((j) => j.id === id)?.name ?? id;
}
function relevanceTint(level: string): string {
  const l = level.toLowerCase();
  if (l.includes("high")) return "tint-rose";
  if (l.includes("medium")) return "tint-amber";
  if (l.includes("low")) return "tint-blue";
  return "tint-brand";
}
function riskTint(level: string): string {
  const l = level.toLowerCase();
  if (l.includes("critical") || l.includes("high")) return "tint-rose";
  if (l.includes("moderate")) return "tint-amber";
  return "tint-emerald";
}
function alertMetaFor(id: string): AlertMeta | undefined {
  return alertMetaList.find((m) => m.alertId === id);
}
function eligibleAlertsForOrg<T extends { id: string; status: string; jurisdictionIds: string[] }>(
  orgId: string | undefined,
  alerts: T[]
): T[] {
  const cov = coverageList.find((c) => c.organizationId === orgId);
  const covJur = new Set(cov?.jurisdictionIds ?? []);
  return alerts.filter(
    (a) => a.status === "published" && (a.jurisdictionIds.some((j) => covJur.has(j)) || a.jurisdictionIds.includes("US-FED"))
  );
}

/* -------------------------- Eligible alert list --------------------------- */

function EligibleAlertsView({ route }: { route: RouteDefinition }) {
  const { store, activeUser } = useDemoStore();
  const orgId = activeUser?.organizationId;
  const eligible = eligibleAlertsForOrg(orgId, store.alerts);
  const [jur, setJur] = useState("all");
  const [topic, setTopic] = useState("all");
  const [relevance, setRelevance] = useState("all");
  const [actionOnly, setActionOnly] = useState(false);
  const [query, setQuery] = useState("");

  const unread = alertRecipients.filter((r) => r.organizationId === orgId && !r.readAt && eligible.some((a) => a.id === r.alertId)).length;
  const jurOptions = ["all", ...Array.from(new Set(eligible.flatMap((a) => a.jurisdictionIds)))];
  const topicOptions = ["all", ...Array.from(new Set(eligible.map((a) => a.topic)))];

  const hasAction = (a: { recommendedAction: string }) => !!a.recommendedAction && !/no action/i.test(a.recommendedAction);

  const alerts = eligible.filter((a) => {
    const m = alertMetaFor(a.id);
    if (jur !== "all" && !a.jurisdictionIds.includes(jur)) return false;
    if (topic !== "all" && a.topic !== topic) return false;
    if (relevance !== "all" && (m?.relevance ?? "").toLowerCase() !== relevance) return false;
    if (actionOnly && !hasAction(a)) return false;
    if (query.trim() && !`${a.title} ${a.summary}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Legal and regulatory changes Greenwald Doherty has flagged as potentially relevant to your company." />

      <div className="stagger mb-6 grid gap-4 sm:grid-cols-3">
        <MiniStat label="Eligible alerts" value={String(eligible.length)} tint="tint-blue" />
        <MiniStat label="Action recommended" value={String(eligible.filter(hasAction).length)} tint="tint-amber" />
        <MiniStat label="Unread" value={String(unread)} tint={unread > 0 ? "tint-rose" : "tint-emerald"} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="ds-field inline-flex items-center gap-2 px-3 py-2 text-sm">
          <Search className="h-4 w-4 opacity-60" aria-hidden="true" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search alerts" className="w-44 bg-transparent outline-none" />
        </label>
        <select className="ds-field px-3 py-2 text-sm" value={jur} onChange={(e) => setJur(e.target.value)}>
          {jurOptions.map((j) => <option key={j} value={j}>{j === "all" ? "All jurisdictions" : jurisdictionName(j)}</option>)}
        </select>
        <select className="ds-field px-3 py-2 text-sm" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {topicOptions.map((t) => <option key={t} value={t}>{t === "all" ? "All topics" : t}</option>)}
        </select>
        <select className="ds-field px-3 py-2 text-sm" value={relevance} onChange={(e) => setRelevance(e.target.value)}>
          <option value="all">All relevance</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="informational">Informational</option>
        </select>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={actionOnly} onChange={(e) => setActionOnly(e.target.checked)} />
          Action required
        </label>
        <Link href="/app/alerts/coverage" className="ml-auto inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--brand-accent)]">
          <MapPin className="h-4 w-4" aria-hidden="true" />Jurisdiction coverage
        </Link>
      </div>

      {alerts.length === 0 ? (
        <p className="text-muted">No alerts match these filters.</p>
      ) : (
        <div className="stagger grid gap-4 md:grid-cols-2">
          {alerts.map((a) => {
            const m = alertMetaFor(a.id);
            return (
              <Link key={a.id} href={`/app/alerts/${a.id}`} className="ds-card ds-card-interactive block p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="action-icon inline-flex h-10 w-10 items-center justify-center"><Scale className="h-5 w-5" aria-hidden="true" /></span>
                  <div className="flex flex-wrap justify-end gap-2">
                    {m ? <span className={`tint-chip px-2 py-0.5 text-xs uppercase tracking-wide ${relevanceTint(m.relevance)}`}>{m.relevance}</span> : null}
                    {m ? <span className={`tint-chip px-2 py-0.5 text-xs uppercase tracking-wide ${riskTint(m.riskLevel)}`}>{m.riskLevel} impact</span> : null}
                  </div>
                </div>
                <h3 className="mt-3 text-base font-bold">{a.title}</h3>
                <p className="mt-1 text-xs font-semibold text-muted">{a.jurisdictionIds.map(jurisdictionName).join(", ")} · {a.topic}</p>
                <p className="mt-2 text-sm text-muted">{a.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <StatusChip value={a.status} />
                  <span className="text-muted">Effective {a.effectiveDate ? formatDate(a.effectiveDate) : "pending"}</span>
                </div>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--brand-accent)]">View detail<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></p>
              </Link>
            );
          })}
        </div>
      )}
      <p className="mt-6 flex items-start gap-2 text-xs text-muted">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Alerts are prepared by Greenwald Doherty to help identify potentially relevant changes. They are not a substitute for a full legal review of your situation.
      </p>
    </div>
  );
}

/* --------------------------- Alert detail --------------------------------- */

function AlertDetailView({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  const { store, activeUser } = useDemoStore();
  const alertId = decodeURIComponent(pathname.split("/").pop() ?? "");
  const eligible = eligibleAlertsForOrg(activeUser?.organizationId, store.alerts);
  const alert = eligible.find((a) => a.id === alertId) ?? store.alerts.find((a) => a.id === alertId && a.status === "published");
  const m = alertMetaFor(alertId);
  const [tracking, setTracking] = useState("none");

  if (!alert) {
    return (
      <div className="narrow-shell">
        <section className="ds-card p-6">
          <Scale className="h-8 w-8 opacity-40" aria-hidden="true" />
          <h1 className="page-title mt-3 text-2xl font-bold">Alert not available</h1>
          <p className="mt-2 text-muted">This alert does not exist or is not eligible for your company.</p>
          <Link href="/app/alerts" className="ds-button ds-button-primary mt-5 inline-flex px-4 py-2">Back to alerts</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="What changed, whether it applies to you, and what to consider next — in plain language." />

      <section className="ds-card mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{alert.title}</h2>
            <p className="mt-1 text-sm text-muted">{alert.jurisdictionIds.map(jurisdictionName).join(", ")} · {alert.topic}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <StatusChip value={alert.status} />
            {m ? <span className={`tint-chip px-2 py-0.5 text-xs uppercase tracking-wide ${relevanceTint(m.relevance)}`}>{m.relevance} relevance</span> : null}
            {m ? <span className={`tint-chip px-2 py-0.5 text-xs uppercase tracking-wide ${riskTint(m.riskLevel)}`}>{m.riskLevel} impact</span> : null}
          </div>
        </div>
        <dl className="mt-4 grid gap-3 border-t border-[color:var(--hairline,rgba(0,0,0,0.08))] pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Effective date</dt><dd className="mt-0.5 text-sm">{alert.effectiveDate ? formatDate(alert.effectiveDate) : "Pending"}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Affected departments</dt><dd className="mt-0.5 text-sm">{m?.affectedDepartments.join(", ") ?? "—"}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Last reviewed by GD</dt><dd className="mt-0.5 text-sm">{m ? `${m.lastReviewedBy} (${formatDate(m.lastReviewedAt)})` : "—"}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Status</dt><dd className="mt-0.5 text-sm">{alert.status}</dd></div>
        </dl>
      </section>

      <section className="ds-card mb-6 p-5 tint-blue">
        <h3 className="font-bold">Plain-English summary</h3>
        <p className="mt-2 text-sm">{alert.summary}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {m?.whatChanged.length ? (
            <section className="ds-card p-5"><h3 className="font-bold">What changed</h3><ul className="mt-2 space-y-1.5 text-sm">{m.whatChanged.map((w) => <li key={w} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-accent)]" aria-hidden="true" />{w}</li>)}</ul></section>
          ) : null}
          {m?.whoAffected.length ? (
            <section className="ds-card p-5"><h3 className="font-bold">Who may be affected</h3><ul className="mt-2 space-y-1.5 text-sm text-muted">{m.whoAffected.map((w) => <li key={w}>{w}</li>)}</ul></section>
          ) : null}
          {m?.businessImpact.length ? (
            <section className="ds-card p-5"><h3 className="font-bold">Potential business impact</h3><ul className="mt-2 space-y-1.5 text-sm text-muted">{m.businessImpact.map((w) => <li key={w}>{w}</li>)}</ul></section>
          ) : null}
          <section className="ds-card p-5">
            <h3 className="font-bold">Recommended next steps</h3>
            <ol className="mt-2 space-y-1.5 text-sm">
              {(m?.nextSteps ?? [alert.recommendedAction]).map((step, i) => (
                <li key={i} className="flex gap-2"><span className="font-bold text-[color:var(--brand-accent)]">{i + 1}.</span>{step}</li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-6">
          <section className="ds-card p-5">
            <h3 className="font-bold">Related GD services</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">{(m?.relatedGdServices ?? []).map((g) => <li key={g}>{g}</li>)}</ul>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/app/gd/requests/new" className="ds-button ds-button-primary inline-flex justify-center px-3 py-2 text-sm"><Send className="h-4 w-4" aria-hidden="true" />Submit legal request</Link>
              <Link href="/app/gd/schedule" className="ds-button ds-button-secondary inline-flex justify-center px-3 py-2 text-sm"><CalendarDays className="h-4 w-4" aria-hidden="true" />Schedule consultation</Link>
            </div>
          </section>
          {m?.relatedTraining.length ? (
            <section className="ds-card p-5">
              <div className="mb-2 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h3 className="font-bold">Related training</h3></div>
              <ul className="space-y-2 text-sm">
                {m.relatedTraining.map((t) => <li key={t.href}><Link href={t.href} className="inline-flex items-center gap-1.5 font-semibold text-[color:var(--brand-accent)] hover:underline">{t.label}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link></li>)}
              </ul>
            </section>
          ) : null}
          <section className="ds-card p-5">
            <h3 className="font-bold">Source</h3>
            <p className="mt-1 text-sm">{m?.sourceTitle ?? alert.sourceReferences[0]}</p>
            <p className="text-xs text-muted">{m?.sourceType}{m?.sourceDate ? ` · ${formatDate(m.sourceDate)}` : ""}</p>
          </section>
          <section className="ds-card p-5">
            <h3 className="font-bold">Your tracking</h3>
            <select className="ds-field mt-2 w-full px-3 py-2 text-sm" value={tracking} onChange={(e) => setTracking(e.target.value)}>
              <option value="none">No action needed</option>
              <option value="reviewed">Reviewed</option>
              <option value="assigned_hr">Assigned to HR</option>
              <option value="assigned_legal">Assigned to legal</option>
              <option value="in_progress">Action in progress</option>
              <option value="follow_up">Follow-up requested</option>
            </select>
            {tracking !== "none" ? <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[color:var(--brand-accent)]"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />Saved for your company (simulation).</p> : null}
          </section>
        </div>
      </div>
      <div className="mt-6"><Link href="/app/alerts" className="text-sm font-bold text-[color:var(--brand-accent)] hover:underline">← Back to alerts</Link></div>
    </div>
  );
}

/* ------------------------- Jurisdiction coverage -------------------------- */

function JurisdictionCoverageView({ route }: { route: RouteDefinition }) {
  const { store, activeUser } = useDemoStore();
  const orgId = activeUser?.organizationId;
  const details = coverageDetailList.filter((c) => c.organizationId === orgId);
  const locations = operatingLocationsList.filter((l) => l.organizationId === orgId);
  const eligible = eligibleAlertsForOrg(orgId, store.alerts);
  const activeAlertsIn = (jurId: string) => eligible.filter((a) => a.jurisdictionIds.includes(jurId)).length;
  const allTopics = Array.from(new Set(details.flatMap((d) => d.topics)));

  const [addOpen, setAddOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  const COVERAGE_STATUS_NOTES: { status: string; note: string }[] = [
    { status: "Active coverage", note: "GD actively monitors relevant changes and can create alerts." },
    { status: "Monitoring only", note: "Only key changes are monitored, not full analysis." },
    { status: "Limited coverage", note: "Only a specific area is covered (e.g., training obligations)." },
    { status: "Available on request", note: "GD can add this jurisdiction if you request it." },
    { status: "Not currently covered", note: "Not part of the current scope." }
  ];

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Which jurisdictions and topics Greenwald Doherty monitors for your company — and where the limits are." />

      <div className="stagger mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Covered jurisdictions" value={String(details.length)} tint="tint-blue" />
        <MiniStat label="Monitored topics" value={String(allTopics.length)} tint="tint-violet" />
        <MiniStat label="Active alerts" value={String(eligible.length)} tint="tint-amber" />
        <MiniStat label="Primary GD contact" value="Rachel Kim" tint="tint-brand" />
      </div>

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold">Jurisdiction coverage</h2>
        <div className="ds-card overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Jurisdiction</th><th>Coverage</th><th>Topics monitored</th><th>Relevance</th><th>Active alerts</th><th>Last reviewed</th></tr></thead>
            <tbody>
              {details.map((c) => (
                <tr key={c.jurisdictionId}>
                  <td className="font-semibold">{jurisdictionName(c.jurisdictionId)}</td>
                  <td><span className={`tint-chip px-2 py-0.5 text-xs uppercase tracking-wide ${c.status.includes("Active") ? "tint-emerald" : c.status.includes("Monitoring") ? "tint-blue" : "tint-amber"}`}>{c.status}</span></td>
                  <td className="text-sm text-muted">{c.topics.join(", ")}</td>
                  <td className="text-sm">{c.relevance}</td>
                  <td className="text-sm">{activeAlertsIn(c.jurisdictionId)}</td>
                  <td className="text-sm text-muted">{formatDate(c.lastReviewed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold">Coverage statuses</h2>
          <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))]">
            {COVERAGE_STATUS_NOTES.map((c) => (
              <div key={c.status} className="flex flex-wrap items-center justify-between gap-3 p-3 text-sm">
                <span className="font-semibold">{c.status}</span>
                <span className="text-muted">{c.note}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <div className="mb-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Your operating locations</h2></div>
          <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))]">
            {locations.map((l) => (
              <div key={l.location} className="flex items-center justify-between gap-3 p-3 text-sm">
                <span className="font-semibold">{l.location}</span>
                <span className="text-xs text-muted">{l.kind}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="ds-card mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Request additional jurisdiction coverage</h2>
          <button type="button" className="ds-button ds-button-secondary px-4 py-2 text-sm" onClick={() => { setAddOpen((v) => !v); setRequested(false); }}>{addOpen ? "Close" : "Add jurisdiction"}</button>
        </div>
        {addOpen ? (
          requested ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-[color:var(--brand-accent)]"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Coverage request sent to Greenwald Doherty (simulation).</p>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input className="ds-field px-3 py-2 text-sm" placeholder="Which jurisdiction?" />
              <input className="ds-field px-3 py-2 text-sm" placeholder="Why is it relevant?" />
              <input className="ds-field px-3 py-2 text-sm sm:col-span-2" placeholder="Topics to monitor (e.g., Employment, Privacy)" />
              <button type="button" className="ds-button ds-button-primary inline-flex px-4 py-2 text-sm sm:col-span-2" onClick={() => setRequested(true)}><Send className="h-4 w-4" aria-hidden="true" />Send coverage request</button>
            </div>
          )
        ) : null}
      </section>

      <p className="mt-6 flex items-start gap-2 text-xs text-muted">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Jurisdiction coverage reflects the monitoring scope currently configured for your company. Alerts help identify potentially relevant changes and are not a substitute for a full legal review of your specific situation.
      </p>
    </div>
  );
}


/* --------------------------- Submit legal request ------------------------- */

function SubmitLegalRequestView({ route }: { route: RouteDefinition }) {
  const categories = ["Contract review", "Employment issue", "Compliance question", "Litigation / dispute", "Policy review", "Corporate governance", "Billing / legal admin", "General legal question", "Signatrain-related training/legal"];
  const outcomes = ["Review and advise", "Draft a response", "Revise a document", "Prepare a new document", "Schedule attorney consultation", "Convert this into a formal matter/project"];
  const riskQuestions = ["There is a court deadline", "There is a government agency deadline", "A demand letter has been received", "An employee/customer/vendor is waiting for a response", "This is blocking a business decision", "This relates to a signed contract"];

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState("medium");
  const [privacy, setPrivacy] = useState<"company_visible" | "restricted">("company_visible");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [risks, setRisks] = useState<Record<string, boolean>>({});
  const [outcome, setOutcome] = useState(outcomes[0]);
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const toggleRisk = (q: string) => setRisks((r) => ({ ...r, [q]: !r[q] }));
  const reference = `REQ-2026-${String(20 + Math.floor(title.length % 80)).padStart(3, "0")}`;

  if (submitted) {
    return (
      <div className="narrow-shell">
        <section className="ds-card p-6">
          <CheckCircle2 className="h-10 w-10 text-[color:var(--brand-accent)]" aria-hidden="true" />
          <h1 className="page-title mt-3 text-2xl font-bold">Legal request submitted</h1>
          <p className="mt-2 text-muted">This is a simulation; no real request was created.</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Request number</dt><dd className="mt-0.5 text-sm">{submitted}</dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Status</dt><dd className="mt-0.5"><StatusChip value="submitted" /></dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Expected response</dt><dd className="mt-0.5 text-sm">1 business day (Concierge plan)</dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wide text-muted">Category</dt><dd className="mt-0.5 text-sm">{category}</dd></div>
          </dl>
          <p className="mt-4 text-sm text-muted">Next steps: your GD team will triage the request and reach out with any questions.</p>
          <div className="mt-5 flex gap-2">
            <Link href="/app/gd/requests" className="ds-button ds-button-primary px-4 py-2 text-sm">Back to requests</Link>
            <button type="button" className="ds-button ds-button-secondary px-4 py-2 text-sm" onClick={() => setSubmitted(null)}>Submit another</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Send a structured legal request to your Greenwald Doherty team. Simple to complete, but detailed enough for GD to act." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="ds-card p-5">
            <h2 className="text-lg font-bold">Basic info</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className="text-xs font-bold uppercase tracking-wide text-muted">Request title</label><input className="ds-field mt-1 w-full px-3 py-2 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short summary of what you need" /></div>
              <div><label className="text-xs font-bold uppercase tracking-wide text-muted">Category</label><select className="ds-field mt-1 w-full px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="text-xs font-bold uppercase tracking-wide text-muted">Priority</label><select className="ds-field mt-1 w-full px-3 py-2 text-sm" value={priority} onChange={(e) => setPriority(e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
              <div><label className="text-xs font-bold uppercase tracking-wide text-muted">Requested deadline</label><input type="date" className="ds-field mt-1 w-full px-3 py-2 text-sm" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></div>
              <div><label className="text-xs font-bold uppercase tracking-wide text-muted">Privacy</label><select className="ds-field mt-1 w-full px-3 py-2 text-sm" value={privacy} onChange={(e) => setPrivacy(e.target.value as "company_visible" | "restricted")}><option value="company_visible">Company visible</option><option value="restricted">Restricted to participants</option></select></div>
            </div>
          </section>

          <section className="ds-card p-5">
            <h2 className="text-lg font-bold">Describe your request</h2>
            <p className="mt-1 text-sm text-muted">What happened? What decision do you need to make? Is there a deadline? Are documents involved?</p>
            <textarea className="ds-field mt-3 w-full px-3 py-2 text-sm" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please describe what you need help with." />
          </section>

          <section className="ds-card p-5">
            <h2 className="text-lg font-bold">Urgency &amp; risk</h2>
            <p className="mt-1 text-sm text-muted">Check anything that applies so GD can triage correctly.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {riskQuestions.map((q) => (
                <label key={q} className="flex items-start gap-2 rounded-lg border border-[color:var(--hairline,rgba(0,0,0,0.08))] p-2.5 text-sm">
                  <input type="checkbox" checked={!!risks[q]} onChange={() => toggleRisk(q)} className="mt-0.5" />
                  {q}
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="ds-card p-5">
            <div className="mb-2 flex items-center gap-2"><Paperclip className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /><h2 className="text-lg font-bold">Documents</h2></div>
            <p className="text-sm text-muted">Attach contracts, letters, notices, or prior correspondence (simulation).</p>
            <button type="button" className="ds-button ds-button-secondary mt-3 px-4 py-2 text-sm" onClick={() => setFileName("Supporting_Documents.pdf")}>Choose file</button>
            {fileName ? <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold"><Paperclip className="h-3.5 w-3.5" aria-hidden="true" />{fileName}</p> : null}
          </section>

          <section className="ds-card p-5">
            <h2 className="text-lg font-bold">Preferred outcome</h2>
            <select className="ds-field mt-2 w-full px-3 py-2 text-sm" value={outcome} onChange={(e) => setOutcome(e.target.value)}>{outcomes.map((o) => <option key={o} value={o}>{o}</option>)}</select>
          </section>

          <button type="button" className="ds-button ds-button-primary inline-flex w-full justify-center px-4 py-2.5 text-sm" onClick={() => setSubmitted(reference)} disabled={!title.trim() || !description.trim()}>
            <Send className="h-4 w-4" aria-hidden="true" />
            Submit request
          </button>
          <p className="text-xs text-muted">You'll receive a request number and expected response window after submitting.</p>
        </div>
      </div>
    </div>
  );
}


/* ========================= GD Internal Admin ============================== */

const GD_OWNER_BY_ORG: Record<string, string> = { org_acme: "user_rachel", org_harbor: "user_dana", org_northstar: "user_dana" };

function useGdAdminData() {
  const { store } = useDemoStore();
  const userName = (id?: string) => store.users.find((u) => u.id === id)?.name ?? "Unassigned";
  const clientOrgs = store.organizations.filter((o) => o.id !== "org_internal");
  return { store, userName, clientOrgs };
}

/* --- GD operations dashboard --- */
function GdOpsDashboardView({ route }: { route: RouteDefinition }) {
  const { store, userName } = useGdAdminData();
  const reqs = store.legalRequests;
  const triage = reqs.filter((r) => ["submitted", "triage"].includes(r.status)).length;
  const awaitingAttorney = reqs.filter((r) => ["assigned", "in_progress"].includes(r.status)).length;
  const waitingClient = reqs.filter((r) => r.status === "waiting_for_client").length;
  const onboardingClients = new Set(onboardingTasks.filter((t) => t.status !== "accepted").map((t) => t.organizationId)).size;
  const projectsNeedScope = gdProjectRequestsData.filter((pr) => ["submitted", "under_scoping"].includes(pr.status)).length;
  const templatesPending = gdTemplates.filter((t) => t.status !== "published").length;

  const workload = [
    { name: "Dana Brooks", role: "Operations", count: onboardingClients + gdProjectRequestsData.length },
    { name: "Rachel Kim", role: "Legal review", count: reqs.filter((r) => r.assignedAttorneyUserId === "user_rachel").length + gdProjectRequestsData.filter((pr) => pr.assignedAttorneyUserId === "user_rachel").length },
    { name: "Sam Carter", role: "Content review", count: templatesPending + store.alerts.filter((a) => a.status !== "published").length }
  ];
  const urgent = reqs.filter((r) => r.priority === "high" || r.urgency === "urgent");
  const activity = [...gdActivity].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6);

  const quick = [
    { label: "Legal request queue", href: "/admin/gd/requests", icon: Inbox },
    { label: "Onboarding operations", href: "/admin/gd/onboarding", icon: ListChecks },
    { label: "Client administration", href: "/admin/gd/clients", icon: Building2 },
    { label: "Project requests", href: "/admin/gd/projects", icon: BriefcaseBusiness },
    { label: "Templates", href: "/admin/gd/templates", icon: FileText },
    { label: "Alert pipeline", href: "/admin/alerts", icon: Scale }
  ];

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="GD operations cockpit — what needs triage, who owns what, and what's urgent across all clients." />
      <div className="stagger mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MiniStat label="Awaiting triage" value={String(triage)} tint="tint-amber" />
        <MiniStat label="Awaiting attorney" value={String(awaitingAttorney)} tint="tint-blue" />
        <MiniStat label="Waiting on client" value={String(waitingClient)} tint="tint-violet" />
        <MiniStat label="Onboarding in progress" value={String(onboardingClients)} tint="tint-cyan" />
        <MiniStat label="Projects need scope" value={String(projectsNeedScope)} tint="tint-amber" />
        <MiniStat label="Templates pending" value={String(templatesPending)} tint={templatesPending ? "tint-rose" : "tint-emerald"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold">Urgent items</h2>
          <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))]">
            {urgent.length === 0 ? <p className="p-4 text-sm text-muted">Nothing urgent right now.</p> : urgent.map((r) => (
              <Link key={r.id} href={`/admin/gd/requests/${r.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-[color:var(--surface-hover,rgba(0,0,0,0.03))]">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-warm)]" aria-hidden="true" />
                  <div><p className="font-semibold">{r.subject}</p><p className="text-xs text-muted">{store.organizations.find((o) => o.id === r.organizationId)?.name} · {r.topic}</p></div>
                </div>
                <div className="flex items-center gap-2"><StatusChip value={r.priority} /><StatusChip value={r.status} /></div>
              </Link>
            ))}
          </div>

          <h2 className="mb-3 mt-6 text-lg font-bold">Recent activity</h2>
          <div className="ds-card p-5">
            <ul className="space-y-3">
              {activity.map((a) => (
                <li key={a.id} className="flex items-start gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[color:var(--brand-accent)]" aria-hidden="true" /><div><p className="text-sm">{a.text}</p><p className="text-xs text-muted">{formatDateTime(a.at)}</p></div></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-lg font-bold">Workload by owner</h2>
            <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))]">
              {workload.map((w) => (
                <div key={w.name} className="flex items-center justify-between gap-3 p-3 text-sm"><div><p className="font-semibold">{w.name}</p><p className="text-xs text-muted">{w.role}</p></div><span className="tint-chip tint-blue px-2 py-0.5 text-xs font-bold">{w.count} open</span></div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold">Quick actions</h2>
            <div className="ds-card p-2">
              {quick.map((q) => (
                <Link key={q.href} href={q.href} className="flex items-center gap-2.5 rounded-lg p-2.5 text-sm font-semibold hover:bg-[color:var(--surface-hover,rgba(0,0,0,0.03))]"><q.icon className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" />{q.label}<ChevronRight className="ml-auto h-4 w-4 text-muted" aria-hidden="true" /></Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* --- GD client administration --- */
function GdClientAdminView({ route }: { route: RouteDefinition }) {
  const { store, userName, clientOrgs } = useGdAdminData();
  const [query, setQuery] = useState("");
  const rows = clientOrgs
    .filter((o) => o.name.toLowerCase().includes(query.trim().toLowerCase()))
    .map((o) => {
      const plan = store.gdPlans.find((pl) => pl.organizationId === o.id);
      const reqs = store.legalRequests.filter((r) => r.organizationId === o.id);
      const openReq = reqs.filter((r) => !["resolved", "converted_to_matter", "closed"].includes(r.status)).length;
      const matters = matterReferences.filter((m) => m.organizationId === o.id && !/closed|completed/i.test(m.status)).length;
      const st = store.entitlements.some((e) => e.organizationId === o.id && e.code.startsWith("SIGNATRAIN") && e.status === "active");
      const tasks = onboardingTasks.filter((t) => t.organizationId === o.id);
      const onbPct = tasks.length ? Math.round((tasks.filter((t) => t.status === "accepted").length / tasks.length) * 100) : null;
      const owner = GD_OWNER_BY_ORG[o.id];
      const status = (o as { status?: string }).status ?? "active";
      return { o, plan, openReq, matters, st, onbPct, owner, status };
    });

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Manage GD clients — portal access, contacts, ownership, and status." />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <label className="ds-field inline-flex items-center gap-2 px-3 py-2 text-sm"><Search className="h-4 w-4 opacity-60" aria-hidden="true" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search clients" className="w-56 bg-transparent outline-none" /></label>
        <button type="button" className="ds-button ds-button-primary inline-flex px-4 py-2 text-sm"><Plus className="h-4 w-4" aria-hidden="true" />Create client</button>
      </div>
      <div className="ds-card overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Company</th><th>Status</th><th>Plan</th><th>GD owner</th><th>Onboarding</th><th>Open requests</th><th>Active matters</th><th>Signatrain</th></tr></thead>
          <tbody>
            {rows.map(({ o, plan, openReq, matters, st, onbPct, owner, status }) => (
              <tr key={o.id}>
                <td className="font-semibold">{o.name}</td>
                <td><StatusChip value={status} /></td>
                <td className="text-sm">{plan ? plan.tier : "—"}</td>
                <td className="text-sm">{userName(owner)}</td>
                <td className="text-sm">{onbPct === null ? "—" : `${onbPct}%`}</td>
                <td className="text-sm">{openReq}</td>
                <td className="text-sm">{matters}</td>
                <td className="text-sm">{st ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">Select a client to manage profile, contacts, portal users, products, and onboarding (account management — not legal work).</p>
    </div>
  );
}

/* --- Onboarding operations --- */
function GdOnboardingOpsView({ route }: { route: RouteDefinition }) {
  const { store, userName, clientOrgs } = useGdAdminData();
  const rows = clientOrgs.map((o) => {
    const tasks = onboardingTasks.filter((t) => t.organizationId === o.id);
    if (tasks.length === 0) return null;
    const done = tasks.filter((t) => t.status === "accepted").length;
    const missing = tasks.filter((t) => t.status !== "accepted" && t.requirement === "required").length;
    const pct = Math.round((done / tasks.length) * 100);
    const status = pct === 100 ? "Completed" : pct === 0 ? "Not started" : tasks.some((t) => t.status === "submitted" || t.status === "in_review") ? "Internal review" : "In progress";
    return { o, tasks, done, missing, pct, status };
  }).filter(Boolean) as { o: (typeof clientOrgs)[number]; tasks: OnboardingTask[]; done: number; missing: number; pct: number; status: string }[];

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Track every client's onboarding — what's late, what's received, and what blocks activation." />
      <div className="ds-card mb-6 overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Client</th><th>Status</th><th>Completion</th><th>Missing required</th><th>Owner</th><th>Target go-live</th></tr></thead>
          <tbody>
            {rows.map(({ o, missing, pct, status }) => (
              <tr key={o.id}>
                <td className="font-semibold">{o.name}</td>
                <td><StatusChip value={status} /></td>
                <td><div className="flex items-center gap-2"><div className="progress-track h-2 w-24"><div className="progress-fill" style={{ width: `${pct}%` }} /></div><span className="text-xs text-muted">{pct}%</span></div></td>
                <td className="text-sm">{missing}</td>
                <td className="text-sm">{userName("user_dana")}</td>
                <td className="text-sm text-muted">2026-01-20</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.map(({ o, tasks }) => (
        <section key={o.id} className="mb-6">
          <h2 className="mb-3 text-lg font-bold">{o.name} — checklist review</h2>
          <div className="ds-card divide-y divide-[color:var(--hairline,rgba(0,0,0,0.08))]">
            {tasks.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                <div className="flex items-center gap-3">
                  {t.status === "accepted" ? <CheckCircle2 className="h-4 w-4 text-[color:var(--brand-accent)]" aria-hidden="true" /> : <Circle className="h-4 w-4 text-muted" aria-hidden="true" />}
                  <div><p className="text-sm font-semibold">{t.title}</p><p className="text-xs text-muted">{t.section} · {t.requirement}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusChip value={t.status} />
                  {t.status !== "accepted" ? <button type="button" className="ds-button ds-button-secondary px-2.5 py-1 text-xs">Mark reviewed</button> : null}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Send reminder to client", "Request missing document", "Approve onboarding step", "Complete onboarding"].map((a) => <button key={a} type="button" className="ds-button ds-button-secondary px-3 py-1.5 text-sm">{a}</button>)}
          </div>
        </section>
      ))}
      {rows.length === 0 ? <p className="text-muted">No onboarding in progress.</p> : null}
    </div>
  );
}

/* --- Legal request work queue --- */
function GdRequestQueueView({ route }: { route: RouteDefinition }) {
  const { store, userName } = useGdAdminData();
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [owner, setOwner] = useState("all");
  const [query, setQuery] = useState("");
  const orgName = (id: string) => store.organizations.find((o) => o.id === id)?.name ?? id;
  const lastUpdate = (rid: string) => {
    const t = store.legalMessages.filter((m) => m.requestId === rid).map((m) => m.createdAt).sort();
    return t.length ? t[t.length - 1] : undefined;
  };
  const rows = store.legalRequests.filter((r) => {
    if (status !== "all" && r.status !== status) return false;
    if (priority !== "all" && r.priority !== priority) return false;
    if (owner === "unassigned" && r.assignedAttorneyUserId) return false;
    if (owner !== "all" && owner !== "unassigned" && r.assignedAttorneyUserId !== owner) return false;
    if (query.trim() && !`${r.subject} ${r.topic}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });
  const daysSince = (iso: string) => Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400000));

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="The internal inbox for every client legal request — triage, assign, and track SLA." />
      <div className="stagger mb-4 grid gap-4 sm:grid-cols-4">
        <MiniStat label="Total" value={String(store.legalRequests.length)} tint="tint-brand" />
        <MiniStat label="Needs triage" value={String(store.legalRequests.filter((r) => ["submitted", "triage"].includes(r.status)).length)} tint="tint-amber" />
        <MiniStat label="Waiting on client" value={String(store.legalRequests.filter((r) => r.status === "waiting_for_client").length)} tint="tint-violet" />
        <MiniStat label="High priority" value={String(store.legalRequests.filter((r) => r.priority === "high").length)} tint="tint-rose" />
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="ds-field inline-flex items-center gap-2 px-3 py-2 text-sm"><Search className="h-4 w-4 opacity-60" aria-hidden="true" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-44 bg-transparent outline-none" /></label>
        <select className="ds-field px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>{["all", "submitted", "triage", "assigned", "in_progress", "waiting_for_client", "resolved", "closed"].map((o) => <option key={o} value={o}>{o === "all" ? "All statuses" : o.replaceAll("_", " ")}</option>)}</select>
        <select className="ds-field px-3 py-2 text-sm" value={priority} onChange={(e) => setPriority(e.target.value)}>{["all", "low", "medium", "high"].map((o) => <option key={o} value={o}>{o === "all" ? "All priorities" : o}</option>)}</select>
        <select className="ds-field px-3 py-2 text-sm" value={owner} onChange={(e) => setOwner(e.target.value)}><option value="all">All owners</option><option value="unassigned">Unassigned</option><option value="user_rachel">Rachel Kim</option><option value="user_dana">Dana Brooks</option></select>
      </div>
      <div className="ds-card overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Request</th><th>Client</th><th>Category</th><th>Priority</th><th>Status</th><th>Owner</th><th>SLA age</th><th>Updated</th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const upd = lastUpdate(r.id) ?? r.createdAt;
              return (
                <tr key={r.id}>
                  <td><Link href={`/admin/gd/requests/${r.id}`} className="font-bold text-[color:var(--brand-accent)] hover:underline">{r.subject}</Link></td>
                  <td className="text-sm">{orgName(r.organizationId)}</td>
                  <td className="text-sm text-muted">{r.topic}</td>
                  <td><StatusChip value={r.priority} /></td>
                  <td><StatusChip value={r.status} /></td>
                  <td className="text-sm">{r.assignedAttorneyUserId ? userName(r.assignedAttorneyUserId) : "—"}</td>
                  <td className="text-sm text-muted">{daysSince(r.createdAt)}d</td>
                  <td className="text-sm text-muted">{formatDate(upd)}</td>
                </tr>
              );
            })}
            {rows.length === 0 ? <tr><td colSpan={8} className="p-6 text-center text-muted">No requests match these filters.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --- Legal request triage workspace --- */
function GdRequestTriageView({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  const { store } = useGdAdminData();
  const requestId = decodeURIComponent(pathname.split("/").pop() ?? "");
  const request = store.legalRequests.find((r) => r.id === requestId);
  const userName = (id?: string) => store.users.find((u) => u.id === id)?.name ?? "Team member";
  const orgName = (id?: string) => store.organizations.find((o) => o.id === id)?.name ?? id;
  const [note, setNote] = useState("");
  const [reply, setReply] = useState("");
  const [nextAction, setNextAction] = useState("answer");
  const [risk, setRisk] = useState("medium");

  if (!request) {
    return <div className="narrow-shell"><section className="ds-card p-6"><h1 className="page-title text-2xl font-bold">Request not found</h1><Link href="/admin/gd/requests" className="ds-button ds-button-primary mt-4 inline-flex px-4 py-2">Back to queue</Link></section></div>;
  }
  const messages = store.legalMessages.filter((m) => m.requestId === request.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Triage workspace — assess, classify, communicate, and decide the next step." />
      <section className="ds-card mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h2 className="text-2xl font-bold">{request.subject}</h2><p className="mt-1 text-sm text-muted">{orgName(request.organizationId)} · {request.topic} · submitted by {userName(request.submittedByUserId)}</p></div>
          <div className="flex flex-wrap gap-2"><StatusChip value={request.status} /><StatusChip value={request.priority} />{request.privacy === "restricted" ? <StatusChip value="restricted" /> : null}</div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="ds-card p-5">
            <h3 className="font-bold">Client-submitted information</h3>
            <p className="mt-2 text-sm text-muted">{request.description}</p>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-xs uppercase tracking-wide text-muted">Urgency</dt><dd>{request.urgency.replaceAll("_", " ")}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-muted">Requested privacy</dt><dd>{request.privacy.replaceAll("_", " ")}</dd></div>
            </dl>
          </section>

          <section className="ds-card p-5">
            <h3 className="font-bold">Client communication</h3>
            <div className="mt-3 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`ds-card p-3 ${m.visibility === "internal_only" ? "note-internal" : ""}`}>
                  <div className="flex justify-between gap-2"><p className="text-sm font-bold">{userName(m.authorUserId)}</p><p className="text-xs text-muted">{formatDateTime(m.createdAt)}</p></div>
                  {m.visibility === "internal_only" ? <p className="mt-1 text-xs font-bold uppercase text-[color:var(--brand-warm)]">Internal note</p> : null}
                  <p className="mt-1 text-sm">{m.body}</p>
                </div>
              ))}
            </div>
            <textarea className="ds-field mt-3 w-full px-3 py-2 text-sm" rows={2} placeholder="Reply to client…" value={reply} onChange={(e) => setReply(e.target.value)} />
            <button type="button" className="ds-button ds-button-primary mt-2 px-4 py-2 text-sm" disabled={!reply.trim()}><Send className="h-4 w-4" aria-hidden="true" />Send client reply</button>
          </section>

          <section className="ds-card p-5">
            <h3 className="font-bold">Document review</h3>
            <p className="mt-2 text-sm text-muted">No documents attached to this request in the portal.</p>
          </section>
        </div>

        <div className="space-y-6">
          <section className="ds-card p-5">
            <h3 className="font-bold">Triage</h3>
            <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-muted">Risk level</label>
            <select className="ds-field mt-1 w-full px-3 py-2 text-sm" value={risk} onChange={(e) => setRisk(e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
            <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-muted">Recommended next action</label>
            <select className="ds-field mt-1 w-full px-3 py-2 text-sm" value={nextAction} onChange={(e) => setNextAction(e.target.value)}>
              <option value="answer">Answer as simple request</option>
              <option value="info">Ask client for more info</option>
              <option value="assign">Assign attorney</option>
              <option value="matter">Convert to matter</option>
              <option value="project">Convert to project request</option>
              <option value="call">Schedule attorney call</option>
              <option value="close">Close (duplicate / out of scope)</option>
            </select>
          </section>
          <section className="ds-card p-5">
            <h3 className="font-bold">Internal note</h3>
            <textarea className="ds-field mt-2 w-full px-3 py-2 text-sm" rows={3} placeholder="Visible to GD team only" value={note} onChange={(e) => setNote(e.target.value)} />
            <button type="button" className="ds-button ds-button-secondary mt-2 px-3 py-1.5 text-sm" disabled={!note.trim()}>Save note</button>
          </section>
          <section className="ds-card p-5">
            <h3 className="font-bold">Workflow actions</h3>
            <div className="mt-2 flex flex-col gap-2">
              {["Assign to attorney", "Request client info", "Convert to matter", "Create project request", "Mark waiting on client", "Mark completed", "Close request"].map((a) => <button key={a} type="button" className="ds-button ds-button-secondary px-3 py-1.5 text-sm">{a}</button>)}
            </div>
          </section>
        </div>
      </div>
      <div className="mt-6"><Link href="/admin/gd/requests" className="text-sm font-bold text-[color:var(--brand-accent)] hover:underline">← Back to queue</Link></div>
    </div>
  );
}

/* --- Project request administration --- */
function GdProjectAdminView({ route }: { route: RouteDefinition }) {
  const { store, userName } = useGdAdminData();
  const orgName = (id: string) => store.organizations.find((o) => o.id === id)?.name ?? id;
  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Manage flat-fee project requests — scope, proposal, approval, and delivery." />
      <div className="ds-card overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Project</th><th>Client</th><th>Type</th><th>Status</th><th>Attorney</th><th>Submitted</th></tr></thead>
          <tbody>
            {gdProjectRequestsData.map((pr) => (
              <tr key={pr.id}>
                <td className="font-semibold">{pr.title}</td>
                <td className="text-sm">{orgName(pr.organizationId)}</td>
                <td className="text-sm text-muted">{pr.type}</td>
                <td><StatusChip value={pr.status} /></td>
                <td className="text-sm">{pr.assignedAttorneyUserId ? userName(pr.assignedAttorneyUserId) : "—"}</td>
                <td className="text-sm text-muted">{formatDate(pr.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="ds-card mt-6 p-5">
        <h2 className="text-lg font-bold">Scoping &amp; proposal</h2>
        <p className="mt-1 text-sm text-muted">Select a project to define scope, deliverables, exclusions, timeline, and flat-fee terms, then send a proposal for client approval.</p>
        <div className="mt-3 flex flex-wrap gap-2">{["Assign attorney", "Prepare scope", "Send proposal", "Mark approved", "Mark in progress", "Mark delivered"].map((a) => <button key={a} type="button" className="ds-button ds-button-secondary px-3 py-1.5 text-sm">{a}</button>)}</div>
      </section>
    </div>
  );
}

/* --- Template administration --- */
function GdTemplateAdminView({ route }: { route: RouteDefinition }) {
  const [status, setStatus] = useState("all");
  const rows = gdTemplates.filter((t) => status === "all" || (status === "published" ? t.status === "published" : t.status !== "published"));
  return (
    <div className="content-shell">
      <ScreenHeading route={route} description="Internal CMS for the GD template library — draft, legal review, publish, and versioning." />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <select className="ds-field px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">In progress</option></select>
        <button type="button" className="ds-button ds-button-primary inline-flex px-4 py-2 text-sm"><Plus className="h-4 w-4" aria-hidden="true" />Create template</button>
      </div>
      <div className="ds-card overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Template</th><th>Category</th><th>Status</th><th>Owner</th><th>Reviewer</th><th>Client visibility</th><th>Updated</th></tr></thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td className="font-semibold">{t.title}</td>
                <td className="text-sm text-muted">{t.category}</td>
                <td><StatusChip value={t.status} /></td>
                <td className="text-sm">Sam Carter</td>
                <td className="text-sm">Rachel Kim</td>
                <td className="text-sm">{t.audiencePlans.join(", ")}</td>
                <td className="text-sm text-muted">{t.lastUpdated ? formatDate(t.lastUpdated) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">Workflow: Sam drafts → Rachel legal review → Dana publishes to the client library. Templates carry a periodic review date.</p>
    </div>
  );
}

