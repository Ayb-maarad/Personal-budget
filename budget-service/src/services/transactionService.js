

const { Transaction, Envelope } = require("../db");

const envelopeService = require('../services/envelopeService')


const getTransactions = async (userId) => {
    const envelopes = await Envelope.findAll({ where: { userId }, attributes: ['id'] });
    const envelopeIds = envelopes.map(e => e.id);
    const transactions = await Transaction.findAll({ where: { envelopeId: envelopeIds } });
    return transactions;
}

const getTransactionById = async (id) => {
    const transaction = await Transaction.findByPk(id);
    return transaction;
}

const getAllTransactionByEnvelope = async (id) => {
    const transactions = await Transaction.findAll({ where: { envelopeId: id } });
    return transactions;
}

const create_transaction = async (data, userId) => {
    const { title, budget } = data;

    const envelope = await envelopeService.getEnvelopeBytitle(title, userId);

    if (!envelope) {
        throw new Error('Envelope not found');
    }

    if (budget == null) {
        throw new Error('budget is required');
    }

    if (budget < 0) {
        throw new Error("should be positive");
    }

    const updated_envelope_budget = envelope.budget - budget;

    if (updated_envelope_budget <= 0) {
        throw new Error("You have no suffiscient money for this operation");
    }

    const updated_envelope = await envelopeService.updateEnvelope(envelope.id, { title: envelope.title, budget: updated_envelope_budget }, userId);

    const transaction = await Transaction.create({ envelopeId: envelope.id, budget });

    return { transaction, updated_envelope };
}


module.exports = {
    getTransactionById,
    getTransactions,
    getAllTransactionByEnvelope,
    create_transaction
};

