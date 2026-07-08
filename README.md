# hub-de-leitura-teste-ui

Automacao end to end do Hub de Leitura com Cypress.

## Como executar

1. Instale as dependencias:

```bash
npm install
```

2. Suba a aplicacao local:

```bash
npm start
```

3. Execute o Cypress:

```bash
npm run cy:open
```

ou em modo headless:

```bash
npm run cy:run
```

## Organizacao

- `cypress/e2e/end-to-end.cy.js`: fluxo principal de cadastro e login em um unico `it`.
- `cypress/support/commands.js`: comandos customizados reutilizaveis.
- `cypress/pages`: Page Objects com acoes e validacoes das paginas.
- `cypress/fixtures/usuarios-e2e.json`: massa de dados usada pelo teste.

## Cypress Cloud

O script `npm run cy:run:cloud` esta pronto para execucao com `--record`.
Para usar o Cypress Cloud, configure o `projectId` em `cypress.config.js` e a variavel `CYPRESS_RECORD_KEY` com a chave do seu projeto.
