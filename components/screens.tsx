"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  LockKeyhole,
  Scale,
  Send,
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
  "/app/gd/requests",
  "/app/gd/requests/[requestId]",
  "/app/gd/matters",
  "/app/signatrain/live",
  "/app/signatrain/library",
  "/app/signatrain/progress",
  "/admin/alerts"
];

export function hasCustomScreen(path: string): boolean {
  return CUSTOM_SCREEN_PATHS.includes(path);
}

export function CustomScreen({ route, pathname }: { route: RouteDefinition; pathname: string }) {
  switch (route.path) {
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

/* ------------------------------ GD: requests ------------------------------ */

function RequestListView({ route }: { route: RouteDefinition }) {
  const { store, activeUser } = useDemoStore();
  const requests = visibleLegalRequestsForUser(activeUser, store);
  const openCount = requests.filter((request) =>
    ["submitted", "triage", "assigned", "in_progress"].includes(request.status)
  ).length;
  const waitingCount = requests.filter((request) => request.status === "waiting_for_client").length;
  const resolvedCount = requests.filter((request) =>
    ["resolved", "converted_to_matter", "closed"].includes(request.status)
  ).length;

  return (
    <div className="content-shell">
      <ScreenHeading
        route={route}
        description="Legal requests visible to this persona. Restricted requests are hidden from non-participants."
      />
      <div className="stagger mb-6 grid gap-4 sm:grid-cols-3">
        <MiniStat label="Open" value={String(openCount)} tint="tint-blue" />
        <MiniStat label="Waiting for client" value={String(waitingCount)} tint="tint-amber" />
        <MiniStat label="Resolved" value={String(resolvedCount)} tint="tint-emerald" />
      </div>
      {requests.length === 0 ? (
        <section className="ds-card p-6 text-center">
          <h2 className="text-xl font-bold">No visible requests</h2>
          <p className="mt-2 text-muted">This persona has no legal requests in view.</p>
        </section>
      ) : (
        <section className="ds-card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Topic</th>
                <th>Status</th>
                <th>Privacy</th>
                <th>Priority</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
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
                  <td className="text-sm text-muted">{formatDate(request.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
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
