import React from "react";
import sample from "../data.sample.json";
export default function Providers() {
  return (
    <div>
      <h3>Providers</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {sample.providers.map((p) => (
            <tr key={p.id}>
              <td>{p.provider_code}</td>
              <td>
                {p.first_name} {p.last_name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
