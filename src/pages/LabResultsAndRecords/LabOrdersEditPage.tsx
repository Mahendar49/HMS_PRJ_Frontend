import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLabOrderById, updateLabOrder } from "../../api/LabOrderApi";
import { getAllPatients } from "../../api/patientApi";
import { getAllProviders } from "../../api/providerApi";
import { LabOrderResponse, LabOrderUpdateRequest } from "../../types/LabOrders";
import { PatientResponse } from "../../types/Patient";

const LabOrderEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<LabOrderUpdateRequest>({});
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  // Dummy Encounter List
  const encounterList = [
    { id: 1001, name: "Encounter #1001" },
    { id: 1002, name: "Encounter #1002" },
    { id: 1003, name: "Encounter #1003" },
  ];

  useEffect(() => {
    if (id) fetchOrder(+id);
    fetchPatients();
    fetchProviders();
  }, [id]);

  const fetchOrder = async (orderId: number) => {
    const data: LabOrderResponse = await getLabOrderById(orderId);

    setOrder({
      orderCode: data.orderCode,
      patientId: data.patientId,
      testCode: data.testCode,
      orderStatus: data.orderStatus,
      priority: data.priority,
      notes: data.notes,
      resultSummary: data.resultSummary,
      encounterId: data.encounterId,
      orderedBy: data.orderedBy, // IMPORTANT: correct name
    });
  };

  const fetchPatients = async () => {
    const list = await getAllPatients();
    setPatients(list);
  };

  const fetchProviders = async () => {
    const list = await getAllProviders(); // API call
    setProviders(list);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!id) return;
    await updateLabOrder(+id, order);
    navigate("/laborders");
  };

  return (
    <div className="p-4">
      <h3>Edit Lab Order #{id}</h3>

      {/* Order Code */}
      <div className="mb-2">
        <label>Order Code:</label>
        <input
          type="text"
          name="orderCode"
          className="form-control"
          value={order.orderCode || ""}
          onChange={handleChange}
        />
      </div>

      {/* Patient Dropdown */}
      <div className="mb-2">
        <label>Patient:</label>
        <select
          name="patientId"
          className="form-control"
          value={order.patientId || ""}
          onChange={handleChange}
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Test Code Dropdown */}
      <div className="mb-2">
        <label>Test Code:</label>
        <select
          name="testCode"
          className="form-control"
          value={order.testCode || ""}
          onChange={handleChange}
        >
          <option value="">Select Test</option>
          <option value="CBC001">CBC - Complete Blood Count</option>
          <option value="BMP002">BMP - Basic Metabolic Panel</option>
          <option value="LFT003">Liver Function Test</option>
        </select>
      </div>

      {/* Status */}
      <div className="mb-2">
        <label>Status:</label>
        <select
          name="orderStatus"
          className="form-control"
          value={order.orderStatus || "ordered"}
          onChange={handleChange}
        >
          <option value="ordered">ordered</option>
          <option value="in_progress">in_progress</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
      </div>

      {/* Priority */}
      <div className="mb-2">
        <label>Priority:</label>
        <select
          name="priority"
          className="form-control"
          value={order.priority || ""}
          onChange={handleChange}
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Encounter ID Dropdown */}
      <div className="mb-2">
        <label>Encounter ID:</label>
        <select
          name="encounterId"
          className="form-control"
          value={order.encounterId || ""}
          onChange={handleChange}
        >
          <option value="">Select Encounter</option>
          {encounterList.map((enc) => (
            <option key={enc.id} value={enc.id}>
              {enc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ordered By (provider fetched from backend) */}
      <div className="mb-2">
        <label>Ordered By (Provider):</label>
        <select
          name="orderedBy"
          className="form-control"
          value={order.orderedBy || ""}
          onChange={handleChange}
        >
          <option value="">Select Provider</option>

          {providers.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.providerName}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div className="mb-2">
        <label>Notes:</label>
        <input
          type="text"
          name="notes"
          className="form-control"
          value={order.notes || ""}
          onChange={handleChange}
        />
      </div>

      {/* Result Summary */}
      <div className="mb-2">
        <label>Result Summary:</label>
        <input
          type="text"
          name="resultSummary"
          className="form-control"
          value={order.resultSummary || ""}
          onChange={handleChange}
        />
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Update
      </button>
    </div>
  );
};

export default LabOrderEditPage;