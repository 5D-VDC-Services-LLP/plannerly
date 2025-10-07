// /server/routes/save.js
import express from 'express';
// import Scope from '../models/Scope.js';

const router = express.Router();

// Save scope data
router.post('/save', async (req, res) => {
  try {
    const { scope, milestones } = req.body;

    console.log(scope, milestones);

    // // Option 1: Replace existing document (for simplicity)
    // await Scope.deleteMany({});
    // const savedScope = await Scope.create({ scope, milestones });

    // res.status(200).json({ message: 'Scope saved successfully', data: savedScope });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving scope', error: err.message });
  }
});

export default router;
