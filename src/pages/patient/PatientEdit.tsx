import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTransgender,
  FaArrowLeft,
  FaSave,
} from "react-icons/fa";

import { getPatientById, updatePatient } from "../../api/patientApi";
import {
  fetchCountries,
  fetchStates,
  fetchCities,
} from "../../api/locationApi";

import { PatientUpdateRequest, PatientResponse } from "../../types/Patient";

export default function PatientEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<PatientUpdateRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // location dropdowns
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  /* ---------------------- LOAD INITIAL DATA ------------------------ */
  useEffect(() => {
    loadPatient();
    fetchCountries().then(setCountries);
  }, []);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const data: PatientResponse = await getPatientById(Number(id));

      // Build update request
      const updateForm: PatientUpdateRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName || "",
        dob: data.dob,
        gender: data.gender,
        email: data.email,
        mobile: data.mobile,
        preferredLanguage: data.preferredLanguage ?? "",
        address: data.address,

        cityId: data.cityId,
        stateId: data.stateId,
        countryId: data.countryId,

        postalCode: data.postalCode,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
      };

      setForm(updateForm);

      // Load cascading states + cities
      if (data.countryId) {
        const statesData = await fetchStates(data.countryId);
        setStates(statesData);
      }
      if (data.stateId) {
        const citiesData = await fetchCities(data.stateId);
        setCities(citiesData);
      }
    } catch (err) {
      console.error("Failed to load patient", err);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- INPUT HANDLER ----------------------- */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (!form) return;

    // Normal fields
    let updatedValue: any = value;

    // Convert dropdown numeric fields
    if (["countryId", "stateId", "cityId"].includes(name)) {
      updatedValue = value ? Number(value) : 0;
    }

    setForm({ ...form, [name]: updatedValue });

    // Cascading logic
    if (name === "countryId") {
      fetchStates(Number(value)).then(setStates);
      setCities([]);
      setForm({
        ...form,
        countryId: Number(value),
        stateId: 0,
        cityId: 0,
      });
    }

    if (name === "stateId") {
      fetchCities(Number(value)).then(setCities);
      setForm({
        ...form,
        stateId: Number(value),
        cityId: 0,
      });
    }
  };

  /* --------------------------- VALIDATION ------------------------- */
  const validate = () => {
    const e: Record<string, string> = {};

    if (!form?.firstName.trim()) e.firstName = "First name required";
    if (!form?.lastName.trim()) e.lastName = "Last name required";
    if (!form?.mobile.trim()) e.mobile = "Mobile required";
    if (!form?.email.trim()) e.email = "Email required";
    if (!form?.address.trim()) e.address = "Address required";
    if (!form?.postalCode.trim()) e.postalCode = "Postal code required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* --------------------------- SUBMIT ---------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    if (!validate()) return;

    try {
      await updatePatient(Number(id), form);
      alert("Patient updated successfully!");
      navigate(`/patients/${id}`);
    } catch (err) {
      alert("Update failed!");
      console.error(err);
    }
  };

  if (loading || !form)
    return (
      <div className="text-center mt-5">
        <h4>Loading...</h4>
      </div>
    );

  /* ---------------------------- UI ----------------------------- */
  return (
    <div className="container mt-4">
      <Link to={`/patients/${id}`} className="btn btn-outline-secondary mb-3">
        <FaArrowLeft /> Back to Details
      </Link>

      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <h3 className="fw-bold text-primary mb-4">
            <FaUser /> Edit Patient: {form.firstName} {form.lastName}
          </h3>

          <form onSubmit={handleSubmit} className="row g-3">
            {/* FIRST NAME */}
            <div className="col-md-6">
              <label className="form-label fw-bold">First Name</label>
              <input
                name="firstName"
                className={`form-control ${errors.firstName && "is-invalid"}`}
                value={form.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </div>

            {/* LAST NAME */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Last Name</label>
              <input
                name="lastName"
                className={`form-control ${errors.lastName && "is-invalid"}`}
                value={form.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </div>

            {/* MIDDLE NAME */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Middle Name</label>
              <input
                name="middleName"
                className="form-control"
                value={form.middleName ?? ""}
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <FaEnvelope /> Email
              </label>
              <input
                name="email"
                className={`form-control ${errors.email && "is-invalid"}`}
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* MOBILE */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <FaPhone /> Mobile
              </label>
              <input
                name="mobile"
                className={`form-control ${errors.mobile && "is-invalid"}`}
                value={form.mobile}
                onChange={handleChange}
              />
              {errors.mobile && (
                <div className="invalid-feedback">{errors.mobile}</div>
              )}
            </div>

            {/* DOB */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Date of Birth</label>
              <input
                type="date"
                name="dob"
                className="form-control"
                value={form.dob}
                onChange={handleChange}
              />
            </div>

            {/* GENDER */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <FaTransgender /> Gender
              </label>
              <select
                name="gender"
                className="form-control"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* ADDRESS */}
            <div className="col-md-12">
              <label className="form-label fw-bold">
                <FaMapMarkerAlt /> Address
              </label>
              <textarea
                name="address"
                className={`form-control ${errors.address && "is-invalid"}`}
                rows={2}
                value={form.address}
                onChange={handleChange}
              />
              {errors.address && (
                <div className="invalid-feedback">{errors.address}</div>
              )}
            </div>

            {/* COUNTRY */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Country</label>
              <select
                name="countryId"
                className="form-control"
                value={form.countryId ? String(form.countryId) : ""}
                onChange={handleChange}
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* STATE */}
            <div className="col-md-4">
              <label className="form-label fw-bold">State</label>
              <select
                name="stateId"
                className="form-control"
                value={form.stateId ? String(form.stateId) : ""}
                onChange={handleChange}
                disabled={!form.countryId}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CITY */}
            <div className="col-md-4">
              <label className="form-label fw-bold">City</label>
              <select
                name="cityId"
                className="form-control"
                value={form.cityId ? String(form.cityId) : ""}
                onChange={handleChange}
                disabled={!form.stateId}
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* POSTAL CODE */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Postal Code</label>
              <input
                name="postalCode"
                className={`form-control ${errors.postalCode && "is-invalid"}`}
                value={form.postalCode}
                onChange={handleChange}
              />
              {errors.postalCode && (
                <div className="invalid-feedback">{errors.postalCode}</div>
              )}
            </div>

            {/* EMERGENCY CONTACT */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                Emergency Contact Name
              </label>
              <input
                name="emergencyContactName"
                className="form-control"
                value={form.emergencyContactName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Emergency Contact Phone
              </label>
              <input
                name="emergencyContactPhone"
                className="form-control"
                value={form.emergencyContactPhone}
                onChange={handleChange}
              />
            </div>

            {/* SAVE BUTTON */}
            <div className="col-12 mt-3">
              <button className="btn btn-primary px-4">
                <FaSave /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
