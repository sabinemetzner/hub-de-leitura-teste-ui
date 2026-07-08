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
      cy.get('#password').type(senha, { parseSpecialCharSequences: false, log: false });
    }
  }

  enviar() {
    cy.get('#login-btn').click();
  }

  usarContaDemo(email) {
    cy.contains('.demo-account', email)
      .within(() => {
        cy.contains('button', 'Usar').click();
      });
  }

  alternarVisibilidadeSenha() {
    cy.get('#toggle-password').click();
  }

  validarCamposPreenchidos({ email, senha }) {
    cy.get('#email').should('have.value', email);
    cy.get('#password').should('have.value', senha);
  }

  validarTipoCampoSenha(tipo) {
    cy.get('#password').should('have.attr', 'type', tipo);
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

  validarUsuarioJaLogado(nome) {
    cy.contains(`Você já está logado como ${nome}`).should('be.visible');
  }
}

module.exports = new LoginPage();
