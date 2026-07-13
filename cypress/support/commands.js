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

Cypress.Commands.add('tentarLoginUsuario', ({ email, senha, statusCode }) => {
  cy.intercept('POST', '/api/login').as('tentativaLoginUsuario');

  loginPage.acessar();
  loginPage.preencherFormulario({ email, senha });
  loginPage.enviar();

  cy.wait('@tentativaLoginUsuario')
    .its('response.statusCode')
    .should('eq', statusCode);
});

Cypress.Commands.add('validarUsuarioLogado', (nome) => {
  dashboardPage.validarAcesso();
  dashboardPage.validarNomeUsuario(nome);
});

Cypress.Commands.add('encerrarSessao', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

Cypress.Commands.add('removerLivrosTemporarios', () => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('authToken');

    cy.request({
      method: 'GET',
      url: '/api/books?search=Livro&limit=100',
      headers: { Authorization: token },
      log: false,
    }).then(({ body }) => {
      const livrosTemporarios = (body.books || []).filter((book) => {
        const ehAutorTeste = book.author && book.author.startsWith('Autora Teste QA');
        const ehTituloTeste = book.title && book.title.startsWith('LivroTesteAdmin');

        return ehAutorTeste || ehTituloTeste;
      });

      cy.wrap(livrosTemporarios, { log: false }).each((book) => {
        cy.request({
          method: 'DELETE',
          url: `/api/books/${book.id}`,
          headers: { Authorization: token },
          failOnStatusCode: false,
          log: false,
        });
      });
    });
  });
});

Cypress.Commands.add('criarLivroPorApi', (livro) => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('authToken');

    cy.request({
      method: 'POST',
      url: '/api/books',
      headers: { Authorization: token },
      log: false,
      body: {
        title: livro.titulo,
        author: livro.autor,
        description: livro.descricao,
        category: livro.categoria,
        isbn: livro.isbn,
        editor: livro.editora,
        language: livro.idioma,
        publication_year: livro.ano,
        pages: livro.paginas,
        total_copies: livro.exemplares,
        available_copies: livro.exemplares,
        cover_image: livro.capa,
      },
    }).its('status').should('eq', 201);
  });
});
