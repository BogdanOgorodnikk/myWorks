describe("Employee edit page", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit("/business");

    cy.url().should("contain", "/business");
    cy.get("[data-cy=cat-loader]").should("not.exist");
    cy.get("[data-cy=business-box] .business-card").should("be.visible")
  });

  it("Modal is visible", () => {
    cy.get("[data-cy=business-page]").should("be.visible");

    cy.get("[data-cy=add-business-button]").should("be.visible");
    cy.get("[data-cy=add-business-button]").click();

    cy.get("[data-cy=add-business-modal]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form fields exist and can create business", () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=add-business-button]").should("be.visible");
      cy.get("[data-cy=add-business-button]").click();

      cy.get("[data-cy=add-business-modal]").should("be.visible");

      cy.get("[data-cy=company-name-input] input").as("name");
      cy.get("@name").type("Test");

      cy.get("[data-cy=company-currency-select]")
        .find(".multiselect__single")
        .then((currency) => {
          const currencyValue = currency.text();

          expect(currencyValue).length.gt(0);
        });

      cy.intercept('POST', /businesses/, {}).as('businessCreate')
      cy.get("[data-cy=create-business-button]").click();
      cy.wait('@businessCreate').its('request.url');

      // cy.get("[data-cy=success-notify]").should("be.visible");
      // cy.get("[data-cy=close-notify]").click();
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=add-business-button]").should("be.visible");
      cy.get("[data-cy=add-business-button]").click();

      cy.get("[data-cy=add-business-modal]").should("be.visible");

      cy.get("[data-cy=create-business-button]").click();

      cy.get("[data-cy=company-name-input] input").as("name");
      cy.get("[data-cy=input-error-message]").as("nameErrorMsg");

      cy.get("@name").should("have.class", "error-input");
      cy.get("@nameErrorMsg").should("be.visible");
    });
  });
});
