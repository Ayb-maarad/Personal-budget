

jest.mock("../../services/envelopeService", () => ({
    updateEnvelope: jest.fn(),
    createEnvelope : jest.fn(),

}))

const envelopeService = require("../../services/envelopeService");

const { create_envelope } = require("../../controllers/envelopesController");


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
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test("return 201 and the created envelope", async () => {
        
        envelopeService.createEnvelope.mockResolvedValue({
            id  :1,
            title : "food",
            budget : 400,
        });
        await create_envelope(req,res);

        expect(envelopeService.createEnvelope).toHaveBeenCalledWith({
            title : "food",
            budget : 400,
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            envelope: {
                id: 1,
                title: "food",
                budget: 400,
            }
        })
        


    })




});
