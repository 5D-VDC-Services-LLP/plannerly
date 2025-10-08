//server/model/plannerModel.js
import mongoose from "mongoose";

// Define schema for folder structure
const folderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  isExpanded: { type: Boolean, default: false },
  children: { type: Array, default: [] }
}, { _id: false });

// Define schema for milestones
const milestoneSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  dueDate: Date,
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], 
    default: 'pending' 
  }
}, { _id: false });

const plannerSchema = new mongoose.Schema({
  userId: { type: String, index: true }, // Add userId for user association
  scope: [folderSchema], // Array of folder objects
  milestones: [milestoneSchema], // Structured milestone array
  title: String, // Optional title for the plan
  description: String, // Optional description
  status: { 
    type: String, 
    enum: ['draft', 'active', 'completed', 'archived'], 
    default: 'draft' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
plannerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Planner = mongoose.model("Planner", plannerSchema);

export default Planner;
