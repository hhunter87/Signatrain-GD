import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canAccessPath, getAvailableProducts, getPersonaUser } from "@/lib/access";
import { createSeedStore } from "@/lib/fixtures";
import { canViewLegalMessage, canViewLegalRequest } from "@/lib/privacy";
import type { LegalRequest } from "@/schemas/domain-types";

function user(personaId: string) {
  const store = createSeedStore();
  const found = getPersonaUser(store, personaId);
  if (!found) {
    throw new Error(`Missing test persona ${personaId}`);
  }
  return { store, found };
}

describe("role and entitlement route access", () => {
  it("allows additive roles while still requiring the relevant product entitlement", () => {
    const { store, found: maya } = user("persona_maya");
    assert.equal(canAccessPath("/app/gd", maya, store).allowed, true);
    assert.equal(canAccessPath("/app/signatrain", maya, store).allowed, true);

    const { store: prospectStore, found: prospect } = user("persona_prospect");
    assert.equal(canAccessPath("/app/gd", prospect, prospectStore).allowed, false);
    assert.equal(canAccessPath("/app/signatrain", prospect, prospectStore).allowed, false);
    assert.equal(canAccessPath("/pricing", prospect, prospectStore).allowed, true);
  });

  it("blocks Company HR Admin from billing while preserving company admin access", () => {
    const { store, found: jordan } = user("persona_jordan");
    assert.equal(canAccessPath("/app/company/users", jordan, store).allowed, true);
    assert.equal(canAccessPath("/app/company/seats", jordan, store).allowed, true);
    assert.equal(canAccessPath("/app/company/billing", jordan, store).allowed, false);
  });

  it("keeps Manager subscribers out of HR-only Bot and Legislative Tracking routes", () => {
    const { store, found: marcus } = user("persona_marcus");
    assert.equal(canAccessPath("/app/signatrain", marcus, store).allowed, true);
    assert.equal(canAccessPath("/app/signatrain/bot", marcus, store).allowed, false);
    assert.equal(canAccessPath("/app/alerts", marcus, store).allowed, false);
    assert.deepEqual(getAvailableProducts(marcus, store), ["signatrain"]);
  });

  it("does not grant technical platform admins privileged GD legal screens by default", () => {
    const { store, found: platformAdmin } = user("persona_platform");
    assert.equal(canAccessPath("/admin/platform/audit", platformAdmin, store).allowed, true);
    assert.equal(canAccessPath("/admin/gd/requests/req_acme_001", platformAdmin, store).allowed, false);
  });
});

describe("GD request privacy foundations", () => {
  it("restricts a restricted GD request to submitter, participants, GD Operations, and assigned attorney", () => {
    const store = createSeedStore();
    const baseRequest = store.legalRequests[0];
    const restrictedRequest: LegalRequest = {
      ...baseRequest,
      id: "req_restricted_test",
      privacy: "restricted",
      submittedByUserId: "user_maya",
      participantUserIds: ["user_maya"],
      assignedAttorneyUserId: "user_rachel"
    };

    const maya = getPersonaUser(store, "persona_maya");
    const jordan = getPersonaUser(store, "persona_jordan");
    const dana = getPersonaUser(store, "persona_dana");
    const rachel = getPersonaUser(store, "persona_rachel");
    const platformAdmin = getPersonaUser(store, "persona_platform");
    const harborOwner = store.users.find((candidate) => candidate.id === "user_nina");

    assert.equal(canViewLegalRequest(maya, restrictedRequest, store), true);
    assert.equal(canViewLegalRequest(jordan, restrictedRequest, store), false);
    assert.equal(canViewLegalRequest(dana, restrictedRequest, store), true);
    assert.equal(canViewLegalRequest(rachel, restrictedRequest, store), true);
    assert.equal(canViewLegalRequest(platformAdmin, restrictedRequest, store), false);
    assert.equal(canViewLegalRequest(harborOwner, restrictedRequest, store), false);
  });

  it("shows company-visible requests to company admins but never exposes internal-only notes to clients", () => {
    const store = createSeedStore();
    const request = store.legalRequests[0];
    const clientMessage = store.legalMessages.find((message) => message.visibility === "client_visible");
    const internalNote = store.legalMessages.find((message) => message.visibility === "internal_only");
    const maya = getPersonaUser(store, "persona_maya");
    const jordan = getPersonaUser(store, "persona_jordan");
    const dana = getPersonaUser(store, "persona_dana");
    const rachel = getPersonaUser(store, "persona_rachel");

    assert.ok(clientMessage);
    assert.ok(internalNote);
    assert.equal(canViewLegalRequest(jordan, request, store), true);
    assert.equal(canViewLegalMessage(maya, request, clientMessage, store), true);
    assert.equal(canViewLegalMessage(maya, request, internalNote, store), false);
    assert.equal(canViewLegalMessage(jordan, request, internalNote, store), false);
    assert.equal(canViewLegalMessage(dana, request, internalNote, store), true);
    assert.equal(canViewLegalMessage(rachel, request, internalNote, store), true);
  });
});
