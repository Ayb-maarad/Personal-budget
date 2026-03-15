const envelopeService = require("../services/envelopeService");

// Get all envelopes
exports.get_envelopes = async (req, res) => {
  try {
    const envelopes = await envelopeService.getAllEnvelopes();
    res.status(200).json({ envelopes });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// Get single envelope
exports.get_envelope = async (req, res) => {
  try {
    const id = req.params.id;
    const envelope = await envelopeService.getEnvelopeById(id);

    if (!envelope) {
      return res.status(404).json({ error: 'Envelope not found' });
    }

    res.status(200).json({ envelope });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// Create envelope
exports.create_envelope = async (req, res) => {
  try {
    const { title, budget } = req.body;
    const envelope = await envelopeService.createEnvelope({ title, budget });
    res.status(201).json({ envelope });
  } catch (error) {
    // Business logic errors (validation)
    if (error.message.includes('required') || error.message.includes('positive')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// Update envelope
exports.update_envelope = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, budget } = req.body;
    
    const envelope = await envelopeService.updateEnvelope(id, { title, budget });

    if (!envelope) {
      return res.status(404).json({ error: 'Envelope not found' });
    }

    res.status(200).json({ envelope });
  } catch (error) {
    // Business logic errors (validation)
    if (error.message.includes('required') || error.message.includes('positive')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// Delete envelope
exports.delete_envelope = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await envelopeService.deleteEnvelope(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Envelope not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};


