class DashboardPage {
  validarAcesso() {
    cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard.html');
  }

  validarNomeUsuario(nome) {
    cy.get('#user-name').should('contain.text', nome);
  }
}

module.exports = new DashboardPage();
