const { faker } = require('@faker-js/faker');
const adminBooksPage = require('../pages/AdminBooksPage');

describe('Gerenciamento de livros', () => {
  beforeEach(() => {
    cy.encerrarSessao();

    cy.fixture('login').then(({ positivos }) => {
      const admin = positivos.find((usuario) => usuario.redirecionamento === '/admin-dashboard.html');

      cy.loginUsuario(admin);
      cy.removerLivrosTemporarios();
    });
  });

  afterEach(() => {
    cy.removerLivrosTemporarios();
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

      cy.criarLivroPorApi(livro);

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
