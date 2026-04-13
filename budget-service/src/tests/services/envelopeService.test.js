jest.mock("../../db", () => ({
  Envelope: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
}));

const { Envelope } = require("../../db");
const envelopeService = require("../../services/envelopeService");

describe("envelopeService", () => {
  const userId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createEnvelope", () => {
    test("creates an envelope", async () => {
      Envelope.findOne.mockResolvedValue(null);
      Envelope.create.mockResolvedValue({
        id: 1,
        title: "food",
        budget: 400,
        userId,
      });

      const result = await envelopeService.createEnvelope({
        title: "food",
        budget: 400,
        userId,
      });

      expect(Envelope.create).toHaveBeenCalledWith({
        title: "food",
        budget: 400,
        userId,
      });

      expect(result).toEqual({
        id: 1,
        title: "food",
        budget: 400,
        userId,
      });
    });

    test("throws if title is missing", async () => {
      await expect(
        envelopeService.createEnvelope({
          title: "",
          budget: 400,
          userId,
        })
      ).rejects.toThrow("Title and budget are required");
    });

    test("throws if budget is negative", async () => {
      await expect(
        envelopeService.createEnvelope({
          title: "food",
          budget: -10,
          userId,
        })
      ).rejects.toThrow("Budget must be a positive number");
    });
  });

  describe("deleteEnvelope", () => {
    test("returns true when an envelope is deleted", async () => {
      Envelope.destroy.mockResolvedValue(1);

      const result = await envelopeService.deleteEnvelope(4, userId);

      expect(Envelope.destroy).toHaveBeenCalledWith({
        where: { id: 4, userId },
      });

      expect(result).toBe(true);
    });

    test("returns false when no envelope is deleted", async () => {
      Envelope.destroy.mockResolvedValue(0);

      const result = await envelopeService.deleteEnvelope(4, userId);

      expect(Envelope.destroy).toHaveBeenCalledWith({
        where: { id: 4, userId },
      });

      expect(result).toBe(false);
    });
  });

  describe("getEnvelopeById", () => {
    test("returns an envelope", async () => {
      Envelope.findOne.mockResolvedValue({
        id: 5,
        title: "food",
        budget: 400,
        userId,
      });

      const result = await envelopeService.getEnvelopeById(5, userId);

      expect(Envelope.findOne).toHaveBeenCalledWith({ where: { id: 5, userId } });

      expect(result).toEqual({
        id: 5,
        title: "food",
        budget: 400,
        userId,
      });
    });

    test("returns null when envelope is not found", async () => {
      Envelope.findOne.mockResolvedValue(null);

      const result = await envelopeService.getEnvelopeById(999, userId);

      expect(Envelope.findOne).toHaveBeenCalledWith({ where: { id: 999, userId } });
      expect(result).toBeNull();
    });
  });

  describe("getAllEnvelopes", () => {
    test("returns all envelopes", async () => {
      Envelope.findAll.mockResolvedValue([
        { id: 1, title: "food", budget: 400, userId },
        { id: 2, title: "transport", budget: 500, userId },
      ]);

      const result = await envelopeService.getAllEnvelopes(userId);

      expect(Envelope.findAll).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toEqual([
        { id: 1, title: "food", budget: 400, userId },
        { id: 2, title: "transport", budget: 500, userId },
      ]);
    });
  });

  describe("getEnvelopeBytitle", () => {
    test("returns an envelope when found", async () => {
      Envelope.findOne.mockResolvedValue({ id: 1, title: "food", budget: 400, userId });

      const result = await envelopeService.getEnvelopeBytitle("food", userId);

      expect(Envelope.findOne).toHaveBeenCalledWith({ where: { title: "food", userId } });
      expect(result).toEqual({ id: 1, title: "food", budget: 400, userId });
    });

    test("returns null when envelope is not found", async () => {
      Envelope.findOne.mockResolvedValue(null);

      const result = await envelopeService.getEnvelopeBytitle("unknown", userId);

      expect(result).toBeNull();
    });
  });

  describe("createEnvelope", () => {
    test("throws if envelope already exists", async () => {
      Envelope.findOne.mockResolvedValue({ id: 1, title: "food", budget: 400, userId });

      await expect(
        envelopeService.createEnvelope({ title: "food", budget: 300, userId })
      ).rejects.toThrow("envelope already exists");

      expect(Envelope.create).not.toHaveBeenCalled();
    });
  });

  describe("updateEnvelope", () => {
    test("updates and returns the envelope", async () => {
      const mockEnvelope = {
        id: 1,
        title: "food",
        budget: 400,
        userId,
        update: jest.fn().mockResolvedValue(undefined),
      };
      Envelope.findOne.mockResolvedValue(mockEnvelope);

      const result = await envelopeService.updateEnvelope(1, {
        title: "food",
        budget: 350,
      }, userId);

      expect(Envelope.findOne).toHaveBeenCalledWith({ where: { id: 1, userId } });
      expect(mockEnvelope.update).toHaveBeenCalledWith({ title: "food", budget: 350 });
      expect(result).toBe(mockEnvelope);
    });

    test("returns null when envelope is not found", async () => {
      Envelope.findOne.mockResolvedValue(null);

      const result = await envelopeService.updateEnvelope(999, {
        title: "food",
        budget: 200,
      }, userId);

      expect(result).toBeNull();
    });

    test("throws if title is missing", async () => {
      await expect(
        envelopeService.updateEnvelope(1, { title: "", budget: 200 }, userId)
      ).rejects.toThrow("Title and budget are required");
    });

    test("throws if budget is missing", async () => {
      await expect(
        envelopeService.updateEnvelope(1, { title: "food", budget: 0 }, userId)
      ).rejects.toThrow("Title and budget are required");
    });

    test("throws if budget is negative", async () => {
      await expect(
        envelopeService.updateEnvelope(1, { title: "food", budget: -50 }, userId)
      ).rejects.toThrow("Budget must be a positive number");
    });
  });

  describe("getTotalBudget", () => {
    test("returns the sum of all envelope budgets", async () => {
      Envelope.findAll.mockResolvedValue([
        { budget: 400 },
        { budget: 300 },
        { budget: 100 },
      ]);

      const result = await envelopeService.getTotalBudget(userId);

      expect(Envelope.findAll).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toBe(800);
    });

    test("returns 0 when there are no envelopes", async () => {
      Envelope.findAll.mockResolvedValue([]);

      const result = await envelopeService.getTotalBudget(userId);

      expect(result).toBe(0);
    });
  });
});