"use strict";

// SCREEN ELEMENTS
const screens = document.querySelectorAll(".screen");
const homeLink = document.getElementById("home-link");

const createForm = document.getElementById("create-form");
const joinForm = document.getElementById("join-form");

const pageTitles = {
  home: "SyncTask | Home",
  create: "SyncTask | Create Workspace",
  join: "SyncTask | Join Workspace"
};

// SCREEN NAVIGATION
function showScreen(moveFocus = true) {
  const requestedPage = window.location.hash.slice(1);

  const pageExists = Object.prototype.hasOwnProperty.call(
    pageTitles,
    requestedPage
  );

  const pageId = pageExists ? requestedPage : "home";

  screens.forEach((screen) => {
    screen.hidden = screen.id !== pageId;
  });

  // Highlight Home only when the Home screen is visible.
  if (pageId === "home") {
    homeLink.setAttribute("aria-current", "page");
  } else {
    homeLink.removeAttribute("aria-current");
  }

  document.title = pageTitles[pageId];

  if (moveFocus) {
    const heading = document.querySelector(`#${pageId} h1`);

    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

// Handle navigation links and browser Back/Forward.
window.addEventListener("hashchange", () => {
  showScreen();
});

// Display the correct screen on first load.
showScreen(false);

// SHARED FIELD VALIDATION
function setFieldError(field, errorId, message) {
  const errorElement = document.getElementById(errorId);

  errorElement.textContent = message;

  if (message) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
}

// Clear a field's error while the user corrects it.
const validationFields = [
  {
    fieldId: "workspace-name",
    errorId: "workspace-error"
  },
  {
    fieldId: "team-type",
    errorId: "team-error"
  },
  {
    fieldId: "invite",
    errorId: "invite-error"
  }
];

validationFields.forEach(({ fieldId, errorId }) => {
  const field = document.getElementById(fieldId);

  const clearError = () => {
    setFieldError(field, errorId, "");
  };

  field.addEventListener("input", clearError);
  field.addEventListener("change", clearError);
});

// Clear old feedback when form values change.
// Values remain in the forms when switching screens.
[createForm, joinForm].forEach((form) => {
  const clearStatus = () => {
    form.querySelector(".form-status").textContent = "";
  };

  form.addEventListener("input", clearStatus);
  form.addEventListener("change", clearStatus);
});

// CREATE WORKSPACE FORM
createForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const workspaceInput = document.getElementById("workspace-name");
  const teamInput = document.getElementById("team-type");
  const status = createForm.querySelector(".form-status");

  const workspaceName = workspaceInput.value.trim();

  const workspaceError = workspaceName
    ? ""
    : "Enter a name for your workspace.";

  const teamError = teamInput.value
    ? ""
    : "Select your team type.";

  status.textContent = "";

  setFieldError(
    workspaceInput,
    "workspace-error",
    workspaceError
  );

  setFieldError(
    teamInput,
    "team-error",
    teamError
  );

  // Focus the first field that needs correction.
  if (workspaceError || teamError) {
    const firstInvalidField = workspaceError
      ? workspaceInput
      : teamInput;

    firstInvalidField.focus();
    return;
  }

  const formData = new FormData(createForm);
  const teamSize = formData.get("teamSize");

  // Demo only: replace this with a backend create request.
  status.textContent =
    `“${workspaceName}” is ready for a team of ${teamSize}. ` +
    "No workspace has been saved.";
});

// JOIN WORKSPACE FORM
joinForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const inviteInput = document.getElementById("invite");
  const status = joinForm.querySelector(".form-status");
  const invitation = inviteInput.value.trim();

  status.textContent = "";

  if (!invitation) {
    setFieldError(
      inviteInput,
      "invite-error",
      "Enter the workspace code or invite link you received."
    );

    inviteInput.focus();
    return;
  }

  setFieldError(inviteInput, "invite-error", "");

  // Demo only: a backend must verify the invitation.
  status.textContent =
    "Invitation entered. " +
    "and join the workspace.";
});