import React, { useEffect, useState } from "react";
import axios from "axios";

type Country = { id: number; name: string; isoCode?: string };
type State = { id: number; name: string; code?: string };
type City = { id: number; name: string; postalCode?: string };

const API_BASE = "http://localhost:8086/api/locations";

const CascadingDropdown: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<number | "">("");
  const [selectedState, setSelectedState] = useState<number | "">("");
  const [selectedCity, setSelectedCity] = useState<number | "">("");

  useEffect(() => {
    axios
      .get(`${API_BASE}/countries`)
      .then((r) => setCountries(r.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedCountry === "") {
      setStates([]);
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
      return;
    }
    axios
      .get(`${API_BASE}/countries/${selectedCountry}/states`)
      .then((r) => {
        setStates(r.data);
        setSelectedState("");
        setCities([]);
        setSelectedCity("");
      })
      .catch(console.error);
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState === "") {
      setCities([]);
      setSelectedCity("");
      return;
    }
    axios
      .get(`${API_BASE}/states/${selectedState}/cities`)
      .then((r) => {
        setCities(r.data);
        setSelectedCity("");
      })
      .catch(console.error);
  }, [selectedState]);

  return (
    <div className="row g-3">
      <div className="col-md-4">
        <label className="form-label">Country</label>
        <select
          className="form-select"
          value={selectedCountry as any}
          onChange={(e) =>
            setSelectedCountry(e.target.value ? Number(e.target.value) : "")
          }
        >
          <option value="">-- Select Country --</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label">State</label>
        <select
          className="form-select"
          value={selectedState as any}
          onChange={(e) =>
            setSelectedState(e.target.value ? Number(e.target.value) : "")
          }
          disabled={!selectedCountry || states.length === 0}
        >
          <option value="">-- Select State --</option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label">City</label>
        <select
          className="form-select"
          value={selectedCity as any}
          onChange={(e) =>
            setSelectedCity(e.target.value ? Number(e.target.value) : "")
          }
          disabled={!selectedState || cities.length === 0}
        >
          <option value="">-- Select City --</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.postalCode ? ` (${c.postalCode})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12 mt-3">
        <button
          className="btn btn-primary"
          onClick={() =>
            alert(
              `Selected: Country ${selectedCountry}, State ${selectedState}, City ${selectedCity}`
            )
          }
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CascadingDropdown;
