import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import qs from 'qs';

import generadoresService from './generadoresService.js';

const port = 5174;
const app = express();

// Definicion de Middlewares
app.use(bodyParser.json());
app.use(cors());
app.set('query parser',
  (str) => qs.parse(str))

app.get('/', (req, res) => {
  res.send("API de Generación de Números Aleatorios");
})

// Endpoints
app.get('/uniforme', async (req, res) => {
  
  try {
    const results = await generadoresService.uniforme(req.query.n, req.query.k, req.query.linf, req.query.lsup);
    res.json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Erro servidor' });
  }

});


app.get('/exponencial', async (req, res) => {
  try {
    const results = await generadoresService.exponencial(parseInt(req.query.n), parseInt(req.query.k), parseFloat(req.query.lambda));
    res.json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Error' });
  }
})


app.get('/normal', async (req, res) => {
    try {
      const results = await generadoresService.normal(parseInt(req.query.n), parseInt(req.query.k), parseFloat(req.query.media), parseFloat(req.query.desviacion));
      res.json(results);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Error' });
    }
})

app.get('/result-download', async (req, res) => {
  try {
    await generadoresService.generateCSV("results");
    res.download('results', (err) => {console.log(err)})
  }
  catch (err) {
    console.log(err)
  }
})

app.listen(port, () => {
  console.log(`Generador de distribuciones aleatorias escuchando en ${port}`)
})