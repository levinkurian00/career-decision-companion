import React, { useEffect, useState } from "react";

function App() {
  const [selectedSector, setSelectedSector] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [weights, setWeights] = useState({});
  const [ranking, setRanking] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [sensitivity, setSensitivity] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  //const [recommendedSector, setRecommendedSector] = useState("");
  const [mode, setMode] = useState(""); // "", "quiz", "manual"

  // Load criteria when sector changes
  useEffect(() => {
    if (!selectedSector) return;

    fetch(`https://career-decision-companion.onrender.com/criteria/${selectedSector,weights}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.criteria) return;

        setCriteria(data.criteria);

        // If no weights exist (manual mode), initialize to 5
        const initialWeights = {};
        data.criteria.forEach((c) => {
          initialWeights[c] = weights[c] || 5;
        });

        setWeights(initialWeights);
      })
      .catch((err) => console.error("Criteria fetch error:", err));
  }, [selectedSector]);

  const handleChange = (criterion, value) => {
    setWeights({
      ...weights,
      [criterion]: Number(value),
    });
  };

  const handleQuizChange = (questionId, value) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: Number(value),
    });
  };

  const submitQuiz = async () => {
    try {
      const response = await fetch("https://career-decision-companion.onrender.com/quiz-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: quizAnswers }),
      });

      const data = await response.json();

      //setRecommendedSector(data.recommended_sector);
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
        body: JSON.stringify({
          sector: selectedSector,
          weights: weights,
        }),
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
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        display: "flex",
        justifyContent: "center",
        paddingTop: "60px",
      }}
    >
      <div
        style={{
          width: "750px",
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>
          Career Decision Companion
        </h1>
        <p style={{ color: "#555", marginBottom: "30px" }}>
          Structured Multi-Criteria Career Evaluation System
        </p>

        {/* Mode Selection */}
        {mode === "" && (
          <div style={{ marginBottom: "30px" }}>
            <button
              style={primaryButton}
              onClick={() => setMode("quiz")}
            >
              Take Interest Quiz (Recommended)
            </button>

            <button
              style={{ ...secondaryButton, marginLeft: "15px" }}
              onClick={() => setMode("manual")}
            >
              I Already Know My Sector
            </button>
          </div>
        )}

        {/* Quiz Section */}
        {mode === "quiz" && (
          <div>
            <h3>Interest Quiz (Rate 1–5)</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
              1 = Low Agreement | 5 = High Agreement
            </p>

            {quizQuestions.map((q) => (
              <div key={q.id} style={{ marginBottom: "20px" }}>
                <label>{q.text}</label>
                <select
                  style={selectStyle}
                  value={quizAnswers[q.id] || ""}
                  onChange={(e) => handleQuizChange(q.id, e.target.value)}
                >
                  <option value="">Select Rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            ))}

            <button style={primaryButton} onClick={submitQuiz}>
              Submit Quiz
            </button>
          </div>
        )}

        {/* Manual Mode Sector Selection */}
        {mode === "manual" && !selectedSector && (
          <div style={{ marginBottom: "30px" }}>
            <h3>Select Sector</h3>
            <select
              style={selectStyle}
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
            >
              <option value="">-- Choose Sector --</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Government Services">
                Government Services
              </option>
              <option value="Management & Business">
                Management & Business
              </option>
            </select>
          </div>
        )}

        {/* Sliders */}
        {selectedSector && criteria.length > 0 && (
          <>
            <h3 style={{ marginTop: "30px" }}>
              Fine-Tune Your Priorities (1–10)
            </h3>

            {criteria.map((criterion) => (
              <div key={criterion} style={sliderContainer}>
                <label>
                  {criterion}: {weights[criterion]}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={weights[criterion] || 5}
                  onChange={(e) =>
                    handleChange(criterion, e.target.value)
                  }
                  style={{ width: "100%" }}
                />
              </div>
            ))}

            <button style={primaryButton} onClick={evaluateCareer}>
              Evaluate Careers
            </button>
          </>
        )}

        {/* Ranking */}
        {ranking.length > 0 && (
          <>
            <h3 style={{ marginTop: "40px" }}>Career Ranking</h3>
            {ranking.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "12px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  backgroundColor:
                    index === 0 ? "#e0f2fe" : "#f3f4f6",
                  fontWeight: index === 0 ? "600" : "400",
                }}
              >
                {index + 1}. {item[0]}
                <span style={{ float: "right" }}>
                  {item[1].toFixed(2)}
                </span>
              </div>
            ))}
          </>
        )}

        {/* Explanation */}
        {explanation && (
          <>
            <h3 style={{ marginTop: "30px" }}>Why This Result?</h3>
            <p>{explanation}</p>
          </>
        )}

        {sensitivity && (
          <>
            <h3 style={{ marginTop: "20px" }}>
              Model Stability
            </h3>
            <p>{sensitivity}</p>
          </>
        )}
      </div>
    </div>
  );
}

/* Styles */
const primaryButton = {
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontWeight: "500",
};

const secondaryButton = {
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#e5e7eb",
  color: "#111",
  cursor: "pointer",
  fontWeight: "500",
};

const selectStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "8px",
  borderRadius: "6px",
};

const sliderContainer = {
  marginBottom: "25px",
  padding: "15px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
};

export default App;