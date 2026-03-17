

import { useState } from "react";
import { post_envelope } from "../services/envelopeService";

const CreateEnvelopeForm = ({onSuccess}) => {

    const [EnvelopeTitle, setEnvelopeTitle] = useState("");
    const [EnvelopeBudget, setEnvelopeBudget] = useState("");

    const handleEnvelope = async () => {

        try {
            const response = await post_envelope({
                title: EnvelopeTitle,
                budget: EnvelopeBudget
            })
            onSuccess()
            console.log(response);

        } catch (error) {
            console.log(error);
        }
    }


    const handleEnvelopeSubmit = (e) => {
        e.preventDefault();
        handleEnvelope();
    }





    return (
        <>
            <p> Add a new envelope : </p>
            <form onSubmit={handleEnvelopeSubmit}>
                <input placeholder="Envelope name" type="text" value={EnvelopeTitle} onChange={(e)=> setEnvelopeTitle(e.target.value)}/>
                <input type="number" placeholder="amount"
                    value={EnvelopeBudget}
                    onChange={(e) => setEnvelopeBudget(e.target.value)} />
                <button type="submit">Submit</button>
            </form>

        </>
    );
}

export default CreateEnvelopeForm;