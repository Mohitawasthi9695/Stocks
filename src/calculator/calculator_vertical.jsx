import './calculator_vertical.css';
import { useState } from 'react';

function App() {
  const [data, setData] = useState({
    height: '',
    width: '',
    unitWidth: 'inch',
    unitHeight: 'inch',
    numberOfStrips: '',
    lengthOfStrip: '',
    totalLength: '',
    unitLengthOfStrip: 'inch',
    unitTotalLength: 'inch'
  });

  const convertToInches = (value, unit) => {
    if (!value || isNaN(value)) return 0;
    const num = parseFloat(value);
    switch (unit) {
      case 'meter':
        return num * 39.37;
      case 'cm':
        return num * 0.3937;
      default:
        return num;
    }
  };

  const convertFromInches = (value, unit) => {
    if (!value || isNaN(value)) return "";
    switch (unit) {
      case 'meter':
        return (value / 39.37).toFixed(2);
      case 'cm':
        return (value / 0.3937).toFixed(2);
      default:
        return value.toFixed(2);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleUnitChange = (e) => {
    const { name, value } = e.target;
    setData((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    let widthInInches = convertToInches(data.width, data.unitWidth);
    let heightInInches = convertToInches(data.height, data.unitHeight);

    let calculateStrip = 0;
    let stripLength = 0;
    let totalLength = 0;

    if (widthInInches > 0) {
      calculateStrip = widthInInches / 3.7;
      calculateStrip = Math.round(calculateStrip);
    }

    if (heightInInches > 0) {
      stripLength = heightInInches + 1;
    }

    if (stripLength > 0 && calculateStrip > 0) {
      totalLength = stripLength * calculateStrip;
    }

    setData((prevValues) => ({
      ...prevValues,
      numberOfStrips: calculateStrip || "",
      lengthOfStrip: stripLength || "",
      totalLength: totalLength || ""
    }));
  };

  return (
    <div className="cal-body1">
      <div className="cal-body">
        <h1 style={{ textAlign: 'center', paddingBottom: '20px',fontSize:"35px",fontFamily:"sans-serif",fontStyle:"normal" }}>Strip Calculator</h1>

        {/* Width Input */}
        <div className="cal-field">
          <label className="cal-tex">Enter Window Width</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              className="input-field"
              type="number"
              name="width"
              placeholder={`Enter Width (${data.unitWidth})`}
              value={data.width}
              onChange={handleChange}
            />
            <select name="unitWidth" value={data.unitWidth} onChange={handleUnitChange} className="unit-dropdown">
              <option value="inch">Inches</option>
              <option value="meter">Meters</option>
              <option value="cm">Centimeters</option>
            </select>
          </div>
        </div>

        {/* Height Input */}
        <div className="cal-field">
          <label className="cal-tex">Enter Window Height</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              className="input-field"
              type="number"
              name="height"
              placeholder={`Enter Height (${data.unitHeight})`}
              value={data.height}
              onChange={handleChange}
            />
            <select name="unitHeight" value={data.unitHeight} onChange={handleUnitChange} className="unit-dropdown">
              <option value="inch">Inches</option>
              <option value="meter">Meters</option>
              <option value="cm">Centimeters</option>
            </select>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="cal-button">
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#007BFF',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, transform 0.2s',
              boxShadow: '2px 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px'
            }}
          >
            Submit
          </button>
        </div>

        <div style={{ marginLeft: '2%', backgroundColor: 'white', padding: '10px 34px', borderRadius: '20px' }}>
          {/* Display Results */}
          <div>
            <h3 className="cal-tex" style={{fontSize:"16px",fontFamily:"sans-serif",fontWeight:"bold"}}>Number of Strips: {data.numberOfStrips}</h3>
          </div>
          <hr  style={{border:"2px solid black"}}/>

          {/* Length of Strip */}
          <div className="cal-field">
            <p className="cal-tex" style={{fontSize:"16px",fontFamily:"sans-serif",fontWeight:"bold"}}>Length of Strip:</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>{convertFromInches(data.lengthOfStrip, data.unitLengthOfStrip)}</span>
              <select name="unitLengthOfStrip" value={data.unitLengthOfStrip} onChange={handleUnitChange} className="unit-dropdown">
                <option value="inch">Inches</option>
                <option value="meter">Meters</option>
                <option value="cm">Centimeters</option>
              </select>
            </div>
          </div>
        <hr style={{border:"2px solid black",width:"100%"}}/>

          {/* Total Required Strip Length */}
          <div className="cal-field">
            <h3 className="cal-tex" style={{fontSize:"16px",fontFamily:"sans-serif",fontWeight:"bold"}}>Total Required Strip Length:</h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>{convertFromInches(data.totalLength, data.unitTotalLength)}</span>
              <select name="unitTotalLength" value={data.unitTotalLength} onChange={handleUnitChange} className="unit-dropdown">
                <option value="inch">Inches</option>
                <option value="meter">Meters</option>
                <option value="cm">Centimeters</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
