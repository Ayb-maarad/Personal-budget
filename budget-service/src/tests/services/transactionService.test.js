jest.mock("../../db", () => ({
  Transaction: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Envelope: {
    findAll: jest.fn(),
  },
}));

jest.mock("../../services/envelopeService", () => ({
  getEnvelopeBytitle: jest.fn(),
  updateEnvelope: jest.fn(),
}));

const { Transaction, Envelope } = require("../../db");
const envelopeService = require("../../services/envelopeService");
const transactionService = require("../../services/transactionService");

describe("transactionService", () => {
  const userId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTransactions", () => {
    test("returns all transactions for a user", async () => {
      Envelope.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      Transaction.findAll.mockResolvedValue([
        { id: 1, envelopeId: 1, budget: 100 },
        { id: 2, envelopeId: 2, budget: 200 },
      ]);

      const result = await transactionService.getTransactions(userId);

      expect(Envelope.findAll).toHaveBeenCalledWith({ where: { userId }, attributes: ["id"] });
      expect(Transaction.findAll).toHaveBeenCalledWith({ where: { envelopeId: [1, 2] } });
      expect(result).toEqual([
        { id: 1, envelopeId: 1, budget: 100 },
        { id: 2, envelopeId: 2, budget: 200 },
      ]);
    });

    test("returns an empty array when there are no transactions", async () => {
      Envelope.findAll.mockResolvedValue([]);
      Transaction.findAll.mockResolvedValue([]);

      const result = await transactionService.getTransactions(userId);

      expect(result).toEqual([]);
    });
  });

  describe("getTransactionById", () => {
    test("returns a transaction by id", async () => {
      Transaction.findByPk.mockResolvedValue({ id: 5, envelopeId: 1, budget: 100 });

      const result = await transactionService.getTransactionById(5);

      expect(Transaction.findByPk).toHaveBeenCalledWith(5);
      expect(result).toEqual({ id: 5, envelopeId: 1, budget: 100 });
    });

    test("returns null when transaction is not found", async () => {
      Transaction.findByPk.mockResolvedValue(null);

      const result = await transactionService.getTransactionById(999);

      expect(Transaction.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe("getAllTransactionByEnvelope", () => {
    test("returns all transactions for a given envelope", async () => {
      Transaction.findAll.mockResolvedValue([
        { id: 1, envelopeId: 2, budget: 50 },
        { id: 2, envelopeId: 2, budget: 75 },
      ]);

      const result = await transactionService.getAllTransactionByEnvelope(2);

      expect(Transaction.findAll).toHaveBeenCalledWith({ where: { envelopeId: 2 } });
      expect(result).toEqual([
        { id: 1, envelopeId: 2, budget: 50 },
        { id: 2, envelopeId: 2, budget: 75 },
      ]);
    });

    test("returns an empty array when no transactions exist for the envelope", async () => {
      Transaction.findAll.mockResolvedValue([]);

      const result = await transactionService.getAllTransactionByEnvelope(99);

      expect(Transaction.findAll).toHaveBeenCalledWith({ where: { envelopeId: 99 } });
      expect(result).toEqual([]);
    });
  });

  describe("create_transaction", () => {
    const mockEnvelope = { id: 3, title: "food", budget: 500 };
    const mockUpdatedEnvelope = { id: 3, title: "food", budget: 400 };
    const mockTransaction = { id: 10, envelopeId: 3, budget: 100 };

    test("creates a transaction and deducts from the envelope budget", async () => {
      envelopeService.getEnvelopeBytitle.mockResolvedValue(mockEnvelope);
      envelopeService.updateEnvelope.mockResolvedValue(mockUpdatedEnvelope);
      Transaction.create.mockResolvedValue(mockTransaction);

      const result = await transactionService.create_transaction(
        { title: "food", budget: 100 },
        userId
      );

      expect(envelopeService.getEnvelopeBytitle).toHaveBeenCalledWith("food", userId);
      expect(envelopeService.updateEnvelope).toHaveBeenCalledWith(3, {
        title: "food",
        budget: 400,
      }, userId);
      expect(Transaction.create).toHaveBeenCalledWith({ envelopeId: 3, budget: 100 });
      expect(result).toEqual({
        transaction: mockTransaction,
        updated_envelope: mockUpdatedEnvelope,
      });
    });

    test("throws if envelope does not exist", async () => {
      envelopeService.getEnvelopeBytitle.mockResolvedValue(null);

      await expect(
        transactionService.create_transaction({ title: "nonexistent", budget: 100 }, userId)
      ).rejects.toThrow("Envelope not found");

      expect(Transaction.create).not.toHaveBeenCalled();
    });

    test("throws if budget is null", async () => {
      envelopeService.getEnvelopeBytitle.mockResolvedValue(mockEnvelope);

      await expect(
        transactionService.create_transaction({ title: "food", budget: null }, userId)
      ).rejects.toThrow("budget is required");

      expect(Transaction.create).not.toHaveBeenCalled();
    });

    test("throws if budget is negative", async () => {
      envelopeService.getEnvelopeBytitle.mockResolvedValue(mockEnvelope);

      await expect(
        transactionService.create_transaction({ title: "food", budget: -50 }, userId)
      ).rejects.toThrow("should be positive");

      expect(Transaction.create).not.toHaveBeenCalled();
    });

    test("throws if envelope has insufficient funds (budget - amount <= 0)", async () => {
      envelopeService.getEnvelopeBytitle.mockResolvedValue({
        id: 3,
        title: "food",
        budget: 100,
      });

      await expect(
        transactionService.create_transaction({ title: "food", budget: 100 }, userId)
      ).rejects.toThrow("You have no suffiscient money for this operation");

      expect(Transaction.create).not.toHaveBeenCalled();
    });

    test("throws if budget exceeds envelope funds", async () => {
      envelopeService.getEnvelopeBytitle.mockResolvedValue({
        id: 3,
        title: "food",
        budget: 50,
      });

      await expect(
        transactionService.create_transaction({ title: "food", budget: 200 }, userId)
      ).rejects.toThrow("You have no suffiscient money for this operation");
    });
  });
});
