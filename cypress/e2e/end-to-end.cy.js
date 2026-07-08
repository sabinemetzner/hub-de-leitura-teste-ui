const { faker } = require('@faker-js/faker');

describe('Fluxo end to end de cadastro e login', () => {
  beforeEach(() => {
    cy.encerrarSessao();
  });

  it('deve cadastrar usuarios da fixture e fazer login com as mesmas credenciais', () => {
    cy.fixture('usuarios-e2e').then((usuarios) => {
      usuarios.forEach((massa) => {
        const usuario = {
          ...massa,
          nome: `${massa.nome} ${faker.person.lastName()}`,
          email: `${massa.emailPrefixo}.${faker.string.uuid()}@teste.com`,
        };

        cy.cadastrarUsuario(usuario);
        cy.validarUsuarioLogado(usuario.nome);

        cy.encerrarSessao();

        cy.loginUsuario(usuario);
        cy.validarUsuarioLogado(usuario.nome);

        cy.encerrarSessao();
      });
    });
  });
});
