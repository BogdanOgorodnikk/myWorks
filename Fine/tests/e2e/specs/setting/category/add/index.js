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

    cy.get("[data-cy=add-categories-button]").click();
    cy.get("[data-cy=add-categories-page]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form fields exist and can create categories", () => {
      cy.get("[data-cy=add-categories-button]").click();

      cy.get("[data-cy=category-name-input] input").as("categoryName");
      cy.get("@categoryName").type("Test");

      cy.get("[data-cy=category-description-input] textarea").as("categoryDescription");
      cy.get("@categoryDescription").type("Test description");

      cy.get("[data-cy=category-type-radio-buttons]").as("categoryTypes");
      cy.get("@categoryTypes").find("label").eq(1).click();

      cy.get("[data-cy=category-activity-radio-buttons]").as("categoryActivities");
      cy.get("@categoryActivities").find("label").eq(1).click();

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();

      cy.reload();

      cy.get("[data-cy=expense-list]").as("expenseList");
      cy.get("@expenseList").find("[data-cy=list-item]").should("contain", "Test");

      cy.url().should("contain", "/settings/categories");
      cy.get("[data-cy=categories-page]").should("be.visible");
    });

    it("Error if create same categories", () => {
      cy.get("[data-cy=add-categories-button]").click();

      cy.get("[data-cy=category-name-input] input").as("categoryName");
      cy.get("@categoryName").type("Test");

      cy.get("[data-cy=category-type-radio-buttons]").as("categoryTypes");
      cy.get("@categoryTypes").find("label").eq(1).click();

      cy.get("[data-cy=category-activity-radio-buttons]").as("categoryActivities");
      cy.get("@categoryActivities").find("label").eq(1).click();

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=error-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=add-categories-button]").click();

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=category-name-input] input").as("categoryName");
      cy.get("[data-cy=input-error-message]").as("categoryNameErrorMsg");

      cy.get("@categoryName").should("have.class", "error-input");

      cy.get("@categoryNameErrorMsg").focused().should("be.visible");
    });
  });
});
