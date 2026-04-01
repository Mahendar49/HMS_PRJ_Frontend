import React, { useEffect, useState } from "react";
import { getAllLabOrders, deleteLabOrder } from "../../api/LabOrderApi";
import { getAllPatients } from "../../api/patientApi";
import { getAllProviders } from "../../api/providerApi";
import { getAllEncounters } from "../../api/encounterApi";

import { LabOrderResponse } from "../../types/LabOrders";
import { PatientResponse } from "../../types/Patient";
import { ProviderResponse } from "../../types/provider";

import { useNavigate } from "react-router-dom";

// 👉 PDF Libraries
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const LabOrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<LabOrderResponse[]>([]);
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);

  const [patientMap, setPatientMap] = useState<{ [key: number]: string }>({});
  const [providerMap, setProviderMap] = useState<{ [key: number]: string }>({});
  const [encounterMap, setEncounterMap] = useState<{ [key: number]: string }>(
    {}
  );

  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const orderData = await getAllLabOrders();
    const patientData = await getAllPatients();
    const providerData = await getAllProviders();
    const encounterData = await getAllEncounters();

    setOrders(orderData);
    setPatients(patientData);
    setProviders(providerData);
    setEncounters(encounterData.data);

    // ⭐ Patient Map
    const pMap: { [key: number]: string } = {};
    patientData.forEach((p) => {
      pMap[p.id] = `${p.firstName} ${p.lastName}`;
    });
    setPatientMap(pMap);

    // ⭐ Provider Map
    const prvMap: { [key: number]: string } = {};
    providerData.forEach((p) => {
      prvMap[p.id] = p.providerName;
    });
    setProviderMap(prvMap);

    // ⭐ Encounter Map (id → encounterCode)
    const encMap: { [key: number]: string } = {};
    encounterData.data.forEach((e) => {
      encMap[e.id] = e.encounterCode;
    });
    setEncounterMap(encMap);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this lab order?")) {
      try {
        await deleteLabOrder(id);
        setOrders(orders.filter((o) => o.id !== id));
      } catch (err) {
        console.error("Failed to delete lab order:", err);
        alert("Failed to delete lab order. Please try again.");
      }
    }
  };

  // 🔍 Filter Logic
  const filteredOrders = orders.filter((o) => {
    const patientName = patientMap[o.patientId] || "";
    const providerName = providerMap[o.orderedBy] || "";
    const orderCode = o.orderCode || "";
    const encounterCode = encounterMap[o.encounterId] || "";

    return (
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      encounterCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // ⭐ PDF GENERATION FUNCTION
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Lab Orders Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "ID",
          "Patient",
          "Encounter",
          "Provider",
          "Order Code",
          "Status",
          "Created At",
        ],
      ],
      body: filteredOrders.map((o) => [
        o.id,
        patientMap[o.patientId] || "Unknown",
        encounterMap[o.encounterId] || "Unknown",
        providerMap[o.orderedBy] || "Unknown",
        o.orderCode,
        o.orderStatus,
        o.createdAt ? new Date(o.createdAt).toLocaleString() : "",
      ]),
    });

    doc.save("lab_orders.pdf");
  };

  return (
    <div className="p-4">
      <h3>Lab Orders</h3>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Patient, Provider, Encounter, or Order Code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ⭐ PDF BUTTON */}
      <button className="btn btn-secondary mb-3 me-2" onClick={generatePDF}>
        📄 Download PDF
      </button>

      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate("/laborders/new")}
      >
        + Create Lab Order
      </button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Encounter</th>
            <th>Ordered By</th>
            <th>Order Code</th>
            <th>Status</th>
            <th>Ordered At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{patientMap[o.patientId] || "Unknown"}</td>

              {/* ⭐ Showing Encounter Code Here */}
              <td>{encounterMap[o.encounterId] || "Unknown"}</td>

              <td>{providerMap[o.orderedBy] || "Unknown"}</td>
              <td>{o.orderCode || "N/A"}</td>
              <td>{o.orderStatus}</td>

              <td>
                {o.createdAt
                  ? new Date(o.createdAt).toLocaleString()
                  : "Not Available"}
              </td>

              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => navigate(`/laborders/${o.id}`)}
                >
                  View
                </button>

                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => navigate(`/laborders/${o.id}/edit`)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(o.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredOrders.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center">
                No lab orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LabOrderListPage;
