const base_url = 'https://adeoweb.biz/';


// Just describe your website
describe('adeoweb.biz', () => {
    beforeEach(() => {
        cy.visit(base_url);
    });

    it('should have a title', () => {
        cy.title().should('include', 'Adeo Web');
    });

    it('clicking get in touch button in the header, should take me to the contact form and show validatio error', () => {
        cy.get('.d-none.d-lg-block .aw-menu-shout-item').click();

        cy.get('[name="footer_contact[name]"]').should('be.visible');
        cy.get('[name="footer_contact[name]"]').type('eimantas@kasperiunas.com')
    
        cy.get('[name="footer_contact[email]"]').should('be.visible');
        cy.get('[name="footer_contact[email]"]').type('eimantas@kasperiunas.com')
        
        
        cy.get('[name="footer_contact[message]"]').type('eimantas@kasperiunas.com')
        cy.get('[name="footer_contact[submit]"]').click();

        cy.get('.invalid-tooltip').should('be.visible');

    });

    it('clicking get in touch button in the header, should take me to the contact form and show success message', () => {
        cy.get('.d-none.d-lg-block .aw-menu-shout-item').click();

        cy.get('[name="footer_contact[name]"]').should('be.visible');
        cy.get('[name="footer_contact[name]"]').type('Eimantas Kasperiunas')
    
        cy.get('[name="footer_contact[email]"]').should('be.visible');
        cy.get('[name="footer_contact[email]"]').type('eimantas@kasperiunas.com')
        
        
        cy.get('[name="footer_contact[message]"]').type('eimantas@kasperiunas.com')
        cy.get('.privacy-policy-label').click();
        cy.get('[name="footer_contact[submit]"]').click();

        cy.get('#footer-boltforms-message-success').should('be.visible');


    });


});