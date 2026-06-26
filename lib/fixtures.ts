import demoConfigJson from "@/config/demo-config.json";
import personasJson from "@/config/demo-personas.json";
import commerceJson from "@/mock-data/commerce.json";
import gdDataJson from "@/mock-data/gd-data.json";
import learningProgressJson from "@/mock-data/learning-progress.json";
import legislativeAlertsJson from "@/mock-data/legislative-alerts.json";
import organizationsJson from "@/mock-data/organizations.json";
import sessionsJson from "@/mock-data/sessions-cohorts.json";
import signatrainContentJson from "@/mock-data/signatrain-content.json";
import systemJson from "@/mock-data/system.json";
import usersJson from "@/mock-data/users.json";
import type { DemoStoreData, ProductContext } from "@/lib/types";

export const demoConfig = demoConfigJson;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function productFromRoute(route: string): ProductContext {
  if (route.startsWith("/app/gd")) {
    return "gd";
  }
  if (route.startsWith("/app/signatrain")) {
    return "signatrain";
  }
  if (route.startsWith("/admin")) {
    return "admin";
  }
  return "shared";
}

export function createSeedStore(): DemoStoreData {
  const personas = clone(personasJson.personas) as DemoStoreData["personas"];
  const defaultPersona =
    personas.find((persona) => persona.id === demoConfig.defaultPersonaId) ?? personas[0];

  return {
    schemaVersion: demoConfig.schemaVersion,
    activePersonaId: defaultPersona.id,
    activeOrganizationId: defaultPersona.organizationId,
    activeProduct: productFromRoute(defaultPersona.startRoute),
    users: clone(usersJson.users) as DemoStoreData["users"],
    organizations: clone(organizationsJson.organizations) as DemoStoreData["organizations"],
    personas,
    entitlements: clone(commerceJson.entitlements) as DemoStoreData["entitlements"],
    seatPools: clone(commerceJson.seatPools) as DemoStoreData["seatPools"],
    seatAssignments: clone(commerceJson.seatAssignments) as DemoStoreData["seatAssignments"],
    subscriptions: clone(commerceJson.subscriptions) as DemoStoreData["subscriptions"],
    catalogSkus: clone(commerceJson.catalogSkus) as DemoStoreData["catalogSkus"],
    gdPlans: clone(gdDataJson.plans) as DemoStoreData["gdPlans"],
    gdBenefits: clone(gdDataJson.benefits) as DemoStoreData["gdBenefits"],
    legalRequests: clone(gdDataJson.legalRequests) as DemoStoreData["legalRequests"],
    legalMessages: clone(gdDataJson.messages) as DemoStoreData["legalMessages"],
    notifications: clone(systemJson.notifications) as DemoStoreData["notifications"],
    emailOutbox: clone(systemJson.emailOutbox) as DemoStoreData["emailOutbox"],
    auditEvents: clone(systemJson.auditEvents) as DemoStoreData["auditEvents"],
    alerts: clone(legislativeAlertsJson.alerts) as DemoStoreData["alerts"],
    courses: clone(signatrainContentJson.courses) as DemoStoreData["courses"],
    scenarios: clone(signatrainContentJson.scenarios) as DemoStoreData["scenarios"],
    liveSessions: clone(sessionsJson.liveSessions) as DemoStoreData["liveSessions"],
    certificates: clone(learningProgressJson.certificates) as DemoStoreData["certificates"]
  };
}

export function cloneStore(store: DemoStoreData): DemoStoreData {
  return clone(store);
}

export function inferProductFromRoute(route: string): ProductContext {
  return productFromRoute(route);
}
