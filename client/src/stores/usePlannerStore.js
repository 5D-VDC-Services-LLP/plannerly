// src/stores/usePlannerStore.js
import { create } from 'zustand';
import { produce } from 'immer'; // npm install immer
import axios from 'axios';

// --- Recursive Helper Functions ---

// Finds an item and updates its properties (e.g., name)
const findAndUpdate = (items, itemId, updater) => {
  return items.map(item => {
    if (item.id === itemId) {
      return updater(item);
    }
    if (item.children) {
      return { ...item, children: findAndUpdate(item.children, itemId, updater) };
    }
    return item;
  });
};

// We will modify the logic inside the store action directly, so this helper stays the same.
const findAndAddChild = (items, parentId, newItem) => {
  // If parentId is null, add to the root
  if (parentId === null) {
    return [...items, newItem];
  }
  return items.map(item => {
    if (item.id === parentId) {
      return { ...item, children: [...(item.children || []), newItem], isExpanded: true };
    }
    if (item.children) {
      return { ...item, children: findAndAddChild(item.children, parentId, newItem) };
    }
    return item;
  });
};


// Finds and removes an item from the tree
const findAndRemove = (items, itemId) => {
  const filteredItems = items.filter(item => item.id !== itemId);
  return filteredItems.map(item => {
    if (item.children) {
      return { ...item, children: findAndRemove(item.children, itemId) };
    }
    return item;
  });
};

// ✨ NEW: Recursively traverse the scope and remove data for a deleted milestone
const removeMilestoneData = (items, milestoneId) => {
  return items.map(item => {
    // If the item has values and the milestone key exists, delete it
    if (item.values && item.values[milestoneId]) {
      delete item.values[milestoneId];
    }
    // Recurse through children if they exist
    if (item.children && item.children.length > 0) {
      item.children = removeMilestoneData(item.children, milestoneId);
    }
    return item;
  });
};

// --- Zustand Store Definition ---

export const usePlannerStore = create((set, get) => ({
  // --- STATE (from your previous code) ---
  mode: 'view', // 'view' or 'edit'
  hasUnsavedChanges: false, // ✨ NEW STATE: Tracks if any modification has occurred
  originalScope: null, // ✨ NEW STATE: To hold a snapshot of the scope for reverting
  originalMilestones: null, // ✨ NEW STATE: To hold a snapshot of milestones for reverting

  milestones: [
    { id: "milestone-1", name: "Milestone 1" },
    { id: "milestone-2", name: "Milestone 2" },
  ],
  scope: [
    {
      id: "folder-1",
      type: "folder",
      name: "Architectural",
      isExpanded: true,
      children: [{
        id: "element-101",
        type: "element",
        name: "Walls",
        isExpanded: true,
        children: [{
          id: "sub-element-201",
          type: "sub-element",
          name: "Exterior Walls",
          isExpanded: true,
          values: { /* ... */ },
          // ✨ Sub-elements can now have parameters and groups as children
          children: [{
              id: "param-group-1",
              type: "parameter-group",
              name: "Quality Checks",
              isExpanded: true,
              children: [{
                id: "param-101",
                type: "parameter",
                name: "Clash Detection Run",
                values: { "milestone-1": "yes", "milestone-2": "no" },
              }, ],
            },
            {
              id: "param-102",
              type: "parameter",
              name: "Data Sheet Submitted",
              values: { "milestone-1": "no", "milestone-2": "yes" },
            },
          ],
        }, ],
      }, ],
    },
  ],
  lodOptions: {
    g: ["200", "300", "350", "400"],
    r: ["200", "300", "350", "400"],
  },
  responsiblePartyOptions: ["ARCH", "STR", "MEP", "GC"],
  statusOptions: ["Not Started", "WIP", "Approved"],

  // --- ACTIONS ---
  
  // Using Immer for easier nested state updates
  // This is much safer than manual spreading

setMode: (newMode) => set(produce(state => {
    state.mode = newMode;
    if (newMode === 'edit') {
      // Create a deep copy snapshot of current state when entering edit mode
      state.originalScope = JSON.parse(JSON.stringify(state.scope));
      state.originalMilestones = JSON.parse(JSON.stringify(state.milestones));
    } else if (newMode === 'view' && !state.hasUnsavedChanges) {
      // Clear snapshot if we switch back to view without saving
      state.originalScope = null;
      state.originalMilestones = null;
    }
  })),

  // ✨ NEW ACTION: Revert all changes and switch to view mode
  revertChanges: () => set(state => ({
    mode: 'view',
    hasUnsavedChanges: false,
    scope: state.originalScope || state.scope, // Revert to snapshot or stay the same
    milestones: state.originalMilestones || state.milestones,
    originalScope: null,
    originalMilestones: null,
  })),

  // ✨ MODIFIED: Asynchronous action to save all data. Clears changes flag and snapshot.
  saveData: async () => {
    set({ isSaving: true, error: null });
    try {
      const { scope, milestones } = get();
      const payload = { scope, milestones };

      const response = await axios.post(
        "http://localhost:5000/api/save",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Data saved successfully!", response.data);
      
      // ✨ Reset state on successful save
      set({ 
        isSaving: false, 
        mode: "view", 
        hasUnsavedChanges: false, 
        originalScope: null, // Clear snapshot
        originalMilestones: null, // Clear snapshot
      });
    } catch (err) {
      // ... (Error handling remains the same) ...
      set({ isSaving: false, error: errorMessage });
    }
  },

  // ✨ MODIFIED: All mutator actions now set hasUnsavedChanges: true

  addMilestone: (name) => set(produce(state => {
    state.milestones.push({ id: crypto.randomUUID(), name });
    state.hasUnsavedChanges = true; // Set flag
  })),

  deleteMilestone: (milestoneId) => set(produce(state => {
    state.milestones = state.milestones.filter(m => m.id !== milestoneId);
    state.scope = removeMilestoneData(state.scope, milestoneId);
    state.hasUnsavedChanges = true; // Set flag
  })),

  updateParameterValue: (itemId, milestoneId, value) => set(produce(state => {
    const updateValue = item => {
      if (!item.values) item.values = {};
      item.values[milestoneId] = value;
      return item;
    };
    state.scope = findAndUpdate(state.scope, itemId, updateValue);
    state.hasUnsavedChanges = true; // Set flag
  })),

  renameMilestone: (milestoneId, newName) => set(produce(state => {
    const milestone = state.milestones.find(m => m.id === milestoneId);
    if (milestone) {
      milestone.name = newName;
      state.hasUnsavedChanges = true; // Set flag
    }
  })),
  
  renameItem: (itemId, newName) => set(produce(state => {
    const updateName = item => ({ ...item, name: newName });
    state.scope = findAndUpdate(state.scope, itemId, updateName);
    state.hasUnsavedChanges = true; // Set flag
  })),

  toggleExpand: (itemId) => set(produce(state => {
    // ... (No change to hasUnsavedChanges, this is a UI state change) ...
    const toggle = item => ({ ...item, isExpanded: !item.isExpanded });
    state.scope = findAndUpdate(state.scope, itemId, toggle);
  })),

  updateCellValue: (itemId, milestoneId, field, value) => set(produce(state => {
    const updateValue = item => {
      if (!item.values) item.values = {};
      if (!item.values[milestoneId]) {
        item.values[milestoneId] = { g: '', r: '', responsible: '', status1: '', status2: '' };
      }
      item.values[milestoneId][field] = value;
      return item;
    };
    state.scope = findAndUpdate(state.scope, itemId, updateValue);
    state.hasUnsavedChanges = true; // Set flag
  })),

  addItem: (parentId, newItem) => set(produce(state => {
    // ... (default sub-element logic) ...
    if (newItem.type === 'element') {
      newItem.children = [{
        id: crypto.randomUUID(),
        type: 'sub-element',
        name: 'Default Sub-element',
        isExpanded: true,
        children: [],
        values: {}, 
      }];
    }
    state.scope = findAndAddChild(state.scope, parentId, newItem);
    state.hasUnsavedChanges = true; // Set flag
  })),

  deleteItem: (itemId) => set(produce(state => {
    state.scope = findAndRemove(state.scope, itemId);
    state.hasUnsavedChanges = true; // Set flag
  })),
}));