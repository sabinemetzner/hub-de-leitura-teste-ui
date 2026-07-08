const { faker } = require('@faker-js/faker');

describe('Criação de conta', () => {

    beforeEach(() => {
        cy.visit('/index.html');
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.reload();
    });

    it('Deve preencher todos os campos e criar conta', () => {

        const nome = faker.person.fullName();
        const email = faker.internet.email();
        const senha = faker.internet.password({ length: 8 });

        cy.get('#account-link').click();
        cy.get('[href="/register.html"]').click();
        cy.get('#name').type(nome);
        cy.get('#email').type(email);
        cy.get('#password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#confirm-password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#terms-agreement').check();
        cy.get('#register-btn').click();
        cy.contains('Conta criada com sucesso!').should('be.visible');

        cy.get('h4').should('contain.text', `Olá, ${nome}!`);
    })

    it('Deve preencher todos os campos mas com email invalido', () => {

        const nome = faker.person.fullName();
        const senha = faker.internet.password({ length: 8 });

        cy.get('#account-link').click();
        cy.get('[href="/register.html"]').click();
        cy.get('#name').type(nome);
        cy.get('#email').type('email-invalido');
        cy.get('#password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#confirm-password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#terms-agreement').check();
        cy.get('#register-btn').click();
        cy.contains('Email válido é obrigatório').should('be.visible');
    })

    it('Deve preencher todos os campos mas sem email', () => {

        const nome = faker.person.fullName();
        const senha = faker.internet.password({ length: 8 });

        cy.get('#account-link').click();
        cy.get('[href="/register.html"]').click();
        cy.get('#name').type(nome);
        cy.get('#password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#confirm-password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#terms-agreement').check();
        cy.get('#register-btn').click();
        cy.contains('Email válido é obrigatório').should('be.visible');
    })

    it('Deve preencher todos os campos mas sem nome', () => {

        const email = faker.internet.email();
        const senha = faker.internet.password({ length: 8 });

        cy.get('#account-link').click();
        cy.get('[href="/register.html"]').click();
        cy.get('#email').type(email);
        cy.get('#password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#confirm-password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#terms-agreement').check();
        cy.get('#register-btn').click();
        cy.contains('Nome deve ter pelo menos 2 caracteres').should('be.visible');
    })

    it('Deve preencher todos os campos mas sem senha', () => {

        const nome = faker.person.fullName();
        const email = faker.internet.email();
        const senha = faker.internet.password({ length: 8 });

        cy.get('#account-link').click();
        cy.get('[href="/register.html"]').click();
        cy.get('#name').type(nome);
        cy.get('#email').type(email);
        cy.get('#confirm-password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#terms-agreement').check();
        cy.get('#register-btn').click();
        cy.get('#password').should('have.class', 'is-invalid');
    })

    it('Deve preencher todos os campos mas sem confirmar senha', () => {

        const nome = faker.person.fullName();
        const email = faker.internet.email();
        const senha = faker.internet.password({ length: 8 });

        cy.get('#account-link').click();
        cy.get('[href="/register.html"]').click();
        cy.get('#name').type(nome);
        cy.get('#email').type(email);
        cy.get('#password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#terms-agreement').check();
        cy.get('#register-btn').click();
        cy.contains('Senhas não coincidem').should('be.visible');
    })

    it('Deve exibir erro ao enviar formulario vazio', () => {

        cy.get('#account-link').click();
        cy.get('[href="/register.html"]').click();
        cy.get('#register-btn').click();
        cy.contains('Nome deve ter pelo menos 2 caracteres').should('be.visible');
    })

    it('Deve exibir erro ao preencher senha com menos de 6 caracteres', () => {

        const nome = faker.person.fullName();
        const email = faker.internet.email();
        const senha = '12345';

        cy.get('#account-link').click();
        cy.get('[href="/register.html"]').click();
        cy.get('#name').type(nome);
        cy.get('#email').type(email);
        cy.get('#password').type(senha, { log: false });
        cy.get('#confirm-password').type(senha, { log: false });
        cy.get('#terms-agreement').check();
        cy.get('#register-btn').click();
        cy.get('#password').should('have.class', 'is-invalid');
    })

    it('Deve exibir erro quando as senhas forem diferentes', () => {

        const nome = faker.person.fullName();
        const email = faker.internet.email();
        const senha = faker.internet.password({ length: 8 });

        cy.get('#account-link').click();
        cy.get('[href="/register.html"]').click();
        cy.get('#name').type(nome);
        cy.get('#email').type(email);
        cy.get('#password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#confirm-password').type('senhaDiferente123', { log: false });
        cy.get('#terms-agreement').check();
        cy.get('#register-btn').click();
        cy.contains('Senhas não coincidem').should('be.visible');
    })

    it('Deve exibir erro ao criar conta sem aceitar os termos de uso', () => {

        const nome = faker.person.fullName();
        const email = faker.internet.email();
        const senha = faker.internet.password({ length: 8 });

        cy.get('#account-link').click();
        cy.get('[href="/register.html"]').click();
        cy.get('#name').type(nome);
        cy.get('#email').type(email);
        cy.get('#password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#confirm-password').type(senha, { parseSpecialCharSequences: false, log: false });
        cy.get('#register-btn').click();
        cy.contains('Você deve aceitar os termos de uso').should('be.visible');
    })
})
