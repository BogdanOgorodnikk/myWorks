describe("Tags settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/tags`);
  });

  it("Page is visible", () => {
    cy.url().should("contain", "/settings/tags");
    cy.get("[data-cy=tags-page]").should("be.visible");
  });

  context("Action delete on page", () => {
    it("Delete tags", () => {
      cy.get("[data-cy=add-tag-button]").click();
      cy.get("[data-cy=add-tag-page]").should("be.visible");

      cy.get("[data-cy=tag-name-input] input").as("tagName");
      cy.get("@tagName").type("Test");

      cy.get("[data-cy=tag-comment-textarea] textarea").as("tagComment");
      cy.get("@tagComment").type("TestComment");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.get("[data-cy=list-item]").last().trigger("mouseover");
      cy.get("[data-cy=delete-list-item-icon]").last().invoke("css", "display", "block");
      cy.get("[data-cy=delete-list-item-icon]").last().click();

      cy.get("[data-cy=confirm-modal]").should("be.visible");
      cy.get("[data-cy=accept-button]").click();
      cy.get("[data-cy=confirm-modal]").should("not.exist");

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.get("[data-cy=tags-list]").as("tagsList");
      cy.get("@tagsList").find("[data-cy=list-item]").should("not.contain", "Test");
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
