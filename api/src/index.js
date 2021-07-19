const api = require('./application');
const profitability = parseFloat(process.env.PROFITABILITY);
const paridade = process.env.SYMBOL;

console.log('I N I C I A N D O  B I L L Y !');
console.log('--- --- ---');

setInterval(async () => {
    const mercado = await api.informacaoMercado(paridade);
    const compraPreco = mercado.bids[0][0];
    const vendaPreco = mercado.asks[0][0];
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
    console.log(mercado.bids.length ? `COMPRA: ${compraPreco}` : 'Sem Compras');
    console.log(mercado.asks.length ? `VENDA: ${vendaPreco}` : 'Sem Vendas');
    console.log('--- --- ---');

    if (brl > 600.00000000) {
        if (shib == 0) {
            console.log("sem shib, verificar se tem brl");
            if (vendaPreco <= brl) {
                console.log("tem brl, então verificar cotação");
                if (vendaPreco < 0.00003425) {
                    console.log("preço bom, vou comprar");

                    const ordemCompra = await api.novaOrdem('BUY', 'MARKET', paridade, 300000);
                    console.log(`Ordem: ${ordemCompra.orderId}`);
                    console.log(`Status: ${ordemCompra.status}`);

                    console.log('--- --- ---');
                    console.log("POSICIONANDO VENDA:");
                    console.log('--- --- ---');

                    const ordemVenda = await api.novaOrdem('SELL', 'LIMIT', paridade, shib, vendaPreco * profitability);
                    console.log(`Ordem: ${ordemVenda.orderId}`);
                    console.log(`Status: ${ordemVenda.status}`);
                }
            }
        }
        else {
            if (vendaPreco > 0.00003455) {
                console.log("preço bom, vou vender");

                const ordemVenda = await api.novaOrdem('SELL', 'MARKET', paridade, shib);
                console.log(`Ordem: ${ordemVenda.orderId}`);
                console.log(`Status: ${ordemVenda.status}`);
            }
        }

    }
}, process.env.CRAWLER_INTERVAL);

// 1.000.000 shib *  0.00003436(preço) = R$ 34,36

//0.00003436(preço) + 30% =  0,000010308
//0.00003436(preço) + 3% =  0,0000010308


// 0.000044629
// 0.00004466800000000001