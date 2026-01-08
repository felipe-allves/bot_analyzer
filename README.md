# Bot Analyzer

> Plataforma inteligente de análise de código JavaScript com gamificação e tracking de evolução

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://botanalyzer.netlify.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Preview

<img src="/public/preview/2026-01-07-180656_hyprshot.png" alt="Preview"/>

## Features

- **Análise Automática**: Detecta erros sem precisar informar a mensagem
- **Gamificação**: Sistema de pontos, badges e conquistas
- **Analytics de Aprendizado**: Acompanha sua evolução e identifica padrões
- **Dark/Light Mode**: Interface adaptável
- **Persistência Local**: Histórico salvo no navegador
- **Powered by Gemini AI**: Análises detalhadas e educativas

## Demo

Acesse: **[botanalyzer.netlify.app](https://botanalyzer.netlify.app)**

## Stack

### Frontend
- React 18
- Vite
- CSS Variables (Dark/Light mode)
- Bootstrap Icons
- LocalStorage API

### Backend
- Node.js + Express
- Google Gemini AI API
- CORS configurado

### Deploy
- Frontend: Netlify
- Backend: Render

## Instalação Local

### Pré-requisitos
- Node.js 18+
- Conta no Google AI Studio (API KEY)

### Backend

\`\`\`bash
cd server
npm install
cp .env.example .env
# Adicione sua GEMINI_API_KEY no .env
npm run dev
\`\`\`

### Frontend

\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

## Funcionalidades Principais

### 1. Análise Inteligente
- Detecção automática de erros de sintaxe, lógica e runtime
- Explicações detalhadas do problema
- Sugestões de correção
- Boas práticas relacionadas

### 2. Sistema de Gamificação
- +10 pontos por análise
- Badges desbloqueáveis
- Tracking de estatísticas
- Contador de códigos limpos vs com erros

### 3. Analytics de Evolução
- Detecta se você está melhorando
- Identifica erros repetidos
- Barra de progresso visual
- Mensagens contextualizadas

## Variáveis de Ambiente

### Backend (.env)
\`\`\`
GEMINI_API_KEY=sua_chave_aqui
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://seu-frontend.netlify.app
\`\`\`

### Frontend (.env.local)
\`\`\`
VITE_API_URL=https://seu-backend.onrender.com
\`\`\`

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

MIT

## Autor

**Felipe Alves**

- LinkedIn: [https://www.linkedin.com/in/felipe-allves/]
- Github: [@felipe-allves](https://github.com/felipe-allves)

---

Se ente projeto te ajudou, deixe uma estrela ⭐