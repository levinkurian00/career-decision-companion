# Research Log

This document records research topics and AI assistance used during development.

---

## Conceptual Research

**Researched:**

- Multi-criteria decision-making (MCDM)
- Weighted scoring models
- Deterministic vs black-box systems
- Trade-off evaluation principles

**Decision taken:**

- Use deterministic weighted aggregation instead of AI-based ranking.

**Reason:**

- Transparency and explainability were prioritized over prediction.

---

## Backend Research

**Researched:**

- FastAPI framework
- REST API design principles
- CORS handling
- JSON request/response modeling

**AI was used to:**

- Review API structure
- Validate normalization implementation
- Improve modular design

Core decision logic was implemented and verified independently.

---

## Frontend Research

**Researched:**

- React `useState` for state management
- Fetch API for HTTP communication
- Handling JSON responses
- Slider input handling

**AI was used to:**

- Review component structure
- Improve API integration clarity
- Suggest UI simplifications

AI was not used to generate ranking outcomes.

---

## Design Research

**Researched:**

- Modular architecture patterns
- Separation of domain configuration from computation
- Extensibility principles

**Key architectural decisions:**

- Keep the decision engine generic.
- Treat career data and criteria as configuration layers.

---

## AI Usage Transparency

**AI tools were used for:**

- Structuring documentation
- Reviewing architectural clarity
- Validating mathematical reasoning
- Improving code readability

**AI was not used to:**

- Generate final decision rankings
- Replace deterministic logic
- Introduce opaque decision-making components

The core algorithmic decisions were intentionally **deterministic**.