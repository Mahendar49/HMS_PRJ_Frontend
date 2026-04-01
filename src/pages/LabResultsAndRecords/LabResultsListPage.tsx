// src/pages/LabResults/LabResultsListPage.tsx
import React, { useEffect, useState } from "react";
import { getAllLabResults, deleteLabResult } from "../../api/LabResultsApi";
import { getAllLabOrders } from "../../api/LabOrderApi";

import { LabResultResponse } from "../../types/LabResult";
import { LabOrderResponse } from "../../types/LabOrders";

import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const LabResultsListPage: React.FC = () => {
  const [results, setResults] = useState<LabResultResponse[]>([]);
  const [labOrders, setLabOrders] = useState<LabOrderResponse[]>([]);
  const [labOrderMap, setLabOrderMap] = useState<{ [key: number]: string }>({});

  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resultData = await getAllLabResults();
      const labOrderData = await getAllLabOrders();

      setResults(resultData);
      setLabOrders(labOrderData);

      // Build Lab Order Map (id → orderCode)
      const loMap: { [key: number]: string } = {};
      labOrderData.forEach((o) => {
        loMap[o.id] = o.orderCode;
      });
      setLabOrderMap(loMap);

    } catch (err) {
      console.error("Failed to fetch lab results:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this lab result?")) {
      try {
        await deleteLabResult(id);
        setResults(results.filter((r) => r.id !== id));
      } catch (err) {
        console.error("Failed to delete lab result:", err);
        alert("Failed to delete lab result. Please try again.");
      }
    }
  };

  // PDF DOWNLOAD FUNCTION
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Lab Results Report", 14, 15);

    let y = 30;

    results.forEach((r) => {
      doc.setFontSize(10);

      doc.text(
        `ID: ${r.id} | Order: ${labOrderMap[r.labOrderId] || "Unknown"} | Code: ${r.testCode} | Name: ${r.testName}`,
        14,
        y
      );
      y += 6;

      doc.text(
        `Value: ${r.resultValue} ${r.units || ""} | Range: ${r.referenceRange} | Status: ${r.resultStatus}`,
        14,
        y
      );
      y += 6;

      doc.text(
        `Date: ${r.resultDate ? new Date(r.resultDate).toLocaleString() : "N/A"}`,
        14,
        y
      );

      y += 10;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("lab-results.pdf");
  };

  // Filter logic
  const filteredResults = results.filter((r) => {
    return (
      r.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.testCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.resultStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (labOrderMap[r.labOrderId] || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-4">
      <h3>Lab Results</h3>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Test Name, Test Code, Order Code, or Status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="d-flex gap-2 mb-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/laborders/results/new")}
        >
          + Create Lab Result
        </button>

        {/* PDF GENERATE BUTTON */}
        <button className="btn btn-danger" onClick={generatePDF}>
          Download PDF
        </button>
      </div>

      {/* TABLE */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Lab Order Code</th>
            <th>Test Code</th>
            <th>Test Name</th>
            <th>Result Value</th>
            <th>Reference Range</th>
            <th>Units</th>
            <th>Status</th>
            <th>Result Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredResults.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>

              {/* SHOW LAB ORDER CODE INSTEAD OF ID */}
              <td>{labOrderMap[r.labOrderId] || "Unknown"}</td>

              <td>{r.testCode || "N/A"}</td>
              <td>{r.testName || "N/A"}</td>
              <td>{r.resultValue || "N/A"}</td>
              <td>{r.referenceRange || "N/A"}</td>
              <td>{r.units || "N/A"}</td>
              <td>{r.resultStatus || "N/A"}</td>

              <td>
                {r.resultDate
                  ? new Date(r.resultDate).toLocaleString()
                  : "Not Available"}
              </td>

              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => navigate(`/laborders/results/${r.id}`)}
                >
                  View
                </button>

                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => navigate(`/laborders/results/${r.id}/edit`)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => r.id && handleDelete(r.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredResults.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center">
                No lab results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LabResultsListPage;
