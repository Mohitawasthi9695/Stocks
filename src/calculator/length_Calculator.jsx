import React, { useState } from "react";
import "./length_Calculator.css";

const unitConversion = {
  mm: 0.0393701,
  cm: 0.393701,
  inch: 1,
  ft: 12,
  m: 39.3701,
};

function App() {
  const [outerDiameter, setOuterDiameter] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [thickness, setThickness] = useState("");
  const [length, setLength] = useState(null);

  const [outerUnit, setOuterUnit] = useState("inch");
  const [innerUnit, setInnerUnit] = useState("inch");
  const [thicknessUnit, setThicknessUnit] = useState("mm");
  const [resultUnit, setResultUnit] = useState("inch");

  const handleCalculate = () => {
    const D_outer = parseFloat(outerDiameter) * unitConversion[outerUnit];
    const D_inner = parseFloat(innerDiameter) * unitConversion[innerUnit];
    const t = parseFloat(thickness) * unitConversion[thicknessUnit];

    if (D_outer && D_inner && t) {
      const result = (Math.pow(D_outer, 2) - Math.pow(D_inner, 2)) / (4 * t * Math.PI);
      setLength(result);
    } else {
      alert("Please fill in all fields with valid numbers.");
    }
  };

  const convertLength = () => {
    return length ? (length / unitConversion[resultUnit]).toFixed(2) : "";
  };

  return (
    <div className="length-body">
          <div className="length-App">
      <h3>Sheet Length Calculator</h3>
      <div className="length-form-container">
        {/* R Length */}
        <label>
          R Length:
          <div className="length-input-group">
            <input
              type="number"
              value={outerDiameter}
              onChange={(e) => setOuterDiameter(e.target.value)}
            />
            <select value={outerUnit} onChange={(e) => setOuterUnit(e.target.value)} style={{ width: '30%' }}>
              {Object.keys(unitConversion).map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </label>

        {/* R' Length */}
        <label>
          r' Length:
          <div className="length-input-group">
            <input
              type="number"
              value={innerDiameter}
              onChange={(e) => setInnerDiameter(e.target.value)}
            />
            <select value={innerUnit} onChange={(e) => setInnerUnit(e.target.value)} style={{ width: '30%' }}>
              {Object.keys(unitConversion).map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </label>

        {/* Thickness */}
        <label>
          Thickness:
          <div className="length-input-group">
            <input
              type="number"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
            />
            <select value={thicknessUnit} onChange={(e) => setThicknessUnit(e.target.value)} style={{ width: '30%' }}> 
              {Object.keys(unitConversion).map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </label>

        <button onClick={handleCalculate}>Calculate</button>
              {/* Result Section */}
      <div className="length-result">
      {length && (
        <div >
          <h3>Calculated Length:</h3>
          <p>{convertLength()} <span>{resultUnit}</span></p>
          <select value={resultUnit} onChange={(e) => setResultUnit(e.target.value)}>
            {Object.keys(unitConversion).map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      )}
      </div>
      </div>


    </div>
    </div>
  );
}

export default App;
