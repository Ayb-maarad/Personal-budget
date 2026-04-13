const { Envelope } = require("../db");


const getAllEnvelopes = async (userId) => {
  const envelopes = await Envelope.findAll({ where: { userId } });
  return envelopes;
};


const getEnvelopeById = async (id, userId) => {
  const envelope = await Envelope.findOne({ where: { id, userId } });
  return envelope;
};

const getEnvelopeBytitle = async (title, userId) => {
  const envelope = await Envelope.findOne({ where: { title, userId } });
  return envelope;
};


const createEnvelope = async (envelopeData) => {
  const { title, budget, userId } = envelopeData;

  if (!title || budget === null) {
    throw new Error('Title and budget are required');
  }

  if (budget < 0) {
    throw new Error('Budget must be a positive number');
  }

  const existing = await getEnvelopeBytitle(title, userId);

  if (existing) {
    throw new Error('envelope already exists');
  }

  const envelope = await Envelope.create({ title, budget, userId });
  return envelope;
};

const updateEnvelope = async (id, updateData, userId) => {
  const { title, budget } = updateData;

  if (!title || !budget) {
    throw new Error('Title and budget are required');
  }

  if (budget < 0) {
    throw new Error('Budget must be a positive number');
  }

  const envelope = await Envelope.findOne({ where: { id, userId } });

  if (!envelope) {
    return null;
  }

  await envelope.update({ title, budget });
  return envelope;
};


const deleteEnvelope = async (id, userId) => {
  const deletedCount = await Envelope.destroy({ where: { id, userId } });
  return deletedCount > 0;
};

const getTotalBudget = async (userId) => {
  const envelopes = await Envelope.findAll({ where: { userId } });
  const total = envelopes.reduce((sum, envelope) => sum + envelope.budget, 0);
  return total;
};

module.exports = {
  getAllEnvelopes,
  getEnvelopeById,
  getEnvelopeBytitle,
  createEnvelope,
  updateEnvelope,
  deleteEnvelope,
  getTotalBudget,
};
