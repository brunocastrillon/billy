//index.js
const api = require('./application');
const profitability = parseFloat(process.env.PROFITABILITY);
const symbolTrading = process.env.SYMBOL;

console.log('Iniciando monitoramento!');
setInterval(async () => {
    //console.log(await api.exchangeInfo());
    //console.log(await api.time());
    console.log(`Mercado para ${symbolTrading}`);
    const mercado = await api.depth(symbolTrading);
    console.log(mercado.bids.length ? `Compra: ${mercado.bids[0][0]}` : 'Sem Compras');
    console.log(mercado.asks.length ? `Venda: ${mercado.asks[0][0]}` : 'Sem Vendas');

    console.log('Carteira');
    const carteira = await api.accountInfo();
    const coins = carteira.balances.filter(b => symbolTrading.indexOf(b.asset) !== -1);
    console.log(coins);

    const sellPrice = parseFloat(mercado.asks[0][0]);
    const carteiraUSD = parseFloat(coins.find(c => c.asset.endsWith('USD')).free);
    if (sellPrice < 1000) {
        console.log('Preço está bom. Verificando se tenho grana...');
        if (sellPrice <= carteiraUSD) {

            console.log('Tenho! Comprando!');
            const buyOrder = await api.newOrder(symbolTrading, 1);
            //console.log(buyOrder);//descomente para investigar problemas
            console.log(`orderId: ${buyOrder.orderId}`);
            console.log(`status: ${buyOrder.status}`);

            console.log(`Posicionando venda. Ganho de ${profitability}`);
            const sellOrder = await api.newOrder(symbolTrading, 1, sellPrice * profitability, 'SELL', 'LIMIT');
            //console.log(sellOrder);//descomente para investigar problemas
            console.log(`orderId: ${sellOrder.orderId}`);
            console.log(`status: ${sellOrder.status}`);
        }
    }
}, process.env.CRAWLER_INTERVAL);