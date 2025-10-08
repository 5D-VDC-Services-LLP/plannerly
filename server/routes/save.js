// /server/routes/save.js

import express from 'express';
import Planner from "../model/plannerModel.js";

const router = express.Router();

// Save scope data with user preferences integration
router.post('/save', async (req, res) => {
    const { scope, milestones, userId, title, description } = req.body;
    console.log("📝 Saving planner data:", { scope, milestones, userId });

   try {
    // Create planner data object
    const plannerData = {
      scope: scope || [],
      milestones: milestones || [],
      userId: userId || null,
      title: title || `Plan created on ${new Date().toLocaleDateString()}`,
      description: description || ''
    };

    const newPlanner = new Planner(plannerData);
    const savedPlanner = await newPlanner.save();
    
    res.status(200).json({ 
      success: true,
      message: "Data saved successfully",
      data: {
        plannerId: savedPlanner._id,
        createdAt: savedPlanner.createdAt
      }
    });
  } catch (err) {
    console.error("❌ Error saving data:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to save data",
      error: err.message,
      details: err.errors ? Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message
      })) : null
    });
  }
});

export default router;
