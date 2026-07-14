// Sistema de Carrinho
let carrinho = [];
const numeroWhatsApp = "5521967697037"; // Número da loja
const VALOR_MINIMO = 30.00;


function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }
    
    atualizarCarrinho();
    mostrarFeedback(nome);
}

function removerDoCarrinho(nome) {
    carrinho = carrinho.filter(item => item.nome !== nome);
    atualizarCarrinho();
}

function alterarQuantidade(nome, novaQuantidade) {
    const item = carrinho.find(item => item.nome === nome);
    if (item) {
        if (novaQuantidade <= 0) {
            removerDoCarrinho(nome);
        } else {
            item.quantidade = novaQuantidade;
            atualizarCarrinho();
        }
    }
}

function atualizarCarrinho() {
    const badgeCarrinho = document.getElementById('badgeCarrinho');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    badgeCarrinho.textContent = totalItens;

    const itensCarrinho = document.getElementById('itensCarrinho');
    const totalCarrinho = document.getElementById('totalCarrinho');
    
    if (carrinho.length === 0) {
        itensCarrinho.innerHTML = `
            <div class="carrinho-vazio">
                <p>🍪 Seu carrinho está vazio</p>
                <p>Adicione alguns cookies deliciosos!</p>
            </div>
        `;
        totalCarrinho.textContent = '0,00';
        return;
    }

    let htmlItens = '';
    let valorTotal = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        valorTotal += subtotal;
        
        htmlItens += `
            <div class="item-carrinho">
                <div class="item-info">
                    <h4>${item.nome}</h4>
                    <div class="item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                    <div class="controles-quantidade">
                        <button class="btn-quantidade" onclick="alterarQuantidade('${item.nome}', ${item.quantidade - 1})">-</button>
                        <span class="quantidade">${item.quantidade}</span>
                        <button class="btn-quantidade" onclick="alterarQuantidade('${item.nome}', ${item.quantidade + 1})">+</button>
                        <button class="btn-quantidade" onclick="removerDoCarrinho('${item.nome}')" style="background: #e53e3e; margin-left: 10px;">🗑️</button>
                    </div>
                </div>
                <div class="item-subtotal">
                    <strong>R$ ${subtotal.toFixed(2).replace('.', ',')}</strong>
                </div>
            </div>
        `;
    });

    itensCarrinho.innerHTML = htmlItens;
    totalCarrinho.textContent = valorTotal.toFixed(2).replace('.', ',');

    const avisoMinimo = document.getElementById('avisoMinimo');
    const btnFinalizar = document.getElementById('btnFinalizar');

    if (valorTotal < VALOR_MINIMO) {
        const faltam = (VALOR_MINIMO - valorTotal).toFixed(2).replace('.', ',');
        avisoMinimo.innerHTML = `⚠️ Faltam <strong>R$ ${faltam}</strong> para atingir o pedido mínimo de R$ ${VALOR_MINIMO.toFixed(2).replace('.', ',')}`;
        avisoMinimo.style.display = 'block';
        btnFinalizar.disabled = true;
    } else {
        avisoMinimo.style.display = 'none';
        btnFinalizar.disabled = false;
    }
}

function mostrarFeedback(nome) {
    const botoes = document.querySelectorAll('.botao-carrinho');
    botoes.forEach(botao => {
        if (botao.getAttribute('onclick').includes(nome)) {
            botao.classList.add('sucesso-animacao');
            const textoOriginal = botao.textContent;
            botao.textContent = '✅ Adicionado!';
            
            setTimeout(() => {
                botao.textContent = textoOriginal;
                botao.classList.remove('sucesso-animacao');
            }, 1000);
        }
    });
}

function abrirCarrinho() {
    document.getElementById('modalCarrinho').style.display = 'block';
}

function fecharCarrinho() {
    document.getElementById('modalCarrinho').style.display = 'none';
}

function enviarWhatsApp() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const valorTotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);

    if (valorTotal < VALOR_MINIMO) {
        alert(`Pedido mínimo de R$ ${VALOR_MINIMO.toFixed(2).replace('.', ',')}. Faltam R$ ${(VALOR_MINIMO - valorTotal).toFixed(2).replace('.', ',')}.`);
        return;
    }

    let mensagem = " *PEDIDO CHEWIE COOKIES* \n\n";

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        valorTotal += subtotal;
        mensagem += `▫️ ${item.quantidade}x ${item.nome}\n`;
        mensagem += `   R$ ${item.preco.toFixed(2).replace('.', ',')} cada = R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`;
    });

    mensagem += ` *TOTAL: R$ ${valorTotal.toFixed(2).replace('.', ',')}*\n\n`;
    mensagem += ` *Endereço de entrega:*\n(Favor informar)\n\n`;
    mensagem += ` Pedido realizado em: ${new Date().toLocaleString('pt-BR')}`;

    const mensagemCodificada = encodeURIComponent(mensagem);
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    
    window.open(linkWhatsApp, '_blank');
}

// Fechar modal clicando fora
window.onclick = function(event) {
    const modal = document.getElementById('modalCarrinho');
    if (event.target === modal) {
        fecharCarrinho();
    }
}

// Inicializar carrinho
atualizarCarrinho();