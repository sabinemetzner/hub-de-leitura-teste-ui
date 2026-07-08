class CatalogPage {
  acessar() {
    cy.visit('/catalog.html');
  }

  aguardarCarregamento() {
    cy.intercept('GET', '/api/books*').as('buscarCatalogo');
    this.acessar();
    cy.wait('@buscarCatalogo')
      .its('response.statusCode')
      .should('be.oneOf', [200, 304]);
    cy.get('#book-list .card', { timeout: 10000 }).should('have.length.greaterThan', 0);
  }

  validarCatalogoCompleto() {
    cy.location('pathname').should('eq', '/catalog.html');
    cy.get('#filter-status').should('have.class', 'd-none');
    cy.get('#book-list .card').should('have.length.greaterThan', 0);
    cy.get('#book-list .add-to-cart').should('have.length.at.least', 2);
  }

  adicionarLivroPorIndice(indice) {
    return cy.get('#book-list .add-to-cart').eq(indice).click();
  }

  obterTituloLivroPorIndice(indice) {
    return cy.get('#book-list .add-to-cart')
      .eq(indice)
      .closest('.card')
      .find('.card-title a')
      .invoke('text')
      .then((titulo) => titulo.trim());
  }

  abrirDetalhesPorIndice(indice) {
    cy.get('#book-list .view-details').eq(indice).click();
  }
}

module.exports = new CatalogPage();
