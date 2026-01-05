require('dotenv').config()

async function analyzer_code(code) {

    const api_key = process.env.GEMINI_API_KEY

    if (!api_key) {
        throw new Error('GEMINI_API_KEY não configurada');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${api_key}`

    const prompt = `Você é um mentor especializado em JavaScript. Analise o seguinte código COM CUIDADO:

CÓDIGO:
${code}

INSTRUÇÕES IMPORTANTES:
1. Se o código NÃO tiver erros de sintaxe, lógica ou runtime, retorne "has_issues": false
2. Apenas indique problemas REAIS (erros que impedem execução ou causam bugs)
3. Más práticas leves NÃO são erros críticos
4. Se o código funciona corretamente, elogie e dê sugestões de melhoria opcionais

Retorne APENAS este JSON:
{
    "has_issues": true ou false,
    "error_type": "tipo do erro (sintaxe/lógica/runtime) ou null se não houver",
    "location": "onde está o problema ou null se não houver",
    "explanation": "explicação detalhada ou feedback positivo se o código estiver correto",
    "solution": "como corrigir ou sugestões de melhoria",
    "best_practices": "dicas relacionadas",
    "category": "categoria (async, loops, tipos, etc) ou null"
}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    })

    console.log('DEGUG DA REQUISIÇÃO');
    console.log('Status: ', response.status);
    console.log('Status Text: ', response.statusText);

    if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
    }

    const data = await response.json();
    const response_text = data.candidates[0].content.parts[0].text;

    let json_response;
    try {
        
        let cleaned = response_text.trim();

        cleaned = cleaned.replace(/```json\n?/gi, '');
        cleaned = cleaned.replace(/```\n?/gi, '');

        cleaned = cleaned.trim();

        const json_match = cleaned.match(/\{[\s\S]*\}/);
        
        if (json_match) {
            cleaned = json_match[0];
        }

        json_response = JSON.parse(cleaned);
    } catch (error) {
        return { raw_response: response_text };
    }

    return json_response;
}

module.exports = { analyzer_code }