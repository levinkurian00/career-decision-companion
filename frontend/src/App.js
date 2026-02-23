import React, { useEffect, useState } from "react";

function App() {
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [weights, setWeights] = useState({});
  const [ranking, setRanking] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [sensitivity, setSensitivity] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  // Fetch sectors on load
  useEffect(() => {
    fetch("http://localhost:8000/sectors")
      .then(res => res.json())
      .then(data => setSectors(data.sectors))
      .catch(err => console.error("Sector fetch error:", err));
  }, []);

  // Fetch criteria when sector changes
  useEffect(() => {
    if (selectedSector) {
      fetch(`http://localhost:8000/criteria/${selectedSector}`)
        .then(res => res.json())
        .then(data => {
          setCriteria(data.criteria);

          const initialWeights = {};
          data.criteria.forEach(c => {
            initialWeights[c] = 5;
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

  const evaluateCareer = async () => {
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
      setRanking(data.ranking);
      setExplanation(data.explanation);
      setSensitivity(data.sensitivity || "");
    } catch (error) {
      console.error("Evaluation error:", error);
      alert("Backend not reachable. Make sure it is running.");
    }
  };

  const submitQuiz = async () => {
    if (!selectedSector) {
      alert("Please select a sector first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/quiz-evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sector: selectedSector,
          answers: quizAnswers
        })
      });

      const data = await response.json();

      setRanking(data.ranking);
      setExplanation(data.explanation);
      setSensitivity(data.sensitivity || "");
      setShowQuiz(false);
    } catch (error) {
      console.error("Quiz error:", error);
      alert("Backend not reachable. Make sure it is running.");
    }
  };

  const quizQuestions = [
    { id: "q1", text: "I prioritize high income over comfort." },
    { id: "q2", text: "I prefer careers with strong job availability." },
    { id: "q3", text: "I am comfortable with steep learning curves." },
    { id: "q4", text: "I value work-life balance highly." },
    { id: "q5", text: "I am motivated by long-term growth potential." },
    { id: "q6", text: "I enjoy intellectually challenging work." }
  ];

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Career Decision Companion</h1>

      <h3>Select Sector</h3>
      <select
        value={selectedSector}
        onChange={(e) => setSelectedSector(e.target.value)}
      >
        <option value="">-- Choose Sector --</option>
        {sectors.map((sector) => (
          <option key={sector} value={sector}>
            {sector}
          </option>
        ))}
      </select>

      <br />

      <button
        onClick={() => setShowQuiz(true)}
        style={{ marginTop: "15px" }}
      >
        Take Interest Quiz
      </button>

      {criteria.length > 0 && (
        <>
          <h3 style={{ marginTop: "30px" }}>Rate Importance (1–10)</h3>

          {criteria.map((criterion) => (
            <div key={criterion} style={{ marginBottom: "20px" }}>
              <label>
                {criterion}: {weights[criterion]}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={weights[criterion]}
                onChange={(e) => handleChange(criterion, e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          ))}

          <button onClick={evaluateCareer}>Evaluate</button>
        </>
      )}

      {showQuiz && (
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

      {ranking.length > 0 && (
        <>
          <h3 style={{ marginTop: "40px" }}>Ranking Result</h3>
          {ranking.map((item, index) => (
            <div key={index}>
              {index + 1}. {item[0]} — {item[1].toFixed(2)}
            </div>
          ))}
        </>
      )}

      {explanation && (
        <>
          <h3 style={{ marginTop: "30px" }}>Why This Result?</h3>
          <p>{explanation}</p>
        </>
      )}

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