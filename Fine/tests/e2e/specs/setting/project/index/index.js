describe("Projects settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/projects`);
  });

  it("Page is visible", () => {
    cy.url().should("contain", "/settings/projects");
    cy.get("[data-cy=project-page]").should("be.visible");
  });

  context("Action delete on page", () => {
    it("Delete project", () => {
      cy.get("[data-cy=add-project-button]").click();
      cy.get("[data-cy=add-project-page]").should("be.visible");

      cy.get("[data-cy=project-name-input] input").as("projectName");
      cy.get("@projectName").type("Test");

      cy.get("[data-cy=project-planned-income-input] input").as("plannedIncome");
      cy.get("@plannedIncome").type("1000");

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

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.get("[data-cy=projects-list]").as("projectsList");

      cy.get("[data-cy=list-item]").last().trigger("mouseover");
      cy.get("[data-cy=delete-list-item-icon]").last().invoke("css", "display", "block");
      cy.get("[data-cy=delete-list-item-icon]").last().click();

      cy.get("[data-cy=confirm-modal]").should("be.visible");
      cy.get("[data-cy=accept-button]").click();
      cy.get("[data-cy=confirm-modal]").should("not.exist");

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.get("@projectsList").find("[data-cy=projects-list]").should("not.exist", "Test");
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
