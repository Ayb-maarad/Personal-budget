


const EnvelopeItem =({envelopes})=>{

       
    return (

        <>
        
        <ul>
                {[...envelopes]
                    .sort((a, b) => b.budget - a.budget)
                    .map((envelope) => (
                        <li key={envelope.id}>
                            {envelope.title}
                            <div>{envelope.budget}</div>
                        </li>
                    ))}
            </ul>
        
        </>
    );




}

export default EnvelopeItem;