describe("Categories settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/companies`);

    cy.get("[data-cy=add-companies-button]").click();
    cy.get("[data-cy=company-name-input] input").as("companyName");
  });

  it("Page is visible", () => {
    cy.get("[data-cy=add-companies-page]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form fields exist and can create companies", () => {
      cy.get("@companyName").type("Test");
      cy.get("@companyName").should("have.value", "Test");

      //TODO: UNCOMMENT WHEN METHOD WILL BE WORK

      // cy.get("[data-cy=company-bx24Id-select]").as("bxId");
      // cy.get("@bxId").click();
      //
      // cy.get("[data-cy=company-bx24Id-select] .multiselect__content-wrapper").as(
      //   "bxId-list"
      // );
      //
      // cy.get("@bxId-list").should("be.visible");
      //
      // cy.get("@bxId-list").find(".multiselect__option").first().click();
      //
      // cy.get("@bxId")
      //   .find(".multiselect__single")
      //   .then((currency) => {
      //     const bxIdValue = currency.text();
      //
      //     expect(bxIdValue).length.gt(0);
      //   });

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.get("[data-cy=companies-list]").as("companiesList");
      cy.get("@companiesList").find("[data-cy=list-item]").should("contain", "Test");

      cy.url().should("contain", "/settings/companies");
      cy.get("[data-cy=companies-page]").should("be.visible");
    });

    it("Error if create same companies", () => {
      cy.get("@companyName").type("Test");
      cy.get("@companyName").should("have.value", "Test");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=error-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=input-error-message]").as("companyNameErrorMsg");

      cy.get("@companyName").should("have.class", "error-input");
      cy.get("@companyNameErrorMsg").should("be.visible");
    });
  });

  context("Back buttons", () => {
    it("Click on arrow back button", () => {
      cy.get("[data-cy=arrow-back-button]").click();

      cy.url().should("contain", "/settings/companies");
      cy.get("[data-cy=companies-page]").should("be.visible");
    });

    it("Click on back button", () => {
      cy.get("[data-cy=back-button]").click();

      cy.url().should("contain", "/settings/companies");
      cy.get("[data-cy=companies-page]").should("be.visible");
    });
  });
});
