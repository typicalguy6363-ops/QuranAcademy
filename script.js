document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupRevealAnimations();
    setupPasswordToggles();
    setupSignInForm();
    setupSignUpForm();
});

function setupMobileMenu() {
    const menuButton = document.getElementById("menuButton");
    const navigation = document.getElementById("navigation");

    if (!menuButton || !navigation) {
        return;
    }

    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuButton.classList.toggle("active", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuButton.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            navigation.classList.remove("open");
            menuButton.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
        }
    });
}

function setupRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
}

function setupPasswordToggles() {
    document
        .querySelectorAll("[data-password-toggle]")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const inputId = button.dataset.passwordToggle;
                const input = document.getElementById(inputId);

                if (!input) {
                    return;
                }

                const passwordIsHidden = input.type === "password";

                input.type = passwordIsHidden ? "text" : "password";
                button.textContent = passwordIsHidden ? "🙈" : "👁️";
            });
        });
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showInputError(input, errorElement, message) {
    if (input) {
        input.classList.add("input-error");
        input.classList.remove("input-success");
    }

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function showInputSuccess(input, errorElement) {
    if (input) {
        input.classList.remove("input-error");
        input.classList.add("input-success");
    }

    if (errorElement) {
        errorElement.textContent = "";
    }
}

function createMessageModal() {
    let overlay = document.getElementById("siteMessageOverlay");

    if (overlay) {
        return overlay;
    }

    overlay = document.createElement("div");
    overlay.id = "siteMessageOverlay";
    overlay.className = "modal-overlay";

    overlay.innerHTML = `
        <div class="modal-card" role="dialog" aria-modal="true">
            <button
                class="modal-close"
                id="siteMessageClose"
                type="button"
                aria-label="Close message"
            >
                ×
            </button>

            <div class="modal-icon" id="siteMessageIcon">
                ✨
            </div>

            <h2 id="siteMessageTitle">
                QuranAcademy
            </h2>

            <p id="siteMessageText"></p>

            <button
                class="button button-primary"
                id="siteMessageOkay"
                type="button"
            >
                Okay
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeMessage = () => {
        overlay.classList.remove("show");
        document.body.classList.remove("modal-open");
    };

    document
        .getElementById("siteMessageClose")
        .addEventListener("click", closeMessage);

    document
        .getElementById("siteMessageOkay")
        .addEventListener("click", closeMessage);

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closeMessage();
        }
    });

    return overlay;
}

function showMessage(icon, title, message) {
    const overlay = createMessageModal();

    document.getElementById("siteMessageIcon").textContent = icon;
    document.getElementById("siteMessageTitle").textContent = title;
    document.getElementById("siteMessageText").textContent = message;

    overlay.classList.add("show");
    document.body.classList.add("modal-open");
}

window.showQuranAcademyMessage = showMessage;

function setupSignInForm() {
    const form = document.getElementById("signInForm");

    if (!form) {
        return;
    }

    const email = document.getElementById("signInEmail");
    const password = document.getElementById("signInPassword");

    const emailError =
        document.getElementById("signInEmailError");

    const passwordError =
        document.getElementById("signInPasswordError");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let formIsValid = true;

        if (!email || !validEmail(email.value.trim())) {
            showInputError(
                email,
                emailError,
                "Please enter a valid email address."
            );

            formIsValid = false;
        } else {
            showInputSuccess(email, emailError);
        }

        if (!password || password.value.length < 6) {
            showInputError(
                password,
                passwordError,
                "Password must contain at least 6 characters."
            );

            formIsValid = false;
        } else {
            showInputSuccess(password, passwordError);
        }

        if (!formIsValid) {
            return;
        }

        showMessage(
            "🔐",
            "Sign In Page Works",
            "The page is working correctly. Real accounts still need to be connected to a secure service such as Firebase or Supabase."
        );
    });
}

function setupSignUpForm() {
    const form = document.getElementById("signUpForm");

    if (!form) {
        return;
    }

    const name = document.getElementById("signUpName");
    const email = document.getElementById("signUpEmail");
    const password = document.getElementById("signUpPassword");
    const confirmPassword =
        document.getElementById("confirmPassword");

    const nameError =
        document.getElementById("signUpNameError");

    const emailError =
        document.getElementById("signUpEmailError");

    const passwordError =
        document.getElementById("signUpPasswordError");

    const confirmPasswordError =
        document.getElementById("confirmPasswordError");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let formIsValid = true;

        if (!name || name.value.trim().length < 2) {
            showInputError(
                name,
                nameError,
                "Please enter your first name."
            );

            formIsValid = false;
        } else {
            showInputSuccess(name, nameError);
        }

        if (!email || !validEmail(email.value.trim())) {
            showInputError(
                email,
                emailError,
                "Please enter a valid email address."
            );

            formIsValid = false;
        } else {
            showInputSuccess(email, emailError);
        }

        if (!password || password.value.length < 6) {
            showInputError(
                password,
                passwordError,
                "Password must contain at least 6 characters."
            );

            formIsValid = false;
        } else {
            showInputSuccess(password, passwordError);
        }

        if (
            !confirmPassword ||
            confirmPassword.value !== password.value
        ) {
            showInputError(
                confirmPassword,
                confirmPasswordError,
                "The passwords do not match."
            );

            formIsValid = false;
        } else {
            showInputSuccess(
                confirmPassword,
                confirmPasswordError
            );
        }

        if (!formIsValid) {
            return;
        }

        localStorage.setItem(
            "quranAcademyDemoName",
            name.value.trim()
        );

        showMessage(
            "🎉",
            "Sign Up Page Works",
            "The page is working correctly. Real accounts still need secure authentication before users can permanently create accounts."
        );
    });
}
