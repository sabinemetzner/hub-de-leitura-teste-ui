const { faker } = require('@faker-js/faker');
const adminBooksPage = require('../pages/AdminBooksPage');

const removerLivrosTemporarios = () => {
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

      cy.wrap(livrosTemporarios).each((book) => {
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
};

const criarLivroPorApi = (livro) => {
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
};

describe('Gerenciamento de livros', () => {
  beforeEach(() => {
    cy.encerrarSessao();

    cy.fixture('login').then(({ positivos }) => {
      const admin = positivos.find((usuario) => usuario.redirecionamento === '/admin-dashboard.html');

      cy.loginUsuario(admin);
      removerLivrosTemporarios();
    });
  });

  afterEach(() => {
    removerLivrosTemporarios();
  });

  it('deve criar, visualizar, editar e excluir um livro', () => {
    cy.fixture('admin-books').then(({ livroBase, edicao }) => {
      const identificador = faker.string.alphanumeric(8);
      const livro = {
        ...livroBase,
        titulo: `${livroBase.titulo}${identificador}`,
        isbn: `${livroBase.isbnPrefixo}-${faker.string.numeric(6)}`,
      };
      const livroEditado = {
        ...livro,
        titulo: livro.titulo,
        autor: edicao.autor,
        categoria: edicao.categoria,
        editora: edicao.editora,
        ano: edicao.ano,
        paginas: edicao.paginas,
        exemplares: edicao.exemplares,
        idioma: edicao.idioma,
        descricao: edicao.descricao,
        capa: edicao.capa,
      };

      criarLivroPorApi(livro);

      adminBooksPage.acessar();
      adminBooksPage.validarPagina();
      adminBooksPage.aguardarTabela();
      adminBooksPage.pesquisarLivro(livro.titulo);
      adminBooksPage.validarLivroNaTabela(livro);

      adminBooksPage.visualizarLivro(livro);

      adminBooksPage.acessar();
      adminBooksPage.aguardarTabela();
      adminBooksPage.pesquisarLivro(livro.titulo);
      adminBooksPage.editarLivro(livro.titulo, livroEditado);
      adminBooksPage.pesquisarLivro(livroEditado.titulo);
      adminBooksPage.validarLivroNaTabela(livroEditado);

      adminBooksPage.visualizarLivro(livroEditado);

      adminBooksPage.acessar();
      adminBooksPage.aguardarTabela();
      adminBooksPage.pesquisarLivro(livroEditado.titulo);
      adminBooksPage.excluirLivro(livroEditado);
      adminBooksPage.pesquisarLivro(livroEditado.titulo);
      adminBooksPage.validarLivroNaoListado(livroEditado.titulo);
    });
  });
});
