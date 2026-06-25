export type RoleCode =
  | 'PSA' | 'SSA' | 'SOC' | 'FCR' | 'GDO' | 'GDA' | 'GDC'
  | 'CO' | 'CHA' | 'HRS' | 'MGR' | 'GDCU';

export type EntitlementCode =
  | 'GD_CONCIERGE' | 'GD_ALL_ACCESS'
  | 'SIGNATRAIN_HR' | 'SIGNATRAIN_MANAGER'
  | 'LEGISLATIVE_TRACKING' | 'BOT_ACCESS';

export type EntitlementSource =
  | 'manual' | 'stripe' | 'enterprise_contract' | 'gd_included' | 'promotional';

export interface User {
  id: string;
  personaId?: string;
  name: string;
  email: string;
  organizationId: string;
  roles: RoleCode[];
  status: 'invited' | 'active' | 'archived';
  title?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: 'prospect' | 'active' | 'archived';
  type: 'internal' | 'customer';
  industry?: string;
  employeeCount?: number;
  primaryState?: string;
  jurisdictions: string[];
  gdPlanId?: string;
}

export interface Entitlement {
  id: string;
  organizationId: string;
  code: EntitlementCode;
  status: 'pending' | 'active' | 'cancel_at_period_end' | 'expired' | 'suspended' | 'revoked' | 'archived';
  source: EntitlementSource;
  startsAt: string;
  endsAt?: string;
}

export interface SeatPool {
  id: string;
  organizationId: string;
  entitlementCode: 'SIGNATRAIN_HR' | 'SIGNATRAIN_MANAGER';
  capacity: number;
  source: EntitlementSource;
}

export interface SeatAssignment {
  id: string;
  seatPoolId: string;
  userId: string;
  status: 'active' | 'released';
  assignedAt: string;
  releasedAt?: string;
}

export type ContentStatus = 'draft' | 'in_review' | 'approved' | 'rejected' | 'published' | 'archived';
export type Audience = 'HR' | 'MANAGER';

export interface Scenario {
  id: string;
  title: string;
  audiences: Audience[];
  topic: string;
  status: ContentStatus;
  durationMinutes: number;
  summary: string;
  cohortId?: string;
}

export interface Course {
  id: string;
  title: string;
  audience: Audience;
  status: ContentStatus;
  topic: string;
  moduleIds: string[];
  completionRule: { allModules: boolean; evaluationRequired: boolean };
  certificateTemplate?: string | null;
}

export interface Module {
  id: string;
  courseId: string;
  order: number;
  title: string;
  contentBlocks: string[];
  status: ContentStatus;
}

export interface VideoAsset {
  id: string;
  title: string;
  durationSeconds: number;
  poster?: string;
}

export interface VideoProgress {
  id: string;
  userId: string;
  videoId: string;
  watchedIntervals: Array<[number, number]>;
  uniqueSeconds: number;
  percent: number;
  completed: boolean;
}

export interface LiveSession {
  id: string;
  title: string;
  type: 'HR_MASTERCLASS' | 'RISK_ROUNDTABLE' | 'MANAGER_CORE' | 'PRIVATE_COHORT';
  audience: Audience;
  startsAt: string;
  durationMinutes: number;
  status: 'draft' | 'scheduled' | 'registration_open' | 'completed' | 'cancelled';
  facultyUserIds: string[];
  zoomReference?: string;
  recordingStatus: 'none' | 'recording_pending' | 'recording_published';
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  userId: string;
  scheduledMinutes: number;
  attendedMinutes: number;
  completion: boolean;
}

export interface Certificate {
  id: string;
  userId: string;
  title: string;
  courseId?: string;
  programId?: string;
  issuedAt: string;
  status: 'issued' | 'revoked';
  verificationSlug: string;
  creditMetadata?: { provider: string; credits: number; programCode?: string } | null;
}

export interface LegalRequest {
  id: string;
  organizationId: string;
  submittedByUserId: string;
  subject: string;
  topic: string;
  description: string;
  urgency: 'standard' | 'time_sensitive' | 'urgent';
  privacy: 'company_visible' | 'restricted';
  status: 'submitted' | 'triage' | 'assigned' | 'in_progress' | 'waiting_for_client' | 'resolved' | 'converted_to_matter' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedAttorneyUserId?: string;
  participantUserIds: string[];
  clientVisibleSummary?: string;
  createdAt: string;
}

export interface LegalMessage {
  id: string;
  requestId: string;
  authorUserId: string;
  visibility: 'client_visible' | 'internal_only';
  body: string;
  createdAt: string;
}

export interface MatterReference {
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

export interface LegislativeAlert {
  id: string;
  title: string;
  summary: string;
  impact: string;
  recommendedAction: string;
  topic: string;
  jurisdictionIds: string[];
  effectiveDate: string;
  status: ContentStatus;
  audiences: Array<'GD' | 'HR'>;
  sourceReferences: string[];
  createdByUserId: string;
  approvedByUserId?: string | null;
  approvedAt?: string | null;
  publishedAt?: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  href?: string;
  readAt?: string | null;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  actorUserId: string;
  action: string;
  objectType: string;
  objectId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
