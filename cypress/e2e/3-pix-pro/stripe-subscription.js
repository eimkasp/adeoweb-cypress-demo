const base_url = 'pix-pro.bachana.dev-wesaas.com/';

// Just describe your website
describe('pix-pro-register', () => {
    beforeEach(() => {
        cy.fixture('server.json').then((data) => {
            // Use the data from the file here
            cy.visit(`${data.username}:${data.password}@${base_url}`);
        })
    });

    it('User should be able to subscribe stripe payment after registration.', () => {
        // navigate to register form from home page.
        cy.get('[data-testid="register-button"]').click();

        cy.fixture('register-individual.json').then((data) => {
            // ================== Choose the correct plan with plan id and interval  ===================//
            // plan id: 1, 2, 3     
            // interval: monthly, annual
            cy.get(`[data-testid="subscription-switch-${data.interval}"]`).click();
            cy.get(`[data-testid="subscription-try-plan-${data.plan}-${data.interval}"]`).click();


            // ================== Fill register Form ===================//
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
                    // if ($choice.is(':visible')) {
                      cy.wrap($choice).click();
                    // }
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
            
            cy.get('[data-testid="register-submit"]').click();

            // ================== Fill out subscription checkout form detail ================= //
            // cy.origin('https://checkout.stripe.com', () => {

            //     cy.on('uncaught:exception', (e) => {

            //         if (e.message.includes('Things went bad')) {

            //         // we expected this error, so let's ignore it

            //         // and let the test continue

            //         return false

            //         }

            //     })

            // })
            cy.request(
                "https://checkout.stripe.dev/api/demo-session?country=uk&billingPeriod=monthly&hasBgColor=false&hasBillingAndShipping=false&hasCoupons=false&hasFreeTrial=true&trialPeriodDays=14&hasShippingRate=false&hasTaxes=false&mode=payment&wallet=googlePay&hasPolicies=false&billingType=flat"
              ).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("url");
                cy.visit(response.body.url);
                cy.url().should("contains", "https://checkout.stripe.com/c/pay/");
          
                cy.get("#email").type("SatoshiNakamoto@email.com");
                // cy.get("#cardNumber").type("4242424242424242");
                // cy.get("#cardCvc").type("123");
                // cy.get("#cardExpiry").type(
                //   "12" + (new Date().getFullYear() + 10).toString().substr(-2)
                // );
                // cy.get("#billingName").type("Satoshi Nakamoto");
                // cy.get("#billingPostalCode").type("94043");
          
                // cy.wait(1000);
                // cy.get(".SubmitButton").should(($div) => {
                //   expect($div.text()).to.include("Pay");
                // });
                // cy.get(".SubmitButton").click();
                // cy.get(".SubmitButton").should(($div) => {
                //   expect($div.text()).to.include("Processing");
                // });
              });

            // Wrap commands targeting https://checkout.stripe.com with cy.origin()
            // cy.origin('https://checkout.stripe.com', () => {
                // Enter data into the input form on the checkout page
                // cy.get('#cardNumber').type('4242 4242 4242 4242');
            // });

            // cy.intercept('https://checkout.stripe.com/*').as('checkoutPage');
            // cy.wait(5000);
            // cy.get('#cardNumber').type('4242 4242 4242 4242');
        })
    });
});