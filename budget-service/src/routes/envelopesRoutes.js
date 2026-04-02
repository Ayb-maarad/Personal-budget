const express = require("express");

const envelopesController = require('../controllers/envelopesController');



const router = express.Router();



// Get all envelopes
router.get("/", envelopesController.get_envelopes);

// Get single envelope by ID
router.get("/:id", envelopesController.get_envelope);

// Create new envelope
router.post("/", envelopesController.create_envelope);

// Update envelope
router.put("/:id", envelopesController.update_envelope);

// Delete envelope
router.delete("/:id", envelopesController.delete_envelope);

module.exports = router;