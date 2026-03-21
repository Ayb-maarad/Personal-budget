

jest.mock("../../services/envelopeService", () => ({
    updateEnvelope: jest.fn(),
    createEnvelope : jest.fn(),
    getAllEnvelopes : jest.fn(),
    getEnvelopeById : jest.fn(),

}))

const envelopeService = require("../../services/envelopeService");

const { create_envelope, get_envelopes, get_envelope} = require("../../controllers/envelopesController");


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

    test("returns 200 and all the envelopes", async () => {
        envelopeService.getAllEnvelopes.mockResolvedValue([
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

    await get_envelopes(req,res);

    expect(envelopeService.getAllEnvelopes).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
  envelopes: [
    { id: 1, title: "food", budget: 400 },
    { id: 2, title: "transport", budget: 500 },
  ],
})

    });

    test("returns 200 aand and envelope", async ()=>{
        envelopeService.getEnvelopeById.mockResolvedValue({
            id : 1,
            title : "food",
            budget : 400,
        });

        await get_envelope(req, res);

        expect(envelopeService.getEnvelopeById).toHaveBeenCalledWith(1);
        expect(envelopeService.getEnvelopeById).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            envelope : {
                id : 1,
                title : "food",
                budget : 400,
            }
        })
    })




});
