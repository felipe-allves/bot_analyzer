const { analyzer_code } = require('../services/gemini_service')

async function analyzer_code_controller(req, res) {
    try {
        const { code} = req.body;

        if (!code) {
            return res.status(400).json({ error: 'code é obrigatório'})
        }
        
        const analyze = await analyzer_code(code)

        res.status(200).json({
            success: true,
            analyze: analyze
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { analyzer_code_controller }