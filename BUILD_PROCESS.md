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

------------------------------------------------------------------------------------------

### Day 6 – Explanation Engine Implementation

Focus: Improving interpretability and decision transparency.

Introduced per-criterion contribution tracking in scoring engine.

Modified scoring function to store weighted contribution per criterion.

Implemented explanation generator based on top contributing criteria.

Updated /evaluate endpoint to return both ranking and explanation.

Integrated explanation section in frontend UI.

This stage enhanced system transparency by making ranking decisions traceable to specific weighted factors instead of just returning numeric results.

----------------------------------------------------------------------------------------

### Day 7 – Market Vacancy Integration

Focus: Enhancing real-world decision relevance.

Introduced a new evaluation criterion: Market Vacancy (India).

* Modeled approximate job availability trends as a deterministic score.
* Updated all sectors to include vacancy-based scoring.
* Ensured no changes were required in scoring engine (generic architecture confirmed scalable).
* Validated dynamic frontend adaptation without modification.

This stage strengthened the system by incorporating supply-side market dynamics into the decision framework while maintaining determinism and transparency.

===========================================================================================

### Day 8 – Sector-Aware Quiz Refactoring

Focus: Improving scalability and architectural maturity.

* Identified limitation in initial quiz design (technology-specific criterion mapping).
* Refactored quiz logic to support abstract preference signals instead of direct criterion   mapping.
* Implemented sector-aware dynamic mapping from abstract preferences to sector-specific criteria.
* Ensured compatibility across all sectors without modifying core scoring engine.
* Preserved deterministic and explainable behavior.

This stage strengthened the system by introducing a preference abstraction layer, allowing the quiz to remain generic while dynamically adapting to sector-specific evaluation criteria.

The decision engine remained unchanged, demonstrating proper separation of concerns.
---------------------------------------------------------------------------------------------

### Day 9: Optimized Decision Architecture

Focus: Streamlining the user journey via structured inference.
* Redesigned Flow: Replaced manual sector selection with a two-stage logic:
  1. Sector Recommendation: Inferred via determine_sector_from_quiz().
  2. Career Optimization: Targeted refinement within the identified sector.

System Integration: Updated the quiz endpoint to automatically generate initial weight vectors and preload sliders, bridging preference elicitation with ranking.

Architecture Evolution: Transitioned from a flat model to a layered pipeline:
Preference Elicitation → Sector Recommendation → Weight Initialization → Career Ranking

Impact: Enhanced usability and automated onboarding while preserving the deterministic nature and transparency of the core engine.

---------------------------------------------------------------------------------------------

### Day 10 – Stability & State Management Fixes

Focus: Fixing evaluation failure in manual mode and improving frontend robustness.

* Diagnosed issue where weights was empty during manual sector selection.
* Identified missing initialization after criteria fetch.
* Implemented automatic default weight assignment (value = 5).
* Added defensive state handling to prevent undefined .length errors.
* Improved API response handling with fallback defaults.
* Cleaned dual entry flow (Quiz vs Manual mode).

Outcome:
The application now:
  * Evaluates correctly in both quiz and manual flows.
  * Prevents state-related crashes.
  * Maintains deterministic decision logic.
  * Improves overall system reliability.

Today focused on robustness and correctness rather than feature expansion.

---------------------------------------------------------------------------------------------

### Day 11 – Comparative Explanation Engine

Focus: Enhancing decision transparency beyond top-result explanation.

* Identified limitation: system only explained top-ranked career.
* Designed comparative contribution analysis between top two careers.
* Implemented criterion-level difference calculation.
* Generated deterministic explanation for second-ranked outcome.
* Integrated frontend display under “Why Not Others?” section.

No changes were made to scoring formula or normalization logic.

Outcome:
* The system now provides:
* Ranking
* Primary explanation
* Comparative trade-off reasoning

This improves interpretability without increasing architectural complexity.

------------------------------------------------------------------------------------------

## Day 12 – UI Refinement & Comparative Reasoning

**Focus:** Improve presentation and decision transparency.

### Enhancements Made

- Redesigned frontend layout using centered card structure.
- Introduced consistent spacing and section hierarchy.
- Simplified quiz dropdown scale to minimal numeric options.
- Highlighted top-ranked career visually.

### Comparative Explanation Engine

Added structured explanation to answer:

“Why is Career #1 ranked above Career #2?”

Implementation:

- Extracted top two ranked careers.
- Computed score difference.
- Generated deterministic comparison explanation.

This improved:

- Practical reasoning clarity
- Transparency in decision logic
- System interpretability

The system now presents not only ranking, but structured justification between competing options.

------------

## Day 13 – Diagram Refinement & Deployment Planning

**Focus:** Strengthening architectural clarity and production readiness.

### Diagram Refinement

- Redesigned Architecture Diagram for clearer separation between frontend, backend, and decision engine.
- Simplified DFD Level 0 to show only external entity and system boundary.
- Refined DFD Level 1 to highlight internal processing stages (Quiz → Sector Engine → Weight Generation → Scoring → Explanation).
- Standardized diagram layout and placement inside README under System Design.

The goal was to improve visual clarity and ensure alignment between documentation and implementation.

---

### Deployment Planning & Hosting Decisions

- Evaluated hosting options (Vercel vs Netlify for frontend).
- Chose **Netlify** for static frontend deployment.
- Chose **Render** for dynamic FastAPI backend deployment.
- Configured backend as a web service (not static) for proper API execution.
- Verified public accessibility of deployed URLs.
- Ensured CORS configuration for cross-origin communication.
- Confirmed stateless backend design compatible with cloud hosting.

This stage ensured that the project is not limited to local execution and demonstrates production-level deployment awareness.

---

### Documentation Refinement

- Reorganized README structure for logical flow.
- Added Tech Stack table.
- Positioned diagrams under System Design.
- Added Reflection section for design maturity.

The system documentation now reflects both implementation detail and architectural thinking.

----