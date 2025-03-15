import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Form, Button, Container, Row, Col } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AccessoryOut = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [allAccessories, setAllAccessories] = useState([]);
  const [allStockCodes, setAllStockCodes] = useState({});
  const mainColor = "#3f4d67";
  const [items, setItems] = useState([
    {
      stockout_details_id: id,
      accessory_id: "",
      stock_code_id: "",
      lot_no: "",
      length: "",
      length_unit: "",
      items: "",
      box_bundle: "",
      out_quantity: "0",
    },
  ]);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const accessoriesRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/accessory`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAllAccessories(accessoriesRes.data.data);
      } catch (error) {
        toast.error("Failed to fetch accessories");
      }
    };
    fetchAccessories();
  }, []);

  const fetchStockCodes = async (accessoryId, index) => {
    try {
      const stockCodesRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getaccessorycode/${accessoryId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllStockCodes((prev) => ({ ...prev, [accessoryId]: stockCodesRes.data.data }));
    } catch (error) {
      toast.error("Failed to fetch stock codes");
    }
  };

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      {
        stockout_details_id: id,
        accessory_id: "",
        stock_code_id: "",
        lot_no: "",
        length: "",
        length_unit: "",
        items: "",
        box_bundle: "",
        out_quantity: "0",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleAccessoryChange = (index, event) => {
    const selectedAccessoryId = event.target.value;
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], accessory_id: selectedAccessoryId, stock_code_id: "" };
      return updated;
    });
    fetchStockCodes(selectedAccessoryId, index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to create the new field?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#20B2AA",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, create it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/godownaccessoryout`, items, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      });
      toast.success("Stock added successfully");
      navigate("/operator_invoice");
    } catch (error) {
      toast.error("Error adding stock");
    }
  };
  const handleStockCodeChange = async (index, event) => {
    setLoading(true);
    const selectedStock = event.target.value;

    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], stock_code_id: selectedStock };
      return updated;
    });

    if (selectedStock) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/godownAccessory/${selectedStock}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        setLoading(false);
        if (response.data.data) {
          setItems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...response.data.data };
            return updated;
          });
        }
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching stock details");
      }
    }
  };
  const handleChange = (index, field, event) => {
    const newValue = event.target.value;
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: newValue };
      return updated;
    });
  };


  return (
    <Container fluid className="pt-4 px-4" style={{ border: "3px dashed #14ab7f", borderRadius: "8px", background: "#ff9d0014" }}>
      <Row className="justify-content-center g-4">
        <h2 className="text-center mb-4 fw-bold">Accessory Out</h2>
        <Col md={12}>
          <div className="card shadow border-0 rounded-lg">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4><FaPlus className="me-2" />Add Manually</h4>
                <Button variant="success" onClick={handleAddRow}>Add Row</Button>
              </div>
              <Table bordered responsive className="align-middle">
                <thead className="text-white" style={{ backgroundColor: mainColor }}>
                  <tr>
                    <th>Accessory</th>
                    <th>Stock Code</th>
                    <th>Lot No</th>
                    <th>Length</th>
                    <th>Length Unit</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Select value={item.accessory_id} onChange={(e) => handleAccessoryChange(index, e)} required>
                          <option value="">Select Accessory</option>
                          {allAccessories.map((acc) => (
                            <option key={acc.id} value={acc.id}>{acc.accessory_name}</option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Select value={item.stock_code_id} onChange={(e) => handleStockCodeChange(index, e)} required>
                          <option value="">Select Stock Code</option>
                          {(allStockCodes[item.accessory_id] || []).map((stock) => (
                            <option key={stock.id} value={stock.id}>{stock.stock_code}</option>
                          ))}
                        </Form.Select>
                      </td>
                      <td><Form.Control type="text" value={item.lot_no} readOnly /></td>
                      <td><Form.Control type="text" value={item.length} onChange={(e) => handleChange(index, "length", e)} />

                      </td>
                      <td>
                      <Form.Select value={item.length_unit} onChange={(e) => handleChange(index, 'length_unit', e)}>
                        <option value="">Unit</option>
                        <option value="m">Meter</option>
                        <option value="ft">Feet</option>
                      </Form.Select>
                      </td>
                      
                      <td>
                        <Form.Control
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleChange(index, "quantity", e)}
                        />
                      </td>
                      <td>
                        <Button variant="danger" onClick={() => handleDeleteRow(index)} disabled={items.length === 1}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="text-center mt-4">
                <Button type="submit" style={{ backgroundColor: mainColor, borderColor: mainColor }} size="lg" onClick={handleSubmit}>
                  Submit Stock
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AccessoryOut;