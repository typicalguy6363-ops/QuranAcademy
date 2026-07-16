// PersianAcademy homepage JavaScript

const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");

const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalAction = document.getElementById("modalAction");
const modalIcon = document.getElementById("modalIcon");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");

function openModal(icon, title, message) {
    if (!modalOverlay || !modalIcon || !modalTitle || !modalMessage) {
        return;
    }

    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modalOverlay.classList.add("show");
    document.body.classList.add("modal-open");
}

function closeModal() {
    if (!modalOverlay) {
        return;
    }

    modalOverlay.classList.remove("show");
    document.body.classList.remove("modal-open");
}

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuButton.classList.toggle("active", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        if (navigation) {
            navigation.classList.remove("open");
        }

        if (menuButton) {
            menuButton.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
        }
    });
});

if (modalClose) {
    modalClose.addEventListener("click", closeModal);
}

if (modalAction) {
    modalAction.addEventListener("click", closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener("click", (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

const signInButtons = [
    document.getElementById("signInButton"),
    document.getElementById("footerSignInButton")
].filter(Boolean);

signInButtons.forEach((button) => {
    button.addEventListener("click", () => {
        openModal(
            "🔐",
            "Sign In",
            "The real sign-in page is coming next. Soon, learners will be able to save their progress."
        );
    });
});

const signUpButtons = [
    document.getElementById("signUpButton"),
    document.getElementById("bottomSignUpButton"),
    document.getElementById("footerSignUpButton")
].filter(Boolean);

signUpButtons.forEach((button) => {
    button.addEventListener("click", () => {
        openModal(
            "🎉",
            "Create Your Account",
            "The full sign-up page is coming next. Your free Persian learning journey will begin here."
        );
    });
});

const startButton = document.getElementById("startButton");

if (startButton) {
    startButton.addEventListener("click", () => {
        const coursesSection = document.getElementById("courses");

        if (coursesSection) {
            coursesSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}

const demoButton = document.getElementById("demoButton");

if (demoButton) {
    demoButton.addEventListener("click", () => {
        openModal(
            "▶️",
            "Demo Coming Soon",
            "Soon, this button will open a short preview showing how PersianAcademy lessons work."
        );
    });
}

const premiumButton = document.getElementById("premiumButton");

if (premiumButton) {
    premiumButton.addEventListener("click", () => {
        openModal(
            "👑",
            "PersianAcademy Premium",
            "Premium will include Quran lessons, Tajweed practice, advanced Persian courses, and extra rewards."
        );
    });
}

const aboutButton = document.getElementById("aboutButton");

if (aboutButton) {
    aboutButton.addEventListener("click", () => {
        openModal(
            "🌍",
            "Our Mission",
            "PersianAcademy is being built to make Persian learning fun, simple, and welcoming for children and beginners."
        );
    });
}

const contactButton = document.getElementById("contactButton");

if (contactButton) {
    contactButton.addEventListener("click", () => {
        openModal(
            "✉️",
            "Contact PersianAcademy",
            "A real contact page will be added soon."
        );
    });
}

document.querySelectorAll(".course-button").forEach((button) => {
    button.addEventListener("click", () => {
        const courseName = button.dataset.course || "this course";

        openModal(
            "📚",
            courseName,
            "This course is being prepared. Soon, this button will open the first lesson."
        );
    });
});

const soundButton = document.getElementById("soundButton");

if (soundButton) {
    soundButton.addEventListener("click", () => {
        const speechSupported =
            "speechSynthesis" in window &&
            "SpeechSynthesisUtterance" in window;

        if (!speechSupported) {
            openModal(
                "🔊",
                "Pronunciation",
                "Your browser does not support speech playback, but the real Persian audio will be added later."
            );
            return;
        }

        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance("Salam");

        speech.rate = 0.8;
        speech.pitch = 1;
        speech.volume = 1;

        soundButton.textContent = "🔊 Playing...";

        speech.onend = () => {
            soundButton.textContent = "🔊 Listen";
        };

        speech.onerror = () => {
            soundButton.textContent = "🔊 Listen";

            openModal(
                "🔊",
                "Pronunciation",
                "Audio could not play this time. We will add a real Persian recording later."
            );
        };

        window.speechSynthesis.speak(speech);
    });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

window.addEventListener("load", () => {
    const firstReveal = document.querySelector(".hero-content.reveal");

    if (firstReveal) {
        firstReveal.classList.add("visible");
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        if (navigation) {
            navigation.classList.remove("open");
        }

        if (menuButton) {
            menuButton.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
        }
    }
});
