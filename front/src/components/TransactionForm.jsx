

import { useState } from "react";
import { post_transaction } from "../services/transactionService";

const TransactionForm = ({envelopes, onSuccess}) => {

    const [TransactionTitle, setTransactionTitle] = useState("");
    const [TransactionBudget, setTransactionBudget] = useState("");

    const handleTransaction = async () => {
        try {
            const response = await post_transaction({
                title: TransactionTitle,
                budget: Number(TransactionBudget),
            });

            console.log(response);
            setTransactionBudget("");

            onSuccess();
        } catch (error) {
            console.log(error);
        }
    };



    const handleTransactionSubmit = (e) => {
      
        handleTransaction();
    };


    return (
        <div className="max-w-xl mx-auto mb-8 bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-gray-300 mb-4">Do a Transaction</h2>
            <form onSubmit={handleTransactionSubmit} className="flex flex-col gap-3">
                <select
                    value={TransactionTitle}
                    onChange={(e) => setTransactionTitle(e.target.value)}
                    className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                    <option value="">-- choose an envelope --</option>
                    {envelopes.map((envelope) => (
                        <option key={envelope.id} value={envelope.title}>
                            {envelope.title}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Amount"
                    value={TransactionBudget}
                    onChange={(e) => setTransactionBudget(e.target.value)}
                    className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />

                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-semibold rounded-lg py-2">
                    Buy
                </button>
            </form>
        </div>
    );

}

export default TransactionForm;


