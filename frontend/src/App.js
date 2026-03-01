/* eslint-disable */
import React, { useEffect, useState } from "react";

function App() {
  const [selectedSector, setSelectedSector] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [weights, setWeights] = useState({});
  const [ranking, setRanking] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [sensitivity, setSensitivity] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [mode, setMode] = useState("");

  useEffect(() => {
    if (!selectedSector) return;
    fetch(`https://career-decision-companion.onrender.com/criteria/${selectedSector}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.criteria) return;
        setCriteria(data.criteria);
        const initialWeights = {};
        data.criteria.forEach((c) => { initialWeights[c] = weights[c] || 5; });
        setWeights(initialWeights);
      })
      .catch((err) => console.error("Criteria fetch error:", err));
  }, [selectedSector]);

  const handleChange = (criterion, value) => {
    setWeights({ ...weights, [criterion]: Number(value) });
  };

  const handleQuizChange = (questionId, value) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: Number(value) });
  };

  const submitQuiz = async () => {
    try {
      const response = await fetch("https://career-decision-companion.onrender.com/quiz-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: quizAnswers }),
      });
      const data = await response.json();
      setSelectedSector(data.recommended_sector);
      setWeights(data.initial_weights || {});
      setMode("manual");
    } catch (error) {
      console.error("Quiz error:", error);
      alert("Backend not reachable.");
    }
  };

  const evaluateCareer = async () => {
    try {
      const response = await fetch("https://career-decision-companion.onrender.com/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector: selectedSector, weights: weights }),
      });
      const data = await response.json();
      setRanking(data.ranking || []);
      setExplanation(data.explanation || "");
      setSensitivity(data.sensitivity || "");
    } catch (error) {
      console.error("Evaluation error:", error);
      alert("Backend not reachable.");
    }
  };

  const quizQuestions = [
    { id: "q1", text: "I prioritize financial growth." },
    { id: "q2", text: "I prefer careers with strong job availability." },
    { id: "q3", text: "I enjoy challenging and complex problems." },
    { id: "q4", text: "I value work-life balance highly." },
    { id: "q5", text: "I seek long-term growth opportunities." },
    { id: "q6", text: "I enjoy intellectually stimulating work." },
    { id: "q7", text: "I enjoy working with financial data and market trends." },
    { id: "q8", text: "I prefer stable and structured industries." },
    { id: "q9", text: "I am interested in investment, banking, or financial analysis." },
    { id: "q10", text: "I am comfortable making decisions under financial risk." }
  ];

  // Word-based options mapped to numeric values
  const ratingOptions = [
    { label: "Disagree",  value: 1 },
    { label: "Neutral",   value: 3 },
    { label: "Agree",     value: 5 },
  ];

  return (
    <div style={pageWrapper}>
      <div style={card}>

        {/* ── LANDING PAGE ── */}
        {mode === "" && (
          <div style={landingContainer}>
            <div style={badge}>Career Guidance Tool</div>
            <h1 style={landingTitle}>
              Career Decision<br />Companion
            </h1>
            <p style={landingSubtitle}>
              Structured Multi-Criteria Career Evaluation System
            </p>
            <p style={landingDescription}>
              Discover the right career path based on your personal priorities —
              transparently, quantitatively, and without guesswork.
            </p>
            <div style={buttonRow}>
              <button
                style={gradientButton}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                onClick={() => setMode("quiz")}
              >
                🎯 Take Interest Quiz
                <span style={buttonSubtext}>Recommended</span>
              </button>
              <button
                style={outlineButton}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #1a4a6b, #7dd3fc)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "transparent";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#7dd3fc";
                  e.currentTarget.style.borderColor = "#7dd3fc";
                }}
                onClick={() => setMode("manual")}
              >
                ⚙️ Manual Selection
                <span style={{ ...buttonSubtext, color: "inherit", opacity: 0.75 }}>
                  I know my sector
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ── QUIZ SECTION ── */}
        {mode === "quiz" && (
          <div>
            <h2 style={sectionTitle}>Interest Quiz</h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "28px" }}>
              For each statement, select how much you agree
            </p>

            {quizQuestions.map((q) => (
              <div key={q.id} style={questionCard}>
                <label style={questionLabel}>{q.text}</label>
                <div style={optionRow}>
                  {ratingOptions.map((opt) => {
                    const selected = quizAnswers[q.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleQuizChange(q.id, opt.value)}
                        style={{
                          ...optionBtn,
                          background: selected
                            ? "linear-gradient(135deg, #1a4a6b, #7dd3fc)"
                            : "#111827",
                          color: selected ? "white" : "#64748b",
                          border: selected
                            ? "1.5px solid #7dd3fc"
                            : "1.5px solid #1f2937",
                          boxShadow: selected
                            ? "0 0 14px rgba(125,211,252,0.3)"
                            : "none",
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button style={{ ...gradientButton, marginTop: "10px" }} onClick={submitQuiz}>
              Submit Quiz →
            </button>
          </div>
        )}

        {/* ── MANUAL SECTOR SELECTION ── */}
        {mode === "manual" && !selectedSector && (
          <div style={{ marginBottom: "30px" }}>
            <h2 style={sectionTitle}>Select Your Sector</h2>
            <select
              style={selectStyle}
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
            >
              <option value="">-- Choose Sector --</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Government Services">Government Services</option>
              <option value="Management & Business">Management & Business</option>
            </select>
          </div>
        )}

        {/* ── SLIDERS ── */}
        {selectedSector && criteria.length > 0 && (
          <>
            <h2 style={sectionTitle}>Fine-Tune Your Priorities</h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
              Adjust each criterion from 1 (Low) to 10 (High)
            </p>
            {criteria.map((criterion) => (
              <div key={criterion} style={sliderContainer}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontWeight: "500", color: "#cbd5e1" }}>{criterion}</label>
                  <span style={sliderValue}>{weights[criterion]}</span>
                </div>
                <input
                  type="range" min="1" max="10"
                  value={weights[criterion] || 5}
                  onChange={(e) => handleChange(criterion, e.target.value)}
                  style={sliderInput}
                />
              </div>
            ))}
            <button style={gradientButton} onClick={evaluateCareer}>
              Evaluate Careers →
            </button>
          </>
        )}

        {/* ── RANKING ── */}
        {ranking.length > 0 && (
          <>
            <h2 style={{ ...sectionTitle, marginTop: "40px" }}>Career Ranking</h2>
            {ranking.map((item, index) => (
              <div key={index} style={{
                padding: "14px 18px",
                marginBottom: "10px",
                borderRadius: "12px",
                background: index === 0
                  ? "linear-gradient(135deg, rgba(26,74,107,0.4), rgba(125,211,252,0.1))"
                  : "#0d1117",
                border: index === 0
                  ? "1.5px solid rgba(125,211,252,0.45)"
                  : "1.5px solid #1f2937",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: index === 0 ? "#7dd3fc" : "#64748b",
                fontWeight: index === 0 ? "600" : "400",
              }}>
                <span>
                  {index === 0 && <span style={{ marginRight: "8px" }}>🏆</span>}
                  {index + 1}. {item[0]}
                </span>
                <span style={{
                  background: index === 0
                    ? "linear-gradient(135deg, #1a4a6b, #7dd3fc)"
                    : "#1f2937",
                  color: index === 0 ? "white" : "#64748b",
                  padding: "3px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                }}>
                  {item[1].toFixed(2)}
                </span>
              </div>
            ))}
          </>
        )}

        {/* ── EXPLANATION ── */}
        {explanation && (
          <>
            <h2 style={{ ...sectionTitle, marginTop: "30px" }}>Why This Result?</h2>
            <p style={{ color: "#64748b", lineHeight: "1.8", fontSize: "15px" }}>{explanation}</p>
          </>
        )}

        {sensitivity && (
          <>
            <h2 style={{ ...sectionTitle, marginTop: "20px" }}>Model Stability</h2>
            <p style={{ color: "#64748b", lineHeight: "1.8", fontSize: "15px" }}>{sensitivity}</p>
          </>
        )}

      </div>
    </div>
  );
}

/* ── STYLES ── */
const pageWrapper = {
  minHeight: "100vh",
  background: "linear-gradient(160deg, #060910 0%, #0a0f1a 60%, #080d18 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: "60px",
  paddingBottom: "60px",
};

const card = {
  width: "750px",
  backgroundColor: "#0a0f1a",
  padding: "50px",
  borderRadius: "24px",
  boxShadow: "0 25px 80px rgba(125,211,252,0.07), 0 0 0 1px rgba(125,211,252,0.06)",
  border: "1px solid #111827",
};

const landingContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: "20px 0 10px",
};

const badge = {
  background: "rgba(125,211,252,0.08)",
  border: "1px solid rgba(125,211,252,0.2)",
  color: "#7dd3fc",
  padding: "6px 18px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: "28px",
};

const landingTitle = {
  fontSize: "3.2rem",
  fontWeight: "800",
  background: "linear-gradient(135deg, #e0f2fe, #7dd3fc, #38bdf8)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  lineHeight: "1.15",
  marginBottom: "18px",
  letterSpacing: "-0.02em",
};

const landingSubtitle = {
  fontSize: "1rem",
  fontWeight: "500",
  color: "#334155",
  marginBottom: "14px",
};

const landingDescription = {
  fontSize: "0.95rem",
  color: "#1e293b",
  maxWidth: "460px",
  lineHeight: "1.8",
  marginBottom: "44px",
};

const buttonRow = {
  display: "flex",
  gap: "16px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const gradientButton = {
  padding: "14px 32px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #1a4a6b, #38bdf8)",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  transition: "opacity 0.2s",
  boxShadow: "0 4px 20px rgba(56,189,248,0.25)",
};

const outlineButton = {
  padding: "14px 32px",
  borderRadius: "12px",
  border: "2px solid #7dd3fc",
  background: "transparent",
  color: "#7dd3fc",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  transition: "all 0.2s",
};

const buttonSubtext = {
  fontSize: "11px",
  fontWeight: "400",
  color: "rgba(255,255,255,0.65)",
};

const sectionTitle = {
  fontSize: "1.4rem",
  fontWeight: "700",
  background: "linear-gradient(135deg, #e0f2fe, #38bdf8)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "16px",
};

const questionCard = {
  marginBottom: "20px",
  padding: "18px 20px",
  backgroundColor: "#0d1117",
  borderRadius: "12px",
  border: "1px solid #1f2937",
};

const questionLabel = {
  display: "block",
  fontWeight: "500",
  color: "#94a3b8",
  marginBottom: "14px",
  fontSize: "15px",
};

const optionRow = {
  display: "flex",
  gap: "10px",
};

const optionBtn = {
  flex: 1,
  padding: "10px 8px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
  transition: "all 0.15s",
  letterSpacing: "0.02em",
};

const selectStyle = {
  width: "100%",
  padding: "10px 14px",
  marginTop: "8px",
  borderRadius: "10px",
  border: "1.5px solid #1f2937",
  fontSize: "14px",
  outline: "none",
  background: "#0d1117",
  color: "#cbd5e1",
};

const sliderContainer = {
  marginBottom: "18px",
  padding: "16px",
  backgroundColor: "#0d1117",
  borderRadius: "12px",
  border: "1px solid #1f2937",
};

const sliderValue = {
  background: "linear-gradient(135deg, #1a4a6b, #38bdf8)",
  color: "white",
  padding: "2px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
};

const sliderInput = {
  width: "100%",
  accentColor: "#38bdf8",
  cursor: "pointer",
};

export default App;