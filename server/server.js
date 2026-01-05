const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok'});
});

const analyzer_routes = require('./routes/analyzer_routes');

app.use('/api/analyzer', analyzer_routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});