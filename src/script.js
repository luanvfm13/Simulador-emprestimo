'use strict';

/* =========================================================================
   Simulador de Empréstimos e Juros para MEI
   -------------------------------------------------------------------------
   Regras de negócio do projeto:
   1) Estrutura condicional (if/else): taxa de 1,5% a.m. até 6 parcelas,
      2,8% a.m. acima disso.
   2) Fórmula matemática: prestação fixa pela Tabela Price.
   3) Laço de repetição: extrato mês a mês (juros, amortização, saldo).
   4) Auditoria de renda: alerta se a parcela ultrapassar 30% da renda.
   ========================================================================= */

// ----- Regras de negócio (constantes) -----
const TAXA_ATE_6_PARCELAS = 0.015;      // 1,5% ao mês
const TAXA_ACIMA_6_PARCELAS = 0.028;    // 2,8% ao mês
const LIMITE_PARCELAS_TAXA_REDUZIDA = 6;
const LIMITE_COMPROMETIMENTO_RENDA = 0.30; // 30% da renda mensal
const PARCELAS_MINIMAS = 1;
const PARCELAS_MAXIMAS = 24;

// ----- Elementos do DOM -----
const form = document.getElementById('form-simulacao');
const botaoLimpar = document.getElementById('botao-limpar');

const inputValorEmp = document.getElementById('ValorEmp');
const inputQtdP = document.getElementById('QtdP');
const inputRenM = document.getElementById('RenM');

const secaoResultado = document.getElementById('resultado');
const corpoExtrato = document.getElementById('corpo-extrato');

const seloAuditoria = document.getElementById('selo-auditoria');
const seloTexto = document.getElementById('selo-texto');
const mensagemAuditoria = document.getElementById('mensagem-auditoria');

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

// Sem o símbolo "R$": usado nas células do extrato para ganhar espaço
// horizontal (a legenda acima da tabela já informa que os valores são em reais).
const formatadorNumero = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Define a taxa de juros mensal com base no número de parcelas.
 * Estrutura condicional exigida pelo escopo do projeto (if/else).
 * @param {number} qtdParcelas
 * @returns {number} taxa de juros mensal em formato decimal (ex.: 0.015)
 */
function definirTaxaJuros(qtdParcelas) {
  if (qtdParcelas <= LIMITE_PARCELAS_TAXA_REDUZIDA) {
    return TAXA_ATE_6_PARCELAS;
  } else {
    return TAXA_ACIMA_6_PARCELAS;
  }
}

/**
 * Calcula a prestação fixa mensal pelo método de amortização Tabela Price.
 * PMT = PV * [ i (1+i)^n ] / [ (1+i)^n - 1 ]
 * @param {number} valorEmprestimo - Principal (PV)
 * @param {number} taxaJuros - taxa mensal em decimal (i)
 * @param {number} qtdParcelas - número de parcelas (n)
 * @returns {number} valor da prestação fixa
 */
function calcularParcelaPrice(valorEmprestimo, taxaJuros, qtdParcelas) {
  const fatorAcumulado = Math.pow(1 + taxaJuros, qtdParcelas);
  return (valorEmprestimo * (taxaJuros * fatorAcumulado)) / (fatorAcumulado - 1);
}

/**
 * Gera o extrato mês a mês do financiamento, controlando o saldo devedor
 * de forma iterativa (laço de repetição exigido pelo projeto).
 * @param {number} valorEmprestimo
 * @param {number} taxaJuros
 * @param {number} qtdParcelas
 * @param {number} valorParcela
 * @returns {Array<{mes:number, saldoInicial:number, juros:number, amortizacao:number, saldoFinal:number}>}
 */
function gerarExtrato(valorEmprestimo, taxaJuros, qtdParcelas, valorParcela) {
  const extrato = [];
  let saldoDevedor = valorEmprestimo;

  for (let mes = 1; mes <= qtdParcelas; mes++) {
    const saldoInicial = saldoDevedor;
    const juros = saldoInicial * taxaJuros;
    let amortizacao = valorParcela - juros;
    let saldoFinal = saldoInicial - amortizacao;

    // Na última parcela, ajusta centavos residuais para zerar a dívida.
    if (mes === qtdParcelas) {
      amortizacao = saldoInicial;
      saldoFinal = 0;
    }

    extrato.push({ mes, saldoInicial, juros, amortizacao, saldoFinal });
    saldoDevedor = saldoFinal;
  }

  return extrato;
}

/**
 * Audita a capacidade de pagamento comparando a parcela ao teto de 30% da renda.
 * @param {number} valorParcela
 * @param {number} rendaMensal
 * @returns {{limite:number, comprometimento:number, aprovado:boolean}}
 */
function auditarCapacidadePagamento(valorParcela, rendaMensal) {
  const limite = rendaMensal * LIMITE_COMPROMETIMENTO_RENDA;
  const comprometimento = (valorParcela / rendaMensal) * 100;
  const aprovado = valorParcela <= limite;
  return { limite, comprometimento, aprovado };
}

/**
 * Lê e valida os dados do formulário, exibindo mensagens de erro específicas.
 * @returns {{valorEmprestimo:number, qtdParcelas:number, rendaMensal:number} | null}
 */
function validarFormulario() {
  limparErros();

  const valorEmprestimo = parseFloat(inputValorEmp.value);
  const qtdParcelas = parseInt(inputQtdP.value, 10);
  const rendaMensal = parseFloat(inputRenM.value);

  let valido = true;

  if (!Number.isFinite(valorEmprestimo) || valorEmprestimo <= 0) {
    exibirErro('erro-ValorEmp', 'Informe um valor de empréstimo maior que zero.');
    valido = false;
  }

  if (!Number.isInteger(qtdParcelas) || qtdParcelas < PARCELAS_MINIMAS || qtdParcelas > PARCELAS_MAXIMAS) {
    exibirErro('erro-QtdP', `Informe um número inteiro de parcelas entre ${PARCELAS_MINIMAS} e ${PARCELAS_MAXIMAS}.`);
    valido = false;
  }

  if (!Number.isFinite(rendaMensal) || rendaMensal <= 0) {
    exibirErro('erro-RenM', 'Informe uma renda mensal maior que zero.');
    valido = false;
  }

  return valido ? { valorEmprestimo, qtdParcelas, rendaMensal } : null;
}

function exibirErro(idElemento, mensagem) {
  const elemento = document.getElementById(idElemento);
  elemento.textContent = mensagem;
}

function limparErros() {
  document.querySelectorAll('.campo__erro').forEach((elemento) => {
    elemento.textContent = '';
  });
}

function formatarPercentual(valor, casasDecimais = 1) {
  return `${valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  })}%`;
}

/**
 * Renderiza o resumo (recibo), o selo de auditoria e a tabela de extrato.
 */
function exibirResultado({ taxaJuros, valorParcela, qtdParcelas, extrato, auditoria }) {
  const totalPago = valorParcela * qtdParcelas;
  const totalJuros = extrato.reduce((soma, linha) => soma + linha.juros, 0);

  document.getElementById('res-taxa').textContent =
    `${formatarPercentual(taxaJuros * 100)} a.m.`;
  document.getElementById('res-parcela').textContent = formatadorMoeda.format(valorParcela);
  document.getElementById('res-total').textContent = formatadorMoeda.format(totalPago);
  document.getElementById('res-juros').textContent = formatadorMoeda.format(totalJuros);
  document.getElementById('res-comprometimento').textContent =
    formatarPercentual(auditoria.comprometimento);

  // Selo de auditoria: aprovado (dentro de 30% da renda) ou risco de endividamento.
  seloAuditoria.classList.remove('selo--aprovado', 'selo--risco', 'selo--visivel');
  if (auditoria.aprovado) {
    seloAuditoria.classList.add('selo--aprovado');
    seloTexto.textContent = 'Aprovado';
    mensagemAuditoria.textContent =
      `A parcela compromete ${formatarPercentual(auditoria.comprometimento)} da renda mensal ` +
      `informada, dentro do limite recomendado de 30%. O financiamento é considerado viável.`;
  } else {
    seloAuditoria.classList.add('selo--risco');
    seloTexto.textContent = 'Risco de endividamento';
    mensagemAuditoria.textContent =
      `A parcela compromete ${formatarPercentual(auditoria.comprometimento)} da renda mensal ` +
      `informada, acima do limite recomendado de 30% (${formatadorMoeda.format(auditoria.limite)}). ` +
      `Considere um prazo maior ou um valor de empréstimo menor.`;
  }
  // Força reflow para reiniciar a animação de "carimbo" a cada nova simulação.
  void seloAuditoria.offsetWidth;
  seloAuditoria.classList.add('selo--visivel');

  // Extrato mensal.
  corpoExtrato.innerHTML = '';
  extrato.forEach((linha) => {
    const tr = document.createElement('tr');
    if (!auditoria.aprovado) {
      tr.classList.add('linha-risco');
    }
    tr.innerHTML = `
      <td>${linha.mes}</td>
      <td>${formatadorNumero.format(linha.saldoInicial)}</td>
      <td>${formatadorNumero.format(linha.juros)}</td>
      <td>${formatadorNumero.format(linha.amortizacao)}</td>
      <td>${formatadorNumero.format(linha.saldoFinal)}</td>
    `;
    corpoExtrato.appendChild(tr);
  });

  secaoResultado.hidden = false;
  secaoResultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Ponto de entrada: captura os parâmetros, aplica as regras de negócio
 * e exibe o resultado (Arquitetura do Fluxo de Execução do README).
 */
function simular(evento) {
  evento.preventDefault();

  const dados = validarFormulario();
  if (!dados) {
    return;
  }

  const { valorEmprestimo, qtdParcelas, rendaMensal } = dados;

  const taxaJuros = definirTaxaJuros(qtdParcelas);
  const valorParcela = calcularParcelaPrice(valorEmprestimo, taxaJuros, qtdParcelas);
  const extrato = gerarExtrato(valorEmprestimo, taxaJuros, qtdParcelas, valorParcela);
  const auditoria = auditarCapacidadePagamento(valorParcela, rendaMensal);

  exibirResultado({ taxaJuros, valorParcela, qtdParcelas, extrato, auditoria });
}

function limparSimulacao() {
  limparErros();
  secaoResultado.hidden = true;
  seloAuditoria.classList.remove('selo--visivel');
}

form.addEventListener('submit', simular);
botaoLimpar.addEventListener('click', limparSimulacao);
