// // // src/components/ScopeRow.jsx
// import React, { useState, useRef, useEffect } from 'react'; // ✨ Import hooks
// import { usePlannerStore } from '../stores/usePlannerStore';
// import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react';
// import { EditableText } from './EditableText';

// // ✨ Add isDeletable prop, defaulting to true
// export const ScopeRow = ({ item, depth, mode, isDeletable = true }) => {
//   const {
//     milestones,
//     lodOptions,
//     responsiblePartyOptions,
//     statusOptions,
//     toggleExpand,
//     renameItem,
//     updateCellValue,
//     updateParameterValue,
//     addItem,
//     deleteItem,
//   } = usePlannerStore(state => state);

//   // ✨ State and ref for the "Add" menu dropdown
//   const [showMenu, setShowMenu] = useState(false);
//   const menuRef = useRef(null);

//   // ✨ Effect to close the menu if you click outside of it
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // ✨ handleAddItem now takes the specific type to add
//   const handleAddItem = (typeToAdd) => {
//     const newItem = {
//       id: crypto.randomUUID(),
//       type: typeToAdd,
//       name: `New ${typeToAdd.charAt(0).toUpperCase() + typeToAdd.slice(1)}`,
//       isExpanded: true,
//       children: [],
//     };
//     addItem(item.id, newItem);
//     setShowMenu(false); // Close menu after adding
//   };

//   // ✨ Define which types can have children added to them
//   const canHaveChildren = ['folder', 'element', 'sub-element', 'parameter-group'].includes(item.type);

//   // ✨ Apply distinct background colors for visual hierarchy
//   const getBackgroundColor = () => {
//     switch (item.type) {
//       case 'folder':
//       case 'element':
//         return 'bg-gray-100';
//       case 'parameter-group':
//         return 'bg-blue-50';
//       case 'sub-element':
//       case 'parameter':
//       default:
//         return 'bg-white';
//     }
//   };


//   const renderCellContent = (milestone) => {
//     const cellData = item.values?.[milestone.id];

//     // --- RENDER FOR 'ELEMENT' or 'SUB-ELEMENT' ---
//     if (item.type === 'element' || item.type === 'sub-element') {
//   const cellData = item.values?.[milestone.id];

//   // --- VIEW MODE ---
//   if (mode === 'view') {
//     return (
//       <div className="text-left text-xs p-1 space-y-0.5 w-full">
//         {item.type === 'sub-element' && (
//           <>
//             <p><strong>G:</strong> {cellData?.g || '---'}</p>
//             <p><strong>R:</strong> {cellData?.r || '---'}</p>
//           </>
//         )}
//         <p><strong>By:</strong> {cellData?.responsible || '---'}</p>
//         <p><strong>S1:</strong> {cellData?.status1 || '---'}</p>
//         <p><strong>S2:</strong> {cellData?.status2 || '---'}</p>
//       </div>
//     );
//   }

//   // --- EDIT MODE ---
//   return (
//     <div className="flex flex-col gap-1 p-1 w-full">
//       {item.type === 'sub-element' && (
//         <div className="flex gap-1">
//           <select value={cellData?.g || ''} onChange={(e) => updateCellValue(item.id, milestone.id, 'g', e.target.value)} className="w-1/2 border rounded text-xs p-1">
//             <option value="">G...</option>
//             {lodOptions.g.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//           </select>
//           <select value={cellData?.r || ''} onChange={(e) => updateCellValue(item.id, milestone.id, 'r', e.target.value)} className="w-1/2 border rounded text-xs p-1">
//             <option value="">R...</option>
//             {lodOptions.r.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//           </select>
//         </div>
//       )}
//       <select value={cellData?.responsible || ''} onChange={(e) => updateCellValue(item.id, milestone.id, 'responsible', e.target.value)} className="w-full border rounded text-xs p-1">
//         <option value="">Responsible...</option>
//         {responsiblePartyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//       </select>
//       <select value={cellData?.status1 || ''} onChange={(e) => updateCellValue(item.id, milestone.id, 'status1', e.target.value)} className="w-full border rounded text-xs p-1">
//         <option value="">Status 1...</option>
//         {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//       </select>
//       <select value={cellData?.status2 || ''} onChange={(e) => updateCellValue(item.id, milestone.id, 'status2', e.target.value)} className="w-full border rounded text-xs p-1">
//         <option value="">Status 2...</option>
//         {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//       </select>
//     </div>
//   );
// }

//     // ✨ --- RENDER FOR 'PARAMETER' TYPE ---
//     if (item.type === 'parameter') {
//       const currentValue = item.values?.[milestone.id] || 'none';

//       if (mode === 'view') {
//         return (
//           <div className="text-xs font-semibold">
//             {currentValue === 'yes' && <span className="text-green-600">✓ YES</span>}
//             {currentValue === 'no' && <span className="text-red-600">✗ NO</span>}
//             {currentValue !== 'yes' && currentValue !== 'no' && <span className="text-gray-400">-</span>}
//           </div>
//         );
//       }
//       return ( // Edit Mode for 'parameter'
//         <div className="flex justify-center items-center gap-2 text-xs">
//           <label className="flex items-center gap-1 cursor-pointer">
//             <input type="radio" name={`${item.id}-${milestone.id}`} value="yes" checked={currentValue === 'yes'}
//                    onChange={(e) => updateParameterValue(item.id, milestone.id, e.target.value)} />
//             Yes
//           </label>
//           <label className="flex items-center gap-1 cursor-pointer">
//             <input type="radio" name={`${item.id}-${milestone.id}`} value="no" checked={currentValue === 'no'}
//                    onChange={(e) => updateParameterValue(item.id, milestone.id, e.target.value)} />
//             No
//           </label>
//         </div>
//       );
//     }
    
//     // For folder and parameter-group, render a disabled-looking cell
//     return <div className="h-full w-full bg-gray-200/70"></div>;
//   };

//   return (
//     <>
//       <div className={`group grid grid-cols-12 gap-px border-b border-gray-200 ${getBackgroundColor()}`}>
//         {/* Name Column with Controls */}
//         <div className="col-span-4 p-2 flex items-center" style={{ paddingLeft: `${depth * 24 + 8}px` }}>
//           <button onClick={() => item.children && toggleExpand(item.id)} className="mr-1 flex-shrink-0">
//             {item.children?.length > 0 ? (item.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <div className="w-[16px]"></div>}
//           </button>
//           <EditableText initialValue={item.name} onSave={(newName) => renameItem(item.id, newName)} />

//           <div className="ml-auto flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
//             {/* ✨ Updated "Add" menu logic */}
//             {canHaveChildren && (
//               <div className="relative" ref={menuRef}>
//                 <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-gray-300 rounded"><Plus size={14} /></button>
//                 {showMenu && (
//                   <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
//                     {item.type === 'folder' && <>
//                       <button onClick={() => handleAddItem('folder')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100">Add Folder</button>
//                       <button onClick={() => handleAddItem('element')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100">Add Element</button>
//                     </>}
//                     {item.type === 'element' && 
//                       <button onClick={() => handleAddItem('sub-element')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100">Add Sub-element</button>
//                     }
//                     {(item.type === 'sub-element' || item.type === 'parameter-group') && <>
//                       <button onClick={() => handleAddItem('parameter-group')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100">Add Parameter Group</button>
//                       <button onClick={() => handleAddItem('parameter')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100">Add Parameter</button>
//                     </>}
//                   </div>
//                 )}
//               </div>
//             )}
//             {isDeletable && (
//               <button onClick={() => deleteItem(item.id)} className="p-1 hover:bg-red-200 rounded text-red-600"><X size={14} /></button>
//             )}
//           </div>
//         </div>

//         {/* Milestone Columns */}
//         {milestones.map(milestone => (
//           <div key={milestone.id} className="col-span-2 text-center text-sm flex items-center justify-center">
//             {renderCellContent(milestone)}
//           </div>
//         ))}
//         <div className="col-span-4 bg-gray-200"></div>
//       </div>

//       {/* Recursive Rendering */}
//       {item.isExpanded && item.children?.map(child => {
//         const isNotDeletable = item.type === 'element' && item.children.length === 1;
//         return (<ScopeRow key={child.id} item={child} depth={depth + 1} mode={mode} isDeletable={!isNotDeletable} />);
//       })}
//     </>
//   );
// };



import React, { useState, useRef, useEffect } from 'react';
import { usePlannerStore } from '../stores/usePlannerStore';
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react';
import { EditableText } from './EditableText';

export const ScopeRow = ({ item, depth, mode, isDeletable = true, gridTemplateColumns }) => {
  const {
    milestones,
    lodOptions,
    responsiblePartyOptions,
    statusOptions,
    toggleExpand,
    renameItem,
    updateCellValue,
    updateParameterValue,
    addItem,
    deleteItem,
  } = usePlannerStore(state => state);

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddItem = (typeToAdd) => {
    const newItem = {
      id: crypto.randomUUID(),
      type: typeToAdd,
      name: `New ${typeToAdd.replace('-', ' ')}`,
      isExpanded: true,
      children: [],
    };
    addItem(item.id, newItem);
    setShowMenu(false);
  };

  const canHaveChildren = ['folder', 'element', 'sub-element', 'parameter-group'].includes(item.type);

  const getBackgroundColor = () => {
    switch (item.type) {
      case 'folder':
      case 'element':
        return 'bg-gray-100';
      case 'parameter-group':
        return 'bg-blue-50';
      case 'sub-element':
      case 'parameter':
      default:
        return 'bg-white';
    }
  };

  const renderCellContent = (milestone) => {
    const cellData = item.values?.[milestone.id];

    // --- RENDER FOR 'ELEMENT' or 'SUB-ELEMENT' ---
    if (item.type === 'element' || item.type === 'sub-element') {
      if (mode === 'view') {
        return (
          <div className="text-left text-xs p-1 space-y-0.5 w-full">
            {item.type === 'sub-element' && (
              <>
                <p><strong>G:</strong> {cellData?.g || '---'}</p>
                <p><strong>R:</strong> {cellData?.r || '---'}</p>
              </>
            )}
            <p><strong>By:</strong> {cellData?.responsible || '---'}</p>
            <p><strong>S1:</strong> {cellData?.status1 || '---'}</p>
            <p><strong>S2:</strong> {cellData?.status2 || '---'}</p>
          </div>
        );
      }
      return (
        <div className="flex flex-col gap-1 p-1 w-full">
          {item.type === 'sub-element' && (
            <div className="flex gap-1">
              <select value={cellData?.g || ''} onChange={(e) => updateCellValue(item.id, milestone.id, 'g', e.target.value)} className="w-1/2 border rounded text-xs p-1">
                <option value="">G...</option>
                {lodOptions.g.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={cellData?.r || ''} onChange={(e) => updateCellValue(item.id, milestone.id, 'r', e.target.value)} className="w-1/2 border rounded text-xs p-1">
                <option value="">R...</option>
                {lodOptions.r.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          )}
          <select value={cellData?.responsible || ''} onChange={(e) => updateCellValue(item.id, milestone.id, 'responsible', e.target.value)} className="w-full border rounded text-xs p-1">
            <option value="">Responsible...</option>
            {responsiblePartyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select value={cellData?.status1 || ''} onChange={(e) => updateCellValue(item.id, milestone.id, 'status1', e.target.value)} className="w-full border rounded text-xs p-1">
            <option value="">Status 1...</option>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select value={cellData?.status2 || ''} onChange={(e) => updateCellValue(item.id, milestone.id, 'status2', e.target.value)} className="w-full border rounded text-xs p-1">
            <option value="">Status 2...</option>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      );
    }

    // --- RENDER FOR 'PARAMETER' TYPE ---
    if (item.type === 'parameter') {
      const currentValue = item.values?.[milestone.id] || 'none';
      if (mode === 'view') {
        return (
          <div className="text-xs font-semibold">
            {currentValue === 'yes' && <span className="text-green-600">✓ YES</span>}
            {currentValue === 'no' && <span className="text-red-600">✗ NO</span>}
            {currentValue !== 'yes' && currentValue !== 'no' && <span className="text-gray-400">-</span>}
          </div>
        );
      }
      return (
        <div className="flex justify-center items-center gap-2 text-xs">
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name={`${item.id}-${milestone.id}`} value="yes" checked={currentValue === 'yes'}
                   onChange={(e) => updateParameterValue(item.id, milestone.id, e.target.value)} />
            Yes
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name={`${item.id}-${milestone.id}`} value="no" checked={currentValue === 'no'}
                   onChange={(e) => updateParameterValue(item.id, milestone.id, e.target.value)} />
            No
          </label>
        </div>
      );
    }
    
    return <div className="h-full w-full bg-gray-200/70"></div>;
  };

  return (
    <>
      <div 
        className={`group grid gap-px border-b border-gray-200 ${getBackgroundColor()}`}
        style={{ gridTemplateColumns }}
      >
        {/* Name Column with Controls */}
        <div className="p-2 flex items-center" style={{ paddingLeft: `${depth * 24 + 8}px` }}>
          <button onClick={() => item.children && toggleExpand(item.id)} className="mr-1 flex-shrink-0">
            {item.children?.length > 0 ? (item.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <div className="w-[16px]"></div>}
          </button>
          <EditableText initialValue={item.name} onSave={(newName) => renameItem(item.id, newName)} />
          <div className="ml-auto flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            {canHaveChildren && (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-gray-300 rounded"><Plus size={14} /></button>
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                    {item.type === 'folder' && <>
                      <button onClick={() => handleAddItem('folder')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100">Add Folder</button>
                      <button onClick={() => handleAddItem('element')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100">Add Element</button>
                    </>}
                    {item.type === 'element' && 
                      <button onClick={() => handleAddItem('sub-element')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100">Add Sub-element</button>
                    }
                    {(item.type === 'sub-element' || item.type === 'parameter-group') && <>
                      <button onClick={() => handleAddItem('parameter-group')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100">Add Parameter Group</button>
                      <button onClick={() => handleAddItem('parameter')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100">Add Parameter</button>
                    </>}
                  </div>
                )}
              </div>
            )}
            {isDeletable && (
              <button onClick={() => deleteItem(item.id)} className="p-1 hover:bg-red-200 rounded text-red-600"><X size={14} /></button>
            )}
          </div>
        </div>

        {/* Milestone Columns */}
        {milestones.map(milestone => (
          <div key={milestone.id} className="text-center text-sm flex items-center justify-center">
            {renderCellContent(milestone)}
          </div>
        ))}

        {/* This empty div corresponds to the "Add" button column in the header */}
        <div className="bg-gray-50"></div> 
      </div>

      {/* Recursive Rendering */}
      {item.isExpanded && item.children?.map(child => {
        const isNotDeletable = item.type === 'element' && item.children.length === 1;
        return (
          <ScopeRow
            key={child.id}
            item={child}
            depth={depth + 1}
            mode={mode}
            isDeletable={!isNotDeletable}
            gridTemplateColumns={gridTemplateColumns}
          />
        );
      })}
    </>
  );
};