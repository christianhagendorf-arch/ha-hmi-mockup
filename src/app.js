import { house } from "./data.js";

const app = document.getElementById("app");

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
                ${room.label}
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

render();