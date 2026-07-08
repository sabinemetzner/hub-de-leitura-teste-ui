class CadastroPage {
  acessar() {
    cy.visit('/register.html');
  }

  preencherFormulario({ nome, email, senha }) {
    cy.get('#name').clear().type(nome);
    cy.get('#email').clear().type(email);
    cy.get('#password').clear().type(senha, { parseSpecialCharSequences: false });
    cy.get('#confirm-password').clear().type(senha, { parseSpecialCharSequences: false });
    cy.get('#terms-agreement').check();
  }

  enviar() {
    cy.get('#register-btn').click();
  }

  validarCadastroConcluido() {
    cy.contains('Conta criada com sucesso!').should('be.visible');
  }
}

module.exports = new CadastroPage();
