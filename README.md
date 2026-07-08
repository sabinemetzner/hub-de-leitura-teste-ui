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

Para gerar relatorio automatizado em XML (JUnit):

```bash
npm run cy:run:report
```

## Organizacao

- `cypress/e2e/end-to-end.cy.js`: fluxo principal de cadastro e login em um unico `it`.
- `cypress/support/commands.js`: comandos customizados reutilizaveis.
- `cypress/pages`: Page Objects com acoes e validacoes das paginas.
- `cypress/fixtures/usuarios-e2e.json`: massa de dados usada pelo teste.

## Cypress Cloud

O script `npm run cy:run:cloud` executa com `--record` e gera relatorio JUnit na pasta `cypress/reports/junit`.

1. Configure as variaveis de ambiente antes da execucao:

```powershell
$env:CYPRESS_PROJECT_ID="seu_project_id"
$env:CYPRESS_RECORD_KEY="sua_record_key"
```

2. Execute o comando:

```bash
npm run cy:run:cloud
```

## Seguranca de dados sensiveis

- Os campos de senha sao digitados com `log: false` para nao expor credenciais no Command Log do Cypress.
- O token de autenticacao usado em chamadas de API de admin e enviado com `log: false` para evitar exposicao em evidencias.
- Use `cypress.env.json` apenas localmente para dados sensiveis (o arquivo esta no `.gitignore`).
