describe("Add transaction", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_one@e2e.example.com");
    cy.visit(`/${Cypress.env("e2eAppName")}/transactions`);
  });

  it("Page is visible", () => {
    cy.url().should("contain", "/transactions");
    cy.get("[data-cy=transactions-page]").should("be.visible");
  });

  context("Add expense transaction", () => {
    it("Form work correct", () => {
      cy.get("[data-cy=expense-button]").click();
      cy.get("[data-cy=transaction-form]").should("be.visible");

      cy.get("[data-cy=money-input-base-currency]").as("moneyInputBaseCurrency");
      cy.get("@moneyInputBaseCurrency").clear().type("45,29")

      cy.get("[data-cy=contragent-select]").as("contragentSelect");
      cy.get("@contragentSelect").click();
      cy.get("[data-cy=contragent-select] .multiselect__content-wrapper").as("contragentList");
      cy.get("@contragentList").should("be.visible");
      cy.get("@contragentList").find(".multiselect__option").eq(1).click();
      cy.get("@contragentSelect")
        .find(".multiselect__single")
        .then((contragent) => {
          const contragentValue = contragent.text();

          expect(contragentValue).length.gt(0);
        });

      cy.get("[data-cy=payment-datepicker-checkbox] input").should("be.checked");
      cy.get("[data-cy=payment-datepicker-checkbox] input").click().should("not.be.checked");

      cy.get("[data-cy=transaction-form-more-button] .wrapper").first().click();
      cy.get("[data-cy=accrual-datepicker]").should("be.visible").click();
      cy.get("[data-cy=accrual-datepicker] .calendar-day-button").first().click();
      cy.get("[data-cy=accrual-datepicker-checkbox] input").should("not.be.checked");
      cy.get("[data-cy=accrual-datepicker-checkbox] input").click().should("be.checked");

      cy.get("[data-cy=transaction-form-more-button] .wrapper").first().click();
      cy.get("[data-cy=recurring-form]").should("be.visible");
      cy.get("[data-cy=recurring-select]").as("recurringSelect");
      cy.get("@recurringSelect").click();
      cy.get("[data-cy=recurring-select] .multiselect__content-wrapper").as("recurringList");
      cy.get("@recurringList").should("be.visible");
      cy.get("@recurringList").find(".multiselect__option").eq(1).click();
      cy.get("@recurringSelect")
        .find(".multiselect__single")
        .then((recurring) => {
          const recurringValue = recurring.text();

          expect(recurringValue).length.gt(0);
        });
      cy.get("[data-cy=recurring-datepicker-checkbox] input").should("not.be.checked");
      cy.get("[data-cy=recurring-datepicker-checkbox] input").click().should("be.checked");
      cy.get("[data-cy=stop-recurring-datepicker]").should("be.visible").click();
      cy.get("[data-cy=stop-recurring-datepicker] .calendar-day-button").first().click();

      cy.get("[data-cy=transaction-form-more-button] .wrapper").first().click();
      cy.get("[data-cy=extra-fields-form]").should("be.visible");

      cy.get("[data-cy=project-select]").as("projectSelect");
      cy.get("@projectSelect").click();
      cy.get("[data-cy=project-select] .multiselect__content-wrapper").as("projectList");
      cy.get("@projectList").should("be.visible");
      cy.get("@projectList").find(".multiselect__option").eq(0).click();
      cy.get("@projectSelect")
        .find(".multiselect__single")
        .then((project) => {
          const projectValue = project.text();

          expect(projectValue).length.gt(0);
        });

      cy.get("[data-cy=tags-multiselect]").as("tagsMultiselect");
      cy.get("@tagsMultiselect").click();
      cy.get("[data-cy=tags-multiselect] .multiselect__content-wrapper").as("tagsList");
      cy.get("@tagsList").should("be.visible");
      cy.get("@tagsList").find(".multiselect__option").eq(1).click();
      cy.get("@tagsMultiselect").find(".tags").should("have.length", 1);

      cy.get("[data-cy=description-textarea] textarea").as("descriptionTextarea");
      cy.get("@descriptionTextarea").type("Test");
      cy.get("@descriptionTextarea").click().should("have.value", "Test");

      cy.get("[data-cy=submit-button]").click();

      // cy.get("tbody>tr").should("contain", "–45,29").and("contain", "Test")
      // TODO: Uncomment in future
    });

    it("Expense form should not be empty", () => {
      cy.get("[data-cy=expense-button]").click();
      cy.get("[data-cy=transaction-form]").should("be.visible");

      cy.get("[data-cy=bank-account-select] .multiselect__single").should("not.have.text", 'undefined');
      cy.get("[data-cy=bank-account-select] .svg-icon").click();

      cy.get("[data-cy=categories-select] .svg-icon").click();
      cy.get("[data-cy=categories-select] .svg-icon").click();

      cy.get("[data-cy=payment-datepicker]").click();
      cy.get("[data-cy=payment-datepicker] .calendar-day-button").find("[aria-current=date]").click();

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=money-input-block] .error-message").scrollIntoView().should("be.visible");
      cy.get("[data-cy=bank-account-select] .error-message").should("be.visible");
      cy.get("[data-cy=categories-select] .error-message").scrollIntoView().should("be.visible");
      cy.get("[data-cy=payment-datepicker] .error-message").should("be.visible");
    });
  });

  context("Add income transaction", () => {
    it("Form work correct", () => {
      cy.get("[data-cy=income-button]").click();
      cy.get("[data-cy=transaction-form]").should("be.visible");

      cy.get("[data-cy=money-input-base-currency]").as("moneyInputBaseCurrency");
      cy.get("@moneyInputBaseCurrency").clear().type("78,43");

      cy.get("[data-cy=contragent-select]").as("contragentSelect");
      cy.get("@contragentSelect").click();
      cy.get("[data-cy=contragent-select] .multiselect__content-wrapper").as("contragentList");
      cy.get("@contragentList").should("be.visible");
      cy.get("@contragentList").find(".multiselect__option").eq(1).click();
      cy.get("@contragentSelect")
        .find(".multiselect__single")
        .then((contragent) => {
          const contragentValue = contragent.text();

          expect(contragentValue).length.gt(0);
        });

      cy.get("[data-cy=payment-datepicker]").click();
      cy.get("[data-cy=payment-datepicker] .calendar-day-button").first().click();
      cy.get("[data-cy=payment-datepicker-checkbox] input").should("be.checked");
      cy.get("[data-cy=payment-datepicker-checkbox] input").click().should("not.be.checked");

      cy.get("[data-cy=transaction-form-more-button] .wrapper").first().click();
      cy.get("[data-cy=accrual-datepicker]").should("be.visible").click();
      cy.get("[data-cy=accrual-datepicker] .calendar-day-button").first().click();
      cy.get("[data-cy=accrual-datepicker-checkbox] input").should("not.be.checked");
      cy.get("[data-cy=accrual-datepicker-checkbox] input").click().should("be.checked");

      cy.get("[data-cy=transaction-form-more-button] .wrapper").first().click();
      cy.get("[data-cy=recurring-form]").should("be.visible");
      cy.get("[data-cy=recurring-select]").as("recurringSelect");
      cy.get("@recurringSelect").click();
      cy.get("[data-cy=recurring-select] .multiselect__content-wrapper").as("recurringList");
      cy.get("@recurringList").should("be.visible");
      cy.get("@recurringList").find(".multiselect__option").eq(1).click();
      cy.get("@recurringSelect")
        .find(".multiselect__single")
        .then((recurring) => {
          const recurringValue = recurring.text();

          expect(recurringValue).length.gt(0);
        });
      cy.get("[data-cy=recurring-datepicker-checkbox] input").should("not.be.checked");
      cy.get("[data-cy=recurring-datepicker-checkbox] input").click().should("be.checked");
      cy.get("[data-cy=stop-recurring-datepicker]").should("be.visible").click();
      cy.get("[data-cy=stop-recurring-datepicker] .calendar-day-button").first().click();

      cy.get("[data-cy=transaction-form-more-button] .wrapper").first().click();
      cy.get("[data-cy=extra-fields-form]").should("be.visible");

      cy.get("[data-cy=project-select]").as("projectSelect");
      cy.get("@projectSelect").click();
      cy.get("[data-cy=project-select] .multiselect__content-wrapper").as("projectList");
      cy.get("@projectList").should("be.visible");
      cy.get("@projectList").find(".multiselect__option").eq(0).click();
      cy.get("@projectSelect")
        .find(".multiselect__single")
        .then((project) => {
          const projectValue = project.text();

          expect(projectValue).length.gt(0);
        });

      cy.get("[data-cy=tags-multiselect]").as("tagsMultiselect");
      cy.get("@tagsMultiselect").click();
      cy.get("[data-cy=tags-multiselect] .multiselect__content-wrapper").as("tagsList");
      cy.get("@tagsList").should("be.visible");
      cy.get("@tagsList").find(".multiselect__option").eq(1).click();
      cy.get("@tagsMultiselect").find(".tags").should("have.length", 1);

      cy.get("[data-cy=description-textarea] textarea").as("descriptionTextarea");
      cy.get("@descriptionTextarea").type("Test");
      cy.get("@descriptionTextarea").click().should("have.value", "Test");

      cy.get("[data-cy=submit-button]").click();
      // cy.get("tbody>tr").should("contain", "78,43").and("contain", "Test") TODO: Uncomment in future
    });

    it("Income form should not be empty", () => {
      cy.get("[data-cy=income-button]").click();
      cy.get("[data-cy=transaction-form]").should("be.visible");

      cy.get("[data-cy=bank-account-select] .multiselect__single").should("not.have.text", 'undefined');
      cy.get("[data-cy=bank-account-select] .svg-icon").click();

      cy.get("[data-cy=categories-select] .svg-icon").click();
      cy.get("[data-cy=categories-select] .svg-icon").click();

      cy.get("[data-cy=payment-datepicker]").click();
      cy.get("[data-cy=payment-datepicker] .calendar-day-button").find("[aria-current=date]").click();

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=money-input-block] .error-message").scrollIntoView().should("be.visible");
      cy.get("[data-cy=bank-account-select] .error-message").should("be.visible");
      cy.get("[data-cy=categories-select] .error-message").scrollIntoView().should("be.visible");
      cy.get("[data-cy=payment-datepicker] .error-message").should("be.visible");
    });
  });
});
