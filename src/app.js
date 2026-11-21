import { house } from "./data.js";

const app =
    document.getElementById("app");

function createFunctionCard(func){

    return `
        <div class="function">

            ${func.label}

        </div>
    `;
}

function createHeatingRow(room){

    if(!room.heating){

        return "";
    }

    return `
        <div class="temperature-row">

            <div class="temperature">

                ${room.temperature} °C

            </div>

            <div>

                🔥
                [-]

                ${room.heating.target} °C

                [+]

            </div>

        </div>
    `;
}

function createRoom(room){

    return `
        <div class="room">

            <div class="room-title">

                ${room.label}

            </div>

            ${createHeatingRow(room)}

            <div class="function-grid">

                ${room.functions
                    .map(createFunctionCard)
                    .join("")}

            </div>

        </div>
    `;
}

function createSection(section){

    return `
        <section class="section">

            <div class="section-title">

                ${section.label}

            </div>

            ${section.rooms
                .map(createRoom)
                .join("")}

        </section>
    `;
}

app.innerHTML =

`
<div class="house-grid">

    ${[
        house.groundFloor,
        house.upperFloor,
        house.atticFloor,
        house.garden
    ]
    .map(createSection)
    .join("")}

</div>
`;