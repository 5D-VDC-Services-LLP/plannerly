// src/stores/usePlannerStore.js
import { create } from 'zustand';
import { produce } from 'immer'; // npm install immer

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

  setMode: (newMode) => set({ mode: newMode }),

  // ✨ NEW: Asynchronous action to save all data to the backend
  saveData: async () => {
    set({ isSaving: true, error: null }); // Set saving state
    try {
      // Get the relevant parts of the state to save
      const { scope, milestones } = get();
      const payload = { scope, milestones };

      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      
      console.log("Data saved successfully!");
      set({ isSaving: false, mode: 'view' }); // On success, stop saving and switch to view mode

    } catch (err) {
      console.error("Failed to save data:", err);
      set({ isSaving: false, error: err.message }); // Set error state on failure
    }
  },

  // Add a new milestone
  addMilestone: (name) => set(produce(state => {
    state.milestones.push({ id: crypto.randomUUID(), name });
  })),

  // ✨ NEW: Action to delete a milestone and its associated data
  deleteMilestone: (milestoneId) => set(produce(state => {
    // 1. Remove the milestone from the milestones array
    state.milestones = state.milestones.filter(m => m.id !== milestoneId);
    // 2. Clean up all corresponding data in the scope tree
    state.scope = removeMilestoneData(state.scope, milestoneId);
  })),

  // ✨ NEW: Action to handle the simple yes/no status of parameters
  updateParameterValue: (itemId, milestoneId, value) => set(produce(state => {
    const updateValue = item => {
      if (!item.values) item.values = {};
      item.values[milestoneId] = value;
      return item;
    };
    state.scope = findAndUpdate(state.scope, itemId, updateValue);
  })),

  // ✨ NEW: Action to rename a milestone ✨
  renameMilestone: (milestoneId, newName) => set(produce(state => {
    const milestone = state.milestones.find(m => m.id === milestoneId);
    if (milestone) {
      milestone.name = newName;
    }
  })),
  
  renameItem: (itemId, newName) => set(produce(state => {
    const updateName = item => ({ ...item, name: newName });
    state.scope = findAndUpdate(state.scope, itemId, updateName);
  })),

  toggleExpand: (itemId) => set(produce(state => {
    const toggle = item => ({ ...item, isExpanded: !item.isExpanded });
    state.scope = findAndUpdate(state.scope, itemId, toggle);
  })),

  updateCellValue: (itemId, milestoneId, field, value) => set(produce(state => {
    const updateValue = item => {
      if (!item.values) item.values = {};
      // ✨ Ensure new fields are initialized
      if (!item.values[milestoneId]) {
        item.values[milestoneId] = { g: '', r: '', responsible: '', status1: '', status2: '' };
      }
      item.values[milestoneId][field] = value;
      return item;
    };
    state.scope = findAndUpdate(state.scope, itemId, updateValue);
  })),

  addItem: (parentId, newItem) => set(produce(state => {
    // ✨ Rule: If the new item is an 'element', automatically give it a default sub-element.
    if (newItem.type === 'element') {
      newItem.children = [{
        id: crypto.randomUUID(),
        type: 'sub-element',
        name: 'Default Sub-element',
        isExpanded: true,
        children: [],
        values: {}, // Start with empty values
      }];
    }
    state.scope = findAndAddChild(state.scope, parentId, newItem);
  })),

  deleteItem: (itemId) => set(produce(state => {
    state.scope = findAndRemove(state.scope, itemId);
  })),
}));