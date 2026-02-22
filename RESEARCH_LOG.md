# RESEARCH_LOG.md

## Overview

This document records the AI prompts used during development of the Career Decision Companion System. Only prompts directly related to the implemented system are included. AI was used as a development assistant — all decisions were reviewed and validated before implementation.

---

## Day 1 – Deciding the Approach

**Prompt 1**
> "how do i build a career decision system that helps users pick the right path"

Taken: Modelled as multi-criteria decision making instead of random suggestions.

---

**Prompt 2**
> "is it better to use ai ranking or just weighted scoring for this kind of thing"

Taken: Chose deterministic weighted scoring — explainable and fully traceable.

---

**Prompt 3**
> "how does weighted scoring actually work, explain it simply"

Taken: Confirmed mathematical foundation. Used weighted aggregation:
`Final Score = Σ(weight × score)`

---

**Prompt 4**
> "do the weights need to add up to 1 or can i just normalize them automatically"

Taken: Auto-normalize using `weight_i = importance_i / Σ importance`. Removed manual sum validation to reduce friction.

---

## Day 2 – Core Logic Implementation

**Prompt 5**
> "how should i split up the scoring logic in python so its not all in one file"

Taken: Separated normalization, score calculation, and ranking into `decision_engine.py` and `scorer.py`.

---

**Prompt 6**
> "what is the right way to validate the weights coming in from the frontend"

Taken: Added validation to check sector exists, required criteria match, and avoid frontend mismatch errors.

---

**Prompt 7**
> "what happens to my normalization if all the weights are 0"

Taken: Added divide-by-zero check before normalizing.

---

## Day 3 – Converting to Backend API

**Prompt 8**
> "how do i turn my python script into a fastapi app"

Accepted: Basic FastAPI app structure.
Improved: Added Pydantic request model, error handling, CORS middleware, and clean route separation.

---

**Prompt 9**
> "what endpoints do i need so the frontend can load data dynamically"

Taken: Created `/sectors`, `/criteria/{sector}`, and `/evaluate` endpoints.

---

**Prompt 10**
> "how do i keep the config separate from the actual logic in fastapi"

Taken: Created `domain_config.py` for sector data. Kept scoring engine generic and sector-independent.

---

## Day 4 – Multi-Sector Extension

**Prompt 11**
> "how can i add more career sectors without changing the scoring logic"

Taken: Used structured `SECTORS` dictionary. Decision engine remains fully independent from sector data.

---

**Prompt 12**
> "how do i reload the criteria sliders when the user picks a different sector in react"

Taken: Used `useEffect` with `/sectors` and `/criteria` endpoints. Frontend updates automatically on sector change.

---

## Day 5 – Frontend Integration

**Prompt 13**
> "how do i send the selected sector and weights to my backend using fetch"

Taken: Structured JSON body as `{ sector, weights }`.

---

**Prompt 14**
> "how do i handle sliders in react when the list of criteria keeps changing"

Taken: Used `useState` object mapping criteria to value.

---

## AI Usage Summary

**AI was used for:** structuring the backend, validating normalization logic, modular architecture design, dynamic API design, and frontend fetch integration.

**AI was NOT used for:** generating ranking outputs, black-box recommendations, or making architectural decisions without review.

All suggestions were tested and validated before final integration.

---

## Reflection

AI acted as a development assistant. The deterministic logic, architecture separation, and all final design decisions were independently reviewed and refined before implementation.

-------------------------------------------------------------------------------------
### Day 6 – Explanation Engine
### Prompt 15
how to generate explanation based on weighted scoring result

Why I asked:
To avoid returning only numeric ranking and improve interpretability.

Decision:
Compute contribution per criterion and identify top contributing factors.

### External Reference 1 (Google)

Referred the career guidance website ⇒ mindler (mindler.com)

Why referred:
To understand how structured career guidance platforms categorize domains, define evaluation factors, and present career clusters.

What I used from it:
Observed how careers are grouped into sectors and how multiple factors influence suitability instead of single-metric ranking.

No scoring logic or content was copied. It was used only for conceptual structuring.

### Prompt 16
  Lets implement an Explanation Engine. Is it possible to use an llm via the groq API to generate different feedback based on the results? If using an llm doesn't actually improve the quality or just makes the process slower, then I'd rather build 'Option A' without an llm.”

  Why I asked:
  To evaluate whether adding LLM improves system.

  Decision:
  Rejected LLM-based explanation because:
  Adds non-deterministic behavior
  Reduces traceability
  Introduces external dependency
  Does not improve core logic

  Chose deterministic explanation instead.

### Day 7 – Market Vacancy Integration

### Prompt 17
In the current sector and options there is a feedback missing that is the number of vacancies available for the particular job that has best score or weight. 

Why I asked:
To improve realism by including job market availability as part of decision criteria.

Decision:
Did not implement live API scraping.
Modeled vacancy availability as a structured deterministic score instead.

Reason:
Keeps system deterministic,Avoids external API dependency, Maintains traceability, Prevents instability

### Prompt 18
is it better to use real time vacancy api or the approximate job availability in India

Why I asked:
To evaluate whether real-time data improves the system.

Decision:
Chose static “Market Vacancy (India)” score modeled from general market trends.

Reason:

Assignment focuses on decision modeling, not live scraping, Keeps system architecture clean, Improves realism without overcomplicating backend

