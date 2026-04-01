const BASE = "http://localhost:8084/api/v1/locations";

export const fetchCountries = async () =>
  (await fetch(`${BASE}/countries`)).json();

export const fetchStates = async (countryId: number) =>
  (await fetch(`${BASE}/countries/${countryId}/states`)).json();

export const fetchCities = async (stateId: number) =>
  (await fetch(`${BASE}/states/${stateId}/cities`)).json();
