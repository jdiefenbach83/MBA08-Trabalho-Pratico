import express from 'express';
import { promises as fs } from 'fs';
import { create, deposit, withdraw, getBalance, remove } from '../services/accounts.js'

const { readFile, writeFile } = fs;

const router = express.Router();

router.post('/create', async (req, res, next) => {
  try {
    const payload = await create(req.body);

    res.send(payload);

    logger.info(`POST /account/create - ${JSON.stringify(payload)}`);
  } catch (err) {
    next(err);
  }
});

router.put('/deposit/:id', async (req, res, next) => {
  try {
    const id = req.params.id; 
    const payload = req.body;
    await deposit(id, payload);

    res.end();

    logger.info(`PUT /account/deposit/:id ${id}`);
  } catch (err){
    next(err);
  }
});

router.put('/withdraw/:id', async (req, res, next) => {
  try {
    const id = req.params.id; 
    const payload = req.body;
    await withdraw(id, payload);

    res.end();

    logger.info(`PUT /account/withdraw/:id ${id}`);
  } catch (err){
    next(err);
  }
});

router.get('/getBalance/:id', async (req, res, next) => {
  try {
    const id = req.params.id;    
    const balance = await getBalance(id);
   
    res.send({ balance });

    logger.info(`GET /account/getBalance/:id ${id}`);    
  } catch (err) {
    next(err);
  }
});

router.delete('/remove/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await remove(id);

    res.end();

    logger.info(`DELETE /account/remove/:id ${id}`);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  global.logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);
  res.status(500).send({ error: err.message });
});

export default router;
