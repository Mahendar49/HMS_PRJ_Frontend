import React, { useState, useEffect } from "react";
import { PatientRequest } from "../../types/Patient";
import { registerPatient } from "../../api/authApi";

import {
  fetchCountries,
  fetchStates,
  fetchCities,
} from "../../api/locationApi";

import { CountryDto, StateDto, CityDto } from "../../types/Location";
import { useNavigate } from "react-router-dom";

export default function PatientRegister() {
  const [form, setForm] = useState<PatientRequest>({
    password: "",
    mobile: "",
    enabled: true,
    locked: false,
    firstName: "",
    lastName: "",
    middleName: "",
    dob: "",
    gender: "",
    email: "",
    preferredLanguage: "",
    address: "",
    cityId: 0,
    stateId: 0,
    countryId: 0,
    postalCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [states, setStates] = useState<StateDto[]>([]);
  const [cities, setCities] = useState<CityDto[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string>("");
  const navSubmit = useNavigate();
  // LOAD LOCATION DATA
  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  useEffect(() => {
    if (form.countryId) {
      fetchStates(form.countryId).then(setStates);
      setForm((prev) => ({ ...prev, stateId: 0, cityId: 0 }));
      setCities([]);
    }
  }, [form.countryId]);

  useEffect(() => {
    if (form.stateId) {
      fetchCities(form.stateId).then(setCities);
      setForm((prev) => ({ ...prev, cityId: 0 }));
    }
  }, [form.stateId]);

  // INPUT HANDLER
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // VALIDATION
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Min 6 characters";

    if (!form.mobile.trim()) newErrors.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(form.mobile))
      newErrors.mobile = "Enter 10 digits";
    if (!form.gender.trim()) newErrors.gender = "Select gender";

    if (!form.dob.trim()) newErrors.dob = "DOB required";

    if (!form.countryId) newErrors.countryId = "Select country";
    if (!form.stateId) newErrors.stateId = "Select state";
    if (!form.cityId) newErrors.cityId = "Select city";

    if (!form.address.trim()) newErrors.address = "Address required";

    if (!form.postalCode.trim()) newErrors.postalCode = "Postal Code needed";

    if (!form.emergencyContactName.trim())
      newErrors.emergencyContactName = "Emergency contact name required";

    if (!form.emergencyContactPhone.trim())
      newErrors.emergencyContactPhone = "Emergency contact phone required";
    else if (!/^\d{10}$/.test(form.emergencyContactPhone))
      newErrors.emergencyContactPhone = "Must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await registerPatient(form);
      setSuccess("🎉 Patient Registered Successfully!");
      setErrors({});
    } catch (err: any) {
      alert(err?.message || "Registration failed");
    }
    navSubmit("/patients");
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-3">
          <i className="bi bi-person-plus-fill text-primary"></i> Patient
          Registration
        </h3>

        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* FIRST NAME */}
            <div className="col-md-4">
              <label className="form-label">First Name</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  name="firstName"
                  className="form-control"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              {errors.firstName && (
                <small className="text-danger">{errors.firstName}</small>
              )}
            </div>

            {/* LAST NAME */}
            <div className="col-md-4">
              <label className="form-label">Last Name</label>
              <input
                name="lastName"
                className="form-control"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <small className="text-danger">{errors.lastName}</small>
              )}
            </div>

            {/* MIDDLE NAME */}
            <div className="col-md-4">
              <label className="form-label">Middle Name</label>
              <input
                name="middleName"
                className="form-control"
                placeholder="Middle Name"
                value={form.middleName}
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            {/* MOBILE */}
            <div className="col-md-6">
              <label className="form-label">Mobile</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-phone"></i>
                </span>
                <input
                  name="mobile"
                  className="form-control"
                  placeholder="Mobile"
                  value={form.mobile}
                  onChange={handleChange}
                />
              </div>
              {errors.mobile && (
                <small className="text-danger">{errors.mobile}</small>
              )}
            </div>

            {/* DOB */}
            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dob"
                className="form-control"
                value={form.dob}
                onChange={handleChange}
              />
              {errors.dob && (
                <small className="text-danger">{errors.dob}</small>
              )}
            </div>

            {/* GENDER */}
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unknown">Unknown</option>
              </select>
              {errors.gender && (
                <small className="text-danger">{errors.gender}</small>
              )}
            </div>

            {/* PASSWORD */}
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

            {/* ADDRESS */}
            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                className="form-control"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
              />
              {errors.address && (
                <small className="text-danger">{errors.address}</small>
              )}
            </div>

            {/* COUNTRY */}
            <div className="col-md-4">
              <label className="form-label">Country</label>
              <select
                className="form-select"
                name="countryId"
                value={form.countryId}
                onChange={handleChange}
              >
                <option value={0}>Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.countryId && (
                <small className="text-danger">{errors.countryId}</small>
              )}
            </div>

            {/* STATE */}
            <div className="col-md-4">
              <label className="form-label">State</label>
              <select
                className="form-select"
                name="stateId"
                value={form.stateId}
                onChange={handleChange}
              >
                <option value={0}>Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.stateId && (
                <small className="text-danger">{errors.stateId}</small>
              )}
            </div>

            {/* CITY */}
            <div className="col-md-4">
              <label className="form-label">City</label>
              <select
                className="form-select"
                name="cityId"
                value={form.cityId}
                onChange={handleChange}
              >
                <option value={0}>Select City</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.cityId && (
                <small className="text-danger">{errors.cityId}</small>
              )}
            </div>

            {/* POSTAL CODE */}
            <div className="col-md-6">
              <label className="form-label">Postal Code</label>
              <input
                name="postalCode"
                className="form-control"
                placeholder="Postal Code"
                value={form.postalCode}
                onChange={handleChange}
              />
              {errors.postalCode && (
                <small className="text-danger">{errors.postalCode}</small>
              )}
            </div>

            {/* Language */}
            <div className="col-md-6">
              <label className="form-label">Preferred Language</label>
              <input
                name="preferredLanguage"
                className="form-control"
                placeholder="English, Telugu, Hindi..."
                value={form.preferredLanguage}
                onChange={handleChange}
              />
            </div>

            {/* Emergency Contact Name */}
            <div className="col-md-6">
              <label className="form-label">Emergency Contact Name</label>
              <input
                name="emergencyContactName"
                className="form-control"
                placeholder="Contact Name"
                value={form.emergencyContactName}
                onChange={handleChange}
              />
              {errors.emergencyContactName && (
                <small className="text-danger">
                  {errors.emergencyContactName}
                </small>
              )}
            </div>

            {/* Emergency Contact Phone */}
            <div className="col-md-6">
              <label className="form-label">Emergency Contact Phone</label>
              <input
                name="emergencyContactPhone"
                className="form-control"
                placeholder="Emergency Contact Phone"
                value={form.emergencyContactPhone}
                onChange={handleChange}
              />
              {errors.emergencyContactPhone && (
                <small className="text-danger">
                  {errors.emergencyContactPhone}
                </small>
              )}
            </div>
          </div>

          <button className="btn btn-primary w-100 mt-3">
            <i className="bi bi-save"></i> Register Patient
          </button>
        </form>
      </div>
    </div>
  );
}
