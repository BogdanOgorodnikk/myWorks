describe("tags settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/tags`);

    cy.get("[data-cy=add-tag-button]").click();
    cy.get("[data-cy=tag-name-input] input").as("tagName");
    cy.get("[data-cy=tag-comment-textarea] textarea").as("tagComment");
  });

  it("Page is visible", () => {
    cy.get("[data-cy=add-tag-page]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form fields exist and can create tags", () => {
      cy.get("@tagName").type("Test").should("have.value", "Test");

      cy.get("@tagComment").type("TestComment").should("have.value", "TestComment");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.get("[data-cy=tags-list]").as("tagsList");
      cy.get("@tagsList").find("[data-cy=list-item]").should("contain", "Test");

      cy.url().should("contain", "/settings/tags");
      cy.get("[data-cy=tags-page]").should("be.visible");
    });

    it("Error if create same tag", () => {
      cy.get("@tagName").type("Test").should("have.value", "Test");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=error-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=input-error-message]").as("tagNameErrorMsg");

      cy.get("@tagName").should("have.class", "error-input");
      cy.get("@tagNameErrorMsg").should("be.visible");
    });
  });

  context("Back buttons", () => {
    it("Click on arrow back button", () => {
      cy.get("[data-cy=arrow-back-button]").click();

      cy.url().should("contain", "/settings/tags");
      cy.get("[data-cy=tags-page]").should("be.visible");
    });

    it("Click on back button", () => {
      cy.get("[data-cy=back-button]").click();

      cy.url().should("contain", "/settings/tags");
      cy.get("[data-cy=tags-page]").should("be.visible");
    });
  });
});
