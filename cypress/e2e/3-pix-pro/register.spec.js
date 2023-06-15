const base_url = 'pix-pro.bachana.dev-wesaas.com/';

// Just describe your website
describe('pix-pro-register', () => {
    beforeEach(() => {
        cy.fixture('server.json').then((data) => {
            // Use the data from the file here
            cy.visit(`${data.username}:${data.password}@${base_url}`);
        })
    });

    it('user should be able to register', () => {
        // navigate to register form from home page.
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="signup-button"]').click(); 

        // fill in the form from :
        // register-company.json / Company Registration
        // register-individual.json / Individual Registration
        cy.fixture('register-company.json').then((data) => {
            // Select entity company/individual
            cy.get(`[data-testid="register-entity-${data.entity}"]`).click();

            // Type firstname, lastname, email, phone number.
            cy.get('[data-testid="register-firstname-input"]').type(data.firstname);
            cy.get('[data-testid="register-lastname-input"]').type(data.lastname);
            cy.get('[data-testid="register-email-input-parent"]').type(data.email);
            cy.get('[data-testid="register-phonenumber-input"]').type(data.phonenumber);

            // Click  country select and pick one.
            cy.get('[data-testid="select-user_meta.address_country"]').click();
            cy.get(`[data-testid="register-user_meta.address_country-${data.country}"]`).click();

            // Click  state select and pick one.
            if('state' in data && data.state != ''){
                cy.get('[data-testid="select-user_meta.address_state"]').then(($select) => {
                    if ($select.is(':visible')) {
                      cy.wrap($select).click();
                    }
                });
                cy.get(`[data-testid="register-user_meta.address_state-${data.state}"]`).then(($choice) => {
                    if ($choice.is(':visible')) {
                      cy.wrap($choice).click();
                    }
                });
            }
            
            cy.get('[data-testid="register-user_meta.address_city-input"]').type(data.city);
            cy.get('[data-testid="register-user_meta.address_line-input"]').type(data.line);
            cy.get('[data-testid="register-user_meta.address_postal_code-input"]').type(data.postalcode);

            cy.get('[data-testid="register-password-input"]').type(data.password);
            cy.get('[data-testid="register-password-confirmation-input"]').type(data.passwordconfirm);
            
            cy.get('[data-testid="register-terms-consent-check"]').check(); // Check terms and policy consent. 
          
            if(data.entity == "company") { // If the entity type is company, type company name, company vat, company registration number.
                cy.get('[data-testid="register-user_meta.company_name-input"]').type(data.companyname);
                cy.get('[data-testid="register-user_meta.company_vat-input"]').type(data.companyvat);
                cy.get('[data-testid="register-user_meta.company_registration_number-input"]').type(data.compnayregnum);
            }

            // CLoudflare reCaptcha Tricking..
            // cy.get('.cf-turnstile iframe')
            //     .should('be.visible')
            //     .then(($iframe) => {
            //         cy.frameLoaded($iframe)
            //         .its('0.contentDocument.body')
            //         .then(cy.wrap)
            //         .find('input[type="checkbox"]')
            //         .should('be.visible')
            //         .check();
            //     });
            
            // cy.iframe('iframe-selector').then($iframe => {
            //     const iframeBody = $iframe.contents().find('body');
            //     cy.wrap(iframeBody).find('button').click();
            //   });
            
            cy.get('[data-testid="register-submit"]').click();
        })
    });
});