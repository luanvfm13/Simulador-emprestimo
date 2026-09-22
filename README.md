# Simulador de Empréstimos e Juros para MEI

## Visão Geral

O **Simulador de Empréstimos e Juros para MEI** é uma aplicação web interativa desenvolvida com tecnologias nativas de front-end (HTML5, CSS3 e JavaScript) projetada para calcular, simular e auditar operações de microcrédito e financiamento voltadas a Microempreendedores Individuais (MEIs). O sistema aplica fundamentos de matemática financeira (método de amortização Tabela Price), taxas de juros condicionais dinâmicas, controle iterativo de saldo devedor e uma auditoria automatizada de risco financeiro baseada no comprometimento de renda.

## Funcionalidades Principais

- **Interface Web Reativa:** Formulários estruturados para inserção de parâmetros financeiros e renderização imediata de relatórios de amortização no navegador.
- **Taxas de Juros Condicionais:** Aplicação automatizada de taxas escalonadas conforme a duração do financiamento (1,5% ao mês para prazos até 6 meses; 2,8% ao mês para prazos superiores).
- **Amortização pela Tabela Price:** Processamento matemático de parcelas fixas baseadas em juros compostos.
- **Controle Iterativo (Loops):** Geração dinâmica de extratos mensais detalhando a composição de juros, amortização e saldo devedor residual.
- **Auditoria de Capacidade de Pagamento:** Validação automática do limite de 30% da renda mensal informada, emitindo notificações de viabilidade de crédito ou alerta de risco de endividamento.

## Especificações Técnicas

- **Front-End:** HTML5, CSS3.
- **Lógica e Processamento:** Vanilla JavaScript (ES6+), manipulação avançada do DOM.
- **Arquitetura:** Aplicação Client-Side pura, compatível com implantação estática via GitHub Pages.

## Fluxograma do Projeto

 * Abaixo está o diagrama lógico que representa o fluxo de execução do sistema, desde a captura dos parâmetros até a auditoria de risco financeiro:

![Fluxograma do Sistema](./assets/trabaipitic.drawio.png)


## Arquitetura do Fluxo de Execução

1. **Captura de Parâmetros:** Recepção dos dados de entrada do usuário (`ValorEmp`, `QtdP`, `RenM`) através da interface DOM.
2. **Avaliação Regulatória:** Execução de estruturas condicionais para estipulação da taxa de juros aplicável.
3. **Modelagem Matemática:** Cálculo da prestação periódica fixa mediante a fórmula da Tabela Price.
4. **Processamento do Extrato:** Execução de laços de repetição para mapear a evolução do saldo devedor ao longo dos meses.
5. **Auditoria de Risco:** Apuração do teto limite de renda e exibição dinâmica dos resultados de aprovação ou restrição.

## Instruções de Execução

1. Clone o repositório ou realize o download dos arquivos fonte.
2. Certifique-se de manter a estrutura de arquivos da aplicação (`index.html`, arquivos de estilo e script) no mesmo diretório.
3. Abra o arquivo `index.html` em qualquer navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, etc.).
4. Insira os parâmetros de simulação diretamente nos campos da interface.

## Contexto do Acadêmico / Projeto

Trabalho desenvolvido para a disciplina de Práticas Técnicas em Informática / TIC (PTIC) integrante da grade curricular do curso técnico em **Desenvolvimento de Sistemas** da **ETEC EURO ALBINO DE SOUZA**, com ênfase em engenharia de software front-end, automação de regras de negócio financeiras e validação estrita de dados.

## Autoria

- **Luan Vicktor Ferreira Moura**
