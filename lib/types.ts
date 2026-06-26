import type {
  AuditEvent,
  Certificate,
  Entitlement,
  EntitlementCode,
  LegalMessage,
  LegalRequest,
  LiveSession,
  Notification,
  Organization,
  RoleCode,
  SeatAssignment,
  SeatPool,
  User
} from "@/schemas/domain-types";

export type ProductContext = "shared" | "gd" | "signatrain" | "admin";
export type GuardRole = RoleCode | "ALL_ACTIVE";

export interface RouteDefinition {
  path: string;
  name: string;
  domain: string;
  priority: "P0" | "P1";
  allowedRoles: GuardRole[];
  requiredEntitlementsAny: EntitlementCode[];
  primaryActions: string[];
  states: string[];
}

export interface DemoPersona {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  roles: RoleCode[];
  startRoute: string;
  description: string;
}

export interface CatalogSku {
  id: string;
  name: string;
  product: EntitlementCode;
  priceDisplay: string;
  additionalSeatDisplay?: string;
  selfService: boolean;
}

export interface SubscriptionReference {
  id: string;
  organizationId: string;
  product: EntitlementCode;
  status: string;
  cadence: string;
  amountDisplay: string;
  source: string;
  renewsAt: string;
}

export interface GDPlan {
  id: string;
  organizationId: string;
  tier: "CONCIERGE" | "ALL_ACCESS";
  status: string;
  startsAt: string;
  renewsAt: string;
  includedHrSeats: number;
}

export interface BenefitAllocation {
  id: string;
  organizationId: string;
  name: string;
  allowance: number | null;
  used: number | null;
  renewsAt: string;
}

export interface LegislativeAlertFixture {
  id: string;
  title: string;
  summary: string;
  impact: string;
  recommendedAction: string;
  topic: string;
  jurisdictionIds: string[];
  effectiveDate: string;
  status: string;
  audiences: Array<"GD" | "HR">;
  sourceReferences: string[];
  createdByUserId: string;
  approvedByUserId?: string | null;
  approvedAt?: string | null;
  publishedAt?: string | null;
}

export interface DemoStoreData {
  schemaVersion: number;
  activePersonaId: string;
  activeOrganizationId: string;
  activeProduct: ProductContext;
  users: User[];
  organizations: Organization[];
  personas: DemoPersona[];
  entitlements: Entitlement[];
  seatPools: SeatPool[];
  seatAssignments: SeatAssignment[];
  subscriptions: SubscriptionReference[];
  catalogSkus: CatalogSku[];
  gdPlans: GDPlan[];
  gdBenefits: BenefitAllocation[];
  legalRequests: LegalRequest[];
  legalMessages: LegalMessage[];
  notifications: Notification[];
  emailOutbox: Array<{
    id: string;
    recipient: string;
    subject: string;
    templateKey: string;
    body: string;
    createdAt: string;
  }>;
  auditEvents: AuditEvent[];
  alerts: LegislativeAlertFixture[];
  courses: Array<{
    id: string;
    title: string;
    audience: "HR" | "MANAGER";
    status: string;
    topic: string;
    moduleIds: string[];
  }>;
  scenarios: Array<{
    id: string;
    title: string;
    audiences: Array<"HR" | "MANAGER">;
    topic: string;
    status: string;
    durationMinutes: number;
    summary: string;
    cohortId?: string;
  }>;
  liveSessions: LiveSession[];
  certificates: Certificate[];
}

export interface AccessResult {
  allowed: boolean;
  reason?: string;
  requiredRoles?: GuardRole[];
  requiredEntitlements?: EntitlementCode[];
}
