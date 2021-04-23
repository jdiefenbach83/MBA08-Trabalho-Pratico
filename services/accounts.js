import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

const readDB = async () => {
    return JSON.parse(await readFile(global.fileName));
}

const saveDB = async (currentDB) => {
    await writeFile(global.fileName, JSON.stringify(currentDB, null, 2));
}

export const create = async (accountData) => {
    if (!!!accountData.name || accountData.balance == null) {
        throw new Error('Os campos "name" e "balance" são obrigatórios!');
    }

    const accountDB = await readDB();

    const account = {
      id: accountDB.nextId++,
      name: accountData.name,
      balance: accountData.balance,
    };

    accountDB.accounts.push(account);

    await saveDB(accountDB);

    return account;
}

export const deposit = async (id, payload) => {
    const accountDB = await readDB();

    const index = accountDB.accounts.findIndex((item) => item.id === parseInt(id));

    if (index === -1) {
        throw new Error('Conta não encontrada');
    }

    const currentBalance = parseFloat(accountDB.accounts[index].balance, 2);
    const amountToDeposit = parseFloat(payload.amount, 2);

    if (amountToDeposit <= 0) {
        throw new Error('Valor do depósito inválido');
    }

    accountDB.accounts[index].balance = currentBalance + amountToDeposit;

    await saveDB(accountDB);
}

export const withdraw = async (id, payload) => {
    const accountDB = await readDB();

    const index = accountDB.accounts.findIndex((item) => item.id === parseInt(id));

    if (index === -1) {
        throw new Error('Conta não encontrada');
    }

    const currentBalance = parseFloat(accountDB.accounts[index].balance, 2);
    const amountTowithdraw = parseFloat(payload.amount, 2);

    if (currentBalance < amountTowithdraw) {
        throw new Error('Saldo insuficiente');
    }

    accountDB.accounts[index].balance = currentBalance - amountTowithdraw;

    await saveDB(accountDB);
}

export const getBalance = async (id) => {
    const accountDB = await readDB();
    
    const account = accountDB.accounts.find(
      (account) => account.id === parseInt(id)
    );

    if (!!!account) {
        throw new Error('Conta não encontrada');
    }

    return account.balance;
}

export const remove = async (id) => {
    const accountDB = await readDB();
    
    const index = accountDB.accounts.findIndex((item) => item.id === parseInt(id));

    if (index === -1) {
        throw new Error('Conta não encontrada');
    }

    accountDB.accounts.splice(index, 1);

    await saveDB(accountDB);
}