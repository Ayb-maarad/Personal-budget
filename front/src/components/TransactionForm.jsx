

import { useState } from "react";
import { post_transaction } from "../services/transactionService";

const TransactionForm = ({envelopes}) => {

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

            fetch_envelopes();
        } catch (error) {
            console.log(error);
        }
    };



    const handleTransactionSubmit = (e) => {
        e.preventDefault();
        handleTransaction();
    };


    return (
        <>
            <p>Do a transaction : </p>
            <form onSubmit={handleTransactionSubmit}>
                <select value={TransactionTitle} onChange={(e) => setTransactionTitle(e.target.value)}>
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
                />

                <button type="submit">Buy</button>
            </form>
        </>
    );

}

export default TransactionForm;


