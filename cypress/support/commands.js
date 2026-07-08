const cadastroPage = require('../pages/CadastroPage');
const loginPage = require('../pages/LoginPage');
const dashboardPage = require('../pages/DashboardPage');

Cypress.Commands.add('preencherCadastro', ({ nome, email, senha }) => {
  cadastroPage.preencherFormulario({ nome, email, senha });
});

Cypress.Commands.add('cadastrarUsuario', ({ nome, email, senha }) => {
  cy.intercept('POST', '/api/register').as('cadastroUsuario');

  cadastroPage.acessar();
  cy.preencherCadastro({ nome, email, senha });
  cadastroPage.enviar();

  cy.wait('@cadastroUsuario')
    .its('response.statusCode')
    .should('eq', 201);

  cadastroPage.validarCadastroConcluido();
});

Cypress.Commands.add('loginUsuario', ({ email, senha }) => {
  cy.intercept('POST', '/api/login').as('loginUsuario');

  loginPage.acessar();
  loginPage.preencherFormulario({ email, senha });
  loginPage.enviar();

  cy.wait('@loginUsuario')
    .its('response.statusCode')
    .should('eq', 200);

  loginPage.validarLoginConcluido();
});

Cypress.Commands.add('validarUsuarioLogado', (nome) => {
  dashboardPage.validarAcesso();
  dashboardPage.validarNomeUsuario(nome);
});

Cypress.Commands.add('encerrarSessao', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});
