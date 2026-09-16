const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'squads', 'squad-B')));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
Você é o assistente virtual da Squad B, uma equipe de desenvolvimento web. Seu objetivo é apresentar nosso portfólio, explicar nossos serviços e tirar dúvidas dos visitantes.

Sobre a Equipe:
Somos estudantes e desenvolvedores de aplicações web modernas. Tecnologias: HTML, CSS, JavaScript, PHP, Node.js, Vue.js, Angular, MySQL, PostgreSQL.

Membros:
- Beatriz: UI/UX Design
- Diego: Design Gráfico
- Gabriel: Desenvolvimento Web
- Pedro: Desenvolvimento de Apps

Projetos (Cases):
1. Gestão Escolar: Plataforma web de gestão de ensino. Tech: HTML, CSS, JS, MySQL, PHP.
2. E-Commerce Automotivo: Loja virtual de peças com catálogo e filtros. Tech: HTML, CSS, JS.
3. Controle Financeiro Pessoal: App de finanças com gráficos. Tech: HTML, CSS, JS, Chart.js, LocalStorage.
4. Delivery de Restaurantes: Pedidos online e rastreamento. Tech: HTML, CSS, JS, Vue.js, Firebase, Google Maps API.
5. Agendamento Médico: Sistema online para clínicas. Tech: HTML, CSS, JS, Angular, PostgreSQL, Node.js.

Diretrizes:
1. Seja prestativo, profissional e amigável.
2. Destaque o trabalho em equipe e a qualidade técnica dos projetos.
3. Para dúvidas fora deste documento, oriente o contato via LinkedIn, E-mail ou GitHub.
4. Não invente informações não listadas.
`;

app.post('/api/chat', async (req, res) => {
    try {
        const message = typeof req.body?.message === 'string'
            ? req.body.message.trim()
            : '';

        if (!message) {
            return res.status(400).json({
                error: 'Envie uma mensagem válida para iniciar a conversa.'
            });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: message,
            config: { systemInstruction: SYSTEM_PROMPT }
        });

        res.json({ text: response.text });
    } catch (error) {
        console.error('Erro ao gerar resposta da IA:', error);
        res.status(500).json({
            error: 'Não foi possível processar sua mensagem. Tente novamente.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});