const envelopeService = require("../services/envelopeService");

// Get all envelopes
exports.get_envelopes = async (req, res) => {
  try {
    const envelopes = await envelopeService.getAllEnvelopes(req.user.id);
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
    const envelope = await envelopeService.getEnvelopeById(id, req.user.id);

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
    const envelope = await envelopeService.createEnvelope({ title, budget, userId: req.user.id });
    res.status(201).json({ envelope });
  } catch (error) {
    if (error.message.includes('required') || error.message.includes('positive') || error.message.includes('exists')) {
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

    const envelope = await envelopeService.updateEnvelope(id, { title, budget }, req.user.id);

    if (!envelope) {
      return res.status(404).json({ error: 'Envelope not found' });
    }

    res.status(200).json({ envelope });
  } catch (error) {
    if (error.message.includes('required') || error.message.includes('positive')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// Delete envelope
exports.delete_envelope = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await envelopeService.deleteEnvelope(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Envelope not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};


