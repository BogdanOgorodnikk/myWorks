describe("Categories settings", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/settings/companies`);
  });

  it("Page is visible", () => {
    cy.get("[data-cy=edit-list-item-icon]").first().click();
    cy.get("[data-cy=edit-companies-page]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form fields exist and can edit companies", () => {
      cy.get("[data-cy=add-companies-button]").click();

      cy.get("[data-cy=company-name-input] input").as("companyName");
      cy.get("@companyName").type("Test");
      cy.get("@companyName").should("have.value", "Test");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.get("[data-cy=edit-list-item-icon]").last().click();

      cy.get("@companyName").should("have.value", "Test");
      cy.get("@companyName").type("TestEdit");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.url().should("contain", "/settings/companies");
      cy.get("[data-cy=companies-page]").should("be.visible");

      cy.get("[data-cy=companies-list]").as("companiesList");
      cy.get("@companiesList").find("[data-cy=list-item]").should("contain", "TestTestEdit");
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=edit-list-item-icon]").first().click();

      cy.get("[data-cy=company-name-input] input").as("companyName");
      cy.get("@companyName").invoke('val').should('not.be.empty');
      cy.get("@companyName").clear();

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=input-error-message]").as("companyNameErrorMsg");

      cy.get("@companyName").should("have.class", "error-input");
      cy.get("@companyNameErrorMsg").should("be.visible");
    });

    it("Delete categories in edit page", () => {
      cy.get("[data-cy=edit-list-item-icon]").first().click();

      cy.get("[data-cy=edit-companies-dropdown]").click();
      cy.get("[data-cy=dropdown-delete-button]").click();

      cy.get("[data-cy=confirm-modal]").should("be.visible");

      cy.get("[data-cy=accept-delete-transactions] input").should("not.be.checked");
      cy.get("[data-cy=accept-delete-transactions] input").click().should("be.checked");

      cy.get("[data-cy=accept-delete-company-account] input").should("not.be.checked");
      cy.get("[data-cy=accept-delete-company-account] input").click().should("be.checked");

      cy.get("[data-cy=accept-recalculate-balance] input").should("not.be.checked");
      cy.get("[data-cy=accept-recalculate-balance] input").click().should("be.checked");

      cy.get("[data-cy=accept-change-reports] input").should("not.be.checked");
      cy.get("[data-cy=accept-change-reports] input").click().should("be.checked");

      cy.get("[data-cy=accept-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
      cy.get("[data-cy=success-notify]").should("not.exist");

      cy.url().should("contain", "/settings/companies");
      cy.get("[data-cy=companies-page]").should("be.visible");
    });
  });

  context("Back buttons", () => {
    it("Click on arrow back button", () => {
      cy.get("[data-cy=edit-list-item-icon]").first().click();
      cy.get("[data-cy=arrow-back-button]").click();

      cy.url().should("contain", "/settings/companies");
      cy.get("[data-cy=companies-page]").should("be.visible");
    });

    it("Click on back button", () => {
      cy.get("[data-cy=edit-list-item-icon]").first().click();
      cy.get("[data-cy=back-button]").click();

      cy.url().should("contain", "/settings/companies");
      cy.get("[data-cy=companies-page]").should("be.visible");
    });
  });
});
