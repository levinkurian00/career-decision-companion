import React, { useState } from "react";

function App() {
  const criteriaList = [
    "Salary Potential",
    "Job Demand",
    "Learning Curve Difficulty",
    "Personal Interest",
    "Work-Life Balance"
  ];

  const [weights, setWeights] = useState({
    "Salary Potential": 5,
    "Job Demand": 5,
    "Learning Curve Difficulty": 5,
    "Personal Interest": 5,
    "Work-Life Balance": 5
  });

  const [ranking, setRanking] = useState([]);

  const handleChange = (criterion, value) => {
    setWeights({
      ...weights,
      [criterion]: Number(value)
    });
  };

  const evaluateCareer = async () => {
    const response = await fetch("http://127.0.0.1:8000/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ weights })
    });

    const data = await response.json();
    setRanking(data.ranking);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Career Decision Companion</h1>

      <h3>Rate Importance (1–10)</h3>

      {criteriaList.map((criterion) => (
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

      <button onClick={evaluateCareer}>
        Evaluate Career
      </button>

      <h3 style={{ marginTop: "40px" }}>Ranking Result</h3>

      {ranking.map((item, index) => (
        <div key={index}>
          {index + 1}. {item[0]} — {item[1]}
        </div>
      ))}
    </div>
  );
}

export default App;
