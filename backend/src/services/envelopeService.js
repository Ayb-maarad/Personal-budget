const { Envelope } = require("../db");


const getAllEnvelopes = async () => {
  const envelopes = await Envelope.findAll();
  return envelopes;
};


const getEnvelopeById = async (id) => {
  const envelope = await Envelope.findByPk(id);
  return envelope;
};

const getEnvelopeBytitle = async (title) =>{

  const envelope = await Envelope.findOne({where: { title }})
  return envelope;
}


const createEnvelope = async (envelopeData) => {
  const { title, budget } = envelopeData;
  
  // Business logic validation
  if (!title || !budget) {
    throw new Error('Title and budget are required');
  }

  if (budget < 0) {
    throw new Error('Budget must be a positive number');
  }

  const envelope = await Envelope.create({ title, budget });
  return envelope;
};

const updateEnvelope = async (id, updateData) => {
  const { title, budget } = updateData;

  // Business logic validation
  if (!title || !budget) {
    throw new Error('Title and budget are required');
  }

  if (budget < 0) {
    throw new Error('Budget must be a positive number');
  }

  const envelope = await Envelope.findByPk(id);
  
  if (!envelope) {
    return null;
  }

  await envelope.update({ title, budget });
  return envelope;
};


const deleteEnvelope = async (id) => {
  const deletedCount = await Envelope.destroy({ where: { id } });
  return deletedCount > 0;
};

const getTotalBudget = async () => {
  const envelopes = await Envelope.findAll();
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
