import { Router } from "express";
import {IRCTC} from "../seat-book/index.mjs";

const router = Router();

export async function IRCTCBOOK(params) {
    const irctc =   new IRCTC();
    const response = await irctc.book(params);
    return response
};



router.post('/book', async (req, res) => {
    const params = req.body;

    try {
        // Make the POST request to the IRCTC API
        const response = await IRCTCBOOK(params) // Replace with the actual IRCTC API endpoint
        res.status(200).json({ msg: response });
    } catch (error) {
        console.error('Error booking train:', error);
        res.status(500).json({ error: 'Booking failed', details: error.message });
    }
});
export default router;


