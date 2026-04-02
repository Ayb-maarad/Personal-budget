jest.mock("../../services/transactionService", () => ({
    getTransactions: jest.fn(),
    getTransactionById: jest.fn(),
    getAllTransactionByEnvelope: jest.fn(),
    create_transaction: jest.fn(),
}));

const transactionService = require("../../services/transactionService");

const {
    get_transactions,
    get_transaction,
    get_transaction_by_envelope,
    create_transaction,
} = require("../../controllers/transactionController");

describe("transactionController", () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: {},
            params: { id: 1 },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe("get_transactions", () => {
        test("returns 200 and all transactions", async () => {
            transactionService.getTransactions.mockResolvedValue([
                { id: 1, envelopeId: 1, budget: 100 },
                { id: 2, envelopeId: 2, budget: 200 },
            ]);

            await get_transactions(req, res);

            expect(transactionService.getTransactions).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                transactions: [
                    { id: 1, envelopeId: 1, budget: 100 },
                    { id: 2, envelopeId: 2, budget: 200 },
                ],
            });
        });

        test("returns 500 on unexpected error", async () => {
            transactionService.getTransactions.mockRejectedValue(new Error("DB failure"));

            await get_transactions(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
        });
    });

    describe("get_transaction", () => {
        test("returns 200 and the transaction", async () => {
            transactionService.getTransactionById.mockResolvedValue({
                id: 1,
                envelopeId: 1,
                budget: 100,
            });

            await get_transaction(req, res);

            expect(transactionService.getTransactionById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                transaction: { id: 1, envelopeId: 1, budget: 100 },
            });
        });

        test("returns 404 when transaction is not found", async () => {
            transactionService.getTransactionById.mockResolvedValue(null);

            await get_transaction(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Transaction not found" });
        });

        test("returns 500 on unexpected error", async () => {
            transactionService.getTransactionById.mockRejectedValue(new Error("DB failure"));

            await get_transaction(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
        });
    });

    describe("get_transaction_by_envelope", () => {
        test("returns 200 and transactions for the envelope", async () => {
            transactionService.getAllTransactionByEnvelope.mockResolvedValue([
                { id: 1, envelopeId: 1, budget: 50 },
                { id: 2, envelopeId: 1, budget: 75 },
            ]);

            await get_transaction_by_envelope(req, res);

            expect(transactionService.getAllTransactionByEnvelope).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                transactions: [
                    { id: 1, envelopeId: 1, budget: 50 },
                    { id: 2, envelopeId: 1, budget: 75 },
                ],
            });
        });

        test("returns 404 when no transactions exist for the envelope", async () => {
            transactionService.getAllTransactionByEnvelope.mockResolvedValue([]);

            await get_transaction_by_envelope(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Transaction not found" });
        });

        test("returns 500 on unexpected error", async () => {
            transactionService.getAllTransactionByEnvelope.mockRejectedValue(
                new Error("DB failure")
            );

            await get_transaction_by_envelope(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
        });
    });

    describe("create_transaction", () => {
        test("returns 201 with the transaction and updated envelope", async () => {
            const mockResult = {
                transaction: { id: 10, envelopeId: 3, budget: 100 },
                updated_envelope: { id: 3, title: "food", budget: 400 },
            };
            transactionService.create_transaction.mockResolvedValue(mockResult);
            req.body = { title: "food", budget: 100 };

            await create_transaction(req, res);

            expect(transactionService.create_transaction).toHaveBeenCalledWith({
                title: "food",
                budget: 100,
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                transaction: mockResult.transaction,
                envelope: mockResult.updated_envelope,
            });
        });

        test("returns 400 when budget is missing", async () => {
            transactionService.create_transaction.mockRejectedValue(
                new Error("budget is required")
            );

            await create_transaction(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "budget is required" });
        });

        test("returns 400 when budget is negative", async () => {
            transactionService.create_transaction.mockRejectedValue(
                new Error("should be positive")
            );

            await create_transaction(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "should be positive" });
        });

        test("returns 400 when envelope has insufficient funds", async () => {
            transactionService.create_transaction.mockRejectedValue(
                new Error("You have no suffiscient money for this operation")
            );

            await create_transaction(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "You have no suffiscient money for this operation",
            });
        });
    });
});
