describe("Tags settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/tags`);
  });

  it("Page is visible", () => {
    cy.get("[data-cy=edit-list-item-icon]").first().click();
    cy.get("[data-cy=edit-tags-page]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form fields exist and can edit tag", () => {
      cy.get("[data-cy=add-tag-button]").click();

      cy.get("[data-cy=tag-name-input] input").as("tagName");
      cy.get("@tagName").type("Test").should("have.value", "Test");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.get("[data-cy=tags-list]").contains("Test").parent().find(".icon-edit").click();

      cy.get("@tagName").should("have.value", "Test").type("TestEdit");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.url().should("contain", "/settings/tags");
      cy.get("[data-cy=tags-page]").should("be.visible");

      cy.get("[data-cy=tags-list]").as("tagsList");
      cy.get("@tagsList").find("[data-cy=list-item]").should("contain", "TestTestEdit");
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=edit-list-item-icon]").first().click();

      cy.get("[data-cy=tag-name-input] input").as("tagName");
      cy.get("@tagName").invoke('val').should('not.be.empty');
      cy.get("@tagName").clear();

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=input-error-message]").as("tagNameErrorMsg");

      cy.get("@tagName").should("have.class", "error-input");
      cy.get("@tagNameErrorMsg").should("be.visible");
    });

    it("Delete tag in edit page", () => {
      cy.get("[data-cy=edit-list-item-icon]").last().click();

      cy.get("[data-cy=edit-tag-dropdown]").click();
      cy.get("[data-cy=dropdown-delete-button]").click();

      cy.get("[data-cy=confirm-modal]").should("be.visible");
      cy.get("[data-cy=accept-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.get("[data-cy=tags-list]").as("tagsList");
      cy.get("@tagsList").find("[data-cy=list-item]").should("not.contain", "TestTestEdit");

      cy.url().should("contain", "/settings/tags");
      cy.get("[data-cy=tags-page]").should("be.visible");
    });
  });

  context("Back buttons", () => {
    it("Click on arrow back button", () => {
      cy.get("[data-cy=edit-list-item-icon]").first().click();
      cy.get("[data-cy=arrow-back-button]").click();

      cy.url().should("contain", "/settings/tags");
      cy.get("[data-cy=tags-page]").should("be.visible");
    });

    it("Click on back button", () => {
      cy.get("[data-cy=edit-list-item-icon]").first().click();
      cy.get("[data-cy=back-button]").click();

      cy.url().should("contain", "/settings/tags");
      cy.get("[data-cy=tags-page]").should("be.visible");
    });
  });
});
