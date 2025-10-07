// import React, { useState } from "react";
// import { FiChevronDown, FiChevronRight } from "react-icons/fi";

// function App() {
//   const [tableData, setTableData] = useState([
//     {
//       id: 1,
//       type: "subsection",
//       label: "Subsection 1",
//       expanded: true,
//       milestones: {},
//       children: [
//         {
//           id: 2,
//           type: "element",
//           label: "Element 1",
//           expanded: true,
//           milestones: {
//             milestone1: { value: "G 200", status: "completed" },
//             milestone2: { value: "", status: "not_completed" },
//             milestone3: { value: "", status: "not_completed" },
//             milestone4: { value: "", status: "not_completed" },
//           },
//           children: [],
//         },
//       ],
//     },
//   ]);

//   const generateId = () => Date.now() + Math.random();

//   const toggleExpand = (id, rows) =>
//     rows.map((row) =>
//       row.id === id
//         ? { ...row, expanded: !row.expanded }
//         : { ...row, children: toggleExpand(id, row.children) }
//     );

//   const handleInputChange = (id, milestoneKey, value, rows) =>
//     rows.map((row) =>
//       row.id === id
//         ? {
//             ...row,
//             milestones: {
//               ...row.milestones,
//               [milestoneKey]: {
//                 value,
//                 status: value.trim() !== "" ? "completed" : "not_completed",
//               },
//             },
//           }
//         : { ...row, children: handleInputChange(id, milestoneKey, value, row.children) }
//     );

//   const addElement = (parentId, rows) =>
//     rows.map((row) =>
//       row.id === parentId && row.type === "subsection"
//         ? {
//             ...row,
//             children: [
//               ...row.children,
//               {
//                 id: generateId(),
//                 type: "element",
//                 label: "New Element",
//                 expanded: true,
//                 milestones: {
//                   milestone1: { value: "", status: "not_completed" },
//                   milestone2: { value: "", status: "not_completed" },
//                   milestone3: { value: "", status: "not_completed" },
//                   milestone4: { value: "", status: "not_completed" },
//                 },
//                 children: [],
//               },
//             ],
//           }
//         : { ...row, children: addElement(parentId, row.children) }
//     );

//   const addSubsection = (parentId, rows) =>
//     rows.map((row) =>
//       row.id === parentId && row.type === "element"
//         ? {
//             ...row,
//             children: [
//               ...row.children,
//               {
//                 id: generateId(),
//                 type: "subsection",
//                 label: "New Subsection",
//                 expanded: true,
//                 milestones: {},
//                 children: [],
//               },
//             ],
//           }
//         : { ...row, children: addSubsection(parentId, row.children) }
//     );

//   const renderRows = (rows, level = 0) =>
//     rows.map((row) => (
//       <React.Fragment key={row.id}>
//         <tr
//           className={`transition ${
//             row.type === "subsection"
//               ? "bg-gray-50 border-t border-b"
//               : "hover:bg-gray-50"
//           }`}
//         >
//           <td
//             className="px-3 py-2 font-medium text-gray-800 border-r flex items-center"
//             style={{ paddingLeft: `${level * 20 + 8}px` }}
//           >
//             <button
//               className="mr-2 text-gray-600 hover:text-gray-900"
//               onClick={() => setTableData(toggleExpand(row.id, tableData))}
//             >
//               {row.children.length > 0 ? (
//                 row.expanded ? (
//                   <FiChevronDown />
//                 ) : (
//                   <FiChevronRight />
//                 )
//               ) : (
//                 <span className="text-gray-300">•</span>
//               )}
//             </button>
//             {row.label}
//           </td>

//           {Object.entries(row.milestones || {}).map(([key, milestone]) => (
//             <td key={key} className="px-2 py-1 border-r text-center">
//               <input
//                 type="text"
//                 value={milestone.value}
//                 onChange={(e) =>
//                   setTableData(handleInputChange(row.id, key, e.target.value, tableData))
//                 }
//                 className="w-full p-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
//                 style={{
//                   backgroundColor:
//                     milestone.status === "completed" ? "#99daff" : "#ffffff",
//                 }}
//               />
//             </td>
//           ))}
//         </tr>

//         {row.expanded && (
//           <>
//             {renderRows(row.children, level + 1)}

//             {row.type === "subsection" && (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="px-3 py-2 text-blue-600 text-sm cursor-pointer hover:underline border-b"
//                   style={{ paddingLeft: `${(level + 1) * 20 + 28}px` }}
//                   onClick={() => setTableData(addElement(row.id, tableData))}
//                 >
//                   + Add Element
//                 </td>
//               </tr>
//             )}
//             {row.type === "element" && (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="px-3 py-2 text-green-600 text-sm cursor-pointer hover:underline border-b"
//                   style={{ paddingLeft: `${(level + 1) * 20 + 28}px` }}
//                   onClick={() => setTableData(addSubsection(row.id, tableData))}
//                 >
//                   + Add Subsection
//                 </td>
//               </tr>
//             )}
//           </>
//         )}
//       </React.Fragment>
//     ));

//   const handleSave = () => {
//     console.log("Saved data:", tableData);
//     alert("Data saved to console!");
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Plannerly-Style Table</h1>
//           <button
//             onClick={handleSave}
//             className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition"
//           >
//             Save
//           </button>
//         </div>

//         <table className="border-collapse w-full text-sm rounded-lg overflow-hidden">
//           <thead className="bg-gray-100 text-gray-700 border-b">
//             <tr>
//               <th className="px-3 py-2 text-left border-r">Task</th>
//               <th className="px-3 py-2 border-r">Milestone 1</th>
//               <th className="px-3 py-2 border-r">Milestone 2</th>
//               <th className="px-3 py-2 border-r">Milestone 3</th>
//               <th className="px-3 py-2">Milestone 4</th>
//             </tr>
//           </thead>
//           <tbody>{renderRows(tableData)}</tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { ScopeGrid } from './components/ScopeGrid';

function App() {
  return (
    <div>
      <ScopeGrid />
    </div>
  );
}

export default App;
