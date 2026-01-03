const express = require('express');
const router = express.Router();
const { analyzer_code_controller } = require('../controllers/analyzer_controller');

router.post('/analyze', analyzer_code_controller );

module.exports = router;