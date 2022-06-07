describe("Categories settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/categories`);
  });

  it("Page is visible", () => {
    cy.url().should("contain", "/settings/categories");
    cy.get("[data-cy=categories-page]").should("be.visible");
  });

  context("Action delete on page", () => {
    it("Delete categories", () => {
      cy.get("[data-cy=add-categories-button]").click();
      cy.get("[data-cy=add-categories-page]").should("be.visible");

      cy.get("[data-cy=category-name-input] input").as("categoryName");
      cy.get("@categoryName").type("Test124124111");

      cy.get("[data-cy=category-type-radio-buttons]").as("categoryTypes");
      cy.get("@categoryTypes").find("label").eq(0).click();

      cy.get("[data-cy=category-activity-radio-buttons]").as("categoryActivity");
      cy.get("@categoryActivity").find("label").eq(0).click();

      cy.get("[data-cy=submit-button]").click();
      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.be.visible");

      cy.get("[data-cy=income-card] [data-cy=edit-list-item-icon]").last().trigger("mouseover");
      cy.get("[data-cy=income-card] [data-cy=delete-list-item-icon]")
        .last()
        .invoke("css", "display", "block");
      cy.get("[data-cy=income-card] [data-cy=delete-list-item-icon]").last().click();

      cy.get("[data-cy=confirm-modal]").should("be.visible");
      cy.get("[data-cy=accept-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
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
