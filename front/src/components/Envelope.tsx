import { useState, useEffect } from "react";
import { get_envelopes } from "../services/envelopeService";

import CreateEnvelopeForm from "./CreateEnvelopeForm";
import EnvelopeItem from "./EnvelopeItem";
import TransactionForm from "./TransactionForm";


type EnvelopeType = {

  id : number;
  title : string;
  budget : number;
}

const Envelope = () => {
   
  
    const [envelopes, setEnvelopes] = useState<EnvelopeType[]>([]);


      const fetch_envelopes = async (): Promise<void> => {

                try {
                    const data : EnvelopeType[] = await get_envelopes();
                    setEnvelopes(data);
                } catch (error) {
                    console.log(error);
                }
            };


       

            
    useEffect(() => {
        fetch_envelopes();
    }, []);
   



  





      return (
    <div className="min-h-screen bg-gray-900 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-4xl font-extrabold text-white mb-2 tracking-tight">
          Envelope Manager
        </h1>
        <p className="text-center text-gray-500 mb-10 text-sm tracking-widest uppercase">Manage your budget with envelopes</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <section className="lg:col-span-2">

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