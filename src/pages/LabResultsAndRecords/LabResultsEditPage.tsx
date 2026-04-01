// src/pages/LabResults/LabResultEditPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLabResultById, updateLabResult } from "../../api/LabResultsApi";
import { LabResultUpdateRequest, LabResultResponse } from "../../types/LabResult";

const LabResultEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<LabResultUpdateRequest>({});

  useEffect(() => {
    if (id) load(+id);
  }, [id]);

  const load = async (id: number) => {
    const data: LabResultResponse = await getLabResultById(id);
    setForm({
      testCode: data.testCode,
      testName: data.testName,
      resultValue: data.resultValue,
      referenceRange: data.referenceRange,
      units: data.units,
      resultStatus: data.resultStatus,
      resultDate: data.resultDate,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!id) return;
    await updateLabResult(+id, form);
    navigate("/laborders/results");
  };

  return (
    <div className="p-4">
      <h3>Edit Lab Result</h3>

      <div className="mb-2">
        <label>Test Code</label>
        <input type="text" name="testCode" className="form-control" value={form.testCode || ""} onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label>Test Name</label>
        <input type="text" name="testName" className="form-control" value={form.testName || ""} onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label>Result Value</label>
        <input type="text" name="resultValue" className="form-control" value={form.resultValue || ""} onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label>Reference Range</label>
        <input type="text" name="referenceRange" className="form-control" value={form.referenceRange || ""} onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label>Units</label>
        <input type="text" name="units" className="form-control" value={form.units || ""} onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label>Status</label>
        <select name="resultStatus" className="form-control" value={form.resultStatus || ""} onChange={handleChange}>
          <option value="finalv">finalv</option>
          <option value="preliminary">preliminary</option>
          <option value="amended">amended</option>
        </select>
      </div>

      <div className="mb-2">
        <label>Result Date</label>
        <input type="datetime-local" name="resultDate" className="form-control" value={form.resultDate || ""} onChange={handleChange} />
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>Update</button>
    </div>
  );
};

export default LabResultEditPage;