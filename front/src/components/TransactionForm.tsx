

import React, { useState } from "react";
import { post_transaction } from "../services/transactionService";

type EnvelopeType = {

  id : number;
  title : string;
  budget : number;
}

type TransactionFormProps = {
  envelopes: EnvelopeType[];
  onSuccess: () => void | Promise<void>;
};


const TransactionForm = ({envelopes , onSuccess}: TransactionFormProps) => {

    const [TransactionTitle, setTransactionTitle] = useState<string>("");
    const [TransactionBudget, setTransactionBudget] = useState<string>("");

    const handleTransaction = async (): Promise<void> => {
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



    const handleTransactionSubmit = async (): Promise<void> => {
     
        await handleTransaction();
    };


    return (
        <div className="max-w-xl mx-auto mb-8 bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 ring-1 ring-indigo-500/10">
            <h2 className="text-base font-bold text-indigo-400 uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">New Transaction</h2>
            <form onSubmit={handleTransactionSubmit} className="flex flex-col gap-3">
                <select
                    value={TransactionTitle}
                    onChange={(e) => setTransactionTitle(e.target.value)}
                    className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors cursor-pointer"
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

                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold rounded-lg py-2 shadow-md shadow-indigo-900/30">
                    Buy
                </button>
            </form>
        </div>
    );

}

export default TransactionForm;


