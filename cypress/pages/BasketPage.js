class BasketPage {
  acessar() {
    cy.visit('/basket.html');
  }

  validarCestaComItens(quantidadeEsperada) {
    cy.location('pathname').should('eq', '/basket.html');
    cy.get('#cart-content', { timeout: 10000 }).should('not.have.class', 'd-none');
    cy.get('#cart-list .book-item').should('have.length', quantidadeEsperada);
    cy.get('#cart-summary').should('contain.text', String(quantidadeEsperada));
  }

  validarLivroNaCesta(titulo) {
    cy.contains('#cart-list .card-title', titulo).should('be.visible');
  }

  abrirDetalhesPrimeiroLivro() {
    cy.get('#cart-list a[title="Ver detalhes"]').first().click();
  }
}

module.exports = new BasketPage();
