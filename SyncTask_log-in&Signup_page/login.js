
const title = document.querySelector("#form-title");
const description = document.querySelector("#form-description");
const statusMessage = document.querySelector("#form-status");

const forms = {
  login: document.querySelector("#login-form"),
  signup: document.querySelector("#signup-form"),
  reset: document.querySelector("#reset-form")
};

const screens = {
  login: {
    title: "Welcome",
    accent: "back",
    description:
      "Log in to your account to continue where you left off."
  },

  signup: {
    title: "Create your",
    accent: "account",
    description:
      "Bring your tasks, team, and projects together."
  },

  reset: {
    title: "Reset your",
    accent: "password",
    description:
      "Enter your account email to request a reset link."
  }
};

function setFieldError(input, message) {
  const error = document.getElementById(`${input.id}-error`);

  error.textContent = message;

  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

function clearFormErrors(form) {
  form.querySelectorAll("input").forEach((input) => {
    setFieldError(input, "");
  });
}

function showScreen(moveFocus = true) {
  const requestedScreen = window.location.hash.slice(1);

  const screenName = Object.hasOwn(screens, requestedScreen)
    ? requestedScreen
    : "login";

  const screen = screens[screenName];

  Object.entries(forms).forEach(([name, form]) => {
    form.hidden = name !== screenName;
    clearFormErrors(form);

    // Clear passwords when changing screens.
    form.querySelectorAll('input[type="password"]').forEach((input) => {
      input.value = "";
    });
  });

  const accent = document.createElement("span");
  accent.textContent = screen.accent;

  title.replaceChildren(`${screen.title} `, accent);
  description.textContent = screen.description;
  statusMessage.textContent = "";

  document.title =
    screenName === "signup"
      ? "SyncTask | Sign up"
      : screenName === "reset"
        ? "SyncTask | Reset password"
        : "SyncTask | Log in";

  if (moveFocus) {
    title.focus();
  }
}

window.addEventListener("hashchange", () => {
  showScreen();
});

function validateForm(form, screenName) {
  let firstInvalidInput = null;

  const email = form.elements.namedItem("email");
  const password = form.elements.namedItem("password");

  clearFormErrors(form);

  email.value = email.value.trim();

  if (!email.value) {
    setFieldError(email, "Enter your email address.");
    firstInvalidInput = email;
  } else if (email.validity.typeMismatch) {
    setFieldError(
      email,
      "Enter a valid email address, such as name@example.com."
    );

    firstInvalidInput = email;
  }

  if (password) {
    if (!password.value) {
      setFieldError(password, "Enter your password.");
      firstInvalidInput ??= password;
    } else if (screenName === "signup" && password.value.length < 8) {
      setFieldError(password, "Use at least 8 characters.");
      firstInvalidInput ??= password;
    }
  }

  if (firstInvalidInput) {
    firstInvalidInput.focus();
    return false;
  }

  return true;
}

const demoMessages = {
  login:
    "Your inputs passed validation.",

  signup:
    "Your inputs passed validation. No account was created.",

  reset:
    "Your email format is valid. No reset email was sent."
};

Object.entries(forms).forEach(([screenName, form]) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    statusMessage.textContent = "";

    if (!validateForm(form, screenName)) {
      return;
    }

    statusMessage.textContent = demoMessages[screenName];
  });

  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      setFieldError(input, "");
      statusMessage.textContent = "";
    });
  });
});

showScreen(false);