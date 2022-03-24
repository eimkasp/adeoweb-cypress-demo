var base_url = 'https://adeoweb.biz/';

describe('example to-do app', () => {
    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.visit(base_url);

    });

    it('Visit homepage it should have correct title', () => {
        // We use the `cy.title()` command to get the title of the current page.
        // Then, we use `should` to assert that the title is correct.
        cy.title().should('include', 'Adeo Web');
    });

});