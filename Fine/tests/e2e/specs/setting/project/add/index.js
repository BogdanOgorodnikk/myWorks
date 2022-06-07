describe("Projects settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/projects`);

    cy.get("[data-cy=add-project-button]").click();
    cy.get("[data-cy=project-name-input] input").as("projectName");
    cy.get("[data-cy=project-planned-income-input] input").as("plannedIncome");
    cy.get("[data-cy=project-planned-expense-input] input").as("plannedExpense");
    cy.get("[data-cy=project-comment-textarea] textarea").as("projectComment");
  });

  it("Page is visible", () => {
    cy.get("[data-cy=add-project-page]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form fields exist and can create projects", () => {
      cy.get("@projectName").type("Test").should("have.value", "Test");
      cy.get("@plannedIncome").type("100").should("have.value", "100");
      cy.get("@plannedExpense").type("600").should("have.value", "600");
      cy.get("@projectComment").type("TestComment").should("have.value", "TestComment");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.get("[data-cy=projects-list]").as("projectsList");
      cy.get("@projectsList").find("[data-cy=list-item]").should("contain", "Test");

      cy.url().should("contain", "/settings/projects");
      cy.get("[data-cy=project-page]").should("be.visible");
    });

    it("Error if create same project", () => {
      cy.get("@projectName").type("Test").should("have.value", "Test");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=error-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=input-error-message]").as("projectNameErrorMsg");

      cy.get("@projectName").should("have.class", "error-input");
      cy.get("@projectNameErrorMsg").should("be.visible");
    });
  });

  context("Back buttons", () => {
    it("Click on arrow back button", () => {
      cy.get("[data-cy=arrow-back-button]").click();

      cy.url().should("contain", "/settings/projects");
      cy.get("[data-cy=project-page]").should("be.visible");
    });

    it("Click on back button", () => {
      cy.get("[data-cy=back-button]").click();

      cy.url().should("contain", "/settings/projects");
      cy.get("[data-cy=project-page]").should("be.visible");
    });
  });
});
