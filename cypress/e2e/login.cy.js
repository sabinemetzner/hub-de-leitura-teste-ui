const loginPage = require('../pages/LoginPage');

describe('Login', () => {
  beforeEach(() => {
    cy.encerrarSessao();
  });

  it('deve realizar login com credenciais validas', () => {
    cy.fixture('login').then(({ positivos }) => {
      positivos.forEach((usuario) => {
        cy.log(`Cenario: ${usuario.cenario}`);

        cy.loginUsuario(usuario);
        cy.location('pathname', { timeout: 10000 }).should('eq', usuario.redirecionamento);

        cy.encerrarSessao();
      });
    });
  });

  it('deve exibir erro para credenciais invalidas', () => {
    cy.fixture('login').then(({ negativosApi }) => {
      negativosApi.forEach((usuario) => {
        cy.log(`Cenario: ${usuario.cenario}`);

        cy.tentarLoginUsuario(usuario);
        loginPage.validarMensagemErro(usuario.mensagem);
        loginPage.validarPermaneceNoLogin();

        cy.encerrarSessao();
      });
    });
  });

  it('deve validar campos obrigatorios e email invalido', () => {
    cy.fixture('login').then(({ negativosFormulario }) => {
      negativosFormulario.forEach((cenario) => {
        cy.log(`Cenario: ${cenario.cenario}`);

        loginPage.acessar();
        loginPage.preencherFormulario(cenario);
        loginPage.enviar();
        loginPage.validarCampoInvalido(cenario.campoInvalido);
        loginPage.validarPermaneceNoLogin();

        cy.encerrarSessao();
      });
    });
  });
});
