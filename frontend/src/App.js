import React, { useEffect, useState } from "react";

function App() {
  const [selectedSector, setSelectedSector] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [weights, setWeights] = useState({});
  const [ranking, setRanking] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [sensitivity, setSensitivity] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [recommendedSector, setRecommendedSector] = useState("");
  const [mode, setMode] = useState(""); // "" | "quiz" | "manual"
  const [showQuiz, setShowQuiz] = useState(true);

  // Load criteria whenever sector changes
  useEffect(() => {
    if (selectedSector) {
      fetch(`http://localhost:8000/criteria/${selectedSector}`)
        .then(res => res.json())
        .then(data => {
          const fetchedCriteria = data.criteria || [];

          setCriteria(fetchedCriteria);

          // Initialize weights for manual mode
          const initialWeights = {};
          fetchedCriteria.forEach(c => {
            initialWeights[c] = weights[c] || 5;
          });

          setWeights(initialWeights);
        })
        .catch(err => console.error("Criteria fetch error:", err));
    }
  }, [selectedSector]);

  const handleChange = (criterion, value) => {
    setWeights({
      ...weights,
      [criterion]: Number(value)
    });
  };

  const handleQuizChange = (questionId, value) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: Number(value)
    });
  };

  const submitQuiz = async () => {
    try {
      const response = await fetch("http://localhost:8000/quiz-evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          answers: quizAnswers
        })
      });

      const data = await response.json();

      setRecommendedSector(data.recommended_sector);
      setSelectedSector(data.recommended_sector);
      setWeights(data.initial_weights || {});
      setShowQuiz(false);
      setMode("manual");

    } catch (error) {
      console.error("Quiz error:", error);
      alert("Backend not reachable.");
    }
  };

  const evaluateCareer = async () => {
    console.log("Evaluate clicked");
    console.log("Selected sector:", selectedSector);
    console.log("Weights:", weights);

    try {
      const response = await fetch("http://localhost:8000/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sector: selectedSector,
          weights: weights
        })
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
    { id: "q6", text: "I enjoy intellectually stimulating work." }
  ];

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Career Decision Companion</h1>

      {/* Initial Entry Selection */}
      {mode === "" && (
        <div style={{ marginTop: "30px" }}>
          <button onClick={() => setMode("quiz")} style={{ marginRight: "15px" }}>
            Take Interest Quiz (Recommended)
          </button>

          <button onClick={() => setMode("manual")}>
            I Already Know My Sector
          </button>
        </div>
      )}

      {/* Manual Sector Selection */}
      {mode === "manual" && !selectedSector && (
        <div style={{ marginTop: "30px" }}>
          <h3>Select Sector</h3>
          <select
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

      {/* Quiz Mode */}
      {mode === "quiz" && showQuiz && (
        <div style={{ marginTop: "30px" }}>
          <h3>Interest Quiz (Rate 1–5)</h3>

          {quizQuestions.map((q) => (
            <div key={q.id} style={{ marginBottom: "20px" }}>
              <label>{q.text}</label>
              <select
                onChange={(e) => handleQuizChange(q.id, e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select</option>
                <option value="1">1 - Strongly Disagree</option>
                <option value="2">2</option>
                <option value="3">3 - Neutral</option>
                <option value="4">4</option>
                <option value="5">5 - Strongly Agree</option>
              </select>
            </div>
          ))}

          <button onClick={submitQuiz}>Submit Quiz</button>
        </div>
      )}

      {/* Sector + Sliders */}
      {selectedSector && (
        <>
          <h2 style={{ marginTop: "30px" }}>
            {recommendedSector
              ? `Recommended Sector: ${recommendedSector}`
              : `Selected Sector: ${selectedSector}`}
          </h2>

          {Array.isArray(criteria) && criteria.length > 0 && (
            <>
              <h3 style={{ marginTop: "20px" }}>
                Fine-Tune Your Priorities (1–10)
              </h3>

              {criteria.map((criterion) => (
                <div key={criterion} style={{ marginBottom: "20px" }}>
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

              <button onClick={evaluateCareer}>
                Evaluate Careers
              </button>
            </>
          )}
        </>
      )}

      {/* Ranking */}
      {Array.isArray(ranking) && ranking.length > 0 && (
        <>
          <h3 style={{ marginTop: "40px" }}>Career Ranking</h3>
          {ranking.map((item, index) => (
            <div key={index}>
              {index + 1}. {item[0]} — {item[1].toFixed(2)}
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

      {/* Sensitivity */}
      {sensitivity && (
        <>
          <h3 style={{ marginTop: "20px" }}>Model Stability</h3>
          <p>{sensitivity}</p>
        </>
      )}
    </div>
  );
}

export default App;