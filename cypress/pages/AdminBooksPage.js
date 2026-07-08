class AdminBooksPage {
  acessar() {
    cy.visit('/admin-books.html');
  }

  validarPagina() {
    cy.contains('h1', 'Gerenciar Livros').should('be.visible');
    cy.get('#books-table').should('be.visible');
  }

  aguardarTabela() {
    cy.get('#books-loading', { timeout: 10000 }).should('not.be.visible');
    cy.get('#books-tbody', { timeout: 10000 }).should('be.visible');
  }

  pesquisarLivro(termo) {
    cy.get('#search-input').clear({ force: true });
    cy.intercept('GET', '/api/books*').as('buscarLivros');
    cy.get('#search-input').type(termo, { force: true });
    cy.wait('@buscarLivros');
    this.aguardarTabela();
    cy.wait(500);
  }

  limparFiltro() {
    cy.contains('button', 'Limpar filtro').click();
    this.aguardarTabela();
  }

  abrirNovoLivro() {
    cy.contains('button', 'Novo Livro').click();
    cy.get('#bookModal').should('be.visible');
    cy.contains('#modal-title', 'Adicionar Novo Livro').should('be.visible');
  }

  preencherFormulario(livro) {
    cy.get('#book-title').clear().type(livro.titulo);
    cy.get('#book-author').clear().type(livro.autor);
    cy.get('#book-isbn').clear().type(livro.isbn);
    cy.get('#book-category').select(livro.categoria);
    cy.get('#book-editor').clear().type(livro.editora);
    cy.get('#book-year').clear().type(String(livro.ano));
    cy.get('#book-pages').clear().type(String(livro.paginas));
    cy.get('#book-copies').clear().type(String(livro.exemplares));
    cy.get('#book-language').select(livro.idioma);
    cy.get('#book-description').clear().type(livro.descricao);
    cy.get('#book-cover').clear().type(livro.capa);
  }

  preencherEdicao(livro) {
    cy.get('#book-author').clear().type(livro.autor);
    cy.get('#book-category').select(livro.categoria);
    cy.get('#book-editor').clear().type(livro.editora);
    cy.get('#book-year').clear().type(String(livro.ano));
    cy.get('#book-pages').clear().type(String(livro.paginas));
    cy.get('#book-copies').clear().type(String(livro.exemplares));
    cy.get('#book-language').select(livro.idioma);
    cy.get('#book-description').clear().type(livro.descricao);
    cy.get('#book-cover').clear().type(livro.capa);
  }

  salvarLivro() {
    cy.get('#save-book-btn').click();
  }

  validarAlerta(mensagem) {
    cy.contains('#alert-container', mensagem, { timeout: 10000 }).should('be.visible');
  }

  criarLivro(livro) {
    cy.intercept('POST', '/api/books').as('criarLivro');

    this.abrirNovoLivro();
    this.preencherFormulario(livro);
    this.salvarLivro();

    cy.wait('@criarLivro')
      .its('response.statusCode')
      .should('be.oneOf', [200, 201]);

    this.validarAlerta('Livro adicionado com sucesso!');
  }

  abrirAcaoDoLivro(titulo, acao) {
    cy.contains('#books-tbody tr', titulo, { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.get(`[title="${acao}"]`).click({ force: true });
      });
  }

  validarLivroNaTabela(livro) {
    cy.contains('#books-tbody tr', livro.titulo, { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.contains(livro.titulo).should('be.visible');
        cy.contains(`${livro.exemplares}/${livro.exemplares}`).should('be.visible');
      });
  }

  validarLivroNaoListado(titulo) {
    cy.contains('#books-tbody tr', titulo).should('not.exist');
  }

  visualizarLivro(livro) {
    this.abrirAcaoDoLivro(livro.titulo, 'Visualizar');

    cy.get('#viewBookModal').should('be.visible');
    cy.get('#view-title').should('contain.text', livro.titulo);
    cy.get('#view-isbn').should('contain.text', livro.isbn);
    cy.get('#view-year').should('contain.text', livro.ano);
    cy.get('#view-stock').should('contain.text', `${livro.exemplares} de ${livro.exemplares}`);
  }

  editarLivro(tituloAtual, novosDados) {
    cy.intercept('PUT', '/api/books/*').as('editarLivro');
    cy.intercept('GET', '/api/books*').as('recarregarLivros');

    this.abrirAcaoDoLivro(tituloAtual, 'Editar');
    cy.get('#bookModal').should('be.visible');
    cy.contains('#modal-title', 'Editar Livro').should('be.visible');

    this.preencherEdicao(novosDados);
    this.salvarLivro();

    cy.wait('@editarLivro')
      .its('response.statusCode')
      .should('eq', 200);

    this.validarAlerta('Livro atualizado com sucesso!');
    cy.wait('@recarregarLivros');
    this.aguardarTabela();
  }

  excluirLivro(livro) {
    cy.intercept('DELETE', '/api/books/*').as('excluirLivro');

    this.abrirAcaoDoLivro(livro.titulo, 'Excluir');
    cy.get('#deleteModal').should('be.visible');
    cy.get('#book-to-delete-info').should('contain.text', livro.titulo);
    cy.get('#confirm-delete-btn').click();

    cy.wait('@excluirLivro')
      .its('response.statusCode')
      .should('eq', 200);

    this.validarAlerta('Livro excluído com sucesso!');
    cy.get('#deleteModal', { timeout: 10000 }).should('not.be.visible');
  }
}

module.exports = new AdminBooksPage();
