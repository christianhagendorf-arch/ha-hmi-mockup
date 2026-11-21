import { house } from "./data.js";

const app = document.getElementById("app");

function createFunctionCard(func) {
    const isActive = func.state === true;

    return `
        <div class="function ${isActive ? "active" : ""}">
            <div class="function-icon">
                ○
            </div>

            <div class="function-label">
                ${func.label}
            </div>
        </div>
    `;
}

function createHeatingRow(room) {
    if (!room.heating) {
        return "";
    }

    return `
        <div class="temperature-row">
            <div class="temperature">
                ${room.temperature} °C
            </div>

            <div class="heating-control">
                <span class="heating-symbol">♨</span>
                <button type="button" class="temperature-button">−</button>
                <span class="target-temperature">
                    ${room.heating.target} °C
                </span>
                <button type="button" class="temperature-button">+</button>
            </div>
        </div>
    `;
}

function createRoom(room) {
    const functions = room.functions
        .map(createFunctionCard)
        .join("");

    return `
        <article class="room">
            <div class="room-title">
                ${room.label}
            </div>

            ${createHeatingRow(room)}

            <div class="function-grid">
                ${functions}
            </div>
        </article>
    `;
}

function createSection(section) {
    const rooms = section.rooms
        .map(createRoom)
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

const sections = [
    house.groundFloor,
    house.upperFloor,
    house.atticFloor,
    house.garden
];

app.innerHTML = `
    <div class="house-grid">
        ${sections.map(createSection).join("")}
    </div>
`;