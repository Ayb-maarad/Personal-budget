
import { useState } from "react";
import { delete_envelope, update_envelope } from "../services/envelopeService";
import UpdateEnvelopeForm from "./UpdateEnvelopeFrom";
import Modal from "./Modal";

type EnvelopeType = {

  id : number;
  title : string;
  budget : number;
}

type EnvelopeItempprops = {

    envelopes : EnvelopeType[];
    setEnvelopes : (value: EnvelopeType[] | ((prev: EnvelopeType[]) => EnvelopeType[])) => void;
}

const EnvelopeItem = ({ envelopes, setEnvelopes } : EnvelopeItempprops) => {

    const [showform, setshowform] = useState<boolean>(false);
    const [selectedenvelope, setselectedenvelope] = useState<EnvelopeType| null>(null);

    const handleDeleteEnvelope = async (id : number) => {

        try {
            const data = await delete_envelope(id);
            console.log(data)

            setEnvelopes(prev => prev.filter((envelope) => envelope.id !== id))
        } catch (error) {
            console.log(error);
            window.location.reload();
        }

    }



    const ShowUpdateForm = (envelope : EnvelopeType) : void => {
        setselectedenvelope(envelope);
        setshowform(true);

    }

    const closeUpdateFrom = () : void => {
        setselectedenvelope(null);
        setshowform(false);
    }



    return (
        <div className="max-w-xl mx-auto mb-10">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Your Envelopes</h2>
            <ul className="space-y-3">
                {[...envelopes]
                    .sort((a, b) => b.budget - a.budget)
                    .map((envelope) => (
                        <li key={envelope.id} className="flex items-center justify-between bg-gray-800 rounded-xl px-5 py-4 shadow-md border border-gray-700 hover:border-indigo-500 hover:shadow-indigo-900/30 hover:shadow-lg transition-all duration-200">
                            <div className="flex items-center flex-1 min-w-0">
                                <span className="font-semibold text-white truncate">{envelope.title}</span>
                            </div>
                            <span className="text-indigo-400 font-bold text-lg whitespace-nowrap mx-auto">${envelope.budget}</span>
                            <div className="flex items-center gap-2 ml-4">
                                <button className="text-xs font-semibold text-indigo-300 border border-indigo-700 hover:bg-indigo-700 hover:text-white px-3 py-1.5 rounded-lg transition-colors" onClick={() => ShowUpdateForm(envelope)}>Edit</button>
                                <button className="text-xs font-semibold text-red-400 border border-red-800 hover:bg-red-700 hover:text-white px-3 py-1.5 rounded-lg transition-colors" onClick={() => handleDeleteEnvelope(envelope.id)}>Delete</button>
                            </div>
                        </li>
                    )
                    )

                    
                    }
            </ul>
            {showform && selectedenvelope ? (
                <Modal onClose={closeUpdateFrom}>
                    <UpdateEnvelopeForm
                        envelope={selectedenvelope}
                        onClose={closeUpdateFrom}
                    />
                </Modal>
            ) : null}
        </div>
    );




}

export default EnvelopeItem;