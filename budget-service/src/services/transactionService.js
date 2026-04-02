

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

    const transactions = await Transaction.findAll({ where: { envelopeId: id } });

    return transactions;


}

const create_transaction = async (data) => {

    const { title, budget } = data;


    const envelope = await envelopeService.getEnvelopeBytitle(title);

    if (budget == null) {
        throw new Error('budget is required');
    }

    if (budget < 0) {
        throw new Error("should be positive");
    }

    const updated_envelope_budget = envelope.budget - budget;

    if(updated_envelope_budget <= 0){
        throw new Error("You have no suffiscient money for this operation");
    }

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

