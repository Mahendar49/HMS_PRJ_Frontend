import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLabOrderById } from "../../api/LabOrderApi";
import { LabOrderResponse } from "../../types/LabOrders";

const LabOrderViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<LabOrderResponse | null>(null);
  const navigate = useNavigate(); // for back navigation

  useEffect(() => {
    if (id) fetchOrder(+id);
  }, [id]);

  const fetchOrder = async (id: number) => {
    const data = await getLabOrderById(id);
    setOrder(data);
  };

  if (!order) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      {/* Back button */}
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <h3>Lab Order #{order.id}</h3>
      <p><strong>Patient ID:</strong> {order.patientId}</p>
      <p><strong>Encounter ID:</strong> {order.encounterId}</p>
      <p><strong>Ordered By:</strong> {order.orderedBy}</p>
      <p><strong>Order Code:</strong> {order.orderCode}</p>
      <p><strong>Status:</strong> {order.orderStatus}</p>
      <p><strong>Result Summary:</strong> {order.resultSummary}</p>
      <p><strong>Ordered At:</strong> {new Date(order.orderedAt).toLocaleString()}</p>
      {order.performedAt && <p><strong>Performed At:</strong> {new Date(order.performedAt).toLocaleString()}</p>}
      <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default LabOrderViewPage;