# Q&A - Unresolved Assumptions

**Date:** 2024-12-19  
**Staff Engineer + QA Lead**

This document contains questions that need answers from product/engineering leadership to resolve assumptions and make architectural decisions.

## 🔴 Critical Questions (Blocking)

### 1. Authentication & Multi-User
- **Question:** Is authentication required for MVP? The codebase has `/login` and `/signup` routes but they appear unused.
- **Current State:** No authentication implemented; state is client-side only (Zustand + localStorage planned)
- **Impact:** Affects data persistence strategy, API design, and deployment architecture
- **Options:**
  - A) Remove auth routes and keep client-side only for MVP
  - B) Implement auth with NextAuth.js + database
  - C) Defer to post-MVP

### 2. Data Persistence
- **Question:** How should user data be persisted? localStorage only, or external database?
- **Current State:** Zustand store with no persistence layer
- **RFC-0001-mvp.md** mentions: "Client-side state; persist to localStorage for scenarios (DB later)"
- **Impact:** Affects data durability, multi-device sync, backup/restore
- **Options:**
  - A) localStorage only for MVP (as per RFC)
  - B) Add database now (PostgreSQL/MySQL)
  - C) Hybrid: localStorage + optional cloud sync

### 3. Legacy Routes Cleanup
- **Question:** Should we remove legacy routes (`/(dashboard)/scenarios/*`, `/login`, `/signup`, `/api/*`)?
- **Current State:** Routes exist but may be unused
- **Impact:** Code complexity, maintenance burden, security surface
- **Options:**
  - A) Remove all unused routes now
  - B) Keep but document as "future"
  - C) Audit usage first

## 🟡 High Priority Questions

### 4. Calculation Engine Architecture
- **Question:** Should we split `buildPlan()` into smaller functions (topline, collections, cash) for testability?
- **Current State:** Single monolithic `buildPlan()` function
- **Impact:** Testability, maintainability, code reuse
- **Options:**
  - A) Keep monolithic (simpler, fewer files)
  - B) Split into modules (better testability)
  - C) Hybrid: keep main function but extract helpers

### 5. Revenue Forecast Integration
- **Question:** Should Revenue Forecast page (`/revenue`) sync with main Financial dashboard?
- **Current State:** Revenue Forecast has "Update store to this ARR" button but logic is separate
- **Impact:** Data consistency, user experience
- **Options:**
  - A) Keep separate (different use cases)
  - B) Fully integrate (single source of truth)
  - C) One-way sync (Revenue → Dashboard)

### 6. Error Handling & Validation
- **Question:** What level of input validation and error handling is required?
- **Current State:** Minimal validation; no error boundaries
- **Impact:** User experience, data integrity, debugging
- **Options:**
  - A) Basic validation (prevent crashes)
  - B) Comprehensive validation (prevent invalid data)
  - C) Client + server validation (full stack)

### 7. Testing Strategy
- **Question:** What's the target test coverage for MVP?
- **Current State:** Unit tests for calc layer only; no E2E tests yet
- **Impact:** Quality assurance, development velocity
- **Options:**
  - A) Calc layer only (critical path)
  - B) Calc + key UI components (60-70% coverage)
  - C) Comprehensive (80%+ coverage)

## 🟢 Medium Priority Questions

### 8. Performance & Bundle Size
- **Question:** Are there performance targets (LCP, FID, bundle size)?
- **Current State:** No performance monitoring
- **Impact:** User experience, SEO, infrastructure costs
- **Options:**
  - A) No targets for MVP (optimize later)
  - B) Basic targets (LCP < 2.5s, bundle < 500KB)
  - C) Strict targets (LCP < 1.5s, bundle < 300KB)

### 9. Accessibility (a11y)
- **Question:** What level of accessibility is required (WCAG AA, AAA)?
- **Current State:** Basic a11y (tooltips, ARIA labels)
- **Impact:** Legal compliance, user reach
- **Options:**
  - A) Basic (keyboard navigation, screen reader support)
  - B) WCAG AA (full compliance)
  - C) WCAG AAA (highest level)

### 10. Browser Support
- **Question:** Which browsers must be supported?
- **Current State:** Modern browsers (Chrome, Firefox, Safari)
- **Impact:** Development complexity, polyfills, testing matrix
- **Options:**
  - A) Modern only (last 2 versions)
  - B) Include IE11 (legacy support)
  - C) Mobile-first (iOS Safari, Chrome Mobile)

### 11. Internationalization (i18n)
- **Question:** Is multi-language support required?
- **Current State:** English only
- **Impact:** Architecture, content management
- **Options:**
  - A) English only for MVP
  - B) Prepare for i18n (structure code)
  - C) Full i18n (2+ languages)

### 12. Analytics & Monitoring
- **Question:** What analytics and monitoring are needed?
- **Current State:** None
- **Impact:** User insights, error tracking, performance monitoring
- **Options:**
  - A) None for MVP
  - B) Basic (Google Analytics, Sentry)
  - C) Comprehensive (custom events, A/B testing)

## 🔵 Low Priority Questions

### 13. Export & Import
- **Question:** Should users be able to export/import scenarios?
- **Current State:** Not implemented
- **RFC-0001-mvp.md** mentions: "CSV/PDF export" in backlog
- **Impact:** User workflow, data portability
- **Options:**
  - A) Defer to post-MVP
  - B) Basic CSV export
  - C) Full import/export (CSV, JSON, PDF)

### 14. Dark Mode
- **Question:** Is dark mode required?
- **Current State:** Light mode only
- **Impact:** Design system, CSS complexity
- **Options:**
  - A) Light mode only
  - B) Dark mode optional
  - C) System preference detection

### 15. Mobile App
- **Question:** Is a mobile app planned?
- **Current State:** Web app only (responsive)
- **Impact:** Architecture decisions, API design
- **Options:**
  - A) Web only
  - B) Responsive web (current)
  - C) Native app planned (design APIs accordingly)

## 📋 Decision Log

| Question | Decision | Date | Notes |
|----------|----------|------|-------|
| 1. Authentication | **Pending** | - | Awaiting product decision |
| 2. Data Persistence | **localStorage for MVP** | 2024-12-19 | Per RFC-0001-mvp.md |
| 3. Legacy Routes | **Pending** | - | Needs audit |
| 4. Calc Architecture | **Pending** | - | Technical decision |
| 5. Revenue Integration | **Pending** | - | UX decision |

## 🎯 Next Steps

1. **Schedule review meeting** to answer Critical and High Priority questions
2. **Document decisions** in this file
3. **Update architecture** based on decisions
4. **Create implementation tickets** for approved features

## 📝 Notes

- Most questions can be answered by reviewing RFC-0001-mvp.md
- Some questions may be deferred to post-MVP
- Prioritize questions that block development or affect architecture

---

**Last Updated:** 2024-12-19  
**Owner:** Engineering Team  
**Review Frequency:** Weekly until MVP launch

