describe('Entre em Contato', () => {

  beforeEach(() => {
    cy.visit('/index.html');
  });

  it('Deve preencher todos os campos e enviar mensagem', () => {

    cy.get('[name="name"]').type('Sabine Draeger');
    cy.get('[name="email"]').type('sabine@teste.com');
    cy.get('[name="subject"]').select('Sugestões');
    cy.get('[name="message"]').type('Testes Sabine QA');
    cy.get('#btn-submit').click()
    cy.contains('Contato enviado com sucesso!').should('be.visible');
  });

  it('Deve preencher todos os campos mas com email invalido', () => {

    cy.get('[name="name"]').type('Sabine Draeger');
    cy.get('[name="email"]').type('email-invalido');
    cy.get('[name="subject"]').select('Sugestões');
    cy.get('[name="message"]').type('Testes Sabine QA');
    cy.get('#btn-submit').click()
    cy.get('[name="email"]').should('match', ':invalid');
  });

  it('Deve preencher todos os campos mas sem email', () => {

    cy.get('[name="name"]').type('Sabine Draeger');
    cy.get('[name="subject"]').select('Sugestões');
    cy.get('[name="message"]').type('Testes Sabine QA');
    cy.get('#btn-submit').click()
    cy.contains('Por favor, preencha o campo E-mail.').should('be.visible');
  });

  it('Deve preencher todos os campos mas sem nome', () => {

    cy.get('[name="email"]').type('sabine@teste.com');
    cy.get('[name="subject"]').select('Sugestões');
    cy.get('[name="message"]').type('Testes Sabine QA');
    cy.get('#btn-submit').click()
    cy.contains('Por favor, preencha o campo Nome.').should('be.visible');
  });

  it('Deve preencher todos os campos mas sem assunto', () => {

    cy.get('[name="name"]').type('Sabine Draeger');
    cy.get('[name="email"]').type('sabine@teste.com');
    cy.get('[name="message"]').type('Testes Sabine QA');
    cy.get('#btn-submit').click()
    cy.contains('Por favor, selecione o Assunto.').should('be.visible');
  });

  it('Deve preencher todos os campos mas sem mensagem de teste', () => {

    cy.get('[name="name"]').type('Sabine Draeger');
    cy.get('[name="email"]').type('sabine@teste.com');
    cy.get('[name="subject"]').select('Sugestões');
    cy.get('#btn-submit').click()
    cy.contains('Por favor, escreva sua Mensagem.').should('be.visible');
  });

  it('Deve exibir erro ao enviar formulario vazio', () => {

    cy.get('#btn-submit').click()
    cy.contains('Por favor, preencha o campo Nome.').should('be.visible');
  });

  it('Deve exibir erro ao preencher nome somente com espacos', () => {

    cy.get('[name="name"]').type('   ');
    cy.get('[name="email"]').type('sabine@teste.com');
    cy.get('[name="subject"]').select('Sugestões');
    cy.get('[name="message"]').type('Testes Sabine QA');
    cy.get('#btn-submit').click()
    cy.contains('Por favor, preencha o campo Nome.').should('be.visible');
  });

  it('Deve exibir erro ao preencher mensagem somente com espacos', () => {

    cy.get('[name="name"]').type('Sabine Draeger');
    cy.get('[name="email"]').type('sabine@teste.com');
    cy.get('[name="subject"]').select('Sugestões');
    cy.get('[name="message"]').type('   ');
    cy.get('#btn-submit').click()
    cy.contains('Por favor, escreva sua Mensagem.').should('be.visible');
  });

  it('Deve limpar os campos apos enviar mensagem com sucesso', () => {

    cy.get('[name="name"]').type('Sabine Draeger');
    cy.get('[name="email"]').type('sabine@teste.com');
    cy.get('[name="subject"]').select('Sugestões');
    cy.get('[name="message"]').type('Testes Sabine QA');
    cy.get('#btn-submit').click()
    cy.contains('Contato enviado com sucesso!').should('be.visible');
    cy.get('[name="name"]').should('have.value', '');
    cy.get('[name="email"]').should('have.value', '');
    cy.get('[name="subject"]').should('have.value', '');
    cy.get('[name="message"]').should('have.value', '');
  });

  it('Deve exibir erro quando o servidor nao salvar o contato', () => {

    cy.intercept('POST', '/api/contact', {
      statusCode: 500,
      body: {
        message: 'Erro interno ao salvar contato.'
      }
    }).as('enviarContato');

    cy.get('[name="name"]').type('Sabine Draeger');
    cy.get('[name="email"]').type('sabine@teste.com');
    cy.get('[name="subject"]').select('Sugestões');
    cy.get('[name="message"]').type('Testes Sabine QA');
    cy.get('#btn-submit').click()
    cy.wait('@enviarContato');
    cy.contains('Erro interno ao salvar contato.').should('be.visible');
  });
});
