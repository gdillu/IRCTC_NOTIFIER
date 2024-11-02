import { Router } from "express";
import {IRCTC} from "../seat-book/index.mjs";
import { IRCTCSeat } from "../irctc-seatcheck/index.mjs";
const router = Router();

export async function IRCTCBOOK(params) {
    const irctc =   new IRCTC();
    const response = await irctc.book(params);
    return response
};

export async function IRCTCSEAT(params) {
    const irctc =   new IRCTCSeat();
    const response = await irctc.seat(params);
    return [response.avlDayList[0].availablityStatus,response.totalCollectibleAmount];
};

router.post('/book', async (req, res) => {
    const params = req.body;

    try {
        // Make the POST request to the IRCTC API
        const response = await IRCTCBOOK(params) // Replace with the actual IRCTC API endpoint
        res.json(response.data);
    } catch (error) {
        console.error('Error booking train:', error);
        res.status(500).json({ error: 'Booking failed', details: error.message });
    }
});

router.post('/seat', async (req, res) => {
    const params = req.body;

    try {
        // Make the POST request to the IRCTC API
        const response = await IRCTCSEAT(params) // Replace with the actual IRCTC API endpoint
        res.json(response);
    } catch (error) {
        console.error('Error booking train:', error);
        res.status(500).json({ error: 'Seat Checking failed', details: error.message });
    }
});
export default router;


