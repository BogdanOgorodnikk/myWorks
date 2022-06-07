describe("Projects settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/projects`);
  });

  it("Page is visible", () => {
    cy.get("[data-cy=edit-list-item-icon]").first().click();
    cy.get("[data-cy=edit-projects-page]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form fields exist and can edit project", () => {
      cy.get("[data-cy=add-project-button]").click();

      cy.get("[data-cy=project-name-input] input").as("projectName");
      cy.get("@projectName").type("CustomProject");

      cy.get("[data-cy=project-planned-income-input] input").as("plannedIncome");
      cy.get("@plannedIncome").type("100");

      cy.get("[data-cy=project-planned-expense-input] input").as("plannedExpense");
      cy.get("@plannedExpense").type("600");

      //TODO: UNCOMENT WHEN METHO FOR BX24PROJECTS WILL BE WORK

      // cy.get("[data-cy=project-bx24Id-select]").as("bx24Id");
      // cy.get("@bx24Id").click();
      //
      // cy.get("[data-cy=project-bx24Id-select] .multiselect__content-wrapper").as("bx24Id-list");
      //
      // cy.get("@bx24Id-list").should("be.visible");
      //
      // cy.get("@bx24Id-list").find(".multiselect__option").first().click();
      //
      // cy.get("@bx24Id")
      //   .find(".multiselect__single")
      //   .then((language) => {
      //     const languageValue = language.text();
      //
      //     expect(languageValue).length.gt(0);
      //   });

      cy.get("[data-cy=project-comment-textarea] textarea").as("projectComment");
      cy.get("@projectComment").type("projectComment");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=projects-list]").contains("CustomProject").parent().find(".icon-edit").click();

      cy.get("@projectName").should("have.value", "CustomProject").type("CustomProjectTestEdit");
      cy.get("@plannedIncome").should("have.value", "100").type("10");
      cy.get("@plannedExpense").should("have.value", "600").type("60");
      cy.get("@projectComment").should("have.value", "projectComment").type("projectComments");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.url().should("contain", "/settings/projects");
      cy.get("[data-cy=project-page]").should("be.visible");
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=edit-list-item-icon]").first().click();

      cy.get("[data-cy=project-name-input] input").as("projectName");
      cy.get("@projectName").invoke('val').should('not.be.empty');
      cy.get("@projectName").clear();

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=input-error-message]").as("projectNameErrorMsg");

      cy.get("@projectName").should("have.class", "error-input");
      cy.get("@projectNameErrorMsg").should("be.visible");
    });

    it("Delete project in edit page", () => {
      cy.get("[data-cy=edit-list-item-icon]").last().click();

      cy.get("[data-cy=edit-project-dropdown]").click();
      cy.get("[data-cy=dropdown-delete-button]").click();

      cy.get("[data-cy=confirm-modal]").should("be.visible");
      cy.get("[data-cy=accept-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.get("[data-cy=projects-list]").as("projectsList");
      cy.get("@projectsList").find("[data-cy=list-item]").should("not.contain", "TestTestEdit");

      cy.url().should("contain", "/settings/projects");
      cy.get("[data-cy=project-page]").should("be.visible");
    });
  });

  context("Back buttons", () => {
    it("Click on arrow back button", () => {
      cy.get("[data-cy=edit-list-item-icon]").first().click();
      cy.get("[data-cy=arrow-back-button]").click();

      cy.url().should("contain", "/settings/projects");
      cy.get("[data-cy=project-page]").should("be.visible");
    });

    it("Click on back button", () => {
      cy.get("[data-cy=edit-list-item-icon]").first().click();
      cy.get("[data-cy=back-button]").click();

      cy.url().should("contain", "/settings/projects");
      cy.get("[data-cy=project-page]").should("be.visible");
    });
  });
});
