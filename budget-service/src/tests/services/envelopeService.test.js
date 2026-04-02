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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createEnvelope", () => {
    test("creates an envelope", async () => {
      Envelope.create.mockResolvedValue({
        id: 1,
        title: "food",
        budget: 400,
      });

      const result = await envelopeService.createEnvelope({
        title: "food",
        budget: 400,
      });

      expect(Envelope.create).toHaveBeenCalledWith({
        title: "food",
        budget: 400,
      });

      expect(result).toEqual({
        id: 1,
        title: "food",
        budget: 400,
      });
    });

    test("throws if title is missing", async () => {
      await expect(
        envelopeService.createEnvelope({
          title: "",
          budget: 400,
        })
      ).rejects.toThrow("Title and budget are required");
    });

    test("throws if budget is negative", async () => {
      await expect(
        envelopeService.createEnvelope({
          title: "food",
          budget: -10,
        })
      ).rejects.toThrow("Budget must be a positive number");
    });
  });

  describe("deleteEnvelope", () => {
    test("returns true when an envelope is deleted", async () => {
      Envelope.destroy.mockResolvedValue(1);

      const result = await envelopeService.deleteEnvelope(4);

      expect(Envelope.destroy).toHaveBeenCalledWith({
        where: { id: 4 },
      });

      expect(result).toBe(true);
    });

    test("returns false when no envelope is deleted", async () => {
      Envelope.destroy.mockResolvedValue(0);

      const result = await envelopeService.deleteEnvelope(4);

      expect(Envelope.destroy).toHaveBeenCalledWith({
        where: { id: 4 },
      });

      expect(result).toBe(false);
    });
  });

  describe("getEnvelopeById", () => {
    test("returns an envelope", async () => {
      Envelope.findByPk.mockResolvedValue({
        id: 5,
        title: "food",
        budget: 400,
      });

      const result = await envelopeService.getEnvelopeById(5);

      expect(Envelope.findByPk).toHaveBeenCalledWith(5);

      expect(result).toEqual({
        id: 5,
        title: "food",
        budget: 400,
      });
    });
  });

  describe("getAllEnvelopes", () => {
    test("returns all envelopes", async () => {
      Envelope.findAll.mockResolvedValue([
        { id: 1, title: "food", budget: 400 },
        { id: 2, title: "transport", budget: 500 },
      ]);

      const result = await envelopeService.getAllEnvelopes();

      expect(Envelope.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        { id: 1, title: "food", budget: 400 },
        { id: 2, title: "transport", budget: 500 },
      ]);
    });
  });

  describe("getEnvelopeById", () => {
    test("returns null when envelope is not found", async () => {
      Envelope.findByPk.mockResolvedValue(null);

      const result = await envelopeService.getEnvelopeById(999);

      expect(Envelope.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe("getEnvelopeBytitle", () => {
    test("returns an envelope when found", async () => {
      Envelope.findOne.mockResolvedValue({ id: 1, title: "food", budget: 400 });

      const result = await envelopeService.getEnvelopeBytitle("food");

      expect(Envelope.findOne).toHaveBeenCalledWith({ where: { title: "food" } });
      expect(result).toEqual({ id: 1, title: "food", budget: 400 });
    });

    test("returns null when envelope is not found", async () => {
      Envelope.findOne.mockResolvedValue(null);

      const result = await envelopeService.getEnvelopeBytitle("unknown");

      expect(result).toBeNull();
    });
  });

  describe("createEnvelope", () => {
    test("throws if envelope already exists", async () => {
      Envelope.findOne.mockResolvedValue({ id: 1, title: "food", budget: 400 });

      await expect(
        envelopeService.createEnvelope({ title: "food", budget: 300 })
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
        update: jest.fn().mockResolvedValue(undefined),
      };
      Envelope.findByPk.mockResolvedValue(mockEnvelope);

      const result = await envelopeService.updateEnvelope(1, {
        title: "food",
        budget: 350,
      });

      expect(Envelope.findByPk).toHaveBeenCalledWith(1);
      expect(mockEnvelope.update).toHaveBeenCalledWith({ title: "food", budget: 350 });
      expect(result).toBe(mockEnvelope);
    });

    test("returns null when envelope is not found", async () => {
      Envelope.findByPk.mockResolvedValue(null);

      const result = await envelopeService.updateEnvelope(999, {
        title: "food",
        budget: 200,
      });

      expect(result).toBeNull();
    });

    test("throws if title is missing", async () => {
      await expect(
        envelopeService.updateEnvelope(1, { title: "", budget: 200 })
      ).rejects.toThrow("Title and budget are required");
    });

    test("throws if budget is missing", async () => {
      await expect(
        envelopeService.updateEnvelope(1, { title: "food", budget: 0 })
      ).rejects.toThrow("Title and budget are required");
    });

    test("throws if budget is negative", async () => {
      await expect(
        envelopeService.updateEnvelope(1, { title: "food", budget: -50 })
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

      const result = await envelopeService.getTotalBudget();

      expect(result).toBe(800);
    });

    test("returns 0 when there are no envelopes", async () => {
      Envelope.findAll.mockResolvedValue([]);

      const result = await envelopeService.getTotalBudget();

      expect(result).toBe(0);
    });
  });
});