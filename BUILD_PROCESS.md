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

Day 3 – Converting to Backend API

Focus: Transition from CLI logic to REST-based architecture.

Converted Python scoring logic into FastAPI backend.

Designed structured request model using Pydantic.

Created /evaluate endpoint to process sector + weights.

Implemented error handling for invalid input.

Enabled CORS middleware for frontend communication.

Tested endpoints using Swagger UI.

This stage shifted the system from a local script to an API-driven architecture with clear separation between presentation and computation.

Day 4 – Multi-Sector Extension

Focus: Improving extensibility and scalability.

Introduced domain_config.py to separate domain data from logic.

Structured sector-based configuration:

Sector name

Criteria list

Career performance profiles

Refactored decision engine to accept sector dynamically.

Added new endpoints:

/sectors

/criteria/{sector}

Ensured scoring engine remained domain-independent.

This stage transformed the system from single-sector (Technology only) to a scalable, configuration-driven decision framework.

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