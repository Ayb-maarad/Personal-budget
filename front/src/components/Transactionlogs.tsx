



type TransactionType = {

    id : number;
    date : string;
    envelopeId : number;
    budget : number;
}


type EnvelopeType = {

  id : number;
  title : string;
  budget : number;
}

type Transactionlogsprops = {
    envelopes : EnvelopeType[];
    transactions : TransactionType[];
}



const Transactionlogs = ({envelopes, transactions}: Transactionlogsprops)=>{

 
  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
      <h2 className="text-primary text-xs font-bold uppercase tracking-widest mb-4 border-b border-border pb-3">
        Transaction Logs
      </h2>

      {transactions.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-4">No transactions yet.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {transactions.map((transaction) => {
            const envelope = envelopes.find((env) => env.id === transaction.envelopeId);
            return (
              <li
                key={transaction.id}
                className="flex items-center justify-between bg-muted rounded-xl px-4 py-2 text-sm"
              >
                <div className="flex flex-col">
                  <span className="text-foreground font-medium">{envelope?.title ?? "Unknown"}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(transaction.date).toLocaleDateString("en-GB")}{" "}
                    {new Date(transaction.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <span className="text-destructive font-bold">-${transaction.budget}</span>
              </li>
            );
          })}
        </ul>
      )}
  
    </div>
  );
}

export default Transactionlogs;