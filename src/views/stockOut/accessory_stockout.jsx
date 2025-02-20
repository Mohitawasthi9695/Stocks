import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Form, Button, Container, Row, Col } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AccessoryOut = () => {
  const navigate = useNavigate();
  const { id, no } = useParams();
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const mainColor = "#3f4d67";
  const [items, setItems] = useState([
    {
      stockout_inovice_id: id,
      godown_accessory_id: "",
      product_accessory_id: "",
      lot_no: "",
      length: "",
      length_unit: "",
      items: "",
      box_bundle: "",
      quantity: "0",
    },
  ]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/getaccessorycode`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setAllProducts(response.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch products");
      }
    };
    fetchAllProducts();
  }, []);

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      {
        stockout_inovice_id: id,
        godown_accessory_id: "",
        product_accessory_id: "",
        lot_no: "",
        length: "",
        length_unit: "",
        items: "",
        box_bundle: "",
        quantity: "0",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleRowChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];

      if (field === "product_accessory_id") {
        const selectedIds = updated.map((item) => item.product_accessory_id);
        if (selectedIds.includes(value)) {
          toast.error("This product is already selected in another row!");
          return prev; // Prevent duplicate selection
        }
      }

      updated[index][field] = value;

      if (field === "items" || field === "box_bundle") {
        const items = Number(updated[index].items) || 0;
        const boxBundle = Number(updated[index].box_bundle) || 0;
        updated[index].quantity = (items * boxBundle).toString();
      }
      return updated;
    });
  };

  const handleShadeNoChange = async (index, event) => {
    setLoading(true);
    const selectedProductId = event.target.value;
    if (selectedProductId) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/godownAccessory/${selectedProductId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setLoading(false);
        if (response.data && response.data.data) {
          setItems((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              stockout_inovice_id: id,
              product_accessory_id: response.data.data.product_accessory_id || "",
              godown_accessory_id: response.data.data.id || "",
              lot_no: response.data.data.lot_no || "N/A",
              length: response.data.data.out_length || "N/A",
              length_unit: response.data.data.unit || "N/A",
              items: response.data.data.items || "N/A",
              box_bundle: response.data.data.box_bundle || "N/A",
              quantity: response.data.data.quantity || "0",
            };
            return updated;
          });
        } else {
          toast.error("No products found.");
        }
      } catch (error) {
        setLoading(false);
        toast.error(error.response?.data?.message || "Something went wrong.");
      }
    }
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

    if (!result.isConfirmed) {
      return;
    }

    const payload = items.map((item) => ({
      stockout_inovice_id: id,
      godown_accessory_id: item.godown_accessory_id,
      product_accessory_id: item.product_accessory_id,
      lot_no: item.lot_no,
      length: item.length,
      length_unit: item.length_unit,
      items: item.items,
      box_bundle: item.box_bundle,
      quantity: item.quantity,
    }));

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/godownaccessoryout`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Stock added successfully");
      navigate("/warehouse_accessories");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding stock");
    }
  };

  return (
    <Container fluid className="pt-4 px-4" style={{ border: "3px dashed #14ab7f", borderRadius: "8px", background: "#ff9d0014" }}>
      <Row className="justify-content-center g-4">
        <h2 className="text-center mb-4 fw-bold">Accessory Out</h2>
        <Col md={12}>
          <div className="card shadow border-0 rounded-lg">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>
                  <FaPlus className="me-2" />
                  Add Manually
                </h4>
                <Button variant="success" onClick={handleAddRow}>
                  Add Row
                </Button>
              </div>
              <Table bordered responsive className="align-middle">
                <thead className="text-white" style={{ backgroundColor: mainColor }}>
                  <tr>
                    <th>Stock Code</th>
                    <th>Lot No</th>
                    <th>Length</th>
                    <th>Length Unit</th>
                    <th>Items</th>
                    <th>Box/Bundle</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Select
                          value={item.product_accessory_id}
                          onChange={(e) => handleShadeNoChange(index, e)}
                          required
                        >
                          <option value="">Select Stock Code</option>
                          {allProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.stock_code}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td><Form.Control type="text" value={item.lot_no} readOnly /></td>
                      <td><Form.Control type="number" value={item.length} readOnly /></td>
                      <td><Form.Control type="text" value={item.length_unit} readOnly /></td>
                      <td><Form.Control type="number" value={item.items} readOnly /></td>
                      <td><Form.Control type="number" value={item.box_bundle} readOnly /></td>
                      <td>
                        <Form.Control
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
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
