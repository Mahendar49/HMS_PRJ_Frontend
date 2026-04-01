// import React from "react";
// import sample from "../../data.sample.json";
// import { Link } from "react-router-dom";
// export default function Patients() {
//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Patients</h3>
//         <Link to="/patients/new" className="btn btn-primary btn-sm">
//           Create
//         </Link>
//       </div>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>MRN</th>
//             <th>Name</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {sample.patients.map((p) => (
//             <tr key={p.id}>
//               <td>{p.mrn}</td>
//               <td>
//                 {p.first_name} {p.last_name}
//               </td>
//               <td>
//                 <Link
//                   to={"/patients/" + p.id}
//                   className="btn btn-sm btn-outline-primary"
//                 >
//                   View
//                 </Link>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
