import './calculator_vertical.css';
import { useState, useEffect } from 'react';

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

  // Load table data from localStorage on initial render
  const [tableData, setTableData] = useState(() => {
    const savedData = localStorage.getItem('tableData');
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    localStorage.setItem('tableData', JSON.stringify(tableData));
  }, [tableData]);

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
    if (!value || isNaN(value)) return '';
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

    let calculateStrip = widthInInches > 0 ? ((widthInInches * 2.54) / 9).toFixed(2) : 0;
    let stripLength = heightInInches > 0 ? heightInInches + 1 : 0;
    let totalLength = stripLength > 0 && calculateStrip > 0 ? stripLength * calculateStrip : 0;

    const newEntry = {
      width: data.width,
      unitWidth: data.unitWidth,
      height: data.height,
      unitHeight: data.unitHeight,
      numberOfStrips: calculateStrip || '',
      lengthOfStrip: stripLength || '',
      totalLength: totalLength || '',
      unitLengthOfStrip: data.unitLengthOfStrip,
      unitTotalLength: data.unitTotalLength
    };

    setTableData((prevData) => [newEntry, ...prevData]);
  };

  const handleDelete = (index) => {
    setTableData((prevData) => prevData.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="cal-body1">
        <div className="cal-body">
          <h1 style={{ textAlign: 'center', paddingBottom: '20px', fontSize: '35px', fontFamily: 'sans-serif', fontStyle: 'normal' }}>
            Strip Calculator
          </h1>

          <div className="cal-field">
            <label className="cal-tex">Enter Window Width</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                className="input-field"
                type="number"
                required
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

          <div className="cal-field">
            <label className="cal-tex">Enter Window Height</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                className="input-field"
                type="number"
                required
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

          <div className="cal-button">
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
      <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card p-3 shadow-sm">
            <h3 className="text-center">Calculation Data</h3>
            <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table className="table table-hover text-center table-bordered">
                <thead className="table-dark sticky-top">
                  <tr>
                    <th>Width</th>
                    <th>Height</th>
                    <th>Number of Strips</th>
                    <th>Length of Strip</th>
                    <th>Total Length</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.width} {entry.unitWidth}</td>
                      <td>{entry.height} {entry.unitHeight}</td>
                      <td>{entry.numberOfStrips}</td>
                      <td>{convertFromInches(entry.lengthOfStrip, entry.unitLengthOfStrip)} {entry.unitLengthOfStrip}</td>
                      <td>{convertFromInches(entry.totalLength, entry.unitTotalLength)} {entry.unitTotalLength}</td>
                      <td>
                        <button className="btn btn-danger btn-sm w-100" onClick={() => handleDelete(index)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
