# Product Requirements Document (PRD)
## Photographer Portfolio and Client Gallery Website

> Status: Draft v1 (2025-08-15)
> Owner: (assign)
> Related Guidance: See `COPILOT_INSTRUCTIONS.md` for coding conventions.

---
### 1. Introduction
A web application for professional photographers that functions both as a polished public marketing portfolio and as a secure, private delivery & collaboration space for client photo sets. This document defines required functionality, experience goals, and technical considerations.

### 2. Goals & Objectives
1. Present a visually compelling public brand presence that converts visitors into inquiries.
2. Provide clients with a seamless, secure experience to view, select (favorites), share, and download photos.
3. Streamline the photographer’s workflow: upload, organize, deliver, and (optionally) sell prints/products.
4. Lay a scalable foundation for future monetization (e‑commerce, subscriptions, advanced analytics).

### 3. Target Users
- Photographer (Admin): Manages content, galleries, clients, site configuration.
- Client (End User): Accesses invitation-only galleries; selects favorites; downloads/share images.
- Prospective Client (Visitor): Browses public portfolio, services, blog, and makes contact.

### 4. Functional Requirements
#### 4.1 Public Portfolio (Unauthenticated)
**Homepage**
- Hero: fullscreen/high-impact image or rotating slideshow of curated set.
- Intro blurb (photographer style + value proposition).
- Surface featured galleries or recent shoots.
- Testimonials (optional initial seed placeholder).
- Primary CTA: “View Portfolio” / “Get in Touch”.

**Portfolio / Galleries Listing**
- Categories (e.g. Weddings, Portraits, Landscapes) – filter or segmented navigation.
- Gallery layout: responsive grid or masonry; lazy-loaded images.
- Individual gallery page with lightbox (keyboard & swipe navigation) and optional captions.

**About Page**
- Photographer portrait, narrative bio, approach & differentiators.
- Optional: Behind-the-scenes media (image or embedded video).

**Services / Pricing**
- Service packages with descriptions & starting prices.
- FAQ accordion.
- CTA to contact / inquiry form.

**Blog** (Phase 2 optional if not MVP-critical)
- Post listing (title, hero image, tags, excerpt, date).
- Individual post pages with social share metadata.

**Contact Page**
- Contact form (name, email, message, optional shoot type & budget).
- Contact details + social links.
- Optional map embed (toggleable feature).

#### 4.2 Client Galleries (Authenticated / Tokenized)
**Authentication / Access**
- Client login page OR direct expiring tokenized link (decide model; both possible long-term).
- Each gallery bound to a client identity + optional event metadata.

**Private Gallery**
- Lightbox with high‑res viewing (progressive or on-demand loading).
- Favorites: client can mark/unmark; changes persisted (debounced save).
- Share: generate secure view-only link (read-only; no download if restricted).

**Downloads**
- Download individual photo (select resolution: High (print) / Web (optimized)).
- Bulk download ZIP (async generation with status + email notification if long-running).
- Optional watermark removal only after “approved” status.

#### 4.3 Admin Backend (Photographer)
**Dashboard**
- Recent client activity (views, downloads, favorites submitted).
- Pending client actions (e.g., favorites ready for selection confirmation).

**Photo / Gallery Management**
- Upload (multi-file drag & drop) with progress + background processing queue (resize, thumbnail, watermark).
- Create / edit public vs private galleries; toggle publish state.
- Assign gallery to existing or new client.
- Watermark on-demand or at ingest (configurable default).

**Client Management**
- CRUD clients; auto-generate secure access links.
- Resend invitation / reset gallery password (if password model chosen).

**Site Customization**
- Edit homepage hero selection.
- Manage testimonials (add / reorder / hide).
- Manage services & pricing blocks.

**Favorites Review Workflow** (Nice-to-have early)
- View aggregated client favorites; export list; mark “selected for editing/delivery”.

**E‑Commerce (Phase Later)**
- Price list per product type (prints, canvas, digital license).
- Order tracking & payment integration.

### 5. Non-Functional Requirements
| Category | Requirement |
|----------|-------------|
| Performance | Initial meaningful paint < 2.5s on median mobile; lazy image loading & responsive sizes. |
| Security | All traffic over HTTPS; auth tokens encrypted at rest; rate-limit login endpoints; prevent direct object access (signed URLs). |
| Privacy | No PII in client-side logs; GDPR/CCPA deletion support (manual at first). |
| Scalability | Support growth to 50k stored images without major redesign (object storage + CDN). |
| Accessibility | WCAG 2.1 AA: alt text, keyboard nav, focus states, color contrast. |
| Reliability | 99.5% monthly availability target (non-SLA internal). |
| Maintainability | Modular component architecture; <10% circular imports; lint & type clean. |
| Observability (future) | Basic request logging + error tracking. |

### 6. UX & Design Considerations
- Visual hierarchy favors imagery; subdued UI chrome.
- Dark / light theme toggle (leveraging `next-themes`).
- Client gallery navigation: arrow keys + swipe (mobile) + ESC to close lightbox.
- Favor skeleton loaders over spinners for gallery loading.

### 7. Technology Stack (Aligned to Current Repo)
| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend Framework | Next.js (App Router, React 19) | SSR / ISR / RSC benefits. |
| Language | TypeScript | Strict typing. |
| UI Library | shadcn/ui + Radix primitives + Tailwind CSS v4 | Accessible components. |
| Forms / Validation | react-hook-form + zod | Consistent schema validation. |
| Image Handling | Next.js Image + Cloud Storage (S3 or R2) | Derivatives (thumb, web, print). |
| Auth (Future) | NextAuth.js or custom token-based | Evaluate after gallery model defined. |
| Data Layer | Prisma ORM (proposed) + PostgreSQL | Add schema in future migration. |
| Storage | S3-compatible bucket (signed URLs) | Watermark & resize pipeline. |
| Background Jobs | (Phase) Lightweight queue (e.g., Upstash Q/Stellar) | For ZIP generation & processing. |
| Deployment | Vercel (frontend + serverless) + external object storage | CDN edge caching. |

### 8. Data Model (Initial Draft – Subject to Change)
- User (id, role[photographer|client], name, email, auth fields)
- Gallery (id, title, type[public|private], status[draft|published], coverImageId, clientId?, createdAt)
- Image (id, galleryId, originalUrl, thumbUrl, webUrl, printUrl, width, height, checksum, createdAt)
- Favorite (id, imageId, clientId)
- DownloadLog (id, galleryId, clientId, imageCount, createdAt)
- Invitation (id, galleryId, email, token, expiresAt, redeemedAt)
- Setting (key, value)

### 9. Edge Cases
- Gallery with zero images (show friendly empty placeholder). 
- Expired or invalid invitation token (error page + contact CTA). 
- ZIP generation interrupted (retry or show pending state). 
- Very large gallery (>1000 images): paginate or infinite scroll with virtualization. 
- Watermark processing backlog delay (UI badge: “Processing”).

### 10. Success Metrics
**Photographer KPIs**
- +X% increase in inquiry form submissions (baseline to be established).
- Average time from shoot completion to gallery delivery reduced by Y%.
- Reduction in manual email back-and-forth (qualitative early, later event tracking).

**Client Experience KPIs**
- Completion rate of favorite selection within 7 days.
- Average gallery load time (p75) < 2.0s after initial warm.
- NPS / satisfaction survey (optional post-delivery) target ≥ 8.

### 11. Rollout / Release Plan
1. MVP: Public portfolio + basic private gallery view + manual favorite marking (local persistence). 
2. Add authenticated client accounts + persisted favorites. 
3. Bulk download & watermark pipeline. 
4. Admin customization dashboard. 
5. E‑commerce & advanced analytics.

### 12. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Image storage cost growth | Increased OPEX | Aggressive resizing + archival tiers. |
| Unauthorized gallery access | Privacy breach | Signed expiring URLs & auth checks. |
| Performance regressions with large galleries | Poor UX | Incremental loading + CDN caching. |
| Feature creep pre-MVP | Delays | Enforce scope freeze after MVP spec acceptance. |

### 13. Open Questions
- Will clients authenticate with passwords or token-only links initially? (Decide MVP) 
- Require per-image watermark or only gallery-level? 
- Which storage (S3 vs Cloudflare R2) based on cost & region? 
- Is blog in MVP or deferred? 
- Do we need role-based staff accounts beyond single photographer? 

### 14. Out of Scope (Explicit)
- AI auto-tagging / recognition (future enhancement).
- In-browser RAW editing. 
- Multi-photographer marketplace features.

### 15. Appendices / References
- Inspiration: (list example portfolio sites) – to add.
- Competitive Notes: (to add).

---
### 16. Implementation Guidance Hooks
When opening development tasks, create atomic issues referencing this PRD section IDs (e.g., `FR-Portfolio-Lightbox`, `FR-Client-Favorites`).

---
End of PRD.
