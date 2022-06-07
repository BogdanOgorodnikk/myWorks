describe("Employee edit page", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit("/business");

    cy.url().should("contain", "/business");
  });

  it("page is visible", () => {
    cy.get("[data-cy=business-page]").should("be.visible");
  });

  context("Login in business", () => {
    it("Form fields exist and can change user profile", () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=business-page]").find(".business-card").first().as("business-card");

      cy.get("@business-card").find(".business-card-login-button").click();
    });
  });
});
