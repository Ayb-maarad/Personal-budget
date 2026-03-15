
import { useState, useEffect } from "react";
import { get_envelopes, get_envelope, post_envelope } from "../services/envelopeService";

import { post_transaction } from "../services/transactionService";

const Envelope = () => {

    const [title, setTitle] = useState('');
    const [budget, setBudget] = useState(0);
    const [Envelopes, setEnvelopes] = useState([]);

    //getting envlopes 
    const fetch_envelopes = async () => {
        try {
            const envelopes = await get_envelopes();

            setEnvelopes(envelopes);

        } catch (error) {
            console.log(error);
        }
    }

    //posting transaction 

    const HandleTransaction = async ()=>{
        try {
            const response = await post_transaction({ title , budget})
            
        } catch (error) {
             console.log(error);
        }

    }

    const handleSubmit = (e) =>{
        e.preventDefault();


        
    }

    useEffect(() => {
        fetch_envelopes();
    }, []);


    return (
        <>
            <ul>
                {Envelopes.map((Envelope) => {
                    return (<li key={Envelope.id}> {Envelope.title}  <div>{Envelope.budget}</div></li>);

                })}
            </ul>

            <div>
                <form  onSubmit={handleSubmit}>
                    <select>
                        {Envelopes.map((Envelope)=>{
                            return (<option value={Envelope.title}>{Envelope.title}</option>)
                        })}
                    </select>
                    <input type="number" placeholder="Amount" value={budget} onChange={(e)=>{setBudget(e.target.value)}}/>
                    <button type="submit">Buy</button>
                </form>


            </div>


        </>
    );
}

export default Envelope;