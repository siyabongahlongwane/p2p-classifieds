const express = require('express');
const { pudo } = require('../../controllers');
const router = express.Router();

router.get('/fetch-lockers', pudo.fetchLockers);

module.exports = router;