import React, { useEffect, useState } from "react";

function App() {
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [weights, setWeights] = useState({});
  const [ranking, setRanking] = useState([]);

  // Fetch sectors on load
  useEffect(() => {
    fetch("http://127.0.0.1:8000/sectors")
      .then(res => res.json())
      .then(data => setSectors(data.sectors));
  }, []);

  // Fetch criteria when sector changes
  useEffect(() => {
    if (selectedSector) {
      fetch(`http://127.0.0.1:8000/criteria/${selectedSector}`)
        .then(res => res.json())
        .then(data => {
          setCriteria(data.criteria);

          // Initialize weights to 5
          const initialWeights = {};
          data.criteria.forEach(c => {
            initialWeights[c] = 5;
          });
          setWeights(initialWeights);
        });
    }
  }, [selectedSector]);

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
      body: JSON.stringify({
        sector: selectedSector,
        weights: weights
      })
    });

    const data = await response.json();
    setRanking(data.ranking);
  };

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
    </div>
  );
}

export default App;