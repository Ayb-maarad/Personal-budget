const express = require("express");
const transactionController = require('../controllers/transactionController');

const router = express.Router();

// Get all transactions
router.get("/", transactionController.get_transactions);

// Get transactions by envelope ID
router.get("/:id", transactionController.get_transaction_by_envelope);

// Create new transaction
router.post("/", transactionController.create_transaction);

// Get single transaction by ID
router.get("/:id", transactionController.get_transaction);

// // Transfer between envelopes
// router.post("/transfer", transactionController.transfer_between_envelopes);

// // Update transaction
// router.put("/:id", transactionController.update_transaction);

// // Delete transaction
// router.delete("/:id", transactionController.delete_transaction);

module.exports = router;