

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
    const [err, setErr] = useState<string>("");
   
   

    const handleTransaction = async (): Promise<void> => {

        try {
            const response = await post_transaction({
                title: TransactionTitle,
                budget: Number(TransactionBudget),
            });

            console.log(response);
            setTransactionBudget("");
            setErr("");
            onSuccess();
        } catch (error: any) {
            const message = error.response?.data?.error ?? error.message;
            setErr(message);
            setTimeout(() => setErr(""), 4000);
        }
    };



    const handleTransactionSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        await handleTransaction();
    };


    return (
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 border-b border-border pb-3">New Transaction</h2>
            <form onSubmit={handleTransactionSubmit} className="flex flex-col gap-3">
                <select
                    value={TransactionTitle}
                    onChange={(e) => setTransactionTitle(e.target.value)}
                    className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors cursor-pointer"
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
                    className="bg-background border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />

                <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all font-semibold rounded-lg py-2">
                    Buy
                </button>
                {err && <p className="text-destructive text-sm mt-1">{err}</p>}
            </form>

      
        </div>
    );

}

export default TransactionForm;


