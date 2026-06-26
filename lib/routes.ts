import routeManifestJson from "@/config/route-manifest.json";
import type { RouteDefinition } from "@/lib/types";

export const routes = routeManifestJson.routes as RouteDefinition[];

export const p0Routes = routes.filter((route) => route.priority === "P0");

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function routePatternToRegex(path: string): RegExp {
  const pattern = path
    .split("/")
    .map((segment) => {
      if (segment.startsWith("[") && segment.endsWith("]")) {
        return "[^/]+";
      }
      return escapeRegExp(segment);
    })
    .join("/");

  return new RegExp(`^${pattern}$`);
}

export function findRoute(pathname: string): RouteDefinition | undefined {
  return routes.find((route) => route.path === pathname) ?? routes.find((route) => routePatternToRegex(route.path).test(pathname));
}

export function resolveDemoPath(path: string): string {
  const replacements: Record<string, string> = {
    "[sku]": "st_hr_annual",
    "[certificateId]": "CERT-ST-2026-0007",
    "[scenarioId]": "scenario_accommodation",
    "[courseId]": "course_hr_bootcamp",
    "[moduleId]": "module_hr_2",
    "[programId]": "program_manager_core",
    "[sessionId]": "session_masterclass_termination",
    "[cohortId]": "cohort_acme_2026",
    "[contentId]": "course_hr_bootcamp",
    "[requestId]": "req_acme_001",
    "[matterId]": "matter_demo_0142",
    "[alertId]": "alert_nyc_safe_time"
  };

  return Object.entries(replacements).reduce(
    (current, [token, value]) => current.replace(token, value),
    path
  );
}

export function routeProduct(pathname: string): "shared" | "gd" | "signatrain" | "admin" {
  if (pathname.startsWith("/app/gd")) {
    return "gd";
  }
  if (pathname.startsWith("/app/signatrain")) {
    return "signatrain";
  }
  if (pathname.startsWith("/admin")) {
    return "admin";
  }
  return "shared";
}

export function routeGroup(route: RouteDefinition): string {
  if (route.domain.includes("Admin")) {
    return "Admin";
  }
  if (route.domain === "GD") {
    return "Greenwald Doherty";
  }
  if (route.domain === "Signatrain") {
    return "Signatrain";
  }
  if (route.domain === "Legislative") {
    return "Legislative Tracking";
  }
  if (route.domain === "Shared") {
    return "Shared";
  }
  return "Public";
}
