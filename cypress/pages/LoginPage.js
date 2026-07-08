class LoginPage {
  acessar() {
    cy.visit('/login.html');
  }

  preencherFormulario({ email, senha }) {
    cy.get('#email').clear().type(email);
    cy.get('#password').clear().type(senha, { parseSpecialCharSequences: false });
  }

  enviar() {
    cy.get('#login-btn').click();
  }

  validarLoginConcluido() {
    cy.contains('Login realizado com sucesso!').should('be.visible');
  }
}

module.exports = new LoginPage();
