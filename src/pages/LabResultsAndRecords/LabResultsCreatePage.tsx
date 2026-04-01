// src/pages/LabResults/LabResultCreatePage.tsx
import React, { useState, useEffect } from "react";
import { LabResultRequest } from "../../types/LabResult";
import { createLabResult } from "../../api/LabResultsApi";
import { getAllLabOrders } from "../../api/LabOrderApi";
import { useNavigate } from "react-router-dom";

interface LabOrderDropDown {
  id: number;
  orderCode: string;
}

const LabResultCreatePage: React.FC = () => {
  const navigate = useNavigate();

  // Store dropdown lab orders
  const [labOrders, setLabOrders] = useState<LabOrderDropDown[]>([]);

  const [result, setResult] = useState<LabResultRequest>({
    labOrderId: 0,
    testName: "",
    resultValue: "",
    referenceRange: "",
    units: "",
    resultStatus: "finalv",
    // ❌ removed resultDate - backend will generate
  });

  // Load Lab Orders for dropdown
  useEffect(() => {
    loadLabOrders();
  }, []);

  const loadLabOrders = async () => {
    try {
      const data = await getAllLabOrders();
      const orderList = data.map((o: any) => ({
        id: o.id,
        orderCode: o.orderCode,
      }));
      setLabOrders(orderList);
    } catch (err) {
      console.error("Error loading lab orders:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setResult({ ...result, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await createLabResult(result);
    navigate("/laborders/results");
  };

  return (
    <div className="p-4">
      <h3>Create Lab Result</h3>

      {/* LAB ORDER DROPDOWN */}
      <div className="mb-2">
        <label>Lab Order</label>
        <select
          name="labOrderId"
          className="form-control"
          value={result.labOrderId}
          onChange={handleChange}
        >
          <option value={0}>-- Select Lab Order --</option>
          {labOrders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.orderCode} (ID: {order.id})
            </option>
          ))}
        </select>
      </div>

      {/* Test Name */}
      <div className="mb-2">
        <label>Test Name</label>
        <input type="text" name="testName" className="form-control" onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label>Result Value</label>
        <input type="text" name="resultValue" className="form-control" onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label>Reference Range</label>
        <input type="text" name="referenceRange" className="form-control" onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label>Units</label>
        <input type="text" name="units" className="form-control" onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label>Status</label>
        <select name="resultStatus" className="form-control" onChange={handleChange}>
          <option value="finalv">finalv</option>
          <option value="preliminary">preliminary</option>
          <option value="amended">amended</option>
        </select>
      </div>

      {/* ❌ REMOVED RESULT DATE FIELD */}

      <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
    </div>
  );
};

export default LabResultCreatePage;