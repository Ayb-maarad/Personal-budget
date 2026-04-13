

jest.mock("../../services/envelopeService", () => ({
    updateEnvelope: jest.fn(),
    createEnvelope: jest.fn(),
    getAllEnvelopes: jest.fn(),
    getEnvelopeById: jest.fn(),
    deleteEnvelope: jest.fn(),
}));

const envelopeService = require("../../services/envelopeService");

const {
    create_envelope,
    get_envelopes,
    get_envelope,
    update_envelope,
    delete_envelope,
} = require("../../controllers/envelopesController");


describe("envelope controller", () => {

    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: {
                title: "food",
                budget: 400,
            },
            params: {
                id: 1,
            },
            user: { id: 1 },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    describe("create_envelope", () => {
        test("returns 201 and the created envelope", async () => {
            envelopeService.createEnvelope.mockResolvedValue({
                id: 1,
                title: "food",
                budget: 400,
            });

            await create_envelope(req, res);

            expect(envelopeService.createEnvelope).toHaveBeenCalledWith({
                title: "food",
                budget: 400,
                userId: 1,
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                envelope: { id: 1, title: "food", budget: 400 },
            });
        });

        test("returns 400 on validation error", async () => {
            envelopeService.createEnvelope.mockRejectedValue(
                new Error("Title and budget are required")
            );

            await create_envelope(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Title and budget are required",
            });
        });

        test("returns 400 when envelope already exists", async () => {
            envelopeService.createEnvelope.mockRejectedValue(
                new Error("envelope already exists")
            );

            await create_envelope(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "envelope already exists" });
        });

        test("returns 500 on unexpected error", async () => {
            envelopeService.createEnvelope.mockRejectedValue(new Error("DB failure"));

            await create_envelope(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
        });
    });

    describe("get_envelopes", () => {
        test("returns 200 and all envelopes", async () => {
            envelopeService.getAllEnvelopes.mockResolvedValue([
                { id: 1, title: "food", budget: 400 },
                { id: 2, title: "transport", budget: 500 },
            ]);

            await get_envelopes(req, res);

            expect(envelopeService.getAllEnvelopes).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                envelopes: [
                    { id: 1, title: "food", budget: 400 },
                    { id: 2, title: "transport", budget: 500 },
                ],
            });
        });

        test("returns 500 on unexpected error", async () => {
            envelopeService.getAllEnvelopes.mockRejectedValue(new Error("DB failure"));

            await get_envelopes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
        });
    });

    describe("get_envelope", () => {
        test("returns 200 and the envelope", async () => {
            envelopeService.getEnvelopeById.mockResolvedValue({
                id: 1,
                title: "food",
                budget: 400,
            });

            await get_envelope(req, res);

            expect(envelopeService.getEnvelopeById).toHaveBeenCalledWith(1, 1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                envelope: { id: 1, title: "food", budget: 400 },
            });
        });

        test("returns 404 when envelope is not found", async () => {
            envelopeService.getEnvelopeById.mockResolvedValue(null);

            await get_envelope(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Envelope not found" });
        });

        test("returns 500 on unexpected error", async () => {
            envelopeService.getEnvelopeById.mockRejectedValue(new Error("DB failure"));

            await get_envelope(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
        });
    });

    describe("update_envelope", () => {
        test("returns 200 and the updated envelope", async () => {
            envelopeService.updateEnvelope.mockResolvedValue({
                id: 1,
                title: "food",
                budget: 350,
            });
            req.body = { title: "food", budget: 350 };

            await update_envelope(req, res);

            expect(envelopeService.updateEnvelope).toHaveBeenCalledWith(1, {
                title: "food",
                budget: 350,
            }, 1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                envelope: { id: 1, title: "food", budget: 350 },
            });
        });

        test("returns 404 when envelope is not found", async () => {
            envelopeService.updateEnvelope.mockResolvedValue(null);

            await update_envelope(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Envelope not found" });
        });

        test("returns 400 on validation error", async () => {
            envelopeService.updateEnvelope.mockRejectedValue(
                new Error("Title and budget are required")
            );

            await update_envelope(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Title and budget are required",
            });
        });

        test("returns 500 on unexpected error", async () => {
            envelopeService.updateEnvelope.mockRejectedValue(new Error("DB failure"));

            await update_envelope(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
        });
    });

    describe("delete_envelope", () => {
        test("returns 204 when envelope is deleted", async () => {
            envelopeService.deleteEnvelope.mockResolvedValue(true);

            await delete_envelope(req, res);

            expect(envelopeService.deleteEnvelope).toHaveBeenCalledWith(1, 1);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        test("returns 404 when envelope is not found", async () => {
            envelopeService.deleteEnvelope.mockResolvedValue(false);

            await delete_envelope(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Envelope not found" });
        });

        test("returns 500 on unexpected error", async () => {
            envelopeService.deleteEnvelope.mockRejectedValue(new Error("DB failure"));

            await delete_envelope(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
        });
    });
});
