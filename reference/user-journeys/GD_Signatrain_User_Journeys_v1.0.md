# GD and Signatrain User Journeys v1.0

These Mermaid diagrams are the canonical, Miro-ready journey sources. Each diagram is stored separately in `mmd/`; the matching `svg/` file is a static preview generated from the same structured journey definition.

## Journey catalog

| ID | Journey | Domain | Primary actors | Key integrations |
|---|---|---|---|---|
| J00 | Integrated Journey Landscape | Cross-platform | All external and internal roles | Shared Core, Signatrain, GD Portal, Legislative Tracking |
| J01 | Invitation, Account Activation, and Cross-Product Access | Shared Platform Core | Inviting administrator; invited user; platform | Authentication provider; email provider |
| J02 | Company Setup and Manual Seat Provisioning | Shared Platform Core | Internal domain administrator; Company Owner; Company HR Admin; platform | Email provider; optional contract/CRM references |
| J03 | Online Company Purchase and Entitlement Activation | Shared Platform Core / Optional Billing | Company Owner; platform; Stripe; internal operations | Stripe; email provider |
| J04 | Cancellation, Organization Archive, and Reactivation | Shared Platform Core | Company Owner; internal administrator; platform; Stripe | Stripe for online subscriptions |
| J05 | Signatrain HR Subscriber Learning Journey | Signatrain HR | HR Subscriber; Signatrain portal; video provider; optional Bot and Legislative Tracking services | Secure video provider; Zoom; third-party Bot; Legislative Tracking |
| J06 | Manager Program Enrollment and Completion | Signatrain Manager | Manager Subscriber; Company HR Admin; Signatrain portal; Zoom; video provider | Secure video provider; Zoom; certificate service |
| J07 | Private Company Cohort Lifecycle | Signatrain Cohorts | Signatrain Ops / Content Admin; Company HR Admin; cohort learner; faculty | Zoom; secure video/file storage; notifications |
| J08 | Live Session Registration, Attendance, and Recording Lifecycle | Signatrain Live Sessions | Signatrain administrator; learner; faculty; platform; Zoom | Zoom; email/in-app notifications; secure video provider |
| J09 | Signatrain Content Authoring, Review, and Publication | Signatrain Content Administration | Signatrain Ops / Content Admin; Faculty / Content Reviewer; platform | Secure video provider; file storage; notifications |
| J10 | Certificate Eligibility, Issuance, and Verification | Signatrain Completion and Certificates | Learner; platform; Signatrain administrator; public verifier | Certificate file storage; email provider |
| J11 | Greenwald Doherty Client Onboarding | GD Portal | GD Operations Admin; Company Owner / GD Client User; platform | File storage; email provider; optional Centerbase and Stripe references |
| J12 | GD Legal Request, Triage, and Matter Conversion | GD Portal | GD Client User; GD Operations Admin; assigned GD Attorney; Centerbase | File storage; Calendly; Centerbase; email notifications |
| J13 | GD Flat-Fee Project Request and Adobe Sign Handoff | GD Portal | GD client; GD Operations Admin; GD Attorney; Adobe Sign; Centerbase | Adobe Sign; Centerbase; email notifications |
| J14 | GD-Included Signatrain HR Seat Provisioning | Cross-product GD to Signatrain | GD Operations Admin; Company Owner / Company HR Admin; platform; invited HR user | Shared entitlement layer; email provider |
| J15 | Legislative Alert Authoring, Legal Review, and Distribution | Legislative Tracking MVP-Lite | Alert editor; GD Attorney / legal reviewer; operations publisher; eligible recipient; platform | Email provider; GD and Signatrain portal contexts |
| J16 | Legislative Tracking Jurisdiction Coverage Change | Legislative Tracking MVP-Lite | Company Owner / Company HR Admin; internal operations; platform | Notifications; optional commercial / contract reference |

## Detailed diagrams

### J00 - Integrated Journey Landscape

**Domain:** Cross-platform  
**Primary actors:** All external and internal roles  
**Trigger:** Product discovery and platform planning  
**Outcome:** Traceable index of detailed journeys  
**Integrations:** Shared Core, Signatrain, GD Portal, Legislative Tracking  
**Traceability:** Product Definition v1.0; Functional Map v1.0

**Scope notes:** This diagram is an index. Detailed behavior is defined in J01-J16.

```mermaid
%% J00 - Integrated Journey Landscape
%% Domain: Cross-platform
%% Source requirements: Product Definition v1.0; Functional Map v1.0
flowchart TB
  subgraph LAND["Journey Domains"]
    direction TB
    A(["Shared Platform Core"])
    B["J01 Invitation and cross-product access"]
    C["J02 Company setup and manual seat provisioning"]
    D["J03 Online purchase and entitlement activation"]
    E["J04 Cancellation, archive, and reactivation"]
    F(["Signatrain"])
    G["J05 HR subscriber learning journey"]
    H["J06 Manager program journey"]
    I["J07 Private company cohort lifecycle"]
    J["J08 Live session and recording lifecycle"]
    K["J09 Content authoring, review, and publication"]
    L["J10 Certificate lifecycle"]
    M(["Greenwald Doherty"])
    N["J11 GD client onboarding"]
    O["J12 Legal request, triage, and matter conversion"]
    P["J13 Flat-fee project and Adobe Sign"]
    Q["J14 GD-included Signatrain seat"]
    R(["Legislative Tracking MVP-Lite"])
    S["J15 Alert authoring, review, and distribution"]
    T["J16 Jurisdiction coverage change"]
  end
  A --> B
  A --> C
  A --> D
  A --> E
  F --> G
  F --> H
  F --> I
  F --> J
  F --> K
  F --> L
  M --> N
  M --> O
  M --> P
  M --> Q
  R --> S
  R --> T
  C -.->|"provisions access"| G
  C -.->|"provisions access"| H
  N -.->|"included benefit"| Q
  O -.->|"project path"| P
  S -.->|"HR add-on feed"| G
  S -.->|"GD plan feed"| N
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class A,F,M,R startend;
  class B,C,D,E,G,H,I,J,K,L,N,O,P,Q,S,T action;
```

### J01 - Invitation, Account Activation, and Cross-Product Access

**Domain:** Shared Platform Core  
**Primary actors:** Inviting administrator; invited user; platform  
**Trigger:** Administrator invites a user and assigns permitted product access  
**Outcome:** Active account with role- and entitlement-based access to GD, Signatrain, or both  
**Integrations:** Authentication provider; email provider  
**Traceability:** CORE-IAM-01/02/08; CORE-USR-02/03; CORE-ENT-05; CORE-NOT-02

**Scope notes:** Permissions are additive when a user holds multiple roles. Company 3 is never shown as a user-facing product.

```mermaid
%% J01 - Invitation, Account Activation, and Cross-Product Access
%% Domain: Shared Platform Core
%% Source requirements: CORE-IAM-01/02/08; CORE-USR-02/03; CORE-ENT-05; CORE-NOT-02
flowchart LR
  subgraph ADMIN["Inviting Administrator"]
    direction TB
    A1(["Select organization, user email, roles, and products"])
    A2["Confirm seat or entitlement availability"]
    A3["Resend or revoke invitation"]
  end
  subgraph PLAT["Shared Platform"]
    direction TB
    P1["Validate organization scope and administrator authority"]
    P2["Reserve seat and create pending invitation"]
    P3[["Send time-limited invitation email"]]
    D1{"Invitation valid?"}
    P4["Activate account and assigned roles"]
    P5["Evaluate active entitlements and product permissions"]
    D2{"Access to both public products?"}
  end
  subgraph USER["Invited User"]
    direction TB
    U1["Open invitation link"]
    U2["Set credentials and accept required terms"]
    U3["Sign in"]
    U4["Open My Products switcher"]
    U5["Enter entitled portal directly"]
    END(["User reaches authorized dashboard"])
  end
  A1 --> A2
  A2 --> P1
  P1 --> P2
  P2 --> P3
  P3 --> U1
  U1 --> D1
  D1 -->|"Yes"| U2
  D1 -->|"No / expired"| A3
  A3 -->|"Resend"| P3
  U2 --> P4
  P4 --> U3
  U3 --> P5
  P5 --> D2
  D2 -->|"Yes"| U4
  D2 -->|"No"| U5
  U4 -->|"Select GD or Signatrain"| END
  U5 --> END
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class A1,END startend;
  class A2,P1,P2,U1,U2,P4,U3,P5,U4,U5,A3 action;
  class P3 integration;
  class D1,D2 decision;
```

### J02 - Company Setup and Manual Seat Provisioning

**Domain:** Shared Platform Core  
**Primary actors:** Internal domain administrator; Company Owner; Company HR Admin; platform  
**Trigger:** A contract or approved commercial relationship requires manual provisioning  
**Outcome:** Active organization, administrators, seat inventory, assigned users, and product entitlements  
**Integrations:** Email provider; optional contract/CRM references  
**Traceability:** CORE-ORG-01/05; CORE-USR-02/04; CORE-ENT-02/03/04/05/06; CORE-AUD-01

**Scope notes:** Manual provisioning is the default launch model. Historical learning and legal records remain with the archived user after a seat transfer.

```mermaid
%% J02 - Company Setup and Manual Seat Provisioning
%% Domain: Shared Platform Core
%% Source requirements: CORE-ORG-01/05; CORE-USR-02/04; CORE-ENT-02/03/04/05/06; CORE-AUD-01
flowchart LR
  subgraph INT["Internal Administrator"]
    direction TB
    I1(["Create customer organization"])
    I2["Set company profile, status, plan references, and jurisdictions"]
    I3["Assign Company Owner and optional Company HR Admin"]
    I4["Grant product entitlement with source and effective dates"]
    I5["Create purchased or included seat inventory"]
  end
  subgraph PLAT["Shared Platform"]
    direction TB
    P1["Record audit events and available seat counts"]
    P2[["Reserve seats and send invitations"]]
    D1{"Seat available and user eligible?"}
    P3["Activate user entitlement"]
    END(["Users can access assigned products"])
  end
  subgraph COMP["Company Administrator"]
    direction TB
    C1["Open company user and seat administration"]
    C2["Invite eligible users"]
    C3["Assign available HR or Manager seats"]
    C4["Archive departing user"]
    C5["Transfer seat to another eligible user"]
  end
  I1 --> I2
  I2 --> I3
  I3 --> I4
  I4 --> I5
  I5 --> P1
  P1 --> C1
  C1 --> C2
  C2 --> P2
  P2 --> C3
  C3 --> D1
  D1 -->|"Yes"| P3
  P3 --> END
  D1 -->|"No - correct inventory or assignment"| C3
  END -.->|"Employee leaves"| C4
  C4 --> C5
  C5 --> D1
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class I1,END startend;
  class I2,I3,I4,I5,P1,C1,C2,C3,P3,C4,C5 action;
  class P2 integration;
  class D1 decision;
```

### J03 - Online Company Purchase and Entitlement Activation

**Domain:** Shared Platform Core / Optional Billing  
**Primary actors:** Company Owner; platform; Stripe; internal operations  
**Trigger:** Company Owner chooses an eligible subscription or additional seats  
**Outcome:** Paid or approved subscription creates active entitlements and seat inventory  
**Integrations:** Stripe; email provider  
**Traceability:** CORE-BILL-01-08/10/11; CORE-ENT-03/04/05; CORE-NOT-02

**Scope notes:** Stripe is authoritative for self-service payment state. The portal stores references and status, never raw card or bank details.

```mermaid
%% J03 - Online Company Purchase and Entitlement Activation
%% Domain: Shared Platform Core / Optional Billing
%% Source requirements: CORE-BILL-01-08/10/11; CORE-ENT-03/04/05; CORE-NOT-02
flowchart LR
  subgraph OWNER["Company Owner"]
    direction TB
    O1(["Select product, cadence, and seat quantity"])
    O2["Choose card, ACH, or invoice / PO path"]
    O3["Invite users and assign seats"]
    O4["Add seats mid-period"]
  end
  subgraph PORTAL["Portal"]
    direction TB
    P1["Show approved standard or custom commercial terms"]
    D1{"Self-service payment?"}
    P2["Create or update company subscription reference"]
    P3["Create active product entitlements and seat inventory"]
    END(["Company has active portal access"])
    P4["Show pending / failed payment state and no new access"]
  end
  subgraph STRIPE["Stripe"]
    direction TB
    S1[["Complete hosted checkout or payment setup"]]
    D2{"Payment or subscription active?"}
    S2[["Charge prorated amount immediately"]]
  end
  subgraph OPS["Internal Operations"]
    direction TB
    OP1["Review enterprise contract or PO"]
    OP2["Approve manual activation and payment reference"]
  end
  O1 --> P1
  P1 --> O2
  O2 --> D1
  D1 -->|"Card / ACH"| S1
  S1 --> D2
  D1 -->|"Invoice / PO"| OP1
  OP1 --> OP2
  OP2 --> P2
  D2 -->|"Yes"| P2
  D2 -->|"No"| P4
  P4 -->|"Retry or resolve"| S1
  P2 --> P3
  P3 --> O3
  O3 --> END
  END -.->|"Additional seats"| O4
  O4 --> S2
  S2 --> P3
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class O1,END startend;
  class P1,O2,OP1,OP2,P2,P3,O3,P4,O4 action;
  class D1,D2 decision;
  class S1,S2 integration;
```

### J04 - Cancellation, Organization Archive, and Reactivation

**Domain:** Shared Platform Core  
**Primary actors:** Company Owner; internal administrator; platform; Stripe  
**Trigger:** Cancellation, contract expiry, suspension, or later reactivation  
**Outcome:** Access ends at the correct time without deleting historical records, and may later be restored  
**Integrations:** Stripe for online subscriptions  
**Traceability:** CORE-BILL-08/11; CORE-ORG-04; CORE-USR-04; CORE-ENT-07; PD cancellation rules

**Scope notes:** Cancellation stops renewal but does not revoke access before the paid period ends. Archived records are retained according to domain-specific retention rules.

```mermaid
%% J04 - Cancellation, Organization Archive, and Reactivation
%% Domain: Shared Platform Core
%% Source requirements: CORE-BILL-08/11; CORE-ORG-04; CORE-USR-04; CORE-ENT-07; PD cancellation rules
flowchart LR
  subgraph ACTOR["Company Owner / Internal Admin"]
    direction TB
    A1(["Request cancellation or record contract end"])
    A2["Approve new contract, payment, or manual reactivation"]
  end
  subgraph PLAT["Shared Platform"]
    direction TB
    P1["Set cancellation at paid-period end"]
    P2["Keep access active through paid period"]
    D1{"Paid period ended?"}
    P3["Expire or revoke affected entitlements"]
    P4["Archive company access and external users"]
    P5["Retain learning, certificate, request, audit, and reference history"]
    END1(["Organization archived; no grace period"])
    P6["Reactivate organization and selected users"]
    P7["Grant new active entitlements and seat inventory"]
    END2(["Authorized access restored"])
  end
  subgraph PAY["Stripe / Contract Source"]
    direction TB
    S1[["Stop renewal and retain period-end date"]]
  end
  A1 --> P1
  P1 --> S1
  S1 --> P2
  P2 --> D1
  D1 -->|"No"| P2
  D1 -->|"Yes"| P3
  P3 --> P4
  P4 --> P5
  P5 --> END1
  END1 -.->|"Later reactivation"| A2
  A2 --> P6
  P6 --> P7
  P7 --> END2
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class A1,END1,END2 startend;
  class P1,P2,P3,P4,P5,A2,P6,P7 action;
  class S1 integration;
  class D1 decision;
```

### J05 - Signatrain HR Subscriber Learning Journey

**Domain:** Signatrain HR  
**Primary actors:** HR Subscriber; Signatrain portal; video provider; optional Bot and Legislative Tracking services  
**Trigger:** HR subscriber enters Signatrain with active HR entitlement  
**Outcome:** Subscriber consumes entitled learning, attends live sessions, and completes eligible courses  
**Integrations:** Secure video provider; Zoom; third-party Bot; Legislative Tracking  
**Traceability:** ST-ACC-01; ST-LIB-01-04; ST-CRS-01/03-08; ST-VID-01-04; ST-BOT-01/02; ST-CERT

**Scope notes:** Manager-only users cannot access HR Masterclasses, Risk Roundtable, Bot, or Legislative Tracking. Transcript full-text search is outside MVP.

```mermaid
%% J05 - Signatrain HR Subscriber Learning Journey
%% Domain: Signatrain HR
%% Source requirements: ST-ACC-01; ST-LIB-01-04; ST-CRS-01/03-08; ST-VID-01-04; ST-BOT-01/02; ST-CERT
flowchart LR
  subgraph USER["HR Subscriber"]
    direction TB
    U1(["Open HR dashboard"])
    U2["Choose learning or service path"]
    U3["Browse and self-enroll in eligible course"]
    U4["Complete text, downloads, and optional evaluation"]
    U5["View standalone scenario or approved recording"]
    U6["Choose and register for live session"]
    U7["Open HR Bot"]
    U8["View targeted legislative alerts when add-on is active"]
    END(["Return to dashboard with updated progress"])
  end
  subgraph PORTAL["Signatrain Portal"]
    direction TB
    P1["Show HR courses, Masterclasses, Risk Roundtable, library, progress, and entitled add-ons"]
    D1{"Selected path"}
    P2["Enforce ordered modules and unlock next required item"]
    P3["Mark video complete at 95% unique watch time"]
    P4["Evaluate course completion and certificate eligibility"]
  end
  subgraph EXT["External Services"]
    direction TB
    E1[["Stream gated video and report watched intervals"]]
    E2[["Zoom registration and attendance workflow - see J08"]]
    E3[["Load authenticated third-party Bot embed"]]
  end
  U1 --> P1
  P1 --> U2
  U2 --> D1
  D1 -->|"Course"| U3
  U3 --> P2
  P2 --> E1
  E1 --> P3
  P3 --> U4
  U4 --> P4
  P4 --> END
  D1 -->|"Scenario / recording"| U5
  U5 --> END
  D1 -->|"Masterclass / Roundtable"| U6
  U6 --> E2
  E2 --> END
  D1 -->|"Bot"| U7
  U7 --> E3
  E3 --> END
  D1 -->|"Legislative Tracking"| U8
  U8 --> END
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class U1,END startend;
  class P1,U2,U3,P2,P3,U4,P4,U5,U6,U7,U8 action;
  class D1 decision;
  class E1,E2,E3 integration;
```

### J06 - Manager Program Enrollment and Completion

**Domain:** Signatrain Manager  
**Primary actors:** Manager Subscriber; Company HR Admin; Signatrain portal; Zoom; video provider  
**Trigger:** Manager receives active Manager entitlement and a program assignment or self-enrolls  
**Outcome:** All configured required courses and core sessions are completed and reported  
**Integrations:** Secure video provider; Zoom; certificate service  
**Traceability:** ST-ACC-02; ST-CRS-02/03-10; ST-VID-01-05; ST-LIVE-02-08; ST-CERT; ST-COMP-02/04

**Scope notes:** The required courses and sessions are configurable; they are not hard-coded. Manager subscribers do not gain access to HR-only features.

```mermaid
%% J06 - Manager Program Enrollment and Completion
%% Domain: Signatrain Manager
%% Source requirements: ST-ACC-02; ST-CRS-02/03-10; ST-VID-01-05; ST-LIVE-02-08; ST-CERT; ST-COMP-02/04
flowchart LR
  subgraph ADMIN["Company HR Admin"]
    direction TB
    A1(["Assign manager to configured program"])
    A2["Review progress and export company CSV"]
  end
  subgraph MGR["Manager Subscriber"]
    direction TB
    M1["Open Manager dashboard"]
    M2["Complete ordered course modules"]
    M3["Register for and attend required live sessions"]
  end
  subgraph PORTAL["Signatrain Portal"]
    direction TB
    P1["Validate active seat and create enrollment"]
    P2["Show required courses, scenarios, and three core sessions"]
    P3["Require 95% unique video completion"]
    P4["Require at least 90% session attendance"]
    D1{"All configured program requirements complete?"}
    P5["Show remaining required items"]
    P6["Mark Manager program complete"]
    P7["Evaluate and issue certificate when configured"]
    END(["Program completion recorded and reportable"])
  end
  subgraph EXT["Video / Zoom"]
    direction TB
    E1[["Track secure video watch intervals"]]
    E2[["Return aggregated Zoom attendance"]]
  end
  A1 --> P1
  P1 --> M1
  M1 --> P2
  P2 --> M2
  M2 --> E1
  E1 --> P3
  P3 --> M3
  M3 --> E2
  E2 --> P4
  P4 --> D1
  D1 -->|"No"| P5
  P5 -->|"Complete remaining learning"| M2
  D1 -->|"Yes"| P6
  P6 --> P7
  P7 --> A2
  A2 --> END
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class A1,END startend;
  class P1,M1,P2,M2,P3,M3,P4,P5,P6,P7,A2 action;
  class E1,E2 integration;
  class D1 decision;
```

### J07 - Private Company Cohort Lifecycle

**Domain:** Signatrain Cohorts  
**Primary actors:** Signatrain Ops / Content Admin; Company HR Admin; cohort learner; faculty  
**Trigger:** A private cohort is contracted for one organization  
**Outcome:** Company-only roster completes assigned sessions and private materials with scoped reporting  
**Integrations:** Zoom; secure video/file storage; notifications  
**Traceability:** ST-COH-01/03-06; ST-LIVE-03-10; ST-COMP-02/04; ST-CMS-10

**Scope notes:** Company-specific materials and scenarios are supported. White-label company branding is deferred; standard Signatrain branding applies.

```mermaid
%% J07 - Private Company Cohort Lifecycle
%% Domain: Signatrain Cohorts
%% Source requirements: ST-COH-01/03-06; ST-LIVE-03-10; ST-COMP-02/04; ST-CMS-10
flowchart LR
  subgraph OPS["Signatrain Operations"]
    direction TB
    O1(["Create private cohort for one organization"])
    O2["Set dates, faculty, program rules, and company-only access"]
    O3["Assign live sessions and private scenarios / materials"]
    O4["Review roster, no-shows, completion, and overrides"]
  end
  subgraph COMP["Company HR Admin"]
    direction TB
    C1["Select eligible company users"]
    C2["View company-scoped progress and export CSV"]
  end
  subgraph LEARN["Cohort Learner"]
    direction TB
    L1["Open cohort workspace"]
    L2["Access private materials and scenarios"]
    L3["Register for assigned cohort sessions"]
    L4["Attend sessions and complete assigned content"]
  end
  subgraph PORTAL["Platform / Zoom"]
    direction TB
    D1{"User belongs to cohort company and has required access?"}
    P1["Add learner to cohort roster and send notification"]
    P2[["Create Zoom registrations and provide join links"]]
    P3["Calculate attendance and program completion"]
    END(["Cohort completed with organization-scoped records"])
  end
  O1 --> O2
  O2 --> O3
  O3 --> C1
  C1 --> D1
  D1 -->|"Yes"| P1
  D1 -->|"No - choose eligible user"| C1
  P1 --> L1
  L1 --> L2
  L2 --> L3
  L3 --> P2
  P2 --> L4
  L4 --> P3
  P3 --> O4
  O4 --> C2
  C2 --> END
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class O1,END startend;
  class O2,O3,C1,P1,L1,L2,L3,L4,P3,O4,C2 action;
  class D1 decision;
  class P2 integration;
```

### J08 - Live Session Registration, Attendance, and Recording Lifecycle

**Domain:** Signatrain Live Sessions  
**Primary actors:** Signatrain administrator; learner; faculty; platform; Zoom  
**Trigger:** A Masterclass, Risk Roundtable, course session, or cohort session is scheduled  
**Outcome:** Eligible users register, attendance is calculated, and approved recordings may enter the library  
**Integrations:** Zoom; email/in-app notifications; secure video provider  
**Traceability:** ST-LIVE-01-11; ST-VID-07; Zoom integration map

**Scope notes:** Opening a join link does not count as completion. Recordings are never auto-published.

```mermaid
%% J08 - Live Session Registration, Attendance, and Recording Lifecycle
%% Domain: Signatrain Live Sessions
%% Source requirements: ST-LIVE-01-11; ST-VID-07; Zoom integration map
flowchart LR
  subgraph OPS["Signatrain Operations"]
    direction TB
    O1(["Create session with date, audience, faculty, and status"])
    D1{"Session rescheduled or cancelled?"}
    O2["Optionally apply audited attendance override"]
    O3["Review and approve recording"]
    D3{"Approved for publication?"}
  end
  subgraph USER["Learner / Faculty"]
    direction TB
    U1["Browse eligible dates and register"]
    U2["Open authorized join link near start time"]
  end
  subgraph PORTAL["Signatrain Portal"]
    direction TB
    P1["Create or link Zoom meeting / webinar"]
    P2["Validate entitlement and create portal registration"]
    P3["Update registrations and notify affected users"]
    P4["Aggregate all attendance intervals"]
    D2{"Attendance at least 90%?"}
    P5["Mark session completed"]
    P6["Mark attended / no-show but not completed"]
    P7["Publish recording to entitled library"]
    END(["Attendance and recording status finalized"])
  end
  subgraph ZOOM["Zoom / Video Provider"]
    direction TB
    Z1[["Create Zoom registrant and return join reference"]]
    Z2[["Capture join and leave intervals"]]
    Z3[["Produce recording reference"]]
    Z4[["Transfer / associate secure video asset"]]
  end
  O1 --> P1
  P1 --> U1
  U1 --> P2
  P2 --> Z1
  Z1 --> D1
  D1 -->|"Yes"| P3
  P3 -->|"Reselect date when applicable"| U1
  D1 -->|"No"| U2
  U2 --> Z2
  Z2 --> P4
  P4 --> D2
  D2 -->|"Yes"| P5
  D2 -->|"No"| P6
  P6 -.->|"Correction needed"| O2
  O2 -->|"Override complete"| P5
  P5 --> Z3
  P6 --> Z3
  Z3 --> O3
  O3 --> D3
  D3 -->|"Yes"| Z4
  Z4 --> P7
  D3 -->|"No"| END
  P7 --> END
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class O1,END startend;
  class P1,U1,P2,P3,U2,P4,P5,P6,O2,O3,P7 action;
  class Z1,Z2,Z3,Z4 integration;
  class D1,D2,D3 decision;
```

### J09 - Signatrain Content Authoring, Review, and Publication

**Domain:** Signatrain Content Administration  
**Primary actors:** Signatrain Ops / Content Admin; Faculty / Content Reviewer; platform  
**Trigger:** A new course, module, scenario, recording, or supporting file is created or revised  
**Outcome:** Approved content is published to the correct audience with governance metadata and audit history  
**Integrations:** Secure video provider; file storage; notifications  
**Traceability:** ST-CMS-01-10; ST-VID-06/07; CORE-AUD-01

**Scope notes:** Full content version rollback is outside MVP; a high-level change log is retained. Audience metadata is mandatory for HR / Manager access control.

```mermaid
%% J09 - Signatrain Content Authoring, Review, and Publication
%% Domain: Signatrain Content Administration
%% Source requirements: ST-CMS-01-10; ST-VID-06/07; CORE-AUD-01
flowchart LR
  subgraph AUTHOR["Author / Content Admin"]
    direction TB
    A1(["Create Draft content record"])
    A2["Set content type, audience, topic, duration, and optional jurisdiction"]
    A3["Build ordered modules or standalone scenario"]
    A4["Upload / associate video and supporting files"]
    A5["Set review date, expiration date, and reviewer"]
    A6["Submit content for review"]
    A7["Publish approved content"]
    A8["Revise through a new review cycle or archive"]
  end
  subgraph REVIEW["Faculty / Reviewer"]
    direction TB
    R1["Review legal and instructional content"]
    D1{"Approve?"}
    R2["Return comments and reject to Draft"]
  end
  subgraph PLAT["Signatrain Platform"]
    direction TB
    P1["Show processing and validation status"]
    P2["Record approval, reviewer, date, and change log"]
    P3["Expose content only to eligible audience / cohort"]
    D2{"Review date reached, outdated, or expired?"}
    P4["Hide from new learners and flag for review"]
    END(["Published or archived content retains historical records"])
  end
  A1 --> A2
  A2 --> A3
  A3 --> A4
  A4 --> P1
  P1 --> A5
  A5 --> A6
  A6 --> R1
  R1 --> D1
  D1 -->|"No"| R2
  R2 -->|"Revise"| A1
  D1 -->|"Yes"| P2
  P2 --> A7
  A7 --> P3
  P3 --> D2
  D2 -->|"No"| END
  D2 -->|"Yes"| P4
  P4 --> A8
  A8 -->|"Revise"| A1
  A8 -->|"Archive"| END
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class A1,END startend;
  class A2,A3,A4,P1,A5,A6,R1,R2,P2,A7,P3,P4,A8 action;
  class D1,D2 decision;
```

### J10 - Certificate Eligibility, Issuance, and Verification

**Domain:** Signatrain Completion and Certificates  
**Primary actors:** Learner; platform; Signatrain administrator; public verifier  
**Trigger:** Course, live session, or program completion data changes  
**Outcome:** Eligible learner receives an auditable certificate with limited public verification  
**Integrations:** Certificate file storage; email provider  
**Traceability:** ST-CERT-01-08; ST-CRS-08/10; ST-VID-04; ST-LIVE-07

**Scope notes:** Direct SHRM/HRCI API reporting is outside launch scope; metadata is manually configured. Only limited certificate metadata is exposed publicly.

```mermaid
%% J10 - Certificate Eligibility, Issuance, and Verification
%% Domain: Signatrain Completion and Certificates
%% Source requirements: ST-CERT-01-08; ST-CRS-08/10; ST-VID-04; ST-LIVE-07
flowchart LR
  subgraph LEARN["Learner"]
    direction TB
    L1["See outstanding requirements"]
    L2["Receive notification and download certificate"]
  end
  subgraph PLAT["Signatrain Platform"]
    direction TB
    P1(["Receive completion event"])
    P2["Evaluate required modules, 95% video, 90% live, and optional evaluation"]
    D1{"All configured certificate rules satisfied?"}
    P3["Create certificate candidate with unique number and configured credit metadata"]
    D2{"Administrative approval configured?"}
    P4["Generate certificate file and verification URL / code"]
    P5["Record issuance audit and five-year retention date"]
    P6["Show limited certificate metadata and current status"]
    END(["Certificate lifecycle remains auditable"])
  end
  subgraph ADMIN["Signatrain Administrator"]
    direction TB
    A1["Review and approve certificate"]
    A2["Reissue or revoke with reason when required"]
  end
  subgraph PUBLIC["Public Verifier"]
    direction TB
    V1["Open public verification URL or enter code"]
  end
  P1 --> P2
  P2 --> D1
  D1 -->|"No"| L1
  L1 -->|"After remaining work"| P1
  D1 -->|"Yes"| P3
  P3 --> D2
  D2 -->|"Yes"| A1
  A1 --> P4
  D2 -->|"No"| P4
  P4 --> P5
  P5 --> L2
  L2 -.->|"Share verification"| V1
  V1 --> P6
  P6 --> END
  P5 -.->|"Correction / revocation"| A2
  A2 --> P6
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class P1,END startend;
  class P2,L1,P3,A1,P4,P5,L2,V1,P6,A2 action;
  class D1,D2 decision;
```

### J11 - Greenwald Doherty Client Onboarding

**Domain:** GD Portal  
**Primary actors:** GD Operations Admin; Company Owner / GD Client User; platform  
**Trigger:** A Concierge, All Access, or custom GD plan is approved  
**Outcome:** Client completes required setup tasks and gains active access to plan benefits and linked products  
**Integrations:** File storage; email provider; optional Centerbase and Stripe references  
**Traceability:** GD-PLAN-02-05; GD-ONB-01-05; GD-XP-01; CORE-USR-02

**Scope notes:** The GD portal is a client front door, not a replacement for Centerbase. Client emails link back to the secure portal and omit sensitive document content.

```mermaid
%% J11 - Greenwald Doherty Client Onboarding
%% Domain: GD Portal
%% Source requirements: GD-PLAN-02-05; GD-ONB-01-05; GD-XP-01; CORE-USR-02
flowchart LR
  subgraph GD["GD Operations"]
    direction TB
    G1(["Create or activate GD plan record"])
    G2["Configure benefits, exclusions, renewal data, and named contacts"]
    G3["Build onboarding checklist with owners, due dates, and required documents"]
    G4["Review submissions and task status"]
    D1{"More information or correction needed?"}
    G5["Complete, waive, or close remaining internal tasks"]
  end
  subgraph CLIENT["Client Company"]
    direction TB
    C1["Activate account and open onboarding workspace"]
    C2["Complete eligible tasks and upload requested documents"]
    END(["Client can use entitled GD services and linked products"])
  end
  subgraph PORTAL["GD Portal"]
    direction TB
    P1["Create included Legislative Tracking and Signatrain seat allocations"]
    P2[["Invite Company Owner and client users"]]
    P3["Notify client of reopened or additional task"]
    D2{"All required onboarding tasks complete?"}
    P4["Activate onboarding completion and benefit dashboard"]
  end
  G1 --> G2
  G2 --> P1
  P1 --> G3
  G3 --> P2
  P2 --> C1
  C1 --> C2
  C2 --> G4
  G4 --> D1
  D1 -->|"Yes"| P3
  P3 --> C2
  D1 -->|"No"| G5
  G5 --> D2
  D2 -->|"No - remaining tasks"| G3
  D2 -->|"Yes"| P4
  P4 --> END
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class G1,END startend;
  class G2,P1,G3,C1,C2,G4,P3,G5,P4 action;
  class P2 integration;
  class D1,D2 decision;
```

### J12 - GD Legal Request, Triage, and Matter Conversion

**Domain:** GD Portal  
**Primary actors:** GD Client User; GD Operations Admin; assigned GD Attorney; Centerbase  
**Trigger:** Client submits an employment-law request through the GD portal  
**Outcome:** Request is answered, scheduled, converted to matter-level work, or closed with full permission and audit controls  
**Integrations:** File storage; Calendly; Centerbase; email notifications  
**Traceability:** GD-REQ-01-09; GD-COMM-01-04; GD-MAT-01-04; GD-SCH-01-03; GD-AUD-01

**Scope notes:** Restricted requests are not automatically visible to Company Owners or Company HR Admins. Complete matters, work product, time entries, and billing remain in Centerbase.

```mermaid
%% J12 - GD Legal Request, Triage, and Matter Conversion
%% Domain: GD Portal
%% Source requirements: GD-REQ-01-09; GD-COMM-01-04; GD-MAT-01-04; GD-SCH-01-03; GD-AUD-01
flowchart LR
  subgraph CLIENT["GD Client"]
    direction TB
    C1(["Start New Legal Request"])
    C2["Enter category, subject, description, urgency, contact preference, and attachments"]
    C3["Choose company-visible or restricted privacy scope"]
    C4["Reply and upload additional information"]
  end
  subgraph OPS["GD Operations / Attorney"]
    direction TB
    O1["Triage category, priority, plan scope, and service path"]
    D1{"More information needed?"}
    O2["Assign attorney and permitted participants"]
    D2{"Disposition"}
    O3["Provide general guidance in secure thread"]
    O4["Mark request as requiring matter-level work"]
    O5["Answer and close request or continue through matter reference"]
  end
  subgraph PORTAL["GD Portal"]
    direction TB
    P1["Show emergency / legal disclaimers and create Submitted request"]
    P2["Send secure clarification request"]
    P3["Create limited portal matter reference and approved summary fields"]
    P4["Maintain secure client-visible messages, internal notes, attachments, and status history"]
    END(["Outcome recorded with request-level privacy and audit"])
  end
  subgraph EXT["Calendly / Centerbase"]
    direction TB
    E1[["Launch Calendly scheduling when a call is needed"]]
    E2[["Create / link authoritative Centerbase matter"]]
  end
  C1 --> C2
  C2 --> C3
  C3 --> P1
  P1 --> O1
  O1 --> D1
  D1 -->|"Yes"| P2
  P2 --> C4
  C4 --> O1
  D1 -->|"No"| O2
  O2 --> D2
  D2 -->|"General guidance"| O3
  O3 --> P4
  D2 -->|"Schedule call"| E1
  E1 --> P4
  D2 -->|"Matter-level work"| O4
  O4 --> E2
  E2 --> P3
  P3 --> P4
  P4 --> O5
  O5 --> END
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class C1,END startend;
  class C2,C3,P1,O1,P2,C4,O2,O3,O4,P3,P4,O5 action;
  class D1,D2 decision;
  class E1,E2 integration;
```

### J13 - GD Flat-Fee Project Request and Adobe Sign Handoff

**Domain:** GD Portal  
**Primary actors:** GD client; GD Operations Admin; GD Attorney; Adobe Sign; Centerbase  
**Trigger:** Client requests a handbook, policy, agreement, audit, or another configured flat-fee project  
**Outcome:** Proposal is accepted and converted to project / matter work, or declined and closed  
**Integrations:** Adobe Sign; Centerbase; email notifications  
**Traceability:** GD-PROJ-01-04; GD-MAT-01-04; Adobe Sign integration map

**Scope notes:** Pricing and scope may remain manual while the portal tracks lifecycle status. Adobe Sign is authoritative for signature status.

```mermaid
%% J13 - GD Flat-Fee Project Request and Adobe Sign Handoff
%% Domain: GD Portal
%% Source requirements: GD-PROJ-01-04; GD-MAT-01-04; Adobe Sign integration map
flowchart LR
  subgraph CLIENT["GD Client"]
    direction TB
    C1(["Submit flat-fee project request"])
    C2["Provide additional information"]
    C3["Review and sign or decline"]
  end
  subgraph GD["GD Operations / Attorney"]
    direction TB
    G1["Review eligibility, complexity, and scope"]
    D1{"More information required?"}
    G2["Prepare quote and engagement terms"]
  end
  subgraph PORTAL["GD Portal"]
    direction TB
    P1["Create Requested project record"]
    P2["Request clarification through secure portal"]
    P3["Update status to Quoted / Sent for Signature"]
    P4["Record declined / expired state and close or rescope"]
    P5["Show limited project status and responsible attorney"]
    END(["Project accepted or closed with status history"])
  end
  subgraph EXT["Adobe Sign / Centerbase"]
    direction TB
    E1[["Create or open Adobe Sign agreement"]]
    D2{"Agreement signed?"}
    E2[["Create or link Centerbase project / matter"]]
  end
  C1 --> P1
  P1 --> G1
  G1 --> D1
  D1 -->|"Yes"| P2
  P2 --> C2
  C2 --> G1
  D1 -->|"No"| G2
  G2 --> P3
  P3 --> E1
  E1 --> C3
  C3 --> D2
  D2 -->|"No"| P4
  P4 --> END
  D2 -->|"Yes"| E2
  E2 --> P5
  P5 --> END
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class C1,END startend;
  class P1,G1,P2,C2,G2,P3,C3,P4,P5 action;
  class D1,D2 decision;
  class E1,E2 integration;
```

### J14 - GD-Included Signatrain HR Seat Provisioning

**Domain:** Cross-product GD to Signatrain  
**Primary actors:** GD Operations Admin; Company Owner / Company HR Admin; platform; invited HR user  
**Trigger:** A GD Concierge or All Access plan becomes active or changes  
**Outcome:** Included HR seat is assigned without a user Stripe transaction and Signatrain access becomes available  
**Integrations:** Shared entitlement layer; email provider  
**Traceability:** CORE-ENT-08; GD-XP-01/02; GD-PLAN-05; CORE-IAM-08; CORE-ENT-06

**Scope notes:** The entitlement source is GD_INCLUDED. No Stripe transaction is required for the recipient user.

```mermaid
%% J14 - GD-Included Signatrain HR Seat Provisioning
%% Domain: Cross-product GD to Signatrain
%% Source requirements: CORE-ENT-08; GD-XP-01/02; GD-PLAN-05; CORE-IAM-08; CORE-ENT-06
flowchart LR
  subgraph GD["GD Operations"]
    direction TB
    G1(["Activate or change GD plan"])
  end
  subgraph COMP["Company Administrator"]
    direction TB
    C1["View included seat pool"]
    C2["Select existing user or send invitation"]
    C3["Archive user and transfer seat when needed"]
  end
  subgraph PLAT["Shared Platform"]
    direction TB
    P1["Determine included HR seat quantity"]
    D1{"Plan tier"}
    P2["Create one GD_INCLUDED HR seat by default"]
    P3["Create two GD_INCLUDED HR seats by default"]
    P4["Apply approved commercial override when configured"]
    P5["Assign seat and activate SIGNATRAIN_HR entitlement"]
    P6["Show Signatrain in My Products"]
  end
  subgraph USER["Seat Recipient"]
    direction TB
    U1["Activate account or sign in"]
    END(["User enters Signatrain HR without user payment"])
  end
  G1 --> P1
  P1 --> D1
  D1 -->|"Concierge"| P2
  D1 -->|"All Access"| P3
  D1 -->|"Custom"| P4
  P2 --> C1
  P3 --> C1
  P4 --> C1
  C1 --> C2
  C2 --> P5
  P5 --> U1
  U1 --> P6
  P6 --> END
  END -.->|"Seat transfer"| C3
  C3 --> C2
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class G1,END startend;
  class P1,P2,P3,P4,C1,C2,P5,U1,P6,C3 action;
  class D1 decision;
```

### J15 - Legislative Alert Authoring, Legal Review, and Distribution

**Domain:** Legislative Tracking MVP-Lite  
**Primary actors:** Alert editor; GD Attorney / legal reviewer; operations publisher; eligible recipient; platform  
**Trigger:** An employment-law change is identified through the manual monitoring process  
**Outcome:** Attorney-approved alert reaches only entitled organizations and jurisdictions, with read and audit records  
**Integrations:** Email provider; GD and Signatrain portal contexts  
**Traceability:** LT-AUTH-01-04; LT-REV-01-04; LT-DIST-01-04; LT-ACC-01-04; LT-REP-01; LT-AUD-01

**Scope notes:** Automated crawling, AI monitoring, and automated legal summaries are outside this module. Manager-only subscribers are excluded from Legislative Tracking.

```mermaid
%% J15 - Legislative Alert Authoring, Legal Review, and Distribution
%% Domain: Legislative Tracking MVP-Lite
%% Source requirements: LT-AUTH-01-04; LT-REV-01-04; LT-DIST-01-04; LT-ACC-01-04; LT-REP-01; LT-AUD-01
flowchart LR
  subgraph EDITOR["Alert Editor"]
    direction TB
    E1(["Create Draft alert"])
    E2["Enter summary, impact, action, topic, jurisdiction, source, and dates"]
    E3["Submit for legal review and assign reviewer"]
    E4["Configure audience, entitlement, organization coverage, and jurisdiction targeting"]
    E5["Review company delivery and read summary"]
  end
  subgraph LEGAL["GD Attorney / Legal Reviewer"]
    direction TB
    L1["Review legal accuracy and external wording"]
    D1{"Approve and sign off?"}
    L2["Return comments to Draft"]
  end
  subgraph PLAT["Legislative Tracking Service"]
    direction TB
    P1["Record approval and lock final sign-off metadata"]
    P2["Publish approved alert"]
    P3["Calculate eligible GD and Signatrain HR recipients"]
    P4[["Create in-app notification and limited-metadata email"]]
    P5["Record user read / unread state and delivery analytics"]
    P6["Archive alert on action or configured date"]
    END(["Authoring, sign-off, targeting, delivery, and archive remain audited"])
  end
  subgraph RECIP["Eligible Recipient"]
    direction TB
    R1["Open secure alert detail"]
    R2["Read summary, impact, recommended action, and attorney sign-off"]
  end
  E1 --> E2
  E2 --> E3
  E3 --> L1
  L1 --> D1
  D1 -->|"No"| L2
  L2 -->|"Revise"| E1
  D1 -->|"Yes"| P1
  P1 --> E4
  E4 --> P2
  P2 --> P3
  P3 --> P4
  P4 --> R1
  R1 --> R2
  R2 --> P5
  P5 --> E5
  E5 -->|"When no longer current"| P6
  P6 --> END
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class E1,END startend;
  class E2,E3,L1,L2,P1,E4,P2,P3,R1,R2,P5,E5,P6 action;
  class D1 decision;
  class P4 integration;
```

### J16 - Legislative Tracking Jurisdiction Coverage Change

**Domain:** Legislative Tracking MVP-Lite  
**Primary actors:** Company Owner / Company HR Admin; internal operations; platform  
**Trigger:** Company requests a state or city coverage addition or removal  
**Outcome:** Approved coverage becomes effective for future alert targeting; rejected requests retain current coverage  
**Integrations:** Notifications; optional commercial / contract reference  
**Traceability:** LT-COV-01-03; CORE-ORG-06; LT-DIST-01

**Scope notes:** Coverage changes may require contract approval and commercial adjustment. Read status is not treated as legal acknowledgment.

```mermaid
%% J16 - Legislative Tracking Jurisdiction Coverage Change
%% Domain: Legislative Tracking MVP-Lite
%% Source requirements: LT-COV-01-03; CORE-ORG-06; LT-DIST-01
flowchart LR
  subgraph COMP["Company Administrator"]
    direction TB
    C1(["Open current jurisdiction coverage"])
    C2["Request state / city addition or removal with effective date"]
    C3["View active and pending coverage"]
  end
  subgraph OPS["Internal Operations"]
    direction TB
    O1["Review plan entitlement, contract scope, and commercial impact"]
    D1{"Approved?"}
    O2["Record rejection reason or required follow-up"]
    O3["Approve effective coverage and optional end date"]
  end
  subgraph PLAT["Legislative Tracking Service"]
    direction TB
    P1["Create pending coverage request and notify operations"]
    P2["Notify company; current coverage remains unchanged"]
    P3["Update organization coverage history"]
    P4["Use new coverage for future alert recipient calculation"]
    END(["Coverage decision and effective dates are auditable"])
  end
  C1 --> C2
  C2 --> P1
  P1 --> O1
  O1 --> D1
  D1 -->|"No"| O2
  O2 --> P2
  P2 --> C3
  D1 -->|"Yes"| O3
  O3 --> P3
  P3 --> P4
  P4 --> C3
  C3 --> END
  classDef action fill:#FFFFFF,stroke:#3A3A3A,stroke-width:1px,color:#222222;
  classDef startend fill:#F4E4A3,stroke:#5A4A00,stroke-width:1.5px,color:#222222;
  classDef decision fill:#FFF4CC,stroke:#7A6500,stroke-width:1.5px,color:#222222;
  classDef integration fill:#EEF3F8,stroke:#3A5872,stroke-width:1px,color:#222222;
  classDef note fill:#F3F3F3,stroke:#777777,stroke-dasharray: 4 3,color:#333333;
  class C1,END startend;
  class C2,P1,O1,O2,P2,O3,P3,P4,C3 action;
  class D1 decision;
```
