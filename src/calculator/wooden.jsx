import { useState } from 'react';
import './wooden.css';

function App() {
  const [data, setData] = useState({
    height: '',
    unit: 'meter',
    stripThickness: '50'
  });

  const [result, setResult] = useState(null);

  const unitConversion = {
    inch: 0.0254,
    cm: 0.01,
    meter: 1
  };

  const stripDivisor = {
    50: 1 / 22,
    31: 1 / 31
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const heightToMeter = (parseFloat(data.height) || 0) * unitConversion[data.unit];
    const strips = heightToMeter / (stripDivisor[data.stripThickness] || 1);
    setResult(strips.toFixed(4));
  };

  return (
    <div className="w-body">
      <div className="w-inner">
        <h2>Wooden Calculator</h2>
        <form onSubmit={handleSubmit}>
          <div className="w-dis-field">
            <div className="w-field">
              <label>Height of window:</label>
              <input className="w-input-field" onChange={handleChange} type="number" name="height" placeholder="Enter height" />
            </div>
            <div className="w-field">
              <label>Unit:</label>
              <select className="w-input-drop" onChange={handleChange} name="unit">
                <option value="meter">Meters</option>
                <option value="inch">Inches</option>
                <option value="cm">Centimeters</option>
              </select>
            </div>
            <div className="w-field">
              <label>Strip Thickness:</label>
              <select className="w-input-drop" onChange={handleChange} name="stripThickness">
                <option value="50">50mm</option>
                <option value="31">31mm</option>
              </select>
            </div>
          </div>
          <button className="w-button" type="submit">
            Calculate
          </button>
        </form>
        <div className="w-dis-field">
          <h3 className="w-data-field">
            <span style={{fontSize:"21px"}}>Number of Wooden Strips:</span>
            {result !== null && (
              <span className="w-result" style={{color:"blue"}}>
                {result.slice(0, -2)}
                <span
                  style={{
                    color: parseInt(result.slice(-2), 10) > 50 ? 'red' : 'black'
                  }}
                >
                  {result.slice(-2)}
                </span>
              </span>
            )}
          </h3>
        </div>
      </div>
    </div>
  );
}
export default App;
