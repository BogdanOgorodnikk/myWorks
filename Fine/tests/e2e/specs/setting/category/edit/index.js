describe("Categories settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/categories`);
  });

  context("Form fields", () => {
    it("Form fields exist and can edit categories", () => {
      cy.get("[data-cy=add-categories-button]").click();

      cy.get("[data-cy=category-name-input] input").as("categoryName");
      cy.get("@categoryName").type("Test");
      cy.get("@categoryName").should("have.value", "Test");

      cy.get("[data-cy=category-description-input] textarea").as("categoryDescription");
      cy.get("@categoryDescription").type("Test");
      cy.get("@categoryDescription").should("have.value", "Test");

      cy.get("[data-cy=category-type-radio-buttons]").as("categoryTypes");
      cy.get("@categoryTypes").find("label").eq(0).click();

      cy.get("[data-cy=category-activity-radio-buttons]").as("categoryActivity");
      cy.get("@categoryActivity").find("label").eq(0).click();

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.be.visible");

      cy.get("[data-cy=income-card] [data-cy=edit-list-item-icon]").last().click();

      cy.get("@categoryName").should("have.value", "Test");
      cy.get("@categoryName").type("TestEdit");

      cy.get("@categoryDescription").should("have.value", "Test");
      cy.get("@categoryDescription").type("TestEditDescription");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();

      cy.url().should("contain", "/settings/categories");
      cy.get("[data-cy=categories-page]").should("be.visible");
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=edit-list-item-icon]").first().click();

      cy.get("[data-cy=category-name-input] input").as("categoryName");
      cy.get("@categoryName").invoke('val').should('not.be.empty');
      cy.get("@categoryName").clear();

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=input-error-message]").as("categoryNameErrorMsg");

      cy.get("@categoryName").should("have.class", "error-input");
      cy.get("@categoryNameErrorMsg").focused().should("be.visible");
    });

    it("Delete categories in edit page", () => {
      cy.get("[data-cy=income-card] [data-cy=edit-list-item-icon]").last().click();

      cy.get("[data-cy=edit-categories-dropdown]").click();
      cy.get("[data-cy=dropdown-delete-button]").click();

      cy.get("[data-cy=confirm-modal]").should("be.visible");
      cy.get("[data-cy=accept-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();

      cy.url().should("contain", "/settings/categories");
      cy.get("[data-cy=categories-page]").should("be.visible");
    });
  });
});
