export const house = {

    groundFloor: {

        id: "ground_floor",

        label: "Erdgeschoss",

        rooms: [

            {
                id: "entrance",

                label: "Hauseingang",

                functions: [

                    {
                        id: "entrance_light",
                        label: "Außenbeleuchtung",
                        type: "switch",
                        icon: "lightbulb-outline",
                        state: false
                    }
                ]
            },

            {
                id: "living_room",

                label: "Wohnzimmer",

                temperature: 22.7,

                heating: {
                    target: 21.5,
                    hvac: "auto"
                },

                functions: [

                    {
                        id: "arc_lamp",
                        label: "Bogenlampe",
                        type: "switch",
                        icon: "floor-lamp-outline",
                        state: false
                    },

                    {
                        id: "tv_board",
                        label: "TV-Board",
                        type: "switch",
                        icon: "television",
                        state: true
                    }
                ]
            },

            {
                id: "kitchen",

                label: "Küche",

                temperature: 22.0,

                heating: {
                    target: 21.5,
                    hvac: "auto"
                },

                functions: [

                    {
                        id: "worktop",
                        label: "Arbeitsfläche",
                        type: "dimmer",
                        icon: "lightbulb-outline",
                        state: true,
                        brightness: 80
                    },

                    {
                        id: "coffee_corner",
                        label: "Kaffee-Ecke",
                        type: "dimmer",
                        icon: "coffee",
                        state: true,
                        brightness: 40
                    },

                    {
                        id: "dining_corner",
                        label: "Essecke",
                        type: "switch",
                        icon: "lightbulb-outline",
                        state: false
                    },

                    {
                        id: "window_light",
                        label: "Schwibbogen",
                        type: "switch",
                        icon: "candlestick",
                        state: false
                    }
                ]
            },

            {
                id: "guest_bathroom",

                label: "Gästebad",

                functions: [

                    {
                        id: "guest_bath_light",
                        label: "Licht",
                        type: "switch",
                        icon: "lightbulb-outline",
                        state: false
                    },

                    {
                        id: "washing_machine",
                        label: "Waschmaschine",
                        type: "status",
                        icon: "washing-machine",
                        state: "running"
                    },

                    {
                        id: "dryer",
                        label: "Trockner",
                        type: "status",
                        icon: "tumble-dryer",
                        state: "finished"
                    }
                ]
            },

            {
                id: "utility_room",

                label: "Hauswirtschaftsraum",

                functions: [

                    {
                        id: "utility_light",
                        label: "Licht",
                        type: "switch",
                        icon: "lightbulb-outline",
                        state: false
                    }
                ]
            }
        ]
    },

    upperFloor: {

        id: "upper_floor",

        label: "Obergeschoss",

        rooms: [

            {
                id: "hall",

                label: "Flur",

                functions: [

                    {
                        id: "sideboard_light",
                        label: "Kommode",
                        type: "dimmer",
                        icon: "led-strip-variant",
                        state: true,
                        brightness: 45
                    }
                ]
            },

            {
                id: "office",

                label: "Arbeitszimmer",

                temperature: 20.1,

                heating: {
                    target: 18.0,
                    hvac: "auto"
                },

                cover: {
                    position: 100
                },

                detailFunctions: [
                    {
                        id: "office_pinboard",
                        label: "Pinnwand",
                        type: "switch",
                        icon: "lightbulb-outline",
                        state: true
                    },

                    {
                        id: "office_platform",
                        label: "Podest",
                        type: "dimmer",
                        icon: "led-strip-variant",
                        state: true,
                        brightness: 40
                    }
                ],

                functions: [

                    {
                        id: "office_light",
                        label: "Arbeitslicht",
                        type: "group",
                        icon: "lightbulb-outline",
                        state: true
                    }
                ]
            },

            {
                id: "bedroom",

                label: "Schlafzimmer",

                temperature: 19.5,

                heating: {
                    target: 20.0,
                    hvac: "auto"
                },

                cover: {
                    position: 28
                },

                functions: [

                    {
                        id: "bedroom_light",
                        label: "Schlafzimmerlicht",
                        type: "rgb-dimmer",
                        icon: "led-strip-variant",
                        state: true,
                        brightness: 55
                    }
                ]
            },

            {
                id: "guest_room",

                label: "Gästezimmer",

                temperature: 20.8,

                heating: {
                    target: 18.0,
                    hvac: "auto"
                },

                functions: [

                    {
                        id: "guest_lamp",
                        label: "Tischlampe",
                        type: "dimmer",
                        icon: "lamp-outline",
                        state: true,
                        brightness: 30
                    }
                ]
            }
        ]
    },

    atticFloor: {

        id: "attic_floor",

        label: "Dachgeschoss",

        rooms: [

            {
                id: "hall",

                label: "Flur",

                functions: [

                    {
                        id: "shoe_cabinet",
                        label: "Schuhschrank",
                        type: "switch",
                        icon: "lightbulb-outline",
                        state: false
                    }
                ]
            },

            {
                id: "lotta",

                label: "Lotta",

                temperature: 20.5,

                heating: {
                    target: 18.0,
                    hvac: "auto"
                },

                detailFunctions: [
                    {
                        id: "window_heating",
                        label: "Fensterheizung",
                        type: "heating",
                        icon: "radiator",
                        temperature: 18.4,
                        target: 19.0,
                        hvac: "heat"
                    }
                ],

                functions: [

                    {
                        id: "lotta_ceiling",
                        label: "LED-Decke",
                        type: "rgb-dimmer",
                        icon: "led-strip-variant",
                        state: true,
                        brightness: 60
                    },

                    {
                        id: "lotta_desk_lamp",
                        label: "Tischlampe",
                        type: "dimmer",
                        icon: "lamp-outline",
                        state: true,
                        brightness: 45
                    },

                    {
                        id: "aquarium",
                        label: "Aquarium",
                        type: "switch",
                        icon: "fish",
                        state: true
                    }
                ]
            },

            {
                id: "lene",

                label: "Lene",

                temperature: 19.7,

                heating: {
                    target: 20.5,
                    hvac: "auto"
                },

                functions: [

                    {
                        id: "lene_ceiling",
                        label: "LED-Decke",
                        type: "rgb-dimmer",
                        icon: "led-strip-variant",
                        state: true,
                        brightness: 70
                    }
                ]
            }
        ]
    },

    garden: {

        id: "garden",

        label: "Garten",

        rooms: [

            {
                id: "terrace",

                label: "Terrasse",

                functions: [

                    {
                        id: "terrace_light",
                        label: "Terrassenlicht",
                        type: "switch",
                        icon: "power-socket-eu",
                        state: false
                    }
                ]
            },

            {
                id: "playhouse",

                label: "Kinderhaus",

                functions: [

                    {
                        id: "roof_light",
                        label: "Dachbeleuchtung",
                        type: "switch",
                        icon: "lightbulb-outline",
                        state: true
                    },

                    {
                        id: "star",
                        label: "Stern",
                        type: "switch",
                        icon: "star-outline",
                        state: false
                    },

                    {
                        id: "outside_light",
                        label: "Außenbeleuchtung",
                        type: "switch",
                        icon: "lightbulb-outline",
                        state: true
                    }
                ]
            }
        ]
    }
};