const axios = require('axios');
const queryString = require('querystring');
const crypto = require('crypto');

const apiUrl = process.env.API_URL;
const apiSecret = process.env.SECRET_KEY;
const apiKey = process.env.API_KEY;
const symbolTrading = process.env.SYMBOL;

async function hora() {
    return chamadaPublica('/v3/time');
}

async function informacaoCorretora(paridade) {
    const resultado = await chamadaPublica('/v3/exchangeInfo');
    return paridade ?
        resultado.symbols.find(s => s.symbol === paridade) :
        resultado.symbols;
}

async function informacaoMercado(symbol = symbolTrading, limit = 5) {
    return chamadaPublica('/v3/depth', { symbol, limit });
}

async function informacaoConta() {
    return chamadaPrivada('/v3/account');
}

async function chamadaPrivada(path, data = {}, method = 'GET') {

    if (!apiKey || !apiSecret)
        throw new Error('Preencha corretamente sua API KEY e SECRET KEY');

    const timestamp = Date.now();

    const signature = crypto
        .createHmac('sha256', apiSecret)
        .update(`${queryString.stringify({ ...data, timestamp })}`)
        .digest('hex');

    const newData = { ...data, timestamp, signature };
    const qs = `?${queryString.stringify(newData)}`;

    try {
        const result = await axios({
            method,
            url: `${apiUrl}${path}${qs}`,
            headers: { 'X-MBX-APIKEY': apiKey }
        });
        return result.data;
    } catch (err) {
        console.log(err);
    }
}

async function chamadaPublica(path, data, method = 'GET', headers = {}) {
    try {
        const qs = data ? `?${queryString.stringify(data)}` : '';
        const result = await axios({
            method,
            url: `${process.env.API_URL}${path}${qs}`
        });
        return result.data;
    } catch (err) {
        console.error(err);
    }
}

async function novaOrdem(side, type, symbol, quantity, price) {
    const data = { symbol, side, type, quantity };

    if (price) data.price = parseInt(price);
    if (type === 'LIMIT') data.timeInForce = 'GTC'; // Good 'till Cancelled (válida até cancelar)

    //console.log(data);
    return chamadaPrivada('/v3/order', data, 'POST');
}

module.exports = {
    hora,
    informacaoCorretora,
    informacaoMercado,
    informacaoConta,
    novaOrdem
}