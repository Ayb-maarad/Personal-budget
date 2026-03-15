import { useState, useEffect } from "react";
import { get_envelopes } from "../services/envelopeService";
import { post_transaction } from "../services/transactionService";

const Envelope = () => {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [envelopes, setEnvelopes] = useState([]);

  const fetch_envelopes = async () => {
    try {
      const data = await get_envelopes();
      setEnvelopes(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTransaction = async () => {
    try {
      const response = await post_transaction({
        title,
        budget: Number(budget),
      });

      console.log(response);

      setBudget("");
      setTitle("");
      fetch_envelopes();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTransaction();
  };

  useEffect(() => {
    fetch_envelopes();
  }, []);

  return (
    <>
      <ul>
        {[...envelopes]
        .sort((a,b) => b.budget - a.budget)
        .map((envelope) => (
          <li key={envelope.id}>
            {envelope.title}
            <div>{envelope.budget}</div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <select value={title} onChange={(e) => setTitle(e.target.value)}>
          <option value="">-- choose an envelope --</option>
          {envelopes.map((envelope) => (
            <option key={envelope.id} value={envelope.title}>
              {envelope.title}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <button type="submit">Buy</button>
      </form>
    </>
  );
};

export default Envelope;