

const { Transaction, Envelope } = require("../db");

const envelopeService = require('../services/envelopeService')


const getTransactions = async () => {

    const transactions = await Transaction.findAll();
    return transactions;
}

const getTransactionById = async (id) => {

    const transaction = await Transaction.findByPk(id);

    return transaction;


}

const getAllTransactionByEnvelope = async (id) => {

    const transactions = await Transaction.findAll({ where: { envelope_id: id } });

    return transactions;


}

const create_transaction = async (data) => {

    const { id, budget } = data;


    const envelope = await envelopeService.getEnvelopeById(id);

    if (budget == null) {
        throw new Error('budget is required');
    }

    if (budget < 0) {
        throw new Error("should be positive");
    }

    const updated_envelope_budget = envelope.budget - budget;

    const updated_envelope = await envelopeService.updateEnvelope(envelope.id, { title: envelope.title, budget: updated_envelope_budget });

    const transaction = await Transaction.create({ envelopeId: envelope.id, budget });

    return { transaction, updated_envelope };




}


module.exports = {
    getTransactionById,
    getTransactions,
    getAllTransactionByEnvelope,
    create_transaction
};

