require('dotenv').config()

async function analyzer_code(code, error_message) {

    const api_key = process.env.GEMINI_API_KEY

    if (!api_key) {
        throw new Error('GEMINI_API_KEY não configurada');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${api_key}`

    const prompt = `Voce é um mentor especializado em JavaScript. Analise o seguite codigo e erro:
                    CÓDIGO:
                    ${code}
                    ERRO:
                    ${error_message}
                    
                    retorne sua análise no seguinte formato JSON:
                    {
                        "error_type": "tipo do erro (sintaxe/lógica/runtime/etc)",
                        "location": "onde está o erro",
                        "explanation": "explicação detalhada do POR QUÊ",
                        "solution": "como corrigir",
                        "best_practices": "dicas relacionadas",
                        "category": "categoria pra gamificação (async, loops, etc)"
                    }`;

    const response = await fetch (url, {
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

// Teste rápido (remover depois)
const testeCode = `
function soma(a, b) {
  return a + b
}
console.log(soma(5, "10"));
`;  

const testeErro = "NaN - resultado inesperado";

analyzer_code(testeCode, testeErro)
  .then(resultado => {
    console.log("=== RESPOSTA DO GEMINI ===");
    console.log(JSON.stringify(resultado, null, 2));
  })
  .catch(erro => {
    console.error("ERRO:", erro);
  });

module.exports = { analyzer_code }