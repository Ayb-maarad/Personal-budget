import { useState, useEffect } from "react";
import { get_envelopes } from "../services/envelopeService";
import { get_transactions } from "../services/transactionService";
import CreateEnvelopeForm from "../components/CreateEnvelopeForm";
import EnvelopeItem from "../components/EnvelopeItem";
import TransactionForm from "../components/TransactionForm";
import Transactionlogs from "../components/Transactionlogs";

type TransactionType = {
    id: number;
    date: string;
    envelopeId: number;
    budget: number;
};

type EnvelopeType = {
    id: number;
    title: string;
    budget: number;
};

const EnvelopePage = () => {

    const [envelopes, setEnvelopes] = useState<EnvelopeType[]>([]);
    const [transactions, setTransactions] = useState<TransactionType[]>([]);

    const fetch_envelopes_and_transactions = async (): Promise<void> => {
        try {
            const data: EnvelopeType[] = await get_envelopes();
            setEnvelopes(data);
            const res = await get_transactions();
            setTransactions(res.transactions);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetch_envelopes_and_transactions();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground px-4 py-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 border-b border-border pb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            Envelope Manager
                        </h1>
                        <p className="text-muted-foreground mt-1 text-xs tracking-widest uppercase">Manage your budget with envelopes</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <section className="lg:col-span-2">
                        <EnvelopeItem
                            envelopes={envelopes}
                            setEnvelopes={setEnvelopes}
                        />
                    </section>
                    <div className="space-y-4">
                        <section>
                            <TransactionForm
                                envelopes={envelopes}
                                onSuccess={fetch_envelopes_and_transactions}
                            />
                        </section>
                        <section>
                            <CreateEnvelopeForm onSuccess={fetch_envelopes_and_transactions} />
                        </section>
                        <section>
                            <Transactionlogs envelopes={envelopes} transactions={transactions} />
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnvelopePage;
