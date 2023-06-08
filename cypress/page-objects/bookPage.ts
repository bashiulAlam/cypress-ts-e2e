class bookPage {
    openHomePage() {
        cy.visit('/');
    }

    login(username : string, password : string) {
        cy.get('#login').click();
        cy.get('#userName').type(username);
        cy.get('#password').type(password);
        cy.get('#login').click();
    }

    validateLogin(username : string) {
        cy.get('#userName-value').should('have.value', username);
    }
}

export default new bookPage();