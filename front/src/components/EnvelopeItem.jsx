
import { useState } from "react";
import { delete_envelope, update_envelope } from "../services/envelopeService";
import UpdateEnvelopeForm from "./UpdateEnvelopeFrom";
import Modal from "./Modal";


const EnvelopeItem = ({ envelopes, setEnvelopes }) => {

    const [showform, setshowform] = useState(false);
    const [selectedenvelope, setselectedenvelope] = useState(null);

    const handleDeleteEnvelope = async (id) => {

        try {
            const data = await delete_envelope(id);
            console.log(data)

            setEnvelopes(prev => prev.filter((envelope) => envelope.id !== id))
        } catch (error) {
            console.log(error);
            window.location.reload();
        }

    }



    const ShowUpdateForm = (envelope) => {
        setselectedenvelope(envelope);
        setshowform(true);

    }

    const closeUpdateFrom = () => {
        setselectedenvelope("");
        setshowform(false);
    }



    return (
        <div className="max-w-xl mx-auto mb-10">
            <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-widest mb-4">Envelopes</h2>
            <ul className="space-y-3">
                {[...envelopes]
                    .sort((a, b) => b.budget - a.budget)
                    .map((envelope) => (
                        <li key={envelope.id} className="flex items-center justify-between bg-gray-800 rounded-xl px-5 py-4 shadow-md border border-gray-700 hover:border-indigo-500 transition-colors">
                            <span className="font-medium text-white">{envelope.title}</span>
                            <span className="text-indigo-400 font-bold text-lg">${envelope.budget}</span>
                            <button className="font-medium text-white" onClick={() => ShowUpdateForm(envelope)}>update</button>

                            
                            <button className="font-medium text-white" onClick={() => handleDeleteEnvelope(envelope.id)}>delete</button>
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