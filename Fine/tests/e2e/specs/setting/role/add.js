describe("Roles settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/roles`);

    cy.get("[data-cy=add-role-button]").click();
    cy.get("[data-cy=role-name-input] input").as("roleName");
  });

  it("Page is visible", () => {
    cy.get("[data-cy=add-role-page]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form work correct and fields can filled", () => {
      cy.get("@roleName").type("TestRole").should("have.value", "TestRole");
      cy.get("[data-cy=role-settings-swich]").click();
      cy.get("[data-cy=role-reports-swich]").click();
      cy.get("[data-cy=role-money-swich]").click();

      cy.get("[data-cy=money-permissions-card]").should("be.visible");

      cy.get("[data-cy=permission-transactions-edit-checkbox]").click();
      cy.get("[data-cy=permission-transactions-delete-checkbox]").click();
      cy.get("[data-cy=permission-transactions-export-checkbox]").click();
      cy.get("[data-cy=permission-transactions-import-checkbox]").click();

      cy.get("[data-cy=bank-account-select]").as("bankAccountSelect");
      cy.get("@bankAccountSelect").click();
      cy.get("[data-cy=bank-account-select] .multiselect__content-wrapper").as("bankAccountList");
      cy.get("@bankAccountList").should("be.visible");
      cy.get("@bankAccountList").find(".multiselect__option").eq(1).click();

      cy.get("[data-cy=projects-select]").click();
      cy.get("[data-cy=projects-select] .multiselect__content-wrapper").as("projectsList");
      cy.get("@projectsList").should("be.visible");
      cy.get("@projectsList").find(".multiselect__option").eq(1).click();

      cy.get("[data-cy=categories-select]").click();
      cy.get("[data-cy=categories-select] .multiselect__content-wrapper").as("categoriesList");
      cy.get("@categoriesList").should("be.visible");
      cy.get("@categoriesList").find(".multiselect__option").eq(1).click();

      cy.get("[data-cy=tags-select]").click();
      cy.get("[data-cy=tags-select] .multiselect__content-wrapper").as("tagsList");
      cy.get("@tagsList").should("be.visible");
      cy.get("@tagsList").find(".multiselect__option").eq(1).click();

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();

      cy.get("[data-cy=roles-page]")
      .find("[data-cy=list-item]").should("contain", "TestRole");
    });

    it("Error if create same role name", () => {
      cy.get("@roleName").type("TestRole").should("have.value", "TestRole");
      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=error-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=submit-button]").click();
      cy.get("[data-cy=input-error-message]").as("roleNameErrorMsg");

      cy.get("@roleName").should("have.class", "error-input");
      cy.get("@roleNameErrorMsg").should("be.visible");
    });
  });

  context("Back buttons", () => {
    it("Click on arrow back button", () => {
      cy.get("[data-cy=arrow-back-button]").click();
      cy.url().should("contain", "/settings/roles");
      cy.get("[data-cy=roles-page]").should("be.visible");
    });

    it("Click on back button", () => {
      cy.get("[data-cy=back-button]").click();
      cy.url().should("contain", "/settings/roles");
      cy.get("[data-cy=roles-page]").should("be.visible");
    });
  });
});
