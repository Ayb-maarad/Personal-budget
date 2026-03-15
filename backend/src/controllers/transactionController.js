
const transactionService = require("../services/transactionService");

exports.get_transactions = async (req, res)=>{

    try {
        const id = req.params.id;
        const transactions = await transactionService.getTransactions();

        if(!transactions){
            return res.status(404).json({ error: "Transactions not found" })

        }
        res.status(200).json({transactions : transactions});
        
    } catch (error) {
 res.status(500).json({ error: error.message });
    console.log(error);
    }


}


exports.get_transaction = async (req, res)=>{

    try {
        const id = req.params.id;
        const transaction = await transactionService.getTransactionById(id);

        if(!transaction){
            return res.status(404).json({ error: "Transaction not found" })

        }
        res.status(200).json({transaction : transaction});
        
    } catch (error) {
 res.status(500).json({ error: error.message });
    console.log(error);
    }


}

exports.get_transaction_by_envelope = async (req, res)=>{
try {
    const id = req.params.id;
    const transactions = await transactionService.getAllTransactionByEnvelope(id);

    if(transactions.length === 0 || !transactions ){
       return res.status(404).json({ error: "Transaction not found" })
    }
    res.status(200).json({transactions : transactions});
} catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
}


}

exports.create_transaction = async (req,res) =>{

    try {   
        const data = req.body.transaction;
       
        const {transaction, updated_envelope} = await transactionService.create_transaction(data);

        
        res.status(201).json({ transaction , envelope : updated_envelope});
        
    } catch (error) {
         res.status(500).json({ error: error.message });
         console.log(error);
    }   
}

