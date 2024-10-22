import { Router } from "express";
import {IRCTC} from "../irctc/index.mjs";
const router = Router();

async function custom_command_name(params) {
    const irctc =   new IRCTC();
    const response = await irctc.book(params);
    console.log(response);
};


router.post('/book', async (req, res) => {
    const params = req.body;

    try {
        // Make the POST request to the IRCTC API
        const response = await custom_command_name(params) // Replace with the actual IRCTC API endpoint
        res.json(response.data);
    } catch (error) {
        console.error('Error booking train:', error);
        res.status(500).json({ error: 'Booking failed', details: error.message });
    }
});

export default router;


