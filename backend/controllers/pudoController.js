const axios = require('axios');

module.exports = {
    fetchLockers: async (req, res) => {
        const lockers = await axios.get(`${process.env.PUDO_URL}/v1/lockers-data`, { headers: { 'Authorization': `Bearer ${process.env.PUDO_API_KEY}` } });

        if (!lockers?.data) {
            res.status(503).send({ err: 'Error fetching Pudo Lockers' });
            return;
        }

        res.status(200).json({ payload: lockers.data });
    }
}