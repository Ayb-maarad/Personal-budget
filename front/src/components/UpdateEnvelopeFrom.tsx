

import { update_envelope } from "../services/envelopeService";

import React, { useState } from "react";

type EnvelopeType = {

  id : number;
  title : string;
  budget : number;
}


type UpdateEnvelopeFormprops = {

    envelope : EnvelopeType;
    onClose : ()=> void
}

const UpdateEnvelopeForm = ({envelope, onClose}: UpdateEnvelopeFormprops)=>{

      const [EnvelopeTitle, setEnvelopeTitle] = useState<string>(envelope.title);
      const [EnvelopeBudget, setEnvelopeBudget] = useState<number>(envelope.budget);


    const handleUpdateEnvelope = async (e : React.FormEvent<HTMLFormElement>) : Promise<void> => {
                
                   
            
                try {
                    const res = await update_envelope(envelope.id, {
                        title : EnvelopeTitle,
                        budget : EnvelopeBudget,
                    });
                    console.log(res);
                    onClose();

                    
                } catch (error) {
                    console.log(error);
                    
                }
            }


    return (
        <form onSubmit={handleUpdateEnvelope} className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white tracking-wide">Update Envelope</h3>

            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400">Title</label>
                <input
                    value={EnvelopeTitle}
                    onChange={(e) => setEnvelopeTitle(e.target.value)}
                    className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Envelope title"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400">Budget</label>
                <input
                    value={EnvelopeBudget}
                    onChange={(e) => setEnvelopeBudget(Number(e.target.value))}
                    className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Budget amount"
                    type="number"
                />
            </div>

            <button
                type="submit"
                className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors"
            >
                Save Changes
            </button>
        </form>
    );


}

export default UpdateEnvelopeForm;