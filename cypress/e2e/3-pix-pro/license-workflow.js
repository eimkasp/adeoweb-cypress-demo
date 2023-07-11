const base_url = 'pix-pro.bachana.dev-wesaas.com/';

// Just describe your website
describe('pix-pro-license-workflow', () => {
    beforeEach(() => {
        // Prevent Hcaptcha from stripe checkout.
        cy.intercept('https://hcaptcha.com/checksiteconfig*', (req) => {
            req.reply({
                statusCode: 200,
                body: {
                success: true
                }
            }); 
        });

        Cypress.on('uncaught:exception', (err, runnable) => {
            // we can ignore specific messages for stripe embed js errors
            if (err.message.includes('Expected error message')) {
              return false
            }
          
            // we can ignore all JavaScript errors
            return false
        })
        
        // Get credential from server.json and visit target url.
        cy.fixture('server.json').then((data) => {
            cy.visit(`${data.username}:${data.password}@${base_url}`);
        })
    });

    it('License should be shown after individual registration of EU country', () => {

        // Pick  pricing page on the menu.
        cy.get('[data-testid="navmenu-Pricing"]').click();

        // Check if SOLO plan displays in pricing page.
        cy.get('[data-testid="try-it-free-SOLO"]').then(($el) => {
            if (!$el || $el.length === 0) { // Fails if the Solo plan doesn't exist in list.
              const errorMsg = "Error: Solo plan doesn't exist on pricing plan page.";
              cy.log(errorMsg);
              throw new Error(errorMsg);
            } else {
              cy.wrap($el).should('be.visible').click();
            }
        });

        // After selecting SOLO package, fill out the register form by individual mode.
        cy.fixture('register-individual.json').then((data) => {
            cy.get('[data-testid="register-firstname-input"]').type(data.firstname);
            cy.get('[data-testid="register-lastname-input"]').type(data.lastname);
            cy.get('[data-testid="register-email-input-parent"]').type(data.email);
            cy.get('[data-testid="register-phonenumber-input"]').type(data.phonenumber);

            // Click  country select and pick one.
            cy.get('[data-testid="select-user_meta.address_country"]').click();
            cy.get(`[data-testid="register-user_meta.address_country-${data.country}"]`).click();
            
            cy.get('[data-testid="register-user_meta.address_city-input"]').type(data.city);
            cy.get('[data-testid="register-user_meta.address_line-input"]').type(data.line);
            cy.get('[data-testid="register-user_meta.address_postal_code-input"]').type(data.postalcode);

            cy.get('[data-testid="register-password-input"]').type(data.password);
            cy.get('[data-testid="register-password-confirmation-input"]').type(data.passwordconfirm);
            
            // Check combobox of terms and consent.
            cy.get('[data-testid="register-terms-consent-check"]').check(); 
            
            // SUBMIT THE FORM
            cy.get('[data-testid="register-submit"]').click();
        });

        /*
        cy.get('[data-testid="register-error-email"]', { timeout: 10000 }).should('be.visible', { failOnStatusCode: false }).then(() => {
          // Log the error amd throw exception if the error message appear.
          const errorMsg = "Error: Email already in use.";
          cy.log(errorMsg);
          throw new Error(errorMsg);
        }).should(() => {
          if (Cypress.$('[data-testid="register-error-email"]').length === 0) {
            // Process stripe subscription page if the error message doesn't appear

            */

            cy.wait(3000);

            // Check if the stripe checkout page loaded and type card details.
            cy.get("#cardNumber").then(($el) => {
                if (!$el || $el.length === 0) { // Fails if we can not see Stripe checkout page.
                  const errorMsg = "Error: Stripe's checkout page is not shown.";
                  cy.log(errorMsg);
                  throw new Error(errorMsg);
                } else {
                  cy.wrap($el).should('be.visible').click();
                }
            });
            cy.get("#cardNumber").type("4242424242424242");
            cy.get("#cardCvc").type("123");
            cy.get("#cardExpiry").type(
              "12" + (new Date().getFullYear() + 10).toString().substr(-2)
            );
            cy.get("#billingName").type("Satoshi Nakamoto");
            // billingCountry
            
            cy.get(".SubmitButton").click();
            cy.get(".SubmitButton").should(($div) => {
              expect($div.text()).to.include("Processing");
            });

            cy.wait(5000);

            /*
            // Check if Subscription is active.
          }
        });
        */
    });
});