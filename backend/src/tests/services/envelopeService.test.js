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
      {
        id: 1,
        title: "food",
        budget: 400,
      },
      {
        id: 2,
        title: "transport",
        budget: 500,
      },
    ]);

    const result = await envelopeService.getAllEnvelopes();

    expect(Envelope.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      {
        id: 1,
        title: "food",
        budget: 400,
      },
      {
        id: 2,
        title: "transport",
        budget: 500,
      },
    ]);
  });
});

});