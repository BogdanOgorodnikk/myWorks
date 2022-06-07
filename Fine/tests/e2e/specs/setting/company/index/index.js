describe("Companies settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/companies`);
  });

  it("Page is visible", () => {
    cy.url().should("contain", "/settings/companies");
    cy.get("[data-cy=companies-page]").should("be.visible");
  });

  context("Action delete on page", () => {
    it("Delete companies", () => {
      cy.get("[data-cy=add-companies-button]").click();
      cy.get("[data-cy=add-companies-page]").should("be.visible");

      cy.get("[data-cy=company-name-input] input").as("companyName");
      cy.get("@companyName").type("Test");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.get("[data-cy=list-item]").last().trigger("mouseover");
      cy.get("[data-cy=delete-list-item-icon]").last().invoke("css", "display", "block");
      cy.get("[data-cy=delete-list-item-icon]").last().click();

      cy.get("[data-cy=confirm-modal]").should("be.visible");

      cy.get("[data-cy=accept-delete-transactions] input").should("not.be.checked");
      cy.get("[data-cy=accept-delete-transactions] input").click().should("be.checked");

      cy.get("[data-cy=accept-delete-company-account] input").should("not.be.checked");
      cy.get("[data-cy=accept-delete-company-account] input").click().should("be.checked");

      cy.get("[data-cy=accept-recalculate-balance] input").should("not.be.checked");
      cy.get("[data-cy=accept-recalculate-balance] input").click().should("be.checked");

      cy.get("[data-cy=accept-change-reports] input").should("not.be.checked");
      cy.get("[data-cy=accept-change-reports] input").click().should("be.checked");


      cy.get("[data-cy=accept-button]").click();
      cy.get("[data-cy=confirm-modal]").should("not.exist");

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");
    });
  });

  context("Back buttons", () => {
    it("Click on arrow back button", () => {
      cy.get("[data-cy=arrow-back-button]").click();

      cy.url().should("contain", "/settings");
      cy.get("[data-cy=settings-page]").should("be.visible");
    });
  });
});
