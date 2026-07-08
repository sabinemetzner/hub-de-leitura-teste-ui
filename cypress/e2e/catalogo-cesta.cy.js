const catalogPage = require('../pages/CatalogPage');
const basketPage = require('../pages/BasketPage');

describe('Catalogo e cesta de livros', () => {
  beforeEach(() => {
    cy.encerrarSessao();

    cy.fixture('login').then(({ positivos }) => {
      const usuarioComum = positivos.find((usuario) => usuario.redirecionamento === '/dashboard.html');
      cy.loginUsuario(usuarioComum);
    });

    cy.window().then((win) => {
      win.localStorage.removeItem('bookCart');
    });

    catalogPage.aguardarCarregamento();
  });

  it('deve acessar o catalogo completo e exibir livros disponiveis para reserva', () => {
    catalogPage.validarCatalogoCompleto();
  });

  it('deve adicionar 2 livros na cesta e validar se ambos estao listados', () => {
    const livrosSelecionados = [];

    catalogPage.validarCatalogoCompleto();

    catalogPage.obterTituloLivroPorIndice(0).then((titulo) => {
      livrosSelecionados.push(titulo);
    });
    catalogPage.adicionarLivroPorIndice(0);

    catalogPage.obterTituloLivroPorIndice(1).then((titulo) => {
      livrosSelecionados.push(titulo);
    });
    catalogPage.adicionarLivroPorIndice(1);

    basketPage.acessar();
    basketPage.validarCestaComItens(2);

    cy.then(() => {
      livrosSelecionados.forEach((titulo) => {
        basketPage.validarLivroNaCesta(titulo);
      });
    });
  });

  it('deve abrir os detalhes de um livro a partir do catalogo', () => {
    let tituloLivro = '';

    catalogPage.obterTituloLivroPorIndice(0).then((titulo) => {
      tituloLivro = titulo;
    });

    catalogPage.abrirDetalhesPorIndice(0);

    cy.location('pathname').should('eq', '/book-details.html');
    cy.location('search').should('contain', 'id=');
    cy.get('#book-details', { timeout: 10000 }).should('not.have.class', 'd-none');
    cy.get('#book-title').should('be.visible');

    cy.then(() => {
      cy.get('#book-title').should('contain.text', tituloLivro);
    });
  });

  it('deve abrir os detalhes do primeiro livro a partir da cesta', () => {
    catalogPage.adicionarLivroPorIndice(0);

    basketPage.acessar();
    basketPage.validarCestaComItens(1);
    basketPage.abrirDetalhesPrimeiroLivro();

    cy.location('pathname').should('eq', '/book-details.html');
    cy.location('search').should('contain', 'id=');
    cy.get('#book-details', { timeout: 10000 }).should('not.have.class', 'd-none');
    cy.get('#book-title').should('be.visible');
    cy.get('#action-buttons').should('be.visible');
  });
});
