import type { LegalMessage, LegalRequest, User } from "@/schemas/domain-types";
import { isInternalUser } from "@/lib/access";
import type { DemoStoreData } from "@/lib/types";

function hasRole(user: User, role: string): boolean {
  return user.roles.includes(role as never);
}

function isAssignedAttorney(user: User, request: LegalRequest): boolean {
  return hasRole(user, "GDA") && request.assignedAttorneyUserId === user.id;
}

function isGdOperations(user: User): boolean {
  return hasRole(user, "GDO");
}

export function canViewLegalRequest(
  user: User | undefined,
  request: LegalRequest,
  _store: DemoStoreData
): boolean {
  if (!user || user.status !== "active") {
    return false;
  }

  if (isGdOperations(user) || isAssignedAttorney(user, request)) {
    return true;
  }

  if (isInternalUser(user)) {
    return false;
  }

  if (user.organizationId !== request.organizationId) {
    return false;
  }

  if (request.submittedByUserId === user.id || request.participantUserIds.includes(user.id)) {
    return true;
  }

  if (request.privacy === "company_visible") {
    return user.roles.includes("CO") || user.roles.includes("CHA");
  }

  return false;
}

export function canViewLegalMessage(
  user: User | undefined,
  request: LegalRequest,
  message: LegalMessage,
  store: DemoStoreData
): boolean {
  if (!canViewLegalRequest(user, request, store)) {
    return false;
  }

  if (message.visibility === "client_visible") {
    return true;
  }

  return Boolean(user && (isGdOperations(user) || isAssignedAttorney(user, request)));
}

export function visibleLegalRequestsForUser(user: User | undefined, store: DemoStoreData): LegalRequest[] {
  return store.legalRequests.filter((request) => canViewLegalRequest(user, request, store));
}
