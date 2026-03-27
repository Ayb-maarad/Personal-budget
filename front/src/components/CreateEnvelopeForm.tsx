

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
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 border-b border-border pb-3">New Envelope</h2>
            <form onSubmit={handleEnvelopeSubmit} className="flex flex-col gap-3">
                <input
                    placeholder="Envelope name"
                    type="text"
                    value={EnvelopeTitle}
                    onChange={(e) => setEnvelopeTitle(e.target.value)}
                    className="bg-background border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={EnvelopeBudget}
                    onChange={(e) => setEnvelopeBudget(Number(e.target.value))}
                    className="bg-background border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all font-semibold rounded-lg py-2">
                    Submit
                </button>
                {Err ? <p className="text-destructive text-sm mt-1">This envelope already exists</p> : null}
            </form>
        </div>
    );
}

export default CreateEnvelopeForm;