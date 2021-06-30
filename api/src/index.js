const api = require('./application');
const profitability = parseFloat(process.env.PROFITABILITY);
const paridade = process.env.SYMBOL;

console.log('Iniciando monitoramento!');
console.log('--- --- ---');

setInterval(async () => {
    const mercado = await api.informacaoMercado(paridade);
    const compra = mercado.bids[0][0];
    const venda = mercado.asks[0][0];
    const carteira = await api.informacaoConta();
    const saldo = carteira.balances.filter(b => paridade.indexOf(b.asset) !== -1);
    const brl = parseFloat(saldo.find(c => c.asset.endsWith('BRL')).free);
    const shib = parseFloat(saldo.find(c => c.asset.endsWith('SHIB')).free);

    //console.log(await api.hora());
    //console.log('--- --- ---');
    //console.log('C O R R E T O R A');
    //console.log(await api.informacaoCorretora(paridade));
    //console.log('--- --- ---');

    console.log('C A R T E I R A');
    console.log(saldo);
    console.log('--- --- ---');
    console.log(`MERCADO PARA ===> ${paridade}`);
    console.log('--- --- ---');
    console.log(mercado.bids.length ? `COMPRA: ${compra}` : 'Sem Compras');
    console.log(mercado.asks.length ? `VENDA: ${venda}` : 'Sem Vendas');
    console.log('--- --- ---');

    if (shib == 0) {
        console.log("sem shib, verificar se tem brl");
        if (venda <= brl) {
            console.log("tem brl, então verificar cotação");
            if (venda < 0.00004040) {
                console.log("preço bom, vou comprar");

                //const ordemCompra = await api.novaOrdem(paridade, 100);
            }            
        }
    }
    else {
        if(depreciou(profitability)){
            console.log("compra!");
        }

        if(apreciou(profitability)){
            console.log("vende!");
        }
    }


    //     if (sellPrice <= carteiraUSD) {

    //         console.log('Tenho! Comprando!');
    //         const buyOrder = await api.newOrder(symbolTrading, 1);
    //         //console.log(buyOrder);//descomente para investigar problemas
    //         console.log(`orderId: ${buyOrder.orderId}`);
    //         console.log(`status: ${buyOrder.status}`);

    //         console.log(`Posicionando venda. Ganho de ${profitability}`);
    //         const sellOrder = await api.newOrder(symbolTrading, 1, sellPrice * profitability, 'SELL', 'LIMIT');
    //         //console.log(sellOrder);//descomente para investigar problemas
    //         console.log(`orderId: ${sellOrder.orderId}`);
    //         console.log(`status: ${sellOrder.status}`);
    //     }
    // }
}, process.env.CRAWLER_INTERVAL);