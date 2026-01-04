require('dotenv').config()

async function analyzer_code(code) {

    const api_key = process.env.GEMINI_API_KEY

    if (!api_key) {
        throw new Error('GEMINI_API_KEY não configurada');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${api_key}`

    const prompt = `Você é um mentor especializado em JavaScript. Analise o seguinte código e identifique problemas, erros, bugs ou más práticas:

CÓDIGO:
${code}

Sua tarefa:
1. Identifique SE existem problemas no código (erros de sintaxe, lógica, runtime, más práticas, etc)
2. Se NÃO houver problemas, indique que o código está correto
3. Se HOUVER problemas, faça uma análise detalhada

Retorne sua análise no seguinte formato JSON:
{
    "has_issues": true ou false,
    "error_type": "tipo do erro (sintaxe/lógica/runtime/boas práticas/etc) ou null se não houver",
    "location": "onde está o problema ou null se não houver",
    "explanation": "explicação detalhada do POR QUÊ ou mensagem positiva se estiver correto",
    "solution": "como corrigir ou sugestões de melhoria",
    "best_practices": "dicas relacionadas",
    "category": "categoria para gamificação (async, loops, tipos, etc) ou null"
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
        const cleaned = response_text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        json_response = JSON.parse(cleaned);
    } catch (error) {
        return { raw_response: response_text };
    }

    return json_response;
}

module.exports = { analyzer_code }