import { house } from "./data.js";

const app = document.getElementById("app");

const modal =
    document.getElementById("room-modal");

const modalTitle =
    document.getElementById("modal-title");

const modalContent =
    document.getElementById("modal-content");

let lastFocusedElement = null;

const sections = [
    house.groundFloor,
    house.upperFloor,
    house.atticFloor,
    house.garden
];

function formatTemperature(value) {
    return value
        .toFixed(1)
        .replace(".", ",");
}

function getFunctionIcon(func) {
    const icons = {
        entrance_light: "mdi-outdoor-lamp",
        arc_lamp: "mdi-floor-lamp-outline",
        tv_board: "mdi-television",
        worktop: "mdi-lightbulb-outline",
        coffee_corner: "mdi-coffee-outline",
        dining_corner: "mdi-lightbulb-outline",
        window_light: "mdi-candle",
        guest_bath_light: "mdi-lightbulb-outline",
        washing_machine: "mdi-washing-machine",
        dryer: "mdi-tumble-dryer",
        utility_light: "mdi-lightbulb-outline",
        sideboard_light: "mdi-led-strip-variant",
        office_light: "mdi-lightbulb-multiple-outline",
        bedroom_light: "mdi-led-strip-variant",
        guest_lamp: "mdi-desk-lamp",
        shoe_cabinet: "mdi-lightbulb-outline",
        lotta_ceiling: "mdi-led-strip-variant",
        lotta_desk_lamp: "mdi-desk-lamp",
        aquarium: "mdi-fish",
        lene_ceiling: "mdi-led-strip-variant",
        terrace_light: "mdi-power-socket-de",
        roof_light: "mdi-lightbulb-outline",
        star: "mdi-star-outline",
        outside_light: "mdi-outdoor-lamp"
    };

    return icons[func.id] ?? "mdi-toggle-switch-outline";
}

function getStatusLabel(state) {
    const labels = {
        running: "Läuft",
        finished: "Fertig",
        idle: "Bereit",
        clean: "Fertig"
    };

    return labels[state] ?? state;
}

function supportsDimmer(func) {
    return (
        func.type === "dimmer" ||
        func.type === "rgb-dimmer"
    );
}

function createDimmerControl(sectionId, roomId, func) {
    if (!supportsDimmer(func) || func.state !== true) {
        return "";
    }

    return `
        <div class="dimmer-control">
            <input
                type="range"
                class="dimmer-slider"
                min="1"
                max="100"
                step="1"
                value="${func.brightness}"
                data-action="change-brightness"
                data-section-id="${sectionId}"
                data-room-id="${roomId}"
                data-function-id="${func.id}"
                aria-label="Helligkeit ${func.label}"
            >

            <span class="dimmer-value">
                ${func.brightness} %
            </span>
        </div>
    `;
}

function createFunctionCard(sectionId, roomId, func) {
    const isStatus = func.type === "status";
    const isActive = func.state === true;
    const icon = getFunctionIcon(func);

    if (isStatus) {
        return `
            <div class="function status-${func.state}">
                <div class="function-status-row">
                    <span class="function-icon" aria-hidden="true">
                        <i class="mdi ${icon}"></i>
                    </span>

                    <span class="function-label">
                        ${func.label}
                    </span>

                    <span class="function-status">
                        ${getStatusLabel(func.state)}
                    </span>
                </div>
            </div>
        `;
    }

    return `
        <div class="function ${isActive ? "active" : ""}">
            <div class="function-main">
                <button
                    type="button"
                    class="function-toggle"
                    data-action="toggle-function"
                    data-section-id="${sectionId}"
                    data-room-id="${roomId}"
                    data-function-id="${func.id}"
                    aria-pressed="${isActive}"
                >
                    <span class="function-icon" aria-hidden="true">
                        <i class="mdi ${icon}"></i>
                    </span>

                    <span class="function-label">
                        ${func.label}
                    </span>
                </button>
            </div>

            ${createDimmerControl(sectionId, roomId, func)}
        </div>
    `;
}

function getHeatingState(room) {
    if (room.heating.hvac === "off") {
        return "off";
    }

    const heatingThreshold = room.heating.target - 0.2;

    if (room.temperature < heatingThreshold) {
        return "heating";
    }

    return "ready";
}

function createHeatingRow(sectionId, room) {
    if (!room.heating) {
        return "";
    }

    const heatingState = getHeatingState(room);
    const isEnabled = heatingState !== "off";

    const heatingTitle = {
        off: "Heizung aus",
        ready: "Heizung eingeschaltet",
        heating: "Heizung heizt"
    }[heatingState];

    return `
        <div class="temperature-row">
            <div class="temperature">
                ${formatTemperature(room.temperature)} °C
            </div>

            <div class="heating-control">
                <button
                    type="button"
                    class="heating-toggle ${heatingState}"
                    data-action="toggle-heating"
                    data-section-id="${sectionId}"
                    data-room-id="${room.id}"
                    title="${heatingTitle}"
                    aria-label="${heatingTitle}"
                    aria-pressed="${isEnabled}"
                >
                    <i class="mdi mdi-radiator"></i>
                </button>

                <button
                    type="button"
                    class="temperature-button"
                    data-action="temperature-down"
                    data-section-id="${sectionId}"
                    data-room-id="${room.id}"
                    aria-label="Solltemperatur um 0,5 Grad senken"
                >
                    −
                </button>

                <span class="target-temperature">
                    ${formatTemperature(room.heating.target)} °
                </span>

                <button
                    type="button"
                    class="temperature-button"
                    data-action="temperature-up"
                    data-section-id="${sectionId}"
                    data-room-id="${room.id}"
                    aria-label="Solltemperatur um 0,5 Grad erhöhen"
                >
                    +
                </button>
            </div>
        </div>
    `;
}

function createCoverControl(sectionId, room) {
    if (!room.cover) {
        return "";
    }

    return `
        <div class="cover-control">
            <span class="cover-icon" aria-hidden="true">
                <i class="mdi mdi-roller-shade"></i>
            </span>

            <span class="cover-label">
                Rollladen
            </span>

            <div class="cover-actions">
                <button
                    type="button"
                    class="cover-button"
                    data-action="cover-up"
                    data-section-id="${sectionId}"
                    data-room-id="${room.id}"
                    title="Rollladen hochfahren"
                    aria-label="Rollladen hochfahren"
                >
                    <i class="mdi mdi-arrow-up"></i>
                </button>

                <button
                    type="button"
                    class="cover-button"
                    data-action="cover-stop"
                    data-section-id="${sectionId}"
                    data-room-id="${room.id}"
                    title="Rollladen stoppen"
                    aria-label="Rollladen stoppen"
                >
                    <i class="mdi mdi-stop"></i>
                </button>

                <button
                    type="button"
                    class="cover-button"
                    data-action="cover-down"
                    data-section-id="${sectionId}"
                    data-room-id="${room.id}"
                    title="Rollladen herunterfahren"
                    aria-label="Rollladen herunterfahren"
                >
                    <i class="mdi mdi-arrow-down"></i>
                </button>
            </div>
        </div>
    `;
}

function createRoom(sectionId, room) {
    const functions = room.functions
        .map((func) =>
            createFunctionCard(
                sectionId,
                room.id,
                func
            )
        )
        .join("");

    return `
        <article class="room">
            <div class="room-title">
                <button
                    type="button"
                    class="room-title-button"
                    data-action="open-room"
                    data-section-id="${sectionId}"
                    data-room-id="${room.id}"
                    aria-label="Details für ${room.label} öffnen"
                >
                    <span>
                        ${room.label}
                    </span>

                    <i
                        class="mdi mdi-chevron-right room-title-chevron"
                        aria-hidden="true"
                    ></i>
                </button>
            </div>
            ${createHeatingRow(sectionId, room)}
            ${createCoverControl(sectionId, room)}

            <div class="function-grid">
                ${functions}
            </div>
        </article>
    `;
}

function createSection(section) {
    const rooms = section.rooms
        .map((room) =>
            createRoom(section.id, room)
        )
        .join("");

    return `
        <section class="section">
            <div class="section-title">
                ${section.label}
            </div>

            ${rooms}
        </section>
    `;
}

function findSection(sectionId) {
    return sections.find(
        (section) => section.id === sectionId
    );
}

function findRoom(sectionId, roomId) {
    const section = findSection(sectionId);

    return section?.rooms.find(
        (room) => room.id === roomId
    );
}

function findFunction(sectionId, roomId, functionId) {
    const room = findRoom(sectionId, roomId);

    return room?.functions.find(
        (func) => func.id === functionId
    );
}

function findDetailFunction(
    sectionId,
    roomId,
    functionId
) {
    const room = findRoom(
        sectionId,
        roomId
    );

    return room?.detailFunctions?.find(
        (func) => func.id === functionId
    );
}

function render() {
    app.innerHTML = `
        <div class="house-grid">
            ${sections.map(createSection).join("")}
        </div>
    `;
}

function toggleFunction(sectionId, roomId, functionId) {
    const func = findFunction(
        sectionId,
        roomId,
        functionId
    );

    if (!func || func.type === "status") {
        return;
    }

    func.state = !func.state;

    render();
}

function toggleHeating(sectionId, roomId) {
    const room = findRoom(
        sectionId,
        roomId
    );

    if (!room?.heating) {
        return;
    }

    room.heating.hvac =
        room.heating.hvac === "off"
            ? "auto"
            : "off";

    render();
}

function changeTemperature(sectionId, roomId, change) {
    const room = findRoom(
        sectionId,
        roomId
    );

    if (!room?.heating) {
        return;
    }

    const nextTarget =
        room.heating.target + change;

    room.heating.target =
        Math.min(
            24,
            Math.max(16, nextTarget)
        );

    render();
}

function updateBrightness(
    sectionId,
    roomId,
    functionId,
    brightness
) {
    const func = findFunction(
        sectionId,
        roomId,
        functionId
    );

    if (!func || !supportsDimmer(func)) {
        return;
    }

    func.brightness = Number(brightness);
}

function operateCover(sectionId, roomId, operation) {
    const room = findRoom(
        sectionId,
        roomId
    );

    if (!room?.cover) {
        return;
    }

    if (operation === "up") {
        room.cover.position = 100;
    }

    if (operation === "down") {
        room.cover.position = 0;
    }

    if (operation === "stop") {
        return;
    }

    render();
}

function getDetailFunctionIcon(func) {
    const icons = {
        office_pinboard:
            "mdi-lightbulb-outline",

        office_platform:
            "mdi-led-strip-variant",

        window_heating:
            "mdi-radiator"
    };

    return (
        icons[func.id] ??
        `mdi-${func.icon ?? "tune-variant"}`
    );
}

function createDetailDimmer(
    sectionId,
    roomId,
    func
) {
    if (
        !supportsDimmer(func) ||
        func.state !== true
    ) {
        return "";
    }

    return `
        <div class="detail-dimmer">
            <input
                type="range"
                min="1"
                max="100"
                step="1"
                value="${func.brightness}"
                data-modal-action="detail-brightness"
                data-section-id="${sectionId}"
                data-room-id="${roomId}"
                data-function-id="${func.id}"
                aria-label="Helligkeit ${func.label}"
            >

            <span class="detail-dimmer-value">
                ${func.brightness} %
            </span>
        </div>
    `;
}

function createDetailFunction(
    sectionId,
    roomId,
    func
) {
    const isActive =
        func.state === true;

    const icon =
        getDetailFunctionIcon(func);

    return `
        <div class="detail-control">
            <div class="detail-control-header">
                <button
                    type="button"
                    class="detail-toggle
                        ${isActive ? "active" : ""}"
                    data-modal-action="toggle-detail"
                    data-section-id="${sectionId}"
                    data-room-id="${roomId}"
                    data-function-id="${func.id}"
                    aria-pressed="${isActive}"
                    aria-label="${func.label} schalten"
                >
                    <i class="mdi ${icon}"></i>
                </button>

                <span class="detail-label">
                    ${func.label}
                </span>
            </div>

            ${createDetailDimmer(
                sectionId,
                roomId,
                func
            )}
        </div>
    `;
}

function createWindowHeating(
    sectionId,
    roomId,
    func
) {
    const isActive =
        func.hvac !== "off";

    return `
        <div class="detail-card">
            <div class="detail-card-title">
                <i class="mdi mdi-window-closed-variant"></i>
                Fensterheizung
            </div>

            <div class="detail-heating-row">
                <div class="detail-heating-status">
                    <button
                        type="button"
                        class="detail-toggle
                            ${isActive ? "active" : ""}"
                        data-modal-action="toggle-window-heating"
                        data-section-id="${sectionId}"
                        data-room-id="${roomId}"
                        data-function-id="${func.id}"
                        aria-pressed="${isActive}"
                        aria-label="Fensterheizung schalten"
                    >
                        <i class="mdi mdi-radiator"></i>
                    </button>

                    <div class="detail-heating-values">
                        <span class="detail-current-temperature">
                            Ist
                            ${formatTemperature(
                                func.temperature
                            )} °C
                        </span>

                        <span class="detail-secondary">
                            Kondensationsschutz
                        </span>
                    </div>
                </div>

                <div class="detail-temperature-control">
                    <button
                        type="button"
                        class="temperature-button"
                        data-modal-action="window-temperature-down"
                        data-section-id="${sectionId}"
                        data-room-id="${roomId}"
                        data-function-id="${func.id}"
                        aria-label="Solltemperatur senken"
                    >
                        −
                    </button>

                    <span class="detail-temperature-value">
                        ${formatTemperature(
                            func.target
                        )} °
                    </span>

                    <button
                        type="button"
                        class="temperature-button"
                        data-modal-action="window-temperature-up"
                        data-section-id="${sectionId}"
                        data-room-id="${roomId}"
                        data-function-id="${func.id}"
                        aria-label="Solltemperatur erhöhen"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createRgbDetails(
    sectionId,
    roomId,
    func
) {
    const selectedColor =
        func.selectedColor ?? "warm-white";

    const presets = [
        {
            id: "warm-white",
            label: "Warmweiß",
            icon: "mdi-white-balance-sunny"
        },
        {
            id: "red",
            label: "Rot",
            icon: "mdi-circle"
        },
        {
            id: "green",
            label: "Grün",
            icon: "mdi-circle"
        },
        {
            id: "blue",
            label: "Blau",
            icon: "mdi-circle"
        },
        {
            id: "purple",
            label: "Violett",
            icon: "mdi-circle"
        }
    ];

    const buttons = presets
        .map((preset) => `
            <button
                type="button"
                class="color-preset
                    ${
                        selectedColor === preset.id
                            ? "selected"
                            : ""
                    }"
                data-modal-action="select-color"
                data-section-id="${sectionId}"
                data-room-id="${roomId}"
                data-function-id="${func.id}"
                data-color="${preset.id}"
                title="${preset.label}"
                aria-label="${preset.label}"
                aria-pressed="${
                    selectedColor === preset.id
                }"
            >
                <i class="mdi ${preset.icon}"></i>
            </button>
        `)
        .join("");

    return `
        <div class="detail-card">
            <div class="detail-card-title">
                <i class="mdi mdi-palette-outline"></i>
                ${func.label} · Farbe
            </div>

            <div class="color-presets">
                ${buttons}
            </div>
        </div>
    `;
}

function createRoomDetails(
    sectionId,
    room
) {
    const detailFunctions =
        room.detailFunctions ?? [];

    const normalDetails =
        detailFunctions.filter(
            (func) => func.type !== "heating"
        );

    const heatingDetails =
        detailFunctions.filter(
            (func) => func.type === "heating"
        );

    const rgbLights =
        room.functions.filter(
            (func) => func.type === "rgb-dimmer"
        );

    const normalMarkup =
        normalDetails.length > 0
            ? `
                <div class="detail-card">
                    <div class="detail-card-title">
                        <i class="mdi mdi-lightbulb-group-outline"></i>
                        Beleuchtung
                    </div>

                    <div class="detail-grid">
                        ${normalDetails
                            .map((func) =>
                                createDetailFunction(
                                    sectionId,
                                    room.id,
                                    func
                                )
                            )
                            .join("")}
                    </div>
                </div>
            `
            : "";

    const heatingMarkup =
        heatingDetails
            .map((func) =>
                createWindowHeating(
                    sectionId,
                    room.id,
                    func
                )
            )
            .join("");

    const rgbMarkup =
        rgbLights
            .map((func) =>
                createRgbDetails(
                    sectionId,
                    room.id,
                    func
                )
            )
            .join("");

    if (
        normalMarkup === "" &&
        heatingMarkup === "" &&
        rgbMarkup === ""
    ) {
        return `
            <div class="detail-card">
                <div class="detail-card-title">
                    <i class="mdi mdi-information-outline"></i>
                    Übersicht
                </div>

                <p class="detail-empty">
                    Für diesen Raum sind momentan keine
                    zusätzlichen Detailfunktionen definiert.
                    Die täglichen Funktionen werden direkt
                    auf der Hauptseite bedient.
                </p>
            </div>
        `;
    }

    return `
        ${normalMarkup}
        ${heatingMarkup}
        ${rgbMarkup}
    `;
}

function openRoomModal(sectionId, roomId) {
    const room = findRoom(
        sectionId,
        roomId
    );

    if (!room) {
        return;
    }

    lastFocusedElement =
        document.activeElement;

    modalTitle.textContent =
        room.label;

    modalContent.innerHTML =
        createRoomDetails(
            sectionId,
            room
        );

    modal.hidden = false;

    document.body.classList.add(
        "modal-open"
    );

    const closeButton =
        modal.querySelector(".modal-close");

    closeButton?.focus();
}

function closeRoomModal() {
    modal.hidden = true;

    document.body.classList.remove(
        "modal-open"
    );

    lastFocusedElement?.focus();

    lastFocusedElement = null;
}

function refreshOpenModal(
    sectionId,
    roomId
) {
    const room = findRoom(
        sectionId,
        roomId
    );

    if (!room || modal.hidden) {
        return;
    }

    modalContent.innerHTML =
        createRoomDetails(
            sectionId,
            room
        );
}

app.addEventListener("click", (event) => {
    const control =
        event.target.closest("[data-action]");

    if (!control) {
        return;
    }

    const {
        action,
        sectionId,
        roomId,
        functionId
    } = control.dataset;

    if (action === "open-room") {
        openRoomModal(
            sectionId,
            roomId
        );

        return;
    }

    if (action === "toggle-function") {
        toggleFunction(
            sectionId,
            roomId,
            functionId
        );
    }

    if (action === "toggle-heating") {
        toggleHeating(
            sectionId,
            roomId
        );
    }

    if (action === "temperature-down") {
        changeTemperature(
            sectionId,
            roomId,
            -0.5
        );
    }

    if (action === "temperature-up") {
        changeTemperature(
            sectionId,
            roomId,
            0.5
        );
    }

    if (action === "cover-up") {
        operateCover(
            sectionId,
            roomId,
            "up"
        );
    }

    if (action === "cover-stop") {
        operateCover(
            sectionId,
            roomId,
            "stop"
        );
    }

    if (action === "cover-down") {
        operateCover(
            sectionId,
            roomId,
            "down"
        );
    }
});

app.addEventListener("input", (event) => {
    const slider = event.target.closest(
        '[data-action="change-brightness"]'
    );

    if (!slider) {
        return;
    }

    const {
        sectionId,
        roomId,
        functionId
    } = slider.dataset;

    updateBrightness(
        sectionId,
        roomId,
        functionId,
        slider.value
    );

    const valueLabel =
        slider
            .closest(".dimmer-control")
            ?.querySelector(".dimmer-value");

    if (valueLabel) {
        valueLabel.textContent =
            `${slider.value} %`;
    }
});

function changeWindowTemperature(
    sectionId,
    roomId,
    functionId,
    change
) {
    const func =
        findDetailFunction(
            sectionId,
            roomId,
            functionId
        );

    if (!func || func.type !== "heating") {
        return;
    }

    const nextTarget =
        func.target + change;

    func.target =
        Math.min(
            24,
            Math.max(10, nextTarget)
        );

    refreshOpenModal(
        sectionId,
        roomId
    );
}

modal.addEventListener(
    "click",
    (event) => {
        const closeControl =
            event.target.closest(
                '[data-action="close-modal"]'
            );

        if (closeControl) {
            closeRoomModal();
            return;
        }

        const control =
            event.target.closest(
                "[data-modal-action]"
            );

        if (!control) {
            return;
        }

        const {
            modalAction,
            sectionId,
            roomId,
            functionId,
            color
        } = control.dataset;

        if (modalAction === "toggle-detail") {
            const func =
                findDetailFunction(
                    sectionId,
                    roomId,
                    functionId
                );

            if (func) {
                func.state = !func.state;

                refreshOpenModal(
                    sectionId,
                    roomId
                );
            }
        }

        if (
            modalAction ===
            "toggle-window-heating"
        ) {
            const func =
                findDetailFunction(
                    sectionId,
                    roomId,
                    functionId
                );

            if (func) {
                func.hvac =
                    func.hvac === "off"
                        ? "heat"
                        : "off";

                refreshOpenModal(
                    sectionId,
                    roomId
                );
            }
        }

        if (
            modalAction ===
            "window-temperature-down"
        ) {
            changeWindowTemperature(
                sectionId,
                roomId,
                functionId,
                -0.5
            );
        }

        if (
            modalAction ===
            "window-temperature-up"
        ) {
            changeWindowTemperature(
                sectionId,
                roomId,
                functionId,
                0.5
            );
        }

        if (modalAction === "select-color") {
            const func =
                findFunction(
                    sectionId,
                    roomId,
                    functionId
                );

            if (func) {
                func.selectedColor = color;

                refreshOpenModal(
                    sectionId,
                    roomId
                );
            }
        }
    }
);

document.addEventListener(
    "keydown",
    (event) => {
        if (
            event.key === "Escape" &&
            !modal.hidden
        ) {
            closeRoomModal();
        }
    }
);

modal.addEventListener(
    "input",
    (event) => {
        const slider =
            event.target.closest(
                '[data-modal-action="detail-brightness"]'
            );

        if (!slider) {
            return;
        }

        const {
            sectionId,
            roomId,
            functionId
        } = slider.dataset;

        const func =
            findDetailFunction(
                sectionId,
                roomId,
                functionId
            );

        if (!func || !supportsDimmer(func)) {
            return;
        }

        func.brightness =
            Number(slider.value);

        const valueLabel =
            slider
                .closest(".detail-dimmer")
                ?.querySelector(
                    ".detail-dimmer-value"
                );

        if (valueLabel) {
            valueLabel.textContent =
                `${slider.value} %`;
        }
    }
);

render();