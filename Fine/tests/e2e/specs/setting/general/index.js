describe("General settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/main`);
    cy.get("[data-cy=cat-loader]").should("not.exist");
  });

  it("Page is visible", () => {
    cy.url().should("contain", "/settings/main");
    cy.get("[data-cy=general-settings-page]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form fields exist and can change general settings", () => {
      cy.get("[data-cy=business-name-input] input").as("businessName");
      cy.get("@businessName").clear();
      cy.get("@businessName").type("Test");

      cy.get("[data-cy=business-currency-input]").should("be.visible");
      cy.get("[data-cy=business-currency-input] input").should("be.disabled");

      cy.get("[data-cy=submit-button]").click();

      //TODO: UNCOMMENT IN FUTURE

      // cy.get("[data-cy=success-notify]").should("be.visible");
      // cy.get("[data-cy=close-notify]").click();
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=business-name-input] input").as("businessName");
      cy.get("@businessName").should("not.have.value", undefined);
      cy.get("@businessName").clear();

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=input-error-message]").as("businessNameErrorMsg");

      cy.get("@businessName").should("have.class", "error-input");
      cy.get("@businessNameErrorMsg").should("be.visible");
    });
  });

  context("Back buttons", () => {
    it("Click on arrow back button", () => {
      cy.get("[data-cy=arrow-back-button]").should("be.visible");
      cy.get("[data-cy=arrow-back-button]").click();

      cy.url().should("contain", "/settings");

      cy.get("[data-cy=settings-page]").should("be.visible");
    });

    it("Click on back button", () => {
      cy.get("[data-cy=back-button]").should("be.visible");
      cy.get("[data-cy=back-button]").click();

      cy.url().should("contain", "/settings");

      cy.get("[data-cy=settings-page]").should("be.visible");
    });
  });
});
