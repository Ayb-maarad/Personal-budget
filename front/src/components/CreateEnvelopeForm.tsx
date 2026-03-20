

import { useState } from "react";
import { post_envelope } from "../services/envelopeService";


type CreateEnvelopeFormprops = {
    onSuccess : ()=> void;
}

const CreateEnvelopeForm = ({onSuccess}: CreateEnvelopeFormprops) => {

    const [EnvelopeTitle, setEnvelopeTitle] = useState<string>("");
    const [EnvelopeBudget, setEnvelopeBudget] = useState<number>(0);
    const [Err , setErr] = useState<string>("");

    const handleEnvelope = async () : Promise<void> => {

        try {
            setErr("");
            const response = await post_envelope({
                title: EnvelopeTitle,
                budget: EnvelopeBudget
            })
            onSuccess?.();
            console.log(response);

        } catch (error: any) {
            console.log(error);
            setErr(error.message);

            setTimeout(()=>{
                setErr(""); 
            },3000);
        }
    }





    const handleEnvelopeSubmit = async (e : React.FormEvent<HTMLFormElement>) : Promise<void> => {
        e.preventDefault();
       await handleEnvelope();
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
                    onChange={(e) => setEnvelopeBudget(Number(e.target.value))}
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