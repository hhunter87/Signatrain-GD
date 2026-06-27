import type { EntitlementCode, Organization, RoleCode, User } from "@/schemas/domain-types";
import { findRoute } from "@/lib/routes";
import type { AccessResult, DemoStoreData, GuardRole, ProductContext, RouteDefinition } from "@/lib/types";

const activeEntitlementStatuses = new Set(["active", "cancel_at_period_end"]);
const internalRoles = new Set<RoleCode>(["PSA", "SSA", "SOC", "FCR", "GDO", "GDA", "GDC"]);

export function isInternalUser(user: User | undefined): boolean {
  return Boolean(user?.roles.some((role) => internalRoles.has(role)));
}

export function getActiveUser(store: DemoStoreData): User | undefined {
  const persona = store.personas.find((item) => item.id === store.activePersonaId);
  return store.users.find((user) => user.personaId === persona?.id);
}

export function getActiveOrganization(store: DemoStoreData): Organization | undefined {
  return store.organizations.find((organization) => organization.id === store.activeOrganizationId);
}

export function getPersonaUser(store: DemoStoreData, personaId: string): User | undefined {
  return store.users.find((user) => user.personaId === personaId);
}

export function hasAnyRole(user: User | undefined, roles: GuardRole[]): boolean {
  if (!user || user.status !== "active") {
    return false;
  }

  if (roles.length === 0) {
    return true;
  }

  if (roles.includes("ALL_ACTIVE")) {
    return true;
  }

  return user.roles.some((role) => roles.includes(role));
}

export function getEffectiveOrganizationId(user: User, store: DemoStoreData): string {
  return isInternalUser(user) ? store.activeOrganizationId : user.organizationId;
}

export function hasActiveEntitlement(
  organizationId: string,
  requiredEntitlements: EntitlementCode[],
  store: DemoStoreData
): boolean {
  if (requiredEntitlements.length === 0) {
    return true;
  }

  return store.entitlements.some(
    (entitlement) =>
      entitlement.organizationId === organizationId &&
      requiredEntitlements.includes(entitlement.code) &&
      activeEntitlementStatuses.has(entitlement.status)
  );
}

export function canAccessRoute(
  route: RouteDefinition | undefined,
  user: User | undefined,
  store: DemoStoreData
): AccessResult {
  if (!route) {
    return {
      allowed: false,
      reason: "This screen is not available."
    };
  }

  const isPublic = route.allowedRoles.length === 0 && route.requiredEntitlementsAny.length === 0;
  if (isPublic) {
    return { allowed: true };
  }

  if (!user || user.status !== "active") {
    return {
      allowed: false,
      reason: "Select an active persona to continue.",
      requiredRoles: route.allowedRoles,
      requiredEntitlements: route.requiredEntitlementsAny
    };
  }

  if (!hasAnyRole(user, route.allowedRoles)) {
    return {
      allowed: false,
      reason: "The active persona does not have a role allowed for this screen.",
      requiredRoles: route.allowedRoles,
      requiredEntitlements: route.requiredEntitlementsAny
    };
  }

  const organizationId = getEffectiveOrganizationId(user, store);
  const organization = store.organizations.find((item) => item.id === organizationId);
  if (!organization || organization.status === "archived") {
    return {
      allowed: false,
      reason: "The active organization is not available for this screen.",
      requiredRoles: route.allowedRoles,
      requiredEntitlements: route.requiredEntitlementsAny
    };
  }

  if (!hasActiveEntitlement(organizationId, route.requiredEntitlementsAny, store)) {
    return {
      allowed: false,
      reason: "The active organization does not have the required active product entitlement.",
      requiredRoles: route.allowedRoles,
      requiredEntitlements: route.requiredEntitlementsAny
    };
  }

  return { allowed: true };
}

export function canAccessPath(pathname: string, user: User | undefined, store: DemoStoreData): AccessResult {
  return canAccessRoute(findRoute(pathname), user, store);
}

export function getAvailableProducts(user: User | undefined, store: DemoStoreData): ProductContext[] {
  const products: ProductContext[] = [];

  if (canAccessPath("/app/gd", user, store).allowed) {
    products.push("gd");
  }

  if (canAccessPath("/app/signatrain", user, store).allowed) {
    products.push("signatrain");
  }

  if (user && isInternalUser(user)) {
    products.push("admin");
  }

  return products;
}

export function productLabel(product: ProductContext): string {
  switch (product) {
    case "gd":
      return "Greenwald Doherty";
    case "signatrain":
      return "Signatrain";
    case "admin":
      return "Admin";
    default:
      return "My Products";
  }
}
