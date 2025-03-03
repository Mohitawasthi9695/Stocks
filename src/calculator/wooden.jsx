import { useState } from 'react';
import './wooden.css';

function App() {
  const [data, setData] = useState({
    height: '',
    unit: 'meter',
    stripThickness: '50'
  });

  const [stripSize, setStripSize] = useState('');
  const [numStrips, setNumStrips] = useState('');
  const [results, setResults] = useState(null);

  const [result, setResult] = useState(null);

  const woodSizes = [48, 60, 72, 96];

  // code for strip and its wastage.
  const calculateBestOption = () => {
    const strip = parseInt(stripSize);
    const stripsNeeded = parseInt(numStrips);
    if (isNaN(strip) || isNaN(stripsNeeded) || strip <= 0 || stripsNeeded <= 0) {
      alert('Please enter valid positive numbers');
      return;
    }

    let bestSize = 0;
    let minWastage = Number.MAX_VALUE;
    let totalWoodPieces = 0;
    let bestWastePerPiece = 0;

    woodSizes.forEach((woodSize) => {
      if (woodSize < strip) return;

      let stripsPerPiece = Math.floor(woodSize / strip);
      let requiredPieces = Math.floor(stripsNeeded / stripsPerPiece);
      let remainingStrips = stripsNeeded % stripsPerPiece;

      if (remainingStrips > 0) {
        requiredPieces += 1;
      }

      let wastePerPiece = woodSize % strip;
      let totalWastage = (requiredPieces - 1) * wastePerPiece;
      if (remainingStrips > 0) {
        totalWastage += woodSize - remainingStrips * strip;
      }

      if (totalWastage < minWastage) {
        minWastage = totalWastage;
        bestSize = woodSize;
        totalWoodPieces = requiredPieces;
        bestWastePerPiece = wastePerPiece;
      }
    });

    setResults({ bestSize, totalWoodPieces, bestWastePerPiece, minWastage });
  };
  // end of code strip and wastage

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
    <div>
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
                  <option value="31">35mm</option>
                </select>
              </div>
            </div>
            <button className="w-button" type="submit">
              Calculate
            </button>
          </form>
          <div className="w-dis-field">
            <h3 className="w-data-field">
              <span style={{ fontSize: '21px' }}>Number of Wooden Strips:</span>
              {result !== null && (
                <span className="w-result" style={{ color: 'blue' }}>
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
        <div className="w-inner">
          <h2 className="text-xl font-bold">Calculator Wastage</h2>
          <div className="w-field">
            <lable>
              Strip size (in inches):
            </lable>
            <input
              type="number"
              placeholder="Enter strip size (in inches)"
              value={stripSize}
              onChange={(e) => setStripSize(e.target.value)}
              className="w-input-field"
            />
          </div>
          <div style={{ 
            paddingTop: '10px'
           }}>
            <lable>Total number of strips</lable>
            <input
              type="number"
              placeholder="Enter number of strips needed"
              value={numStrips}
              onChange={(e) => setNumStrips(e.target.value)}
              className="w-input-field"
            />
          </div>
          <button onClick={calculateBestOption} className="w-button">
            Calculate
          </button>
          <div
            className="mt-4 p-4 border rounded bg-gray-100 "
            style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014',
              height: '180px'
             }}
          >
            {results && (
              <div>
                <p>
                  <strong>Best Wooden Piece Size:</strong> {results.bestSize} inches
                </p>
                <p>
                  <strong>Total Wooden Pieces Required:</strong> {results.totalWoodPieces}
                </p>
                <p>
                  <strong>Wastage per Piece:</strong> {results.bestWastePerPiece} inches
                </p>
                <p>
                  <strong>Total Wastage:</strong> {results.minWastage} inches
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
