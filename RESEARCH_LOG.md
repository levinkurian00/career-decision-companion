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

.............................................................................................

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

.............................................................................................

### Day 8 – Making Quiz Generic Across Sectors

### External reference 2 (The Princeton Review)
I got the idea for the career quiz from looking at The Princeton Review's website =⇒ [https://www.princetonreview.com/quiz/career-quiz](https://www.princetonreview.com/quiz/career-quiz)

### Prompt 19
is it possible to implement a simple quiz to identify the interest of the person. is this a good implementation for the project

Why I asked:
I wanted to improve the usability of the system. Many users may not know how to manually assign weights to abstract criteria like salary or growth. I thought a quiz might help convert qualitative preferences into quantitative weights.

Analysis:
The current system requires users to manually adjust sliders (1–10 scale). While flexible, this assumes the user can clearly quantify their priorities.

Adding a simple quiz would:
* Reduce cognitive effort for users.
* Convert qualitative answers into structured weight vectors.
* Improve personalization.
* Strengthen the decision-support aspect of the system.

However, it should not become a psychological personality test or rely on AI-based inference, as that would introduce unnecessary complexity and reduce explainability.

Decision:
Proceed with a small deterministic quiz (6 questions).

### Prompt 20
how to make quiz work for all sectors without rewriting everything

Why I asked:
Wanted scalable solution instead of creating separate quiz for each sector.

--------------------------------------------------------------------------------------
### Day 9
### External reference 3 (Google gemini)
Top career paths for Indian engineers outside their core fields:
  Management consulting, product management, investment banking, civil services, and entrepreneurship are five of the top non-core career paths for Indian engineers. 

### External reference 4 
 I have referenced Shiksha.com ([https://www.shiksha.com/engineering/articles/alternative-career-paths-after-btech-blogId-190814](https://www.shiksha.com/engineering/articles/alternative-career-paths-after-btech-blogId-190814)) for the Alternative Career Paths Engineers took After BTech to implement in the quiz.

 ### Prompt 21
 this needs some cleanup . in the mainpage the user don't directly enters the quiz section  and the quiz must be about all sectors (don't need sector option dropdown anymore). the quiz result must be a sector like finance,tech,etc. then only show the slider options (ie hide the slider) then the slider used to find the best job in that sector . for eg: if tech was the sector scored the best score in quiz the next option is the slider then like the old way changing the slider to get desired output like web development
  
  Reason:
  * The earlier flow required user to understand sectors before answering quiz. That felt    unnatural.
  * Wanted smoother experience and stronger connection between quiz and ranking logic.

### Prompt 22
how to structure backend so sector recommendation and weight generation are separate

Decision Taken:

Instead of directly mapping quiz to criteria, the system now:
1. Uses quiz to determine macro-level sector alignment.
2. Generates initial criterion weights for that sector.
3. Allows user to refine those weights manually.

This ensures:
* Better UX flow
* Cleaner separation of logic
* Reusable scoring engine
* Deterministic behaviour
* No black-box inference

The model now operates in layered decision stages.

--------------------------------------------------------------------------------------------

### Day 10 
### Prompt 23
  in the project the page directly enters the quiz right ? what if someone only looking for a job in tech  sector. how to skip the quiz then only for that certain case . otherwise conduct the quiz and other part follows.
  ### Solution:
    The system can support a dual-entry design where users either take the quiz for sector discovery or directly select a known sector (e.g., Technology), allowing experienced users to bypass the quiz while preserving deterministic evaluation logic.

### Prompt 24
  i need  to change the jobs under each section . i mean technology field is perfect for engineering graduates . but some of the jobs in other sectors need other qualifications for that job . for eg: chartered accountant needs finance background in the degree to get that job. i think there are a few in the list that affects the completeness of the project
  ### Solution:
    i need  to change the jobs under each section . i mean technology field is perfect for engineering graduates . but some of the jobs in other sectors need other qualifications for that job . for eg: chartered accountant needs finance background in the degree to get that job. i think there are a few in the list that affects the completeness of the project

Today focused on stability rather than feature expansion.

Improvements made:
* Fixed critical weight initialization bug.
* Strengthened state safety.
* Improved frontend-backend synchronization.

Finalized clean dual entry flow.

No architectural changes were introduced.System remains deterministic and modular.

---------------------------------------------------------------------------------------------

### Day 11 – Comparative Trade-Off Explanation

### Prompt 26
how can i explain why second ranked career lost and not only why first won

Why I asked:
The system only explained the top-ranked career. I wanted deeper transparency by highlighting trade-offs between close alternatives.

Analysis:
Users often care about the difference between top options rather than only the winner. Comparing contribution breakdowns can reveal meaningful decision drivers.

Decision:
* Compare top two ranked careers.
* Compute criterion-level contribution differences.
* Identify largest differentiators.
* Generate deterministic comparison explanation.
* Avoid LLM-based explanation for consistency.

Rejected Approach:
Using AI-generated comparison text.
Reason: Reduces traceability and introduces non-determinism.

Implementation:
Created *generate_comparison_explanation()* function using contribution difference sorting.

Result:
System now explains:
* Why the top career won
* Why the second career scored lower
* What criteria influenced the difference most

*Reflection* – Day 11

Today’s improvement focused on decision transparency rather than feature expansion.

Enhancement increases:
* Analytical clarity
* Interpretability
* User trust
* System maturity

Core weighted scoring logic remains unchanged

----------------------------------------------------------------------------------