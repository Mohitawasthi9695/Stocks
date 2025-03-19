import React, { useState, useEffect } from "react";
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
  const [tableData, setTableData] = useState(() => {
    const savedData = localStorage.getItem("lengthTableData");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [outerUnit, setOuterUnit] = useState("inch");
  const [innerUnit, setInnerUnit] = useState("inch");
  const [thicknessUnit, setThicknessUnit] = useState("mm");
  const [resultUnit, setResultUnit] = useState("inch");

  useEffect(() => {
    localStorage.setItem("lengthTableData", JSON.stringify(tableData));
  }, [tableData]);

  const handleCalculate = () => {
    const D_outer = parseFloat(outerDiameter) * unitConversion[outerUnit];
    const D_inner = parseFloat(innerDiameter) * unitConversion[innerUnit];
    const t = parseFloat(thickness) * unitConversion[thicknessUnit];

    if (D_outer && D_inner && t) {
      const result = (Math.pow(D_outer, 2) - Math.pow(D_inner, 2)) / (4 * t * Math.PI);
      setLength(result);
      const newEntry = {
        outerDiameter,
        outerUnit,
        innerDiameter,
        innerUnit,
        thickness,
        thicknessUnit,
        length: result,
        resultUnit,
      };
      setTableData((prevData) => [newEntry, ...prevData]);
    } else {
      alert("Please fill in all fields with valid numbers.");
    }
  };

  const convertLength = (value, unit) => {
    return value ? (value / unitConversion[unit]).toFixed(2) : "";
  };

  const handleDelete = (index) => {
    setTableData((prevData) => prevData.filter((_, i) => i !== index));
  };

  return (
    <div className="length-body">
      <div className="length-App">
        <h3>Sheet Length Calculator</h3>
        <div className="length-form-container">
          <label>
            R Length:
            <div className="length-input-group">
              <input type="number" value={outerDiameter} onChange={(e) => setOuterDiameter(e.target.value)} />
              <select value={outerUnit} onChange={(e) => setOuterUnit(e.target.value)}>
                {Object.keys(unitConversion).map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </label>
          <label>
            r' Length:
            <div className="length-input-group">
              <input type="number" value={innerDiameter} onChange={(e) => setInnerDiameter(e.target.value)} />
              <select value={innerUnit} onChange={(e) => setInnerUnit(e.target.value)}>
                {Object.keys(unitConversion).map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </label>
          <label>
            Thickness:
            <div className="length-input-group">
              <input type="number" value={thickness} onChange={(e) => setThickness(e.target.value)} />
              <select value={thicknessUnit} onChange={(e) => setThicknessUnit(e.target.value)}>
                {Object.keys(unitConversion).map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </label>
          <button onClick={handleCalculate}>Calculate</button>
        </div>
        <div className="length-result">
          {length && (
            <div>
              <h3>Calculated Length:</h3>
              <p>{convertLength(length, resultUnit)} <span>{resultUnit}</span></p>
              <select value={resultUnit} onChange={(e) => setResultUnit(e.target.value)}>
                {Object.keys(unitConversion).map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="length-table">
          <h3>Stored Calculations</h3>
          <table>
            <thead>
              <tr>
                <th>Outer Diameter</th>
                <th>Inner Diameter</th>
                <th>Thickness</th>
                <th>Calculated Length</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.outerDiameter} {entry.outerUnit}</td>
                  <td>{entry.innerDiameter} {entry.innerUnit}</td>
                  <td>{entry.thickness} {entry.thicknessUnit}</td>
                  <td>{convertLength(entry.length, entry.resultUnit)} {entry.resultUnit}</td>
                  <td>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
