// // src/components/ScopeGrid.jsx
// import React from 'react';
// import { usePlannerStore } from '../stores/usePlannerStore';
// import { ScopeRow } from './ScopeRow';

// export const ScopeGrid = () => {
//   // Get data and actions from the Zustand store
//   const milestones = usePlannerStore((state) => state.milestones);
//   const scope = usePlannerStore((state) => state.scope);

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen font-sans">
//       {/* Header Row */}
//       <div className="grid grid-cols-12 gap-px bg-gray-300 border border-gray-300">
//         <div className="col-span-4 bg-gray-200 p-2 font-bold text-gray-700">Scope</div>
//         {milestones.map((milestone) => (
//           <div key={milestone.id} className="col-span-2 bg-gray-200 p-2 font-bold text-gray-700 text-center">
//             {milestone.name}
//           </div>
//         ))}
//         {/* Fill remaining columns if any */}
//         <div className="col-span-4 bg-gray-200"></div>
//       </div>

//       {/* Scope Items */}
//       <div className="border-l border-r border-b border-gray-300">
//         {scope.map((item) => (
//           <ScopeRow key={item.id} item={item} depth={0} />
//         ))}
//       </div>
//     </div>
//   );
// };


// src/components/ScopeGrid.jsx
import React from 'react';
import { usePlannerStore } from '../stores/usePlannerStore';
import { ScopeRow } from './ScopeRow';
import { Plus, Edit, Save, X } from 'lucide-react'; // ✨ Import the Plus icon
import { EditableText } from './EditableText'; // ✨ Import EditableText


export const ScopeGrid = () => {
  // Get data and actions from the Zustand store
  // This prevents creating a new object on every render.
  const milestones = usePlannerStore((state) => state.milestones);
  const scope = usePlannerStore((state) => state.scope);
  const addItem = usePlannerStore((state) => state.addItem);
  const renameMilestone = usePlannerStore((state) => state.renameMilestone);
  const mode = usePlannerStore((state) => state.mode);
  const setMode = usePlannerStore((state) => state.setMode);
  const addMilestone = usePlannerStore((state) => state.addMilestone);
  const deleteMilestone = usePlannerStore((state) => state.deleteMilestone);
  const saveData = usePlannerStore((state) => state.saveData);

  // ✨ Auto-save when switching from edit to view mode
  React.useEffect(() => {
    if (mode === 'view') {
      saveData();
    }
  }, [mode, saveData]);

  // ✨ Function to add a new item at the root level
  const handleAddRootItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      type: 'folder', // Default to folder for root items
      name: 'New Root Item',
      isExpanded: true,
      children: [],
    };
    addItem(null, newItem); // ✨ Call addItem with null parentId
  };

   // ✨ Handler for adding a new milestone column
  const handleAddMilestone = () => {
    const name = prompt("Enter the name for the new milestone:");
    if (name) {
      addMilestone(name);
    }
  };

  // ✨ Handler to confirm and delete a milestone
  const handleDeleteMilestone = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the milestone "${name}"? This action cannot be undone.`)) {
      deleteMilestone(id);
    }
  };

  // ✨ Define a dynamic grid layout that grows with the number of milestones
  // Scope Column | Milestone Columns (200px each) | Add Button Column
  const gridTemplateColumns = `minmax(400px, 2fr) repeat(${milestones.length}, 200px) 150px`;

 return (
    <div className="p-4 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold text-gray-800">Project Planner</h1>
        {mode === 'view' ? (
          <button onClick={() => setMode('edit')} className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            <Edit size={14} /> Edit
          </button>
        ) : (
          <button onClick={() => setMode('view')} className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
            <Save size={14} /> Save
          </button>
        )}
      </div>

      {/* Wrapper to enable horizontal scrolling */}
      <div className="overflow-x-auto border border-gray-300">
        <div style={{ minWidth: '800px' }}> {/* Ensures scrollbar appears on smaller screens */}
          {/* Header Row */}
          <div
            className="grid gap-px bg-gray-300 sticky top-0 z-10" // Sticky header
            style={{ gridTemplateColumns }}
          >
            <div className="bg-gray-200 p-2 font-bold text-gray-700">Scope</div>
            
            {milestones.map((milestone) => (
              <div key={milestone.id} className="group relative bg-gray-200 p-2 font-bold text-gray-700 text-center flex items-center justify-center">
                <EditableText
                  initialValue={milestone.name}
                  onSave={(newName) => renameMilestone(milestone.id, newName)}
                />
                {/* ✨ Delete button appears on hover */}
                <button 
                  onClick={() => handleDeleteMilestone(milestone.id, milestone.name)}
                  className="absolute top-1 right-1 p-0.5 text-gray-500 bg-gray-200 rounded hover:bg-red-200 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <div className="bg-gray-200 p-2 flex items-center justify-center">
              <button onClick={handleAddMilestone} className="text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1">
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Scope Items */}
          <div>
            {scope.map((item) => (
              // Pass the grid layout down to each row for alignment
              <ScopeRow 
                key={item.id} 
                item={item} 
                depth={0} 
                mode={mode} 
                gridTemplateColumns={gridTemplateColumns} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Root Item Button */}
      <div className="mt-2 border-l border-r border-b border-gray-300 border-dashed rounded-md">
        <button onClick={handleAddRootItem} className="w-full text-left p-2 text-gray-500 hover:bg-gray-100 flex items-center">
          <Plus size={16} className="mr-2" />
          Add Scope Item
        </button>
      </div>
    </div>
  );
};