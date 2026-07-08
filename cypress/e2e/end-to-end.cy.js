const { faker } = require('@faker-js/faker');

describe('Fluxo end to end de cadastro e login', () => {
  beforeEach(() => {
    cy.encerrarSessao();
  });

  it('deve cadastrar e depois realizar login com o usuario recem-cadastrado', () => {
    const usuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      senha: faker.internet.password({ length: 10 }),
    };

    cy.cadastrarUsuario(usuario);
    cy.validarUsuarioLogado(usuario.nome);

    cy.encerrarSessao();

    cy.loginUsuario(usuario);
    cy.validarUsuarioLogado(usuario.nome);
  });
});
