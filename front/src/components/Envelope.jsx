import { useState, useEffect } from "react";
import { get_envelopes } from "../services/envelopeService";

import CreateEnvelopeForm from "./CreateEnvelopeForm";
import EnvelopeItem from "./EnvelopeItem";
import TransactionForm from "./TransactionForm";

const Envelope = () => {
   
  
    const [envelopes, setEnvelopes] = useState([]);


      const fetch_envelopes = async () => {
                try {
                    const data = await get_envelopes();
                    setEnvelopes(data);
                } catch (error) {
                    console.log(error);
                }
            };

            
    useEffect(() => {
        fetch_envelopes();
    }, []);
   


  





    return (
        <>

            <EnvelopeItem envelopes = {envelopes} />
            
           <TransactionForm envelopes={envelopes}/>

            <CreateEnvelopeForm onSuccess= {fetch_envelopes}/>
        </>
    );
};

export default Envelope;