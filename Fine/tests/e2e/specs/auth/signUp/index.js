describe("Sign up page", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.visit("/signup");
  });

  it("Page is visible", () => {
    cy.get("[data-cy=signup-page]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form fields exist and can get input data", () => {
      cy.get("[data-cy=first-name-input] input").as("firstName");
      cy.get("[data-cy=phone-input] input").as("phone");
      cy.get("[data-cy=email-input] input").as("email");

      cy.get("@firstName").type("Super").should("have.value", "Super");

      cy.get("@email")
        .type("test_user@e2e.example.com")
        .should("have.value", "test_user@e2e.example.com");

      cy.get("@phone").type("123456789");
      cy.get("@phone").should("have.value", "+380123456789");
    });

    it("Submit with correct data", () => {
      cy.get("[data-cy=first-name-input] input").as("firstName");
      cy.get("[data-cy=phone-input] input").as("phone");
      cy.get("[data-cy=email-input] input").as("email");

      cy.get("@firstName").type("Super");
      cy.get("@phone").type("123456789");
      cy.get("@email").type("test3331user@e2e.example.com");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");

      cy.url().should("contain", "/login");

      cy.get("[data-cy=login-page]").should("be.visible");
    });

    it("Registration error when sending existing email", () => {
      cy.get("[data-cy=first-name-input] input").as("firstName");
      cy.get("[data-cy=phone-input] input").as("phone");
      cy.get("[data-cy=email-input] input").as("email");

      cy.get("@firstName").type("Super");
      cy.get("@phone").type("123456789");
      cy.get("@email").type("user_one@e2e.example.com");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=error-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();

      cy.url().should("contain", "/signup");

      cy.get("[data-cy=signup-page]").should("be.visible");
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=first-name-input] input").as("firstName");
      cy.get("[data-cy=input-error-message]").as("firstNameErrorMsg");

      cy.get("[data-cy=phone-input] input").as("phone");
      cy.get("[data-cy=input-error-message]").as("phoneErrorMsg");

      cy.get("[data-cy=email-input] input").as("email");
      cy.get("[data-cy=input-error-message]").as("emailErrorMsg");

      cy.get("@firstName").should("have.class", "error-input");
      cy.get("@firstNameErrorMsg").should("be.visible");

      cy.get("@phone").should("have.class", "vti__input");
      cy.get("@phoneErrorMsg").should("be.visible");

      cy.get("@email").should("have.class", "error-input");
      cy.get("@emailErrorMsg").should("be.visible");
    });

    it("Form with wrong email can not be submitted", () => {
      cy.get("[data-cy=email-input] input").as("email");

      cy.get("@email").type("test");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=input-error-message]").as("emailErrorMsg");

      cy.get("@email").should("have.class", "error-input");
      cy.get("@emailErrorMsg").should("be.visible");
    });
  });

  context("Link and button", () => {
    it("Followed rules link, and page exist", () => {
      cy.get("[data-cy=rules-link]").should("be.visible");
      cy.get("[data-cy=rules-link]").click();
    });

    it("Followed login link, and page exist", () => {
      cy.get("[data-cy=login-link]").should("be.visible");
      cy.get("[data-cy=login-link]").click();

      cy.url().should("contain", "/login");

      cy.get("[data-cy=login-page]").should("be.visible");
    });
  });
});
