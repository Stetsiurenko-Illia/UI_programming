describe("Test", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it("registers a new user and logs in", () => {
    // Generate a unique email and username to avoid duplicates
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    const uniqueUsername = `TestUserE2E-${Date.now()}`;

    // Register user via API
    cy.request(
      "POST",
      "https://web-app-backend-m6hf.onrender.com/api/register/",
      {
        username: uniqueUsername,
        email: uniqueEmail,
        password: "password123",
        gender: "M",
        birth_date: "1990-01-01",
      }
    ).then((response) => {
      expect(response.status).to.eq(201); // Expect 201 Created
    });

    // Login via API to get tokens
    cy.request("POST", "https://web-app-backend-m6hf.onrender.com/api/login/", {
      email: uniqueEmail,
      password: "password123",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("access");
      expect(response.body).to.have.property("refresh");
      const { access } = response.body;
      localStorage.setItem("accessToken", access);
    });
  });

  it("views and edits profile", () => {
    // Generate a unique email and username for this test run
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    const uniqueUsername = `TestUserE2E-${Date.now()}`;
    const updatedUsername = `UpdatedUserE2E-${Date.now()}`; // Dynamically generate unique updated username

    // Register and login via API to get token
    let authToken;
    cy.request(
      "POST",
      "https://web-app-backend-m6hf.onrender.com/api/register/",
      {
        username: uniqueUsername,
        email: uniqueEmail,
        password: "password123",
        gender: "M",
        birth_date: "1990-01-01",
      }
    )
      .then(() => {
        return cy.request(
          "POST",
          "https://web-app-backend-m6hf.onrender.com/api/login/",
          {
            email: uniqueEmail,
            password: "password123",
          }
        );
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        authToken = response.body.access;
        localStorage.setItem("accessToken", authToken);

        // Fetch profile via API to verify data
        return cy.request({
          method: "GET",
          url: "https://web-app-backend-m6hf.onrender.com/api/profile/",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("username", uniqueUsername);
        expect(response.body).to.have.property("email", uniqueEmail);
        expect(response.body).to.have.property("gender", "M");
        expect(response.body).to.have.property("birth_date", "1990-01-01");

        // Update profile via API
        return cy.request({
          method: "PUT",
          url: "https://web-app-backend-m6hf.onrender.com/api/profile/",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: {
            username: updatedUsername, // Use unique updated username
            email: `${uniqueEmail}-updated`,
            gender: "F",
            birth_date: "1995-05-05",
          },
        });
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("username", updatedUsername);
        expect(response.body).to.have.property(
          "email",
          `${uniqueEmail}-updated`
        );
        expect(response.body).to.have.property("gender", "F");
        expect(response.body).to.have.property("birth_date", "1995-05-05");
      });
  });

  it("manages tasks", () => {
    // Generate a unique email and username for this test run
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    const uniqueUsername = `TestUserE2E-${Date.now()}`;

    // Register and login via API to get token
    let authToken;
    cy.request(
      "POST",
      "https://web-app-backend-m6hf.onrender.com/api/register/",
      {
        username: uniqueUsername,
        email: uniqueEmail,
        password: "password123",
        gender: "M",
        birth_date: "1990-01-01",
      }
    )
      .then(() => {
        return cy.request(
          "POST",
          "https://web-app-backend-m6hf.onrender.com/api/login/",
          {
            email: uniqueEmail,
            password: "password123",
          }
        );
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        authToken = response.body.access;
        localStorage.setItem("accessToken", authToken);

        // Create a task via API
        return cy.request({
          method: "POST",
          url: "https://web-app-backend-m6hf.onrender.com/api/tasks/",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: {
            title: "E2E Task",
            description: "E2E Description",
            completed: false,
          },
        });
      })
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("title", "E2E Task");
        expect(response.body).to.have.property(
          "description",
          "E2E Description"
        );
        expect(response.body).to.have.property("completed", false);
        const taskId = response.body.id;

        // Verify task creation via API
        return cy.request({
          method: "GET",
          url: "https://web-app-backend-m6hf.onrender.com/api/tasks/",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        const tasks = response.body.results || response.body;
        const newTask = tasks.find((task) => task.title === "E2E Task");
        expect(newTask).to.exist;
        expect(newTask.description).to.eq("E2E Description");

        // Toggle task completion
        return cy.request({
          method: "PUT",
          url: `https://web-app-backend-m6hf.onrender.com/api/tasks/${newTask.id}/`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: {
            title: "E2E Task",
            description: "E2E Description",
            completed: true,
          },
        });
      })
      .then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body).to.have.property("completed", true);

        // Delete task
        return cy.request({
          method: "DELETE",
          url: `https://web-app-backend-m6hf.onrender.com/api/tasks/${updateResponse.body.id}/`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      })
      .then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(204);

        // Verify deletion
        return cy.request({
          method: "GET",
          url: `https://web-app-backend-m6hf.onrender.com/api/tasks/${
            deleteResponse.body.id || deleteResponse.body.id
          }/`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          failOnStatusCode: false,
        });
      })
      .then((deleteCheckResponse) => {
        expect(deleteCheckResponse.status).to.eq(404);
      });
  });
});
