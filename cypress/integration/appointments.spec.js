describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");

    //Go to the root of the web browser
    cy.visit("/");

    //Verify that the text 'Monday' is there
    cy.contains("Monday");
  });

  it("should book an interview", () => {
    //Find the 'add'  button and click on it
    cy.get("[alt=Add]").first().click();

    // Type in their name 'student name'
    cy.get('[data-testid="student-name-input"]').type("Lydia Miller-Jones");

    //Check it shows the interviewers and choose one
    cy.get('[alt="Sylvia Palmer"]').click();

    //Save the appointment
    cy.contains("Save").click();

    //Able to see the booked appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones").contains(
      "Sylvia Palmer"
    );
  });

  it("should edit an interview", () => {
    //Clicking on the edit button only works when hovering, thus forcing it to bypass this;
    cy.contains(".appointment__card--show", "Archie Cohen")
      .get('[alt="Edit"]')
      .click({ force: true });

    //Changing the name of the student and interviewer
    cy.get('[data-testid="student-name-input"]').clear().type("Nicolas Cage");
    cy.get('[alt="Tori Malcolm"]').click();

    //Saving the new edited appointment
    cy.contains("Save").click();

    //Able to see the booked appointment
    cy.contains(".appointment__card--show", "Nicolas Cage").contains(
      "Tori Malcolm"
    );
  });

  it("should cancel an interview", () => {
    //Clicking on the delete button only works when hovering, thus forcing it to bypass this;
    cy.contains(".appointment__card--show", "Archie Cohen")
      .get('[alt="Delete"]')
      .click({ force: true });

    // Clicking ont the confirm button
    cy.contains("Confirm").click();

    // Should show that it is deleting
    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    //Able to see that the appointment slot is empty
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});
