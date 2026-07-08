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

  it('deve preencher e autenticar usando as contas demo da tela', () => {
    cy.fixture('login').then(({ contasDemo }) => {
      contasDemo.forEach((usuario) => {
        cy.log(`Cenario: ${usuario.cenario}`);
        cy.intercept('POST', '/api/login').as('loginContaDemo');

        loginPage.acessar();
        loginPage.usarContaDemo(usuario.email);
        loginPage.validarCamposPreenchidos(usuario);
        loginPage.enviar();

        cy.wait('@loginContaDemo')
          .its('response.statusCode')
          .should('eq', 200);

        loginPage.validarLoginConcluido();
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

  it('deve permitir mostrar e ocultar a senha digitada', () => {
    cy.fixture('login').then(({ senhaVisivel }) => {
      loginPage.acessar();
      loginPage.preencherFormulario(senhaVisivel);
      loginPage.validarTipoCampoSenha('password');

      loginPage.alternarVisibilidadeSenha();
      loginPage.validarTipoCampoSenha('text');

      loginPage.alternarVisibilidadeSenha();
      loginPage.validarTipoCampoSenha('password');
    });
  });

  it('deve informar quando ja existe usuario logado', () => {
    cy.fixture('login').then(({ positivos }) => {
      const usuario = positivos[0];

      cy.loginUsuario(usuario);
      cy.visit('/login.html');
      loginPage.validarUsuarioJaLogado(usuario.nome);
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
