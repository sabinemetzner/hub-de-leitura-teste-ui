class LoginPage {
  acessar() {
    cy.visit('/login.html');
  }

  preencherFormulario({ email = '', senha = '' }) {
    cy.get('#email').clear();
    cy.get('#password').clear();

    if (email) {
      cy.get('#email').type(email);
    }

    if (senha) {
      cy.get('#password').type(senha, { parseSpecialCharSequences: false });
    }
  }

  enviar() {
    cy.get('#login-btn').click();
  }

  validarLoginConcluido() {
    cy.contains('Login realizado com sucesso!').should('be.visible');
  }

  validarMensagemErro(mensagem) {
    cy.contains(mensagem).should('be.visible');
  }

  validarCampoInvalido(seletor) {
    cy.get(seletor).should('have.class', 'is-invalid');
  }

  validarPermaneceNoLogin() {
    cy.location('pathname').should('eq', '/login.html');
  }
}

module.exports = new LoginPage();
