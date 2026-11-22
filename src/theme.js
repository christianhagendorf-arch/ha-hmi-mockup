const storageKey = "ha-hmi-theme";

const root = document.documentElement;

const toggleButton =
    document.getElementById("theme-toggle");

const themeIcon =
    document.getElementById("theme-icon");

const themeLabel =
    document.getElementById("theme-label");

function getPreferredTheme() {
    const storedTheme =
        localStorage.getItem(storageKey);

    if (
        storedTheme === "light" ||
        storedTheme === "dark"
    ) {
        return storedTheme;
    }

    const prefersLight =
        window.matchMedia(
            "(prefers-color-scheme: light)"
        ).matches;

    return prefersLight
        ? "light"
        : "dark";
}

function updateThemeControl(theme) {
    const isLight = theme === "light";

    themeIcon.className =
        isLight
            ? "mdi mdi-weather-night"
            : "mdi mdi-weather-sunny";

    themeLabel.textContent =
        isLight
            ? "Dunkel"
            : "Hell";

    toggleButton.setAttribute(
        "aria-pressed",
        String(isLight)
    );

    toggleButton.title =
        isLight
            ? "Dunkles Farbschema aktivieren"
            : "Helles Farbschema aktivieren";
}

function applyTheme(theme) {
    root.dataset.theme = theme;

    localStorage.setItem(
        storageKey,
        theme
    );

    updateThemeControl(theme);
}

function toggleTheme() {
    const currentTheme =
        root.dataset.theme;

    const nextTheme =
        currentTheme === "light"
            ? "dark"
            : "light";

    applyTheme(nextTheme);
}

toggleButton.addEventListener(
    "click",
    toggleTheme
);

applyTheme(
    getPreferredTheme()
);