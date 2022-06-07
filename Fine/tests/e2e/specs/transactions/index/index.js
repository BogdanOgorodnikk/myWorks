describe("Transactions list", () => {
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

  context("Actions on page", () => {
    it("Expense modal form work correct", () => {
      cy.get("[data-cy=expense-button]").click();
      cy.get("[data-cy=transaction-form]").should("be.visible");

      cy.get("[data-cy=money-input-base-currency]").as("moneyInputBaseCurrency");
      cy.get("@moneyInputBaseCurrency").clear().type("100").should("have.value", "–100");

      // cy.get("[data-cy=categories-select]")
      //   .find(".multiselect__single")
      //   .then((category) => {
      //     const categoryValue = category.text();
      //
      //     expect(categoryValue).length.gt(0);
      //   });

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
    });

    it("Income modal form work correct", () => {
      cy.get("[data-cy=income-button]").click();
      cy.get("[data-cy=transaction-form]").should("be.visible");

      cy.get("[data-cy=money-input-base-currency]").as("moneyInputBaseCurrency");
      cy.get("@moneyInputBaseCurrency").clear().type("100").should("have.value", "100");

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
    });

    it("Change modal type button work correct", () => {
      cy.get("[data-cy=transfer-button]").click();
      cy.get("[data-cy=transfer-form]").should("be.visible");

      cy.get("[data-cy=change-type-button]").click();
      cy.get("[data-cy=change-type-button] .dropdown-list").first().click();
      cy.get("[data-cy=transaction-form]").should("be.visible");
    });

    it("Filter modal form work correct", () => {
      cy.get("[data-cy=filter-button]").click();
      cy.get("[data-cy=filter-form]").should("be.visible");

      cy.get("[data-cy=payment-types-multiselect]").as("paymentTypesMultiselect");
      cy.get("@paymentTypesMultiselect").click();
      cy.get("[data-cy=payment-types-multiselect] .multiselect__content-wrapper").as(
        "paymentTypesList"
      );
      cy.get("@paymentTypesList").should("be.visible");
      cy.get("@paymentTypesList").find(".multiselect__option").eq(1).click();
      cy.get("@paymentTypesMultiselect").find(".tags").should("have.length", 1);

      cy.get("[data-cy=start-money-range-input]").as("startMoneyRangeInput");
      cy.get("@startMoneyRangeInput").type("100").should("have.value", "100");
      cy.get("[data-cy=end-money-range-input]").as("endMoneyRangeInput");
      cy.get("@endMoneyRangeInput").type("27").should("have.value", "27");

      cy.get("[data-cy=accounts-multiselect]").as("accountsMultiselect");
      cy.get("@accountsMultiselect").click();
      cy.get("[data-cy=accounts-multiselect] .multiselect__content-wrapper").as("accountsList");
      cy.get("@accountsList").should("be.visible");
      cy.get("@accountsList").find(".multiselect__option").eq(1).click();
      cy.get("@accountsMultiselect").find(".tags").should("have.length", 1);

      cy.get("[data-cy=categories-multiselect]").as("categoriesMultiselect");
      cy.get("@categoriesMultiselect").click();
      cy.get("[data-cy=categories-multiselect] .multiselect__content-wrapper").as("categoriesList");
      cy.get("@categoriesList").should("be.visible");
      cy.get("@categoriesList").find(".multiselect__option").eq(1).click();
      cy.get("@categoriesMultiselect").find(".tags").should("have.length", 1);

      cy.get("[data-cy=contragents-multiselect]").as("contragentsMultiselect");
      cy.get("@contragentsMultiselect").click();
      cy.get("[data-cy=contragents-multiselect] .multiselect__content-wrapper").as(
        "contragentsList"
      );
      cy.get("@contragentsList").should("be.visible");
      cy.get("@contragentsList").find(".multiselect__option").eq(1).click();
      cy.get("@contragentsMultiselect").find(".tags").should("have.length", 1);

      cy.get("[data-cy=payment-multi-state-checkbox] input").should("have.value", "");
      cy.get("[data-cy=payment-multi-state-checkbox] input").click().should("have.value", "1");

      cy.get("[data-cy=accrual-datepicker]").click();
      cy.get("[data-cy=accrual-datepicker] .calendar-day-button").first().click();
      cy.get("[data-cy=accrual-multi-state-checkbox] input").should("have.value", "");
      cy.get("[data-cy=accrual-multi-state-checkbox] input").click().should("have.value", "1");

      cy.get("[data-cy=project-select]").as("projectMultiselect");
      cy.get("@projectMultiselect").click();
      cy.get("[data-cy=project-select] .multiselect__content-wrapper").as("projectsList");
      cy.get("@projectsList").should("be.visible");
      cy.get("@projectsList").find(".multiselect__option").eq(1).click();
      cy.get("@projectMultiselect").find(".tags").should("have.length", 1);

      cy.get("[data-cy=tags-multiselect]").as("tagsMultiselect");
      cy.get("@tagsMultiselect").click();
      cy.get("[data-cy=tags-multiselect] .multiselect__content-wrapper").as("tagsList");
      cy.get("@tagsList").should("be.visible");
      cy.get("@tagsList").find(".multiselect__option").eq(1).click();
      cy.get("@tagsMultiselect").find(".tags").should("have.length", 1);

      cy.get("[data-cy=description-textarea] textarea").as("descriptionTextarea");
      cy.get("@descriptionTextarea").type("Test");
      cy.get("@descriptionTextarea").click().should("have.value", "Test");
    });
  });
});
