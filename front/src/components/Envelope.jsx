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
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-3xl font-bold text-gray-700 mb-10">
          Envelope Manager
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <section className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Envelopes
            </h2>

            <EnvelopeItem
              envelopes={envelopes}
              setEnvelopes={setEnvelopes}
              
            />
          </section>

          <div className="space-y-1">
            <section>
              <TransactionForm
                envelopes={envelopes}
                onSuccess={fetch_envelopes}
              />
            </section>

            <section>
              <CreateEnvelopeForm onSuccess={fetch_envelopes} />
            </section>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Envelope;