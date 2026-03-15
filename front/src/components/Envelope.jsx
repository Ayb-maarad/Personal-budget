import { useState, useEffect } from "react";
import { get_envelopes, post_envelope } from "../services/envelopeService";
import { post_transaction } from "../services/transactionService";

const Envelope = () => {
    const [TransactionTitle, setTransactionTitle] = useState("");
    const [TransactionBudget, setTransactionBudget] = useState("");
    const [EnvelopeTitle, setEnvelopeTitle] = useState("");
    const [EnvelopeBudget, setEnvelopeBudget] = useState("");
    const [envelopes, setEnvelopes] = useState([]);

    const fetch_envelopes = async () => {
        try {
            const data = await get_envelopes();
            setEnvelopes(data);
        } catch (error) {
            console.log(error);
        }
    };

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

    const handleEnvelope = async () => {

        try {
            const response = await post_envelope({
                title: EnvelopeTitle,
                budget: EnvelopeBudget
            })
            console.log(response);

        } catch (error) {
            console.log(error);
        }
    }

    const handleTransactionSubmit = (e) => {
        e.preventDefault();
        handleTransaction();
    };

    const handleEnvelopeSubmit = (e) => {
        e.preventDefault();
        handleEnvelope();
    }





    useEffect(() => {
        fetch_envelopes();
    }, []);

    return (
        <>
            <ul>
                {[...envelopes]
                    .sort((a, b) => b.budget - a.budget)
                    .map((envelope) => (
                        <li key={envelope.id}>
                            {envelope.title}
                            <div>{envelope.budget}</div>
                        </li>
                    ))}
            </ul>
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

            <p> Add a new envelope : </p>
            <form onSubmit={handleEnvelopeSubmit}>
                <input placeholder="Envelope name" type="text" value={EnvelopeTitle} />
                <input type="number" placeholder="amount"
                    value={EnvelopeBudget}
                    onChange={(e) => setEnvelopeBudget(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        </>
    );
};

export default Envelope;