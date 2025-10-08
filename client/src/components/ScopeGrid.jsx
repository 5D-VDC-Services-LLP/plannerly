// src/components/ScopeGrid.jsx
import React from 'react';
import { usePlannerStore } from '../stores/usePlannerStore';
import { ScopeRow } from './ScopeRow';
import { Plus, Edit, Save, X } from 'lucide-react'; // ✨ Import the Plus icon
import { EditableText } from './EditableText'; // ✨ Import EditableText


export const ScopeGrid = () => {
  // Get data and actions from the Zustand store
  const milestones = usePlannerStore((state) => state.milestones);
  const scope = usePlannerStore((state) => state.scope);
  const addItem = usePlannerStore((state) => state.addItem);
  const renameMilestone = usePlannerStore((state) => state.renameMilestone);
  const mode = usePlannerStore((state) => state.mode);
  const setMode = usePlannerStore((state) => state.setMode);
  const addMilestone = usePlannerStore((state) => state.addMilestone);
  const deleteMilestone = usePlannerStore((state) => state.deleteMilestone);
  const saveData = usePlannerStore((state) => state.saveData);
  // ✨ NEW: Get the hasUnsavedChanges state and the revert action
  const hasUnsavedChanges = usePlannerStore((state) => state.hasUnsavedChanges);
  const revertChanges = usePlannerStore((state) => state.revertChanges); 
  const isSaving = usePlannerStore((state) => state.isSaving); // Also get isSaving state

  // ✨ REMOVE Auto-save useEffect, as save is now explicit

  // Function to add a new item at the root level
  const handleAddRootItem = () => {
    // ... (remains the same) ...
    const newItem = {
      id: crypto.randomUUID(),
      type: 'folder', // Default to folder for root items
      name: 'New Root Item',
      isExpanded: true,
      children: [],
    };
    addItem(null, newItem); // Call addItem with null parentId
  };

   // Handler for adding a new milestone column
  const handleAddMilestone = () => {
    const name = prompt("Enter the name for the new milestone:");
    if (name) {
      addMilestone(name);
    }
  };

  // Handler to confirm and delete a milestone
  const handleDeleteMilestone = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the milestone "${name}"? This action cannot be undone.`)) {
      deleteMilestone(id);
    }
  };

  // Define a dynamic grid layout that grows with the number of milestones
  const gridTemplateColumns = `minmax(400px, 2fr) repeat(${milestones.length}, 200px) 150px`;

 return (
    <div className="p-4 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold text-gray-800">Project Planner</h1>
        
        {/* ✨ MODIFIED BUTTONS: Always show save button beside edit/cancel */}
        <div className="flex items-center gap-2">
          
          {/* Save Button (Disabled when not in edit or no changes) */}
          <button 
            onClick={saveData} 
            disabled={mode !== 'edit' || !hasUnsavedChanges || isSaving} 
            className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
              mode === 'edit' && hasUnsavedChanges && !isSaving 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? 'Saving...' : <Save size={14} />} 
            {isSaving ? '' : 'Save'}
          </button>

          {/* Edit / Cancel Button */}
          {mode === 'view' ? (
            <button 
              onClick={() => setMode('edit')} 
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Edit size={14} /> Edit
            </button>
          ) : (
            <button 
              onClick={revertChanges} // Use the new revertChanges action
              className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* Wrapper to enable horizontal scrolling */}
      <div className="overflow-x-auto border border-gray-300">
        <div style={{ minWidth: '800px' }}>
          {/* Header Row */}
          <div
            className="grid gap-px bg-gray-300 sticky top-0 z-10" 
            style={{ gridTemplateColumns }}
          >
            <div className="bg-gray-200 p-2 font-bold text-gray-700">Scope</div>
            
            {milestones.map((milestone) => (
              <div key={milestone.id} className="group relative bg-gray-200 p-2 font-bold text-gray-700 text-center flex items-center justify-center">
                {/* ✨ CONDITIONALLY RENDER EditableText or static text */}
                {mode === 'edit' ? (
                  <EditableText
                    initialValue={milestone.name}
                    onSave={(newName) => renameMilestone(milestone.id, newName)}
                  />
                ) : (
                  <span>{milestone.name}</span>
                )}

                {/* Delete button appears only in edit mode on hover */}
                {mode === 'edit' && (
                  <button 
                    onClick={() => handleDeleteMilestone(milestone.id, milestone.name)}
                    className="absolute top-1 right-1 p-0.5 text-gray-500 bg-gray-200 rounded hover:bg-red-200 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}

            <div className="bg-gray-200 p-2 flex items-center justify-center">
              {/* Add Milestone button is only visible in edit mode */}
              {mode === 'edit' && (
                <button onClick={handleAddMilestone} className="text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1">
                  <Plus size={14} /> Add
                </button>
              )}
            </div>
          </div>

          {/* Scope Items */}
          <div>
            {scope.map((item) => (
              <ScopeRow 
                key={item.id} 
                item={item} 
                depth={0} 
                mode={mode} // Mode is still passed down
                gridTemplateColumns={gridTemplateColumns} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Root Item Button (Only visible in edit mode) */}
      {mode === 'edit' && (
        <div className="mt-2 border-l border-r border-b border-gray-300 border-dashed rounded-md">
          <button onClick={handleAddRootItem} className="w-full text-left p-2 text-gray-500 hover:bg-gray-100 flex items-center">
            <Plus size={16} className="mr-2" />
            Add Scope Item
          </button>
        </div>
      )}
    </div>
  );
};