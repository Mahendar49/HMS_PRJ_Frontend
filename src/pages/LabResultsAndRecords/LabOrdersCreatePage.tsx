// src/pages/LabOrders/LabOrderCreatePage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLabOrder } from "../../api/LabOrderApi";
import { LabOrderRequest } from "../../types/LabOrders";
import { getAllPatients } from "../../api/patientApi";
import { getAllProviders } from "../../api/providerApi";
import { getAllEncounters } from "../../api/encounterApi";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
}

interface Provider {
  id: number;
  providerName: string;
}

interface Encounter {
  id: number;
  encounterCode: string;   // ✅ Added encounterCode to show in dropdown
}

const LabOrderCreatePage: React.FC = () => {
  const [order, setOrder] = useState<LabOrderRequest>({
    patientId: 0,
    encounterId: 0,
    orderedBy: 0,
    orderStatus: "ordered",
    resultSummary: ""
  });

  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingEncounters, setLoadingEncounters] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch patients
      try {
        const patientsData = await getAllPatients();
        setPatients(patientsData);
      } catch (err) {
        console.error("Failed to load patients:", err);
      } finally {
        setLoadingPatients(false);
      }

      // Fetch providers
      try {
        const providersData = await getAllProviders();
        setProviders(providersData);
      } catch (err) {
        console.error("Failed to load providers:", err);
      } finally {
        setLoadingProviders(false);
      }

      // Fetch encounters (AxiosResponse)
      try {
        const response = await getAllEncounters();
        setEncounters(response.data || []);   // ✅ FIXED AxiosResponse
      } catch (err) {
        console.error("Failed to load encounters:", err);
      } finally {
        setLoadingEncounters(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await createLabOrder(order);
    navigate("/laborders");
  };

  return (
    <div className="p-4">
      <h3>Create Lab Order</h3>

      {/* Patient Dropdown */}
      <div className="mb-2">
        <label>Patient:</label>
        <select
          name="patientId"
          className="form-control"
          value={order.patientId}
          onChange={handleChange}
          required
        >
          <option value={0}>{loadingPatients ? "Loading..." : "Select Patient"}</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName} (ID: {p.id})
            </option>
          ))}
        </select>
      </div>

      {/* Encounter Dropdown */}
      <div className="mb-2">
        <label>Encounter:</label>
        <select
          name="encounterId"
          className="form-control"
          value={order.encounterId}
          onChange={handleChange}
          required
        >
          <option value={0}>{loadingEncounters ? "Loading..." : "Select Encounter"}</option>

          {encounters.map((enc) => (
            <option key={enc.id} value={enc.id}>
              {enc.id} - {enc.encounterCode}   {/* ✅ SHOW ID + CODE */}
            </option>
          ))}
        </select>
      </div>

      {/* Ordered By Dropdown */}
      <div className="mb-2">
        <label>Ordered By (Provider):</label>
        <select
          name="orderedBy"
          className="form-control"
          value={order.orderedBy}
          onChange={handleChange}
          required
        >
          <option value={0}>{loadingProviders ? "Loading..." : "Select Provider"}</option>
          {providers.map((pr) => (
            <option key={pr.id} value={pr.id}>
              {pr.providerName} (ID: {pr.id})
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="mb-2">
        <label>Status:</label>
        <select
          name="orderStatus"
          className="form-control"
          value={order.orderStatus}
          onChange={handleChange}
        >
          <option value="ordered">ordered</option>
          <option value="in_progress">in_progress</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
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
        Create
      </button>
    </div>
  );
};

export default LabOrderCreatePage;
