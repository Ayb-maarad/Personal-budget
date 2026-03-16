

jest.mock("../../services/envelopeService", () => ({
    updateEnvelope: jest.fn(),

}))

const envelopeService = require("../../services/envelopeService");

const { update_envelope } = require('../../controllers/envelopeService');


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
        
        


    })




});
