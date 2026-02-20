# Build Process

This document describes how the Career Decision Companion System evolved from a conceptual idea into a full-stack application.

---

## Day 1 – Problem Framing

**Focus:** Understanding the decision problem clearly.

- Defined the core problem (structured career decision support).
- Identified the Technology sector as the initial domain.
- Selected relevant evaluation criteria.
- Chose deterministic weighted scoring over AI-based ranking.
- Documented reasoning and assumptions.

At this stage, the focus was conceptual clarity rather than implementation.

---

## Day 2 – Decision Model Design

**Focus:** Structuring the mathematical foundation.

- Designed a weighted multi-criteria aggregation model.
- Introduced automatic weight normalization.
- Defined scoring formula:
  - `Final Score = Σ (normalized_weight × career_score)`
- Formalized assumptions.
- Structured modular decision components.

The system moved from conceptual framing to a formalized mathematical model.

---

## Day 3 – CLI Prototype

**Focus:** Verifying algorithm correctness.

- Implemented scoring logic in Python.
- Built input handling and validation modules.
- Tested dynamic ranking behavior with varying inputs.
- Verified normalization behavior and deterministic output.

This stage validated the correctness of the core decision engine.

---

## Day 4 – Backend Refactoring

**Focus:** Separation of concerns.

- Refactored CLI logic into a reusable decision engine module.
- Introduced FastAPI backend.
- Implemented `/evaluate` endpoint.
- Enabled CORS for frontend communication.
- Tested functionality using Swagger UI.

The system transitioned from a local script to an API-based architecture.

---

## Day 5 – Frontend Integration

**Focus:** Usability and interaction.

- Built a minimal React interface.
- Implemented slider-based importance input.
- Integrated frontend with backend API.
- Displayed dynamically ranked output.

This stage completed the full-stack transition.

---

## Design Evolution Summary

The system evolved through clear development phases:

- Conceptual modeling
- Deterministic algorithm implementation
- Backend modularization
- Full-stack integration

Throughout all iterations, the decision engine remained **deterministic**, **explainable**, and **modular**.