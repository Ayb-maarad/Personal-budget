

import { useState } from "react";
import { post_envelope } from "../services/envelopeService";

const CreateEnvelopeForm = ({onSuccess}) => {

    const [EnvelopeTitle, setEnvelopeTitle] = useState("");
    const [EnvelopeBudget, setEnvelopeBudget] = useState("");
    const [Err , setErr] = useState("");

    const handleEnvelope = async () => {

        try {
            setErr("");
            const response = await post_envelope({
                title: EnvelopeTitle,
                budget: EnvelopeBudget
            })
            onSuccess?.();
            console.log(response);

        } catch (error) {
            console.log(error);
            setErr(error.message);

            setTimeout(()=>{
                setErr("");
            },3000);
        }
    }





    const handleEnvelopeSubmit = (e) => {
        e.preventDefault();
        handleEnvelope();
    }






    return (
        <div className="max-w-xl mx-auto bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-gray-300 mb-4">Add a New Envelope</h2>
            <form onSubmit={handleEnvelopeSubmit} className="flex flex-col gap-3">
                <input
                    placeholder="Envelope name"
                    type="text"
                    value={EnvelopeTitle}
                    onChange={(e) => setEnvelopeTitle(e.target.value)}
                    className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={EnvelopeBudget}
                    onChange={(e) => setEnvelopeBudget(e.target.value)}
                    className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-semibold rounded-lg py-2">
                    Submit
                </button>
                {Err ?  <p className="text-red-500 mb-4" >This envelope already exists</p> : null}
            </form>
        </div>
    );
}

export default CreateEnvelopeForm;