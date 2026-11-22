# HMI Architecture

**Project:** Home Assistant HMI Redesign  
**Document status:** Initial baseline derived from the approved HTML prototype `v1.0.0`  
**Scope:** Family-facing HMI and operator-facing detail views  
**Language:** German HMI, English backend identifiers

## 1. Purpose

This document defines the target architecture and interaction principles for a new Home Assistant dashboard. The existing Home Assistant configuration is treated as a source of functional knowledge, not as a technical architecture to preserve.

The target is a compact, room-oriented Human-Machine Interface (HMI) that combines status and direct control. Daily functions must be usable without opening a popup wherever practical. Less frequently used settings and diagnostic information may be placed in room details or a separate technical view.

## 2. Scope and guiding principles

### 2.1 Greenfield implementation

The dashboard and supporting YAML structure will be rebuilt and optimized. Existing entity IDs, packages, automations, and dashboard files are not assumed to be suitable for reuse.

Existing code may be used to identify:

- physical devices and their current function
- room assignments
- required automations
- special technical dependencies
- established family terminology

### 2.2 HMI first

The HMI represents how the house is understood and operated, not how devices are electrically connected.

Examples:

- Office and bedroom remain separate HMI rooms even though one physical switching logic controls both lighting functions.
- Kitchen worktop and coffee corner remain separate HMI functions even if a physical Sonoff switch can operate both.
- Technical device names such as `sonoff_11` are not shown to family users.

### 2.3 Status and control are combined

A control surface is also a status surface. Each visible control must communicate its current state.

Examples:

- active lights use a visible active state
- dimmers show the current brightness
- heating shows room temperature and target temperature together
- covers provide direct Up, Stop, and Down controls
- washing machine and dryer are status objects, not power switches

### 2.4 Progressive disclosure

Frequently used functions remain on the main room card. Less frequently used settings are moved to room details.

**Main card examples:**

- room temperature and heating target
- primary lights and switches
- dimmers while the corresponding light is on
- cover Up, Stop, and Down controls
- appliance status

**Room-detail examples:**

- RGB color presets
- Lotta's window heating
- separate office pinboard and platform controls
- future cover position sliders

### 2.5 Private-project pragmatism

Documentation and implementation must remain maintainable without imposing unnecessary industrial process. Documents grow alongside the implementation. New abstractions are introduced only when they solve an observed problem.

## 3. Language model

The project deliberately separates backend language from HMI language.

| Layer | Language | Example |
|---|---|---|
| Physical device and network name | English, with persistent hardware number | `sonoff-mini-11-heating-living-room` |
| Home Assistant entity ID | English | `climate.living_room` |
| HMI room and function label | German, concise | `Wohnzimmer`, `Heizung`, `TV-Board` |

German HMI labels may use familiar Anglicisms where they are shorter or more natural, for example `TV-Board`, `LED-Decke`, `RGB`, `Dimmer`, and `Auto`.

## 4. Information architecture

### 4.1 Primary views

The initial Home Assistant dashboard contains these views or equivalent filters:

1. **Übersicht**
2. **EG**
3. **OG**
4. **DG**
5. **Garten**
6. **Technik** (later phase)

### 4.2 Overview behavior

The overview initially shows all rooms and all agreed primary controls. It is not reduced to favorites in the first implementation.

Favorites and a more selective landing page may be introduced after real-world usage has shown which controls are most important.

Weather is not part of the initial overview.

### 4.3 Section layout

On desktop, the overview presents four vertical sections next to each other:

- Erdgeschoss
- Obergeschoss
- Dachgeschoss
- Garten

On narrower screens, sections reflow responsively. Room-function controls use a two-column grid where usable. A single-column fallback is permitted only when controls or German labels become too narrow.

### 4.4 Hall placement

The hall is always the first room card in its floor section. The HMI label is simply `Flur`; the floor is implied by the containing section.

Backend names remain unambiguous, for example:

- `first_floor_hall`
- `attic_hall`

Future stairwell lights will be assigned to one floor and one room rather than represented as cross-floor objects, unless practical use later demonstrates a need for a separate concept.

## 5. Room-card architecture

### 5.1 General structure

A room card consists of:

1. room title
2. optional inline climate row
3. optional cover control
4. primary functions in a compact two-column grid
5. optional access to room details

### 5.2 Inline climate row

For heated rooms, current room temperature and target setting are displayed on one horizontal line.

Conceptual structure:

```text
Ist 22,7 °C       [Heizung] [−] 21,5 °C [+]
```

Rules:

- temperature step: `0.5 °C`
- radiator icon acts as quick on/off control
- complete HVAC selection is available in room details
- supported HVAC modes: `off`, `auto`, `heat`
- state colors distinguish off, enabled/idle, and actively heating
- TRV temperature and diagnostic values are not shown on the family HMI

### 5.3 Lighting controls

Lighting controls are classified by user capability rather than protocol or hardware type.

| Capability | Main-card behavior |
|---|---|
| Switchable | icon and label, direct on/off |
| Dimmable | switch plus brightness slider while on |
| RGB-capable | switch plus brightness slider while on; colors in room details |

The brightness slider is hidden when the light is off. RGB presets and color controls are hidden from the main card.

### 5.4 Cover controls

Covers are always visible on the main room card where present.

Main-card controls:

- Up
- Stop
- Down

A position slider is a detail function and is excluded from the initial main-card implementation.

### 5.5 Status objects

Washing machine and dryer are shown as read-only status objects.

Example states:

- Bereit
- Läuft
- Fertig

Underlying smart-plug state, power consumption, notification helpers, and state-machine internals belong in the technical view.

## 6. Target room structure

### 6.1 Erdgeschoss

#### Hauseingang

Primary controls:

- Außenbeleuchtung

#### Wohnzimmer

Primary controls:

- Heizung
- Bogenlampe
- TV-Board

Notes:

- TV-Board is a primary function.
- Bogenlamp brightness presets may be introduced later if they prove useful in the HMI.

#### Küche

Primary controls:

- Heizung
- Arbeitsfläche, dimmable
- Kaffee-Ecke, dimmable
- Essecke, switchable decorative light
- Schwibbogen, switchable seasonal/decorative socket function

Notes:

- Worktop and coffee corner remain separate HMI functions.
- Lighting groups and scenes are deferred until after initial real-world use.

#### Gästebad

Primary controls/status:

- Licht, with motion-sensor logic in the backend
- Waschmaschine status
- Trockner status

#### Hauswirtschaftsraum

Primary controls:

- Licht, with motion-sensor logic in the backend

The ground-floor hall is not shown because the former controllable light was removed during renovation.

### 6.2 Obergeschoss

#### Flur

Primary controls:

- Kommode, dimmable white LED strip

#### Arbeitszimmer

Primary controls:

- Heizung
- Rollladen, Up/Stop/Down
- Arbeitslicht, grouped main control

Room details:

- Pinnwand, separate switch
- Podest, separate dimmable light

Notes:

- Pinnwand and Podest are technically coupled by a physical switch but may be controlled separately in room details.

#### Schlafzimmer

Primary controls:

- Heizung
- Rollladen, Up/Stop/Down
- Schlafzimmerlicht, dimmable

Room details:

- RGB presets for Schlafzimmerlicht

Notes:

- Office and bedroom are distinct HMI rooms despite shared physical switching logic caused by the later room division and single ceiling outlet.

#### Gästezimmer

Primary controls:

- Heizung
- Tischlampe, dimmable

### 6.3 Dachgeschoss

#### Flur

Primary controls:

- Schuhschrank

#### Lotta

Primary controls:

- Heizung
- LED-Decke, dimmable and RGB-capable
- Tischlampe, dimmable
- Aquarium, switchable light

Room details:

- Fensterheizung with own on/off and target temperature
- RGB presets for LED-Decke

Notes:

- Fensterheizung is a second climate function used primarily in cold weather to reduce condensation.
- Its target is adjustable but typically changed infrequently.
- Future automation based on outdoor temperature or condensation indicators is possible.

#### Lene

Primary controls:

- Heizung
- LED-Decke, dimmable and RGB-capable

Room details:

- RGB presets for LED-Decke

### 6.4 Garten

#### Terrasse

Primary controls:

- Terrassenlicht, technically a switched socket used for lighting

#### Kinderhaus

Primary controls:

- Dachbeleuchtung
- Stern
- Beleuchtung neben Kinderhaus

The Kinderhaus is treated as a normal room card and receives no special hero treatment.

## 7. Detail views and popups

Room details are used for secondary controls, not as a prerequisite for common actions.

A room popup may contain:

- HVAC mode selection
- RGB presets
- secondary lights split from a main group
- Lotta's window heating
- future cover-position control

The popup must work as:

- centered dialog on desktop/tablet
- bottom sheet on smartphone

The main card remains usable if the popup is never opened.

## 8. Theme and visual system

### 8.1 Themes

Two Home Assistant themes will be implemented:

- Night Control Dark
- Night Control Light

Theme switching may initially be manual. Automatic switching based on time or solar state may be added later.

### 8.2 Light-theme hierarchy

The light theme must maintain visible separation between hierarchy levels:

1. dashboard background
2. floor/section container
3. room card
4. individual control

Sections and room cards require visible borders. The interface must not rely on white-on-white surfaces or shadows alone.

### 8.3 Icon system

- Material Design Icons (MDI)
- outline variants preferred
- standard filled MDI accepted when no suitable outline exists
- consistent circular Mushroom-style icon background
- no emoji icons

### 8.4 State colors

Initial semantic color system:

| State/function | Color behavior |
|---|---|
| Inactive/off | neutral gray |
| Active light | restrained amber |
| Temperature/value | blue |
| Heating enabled but idle | blue |
| Actively heating | orange |
| Finished appliance | green |
| Error/unavailable | red, reserved for true faults |

Exact colors will be refined in Home Assistant themes rather than treated as fixed by the HTML prototype.

## 9. Family HMI and technical view separation

### 9.1 Family HMI

The family HMI contains only operationally relevant controls and statuses:

- light
- heating
- covers
- important sockets
- washing-machine/dryer status
- future scenes where validated by use

### 9.2 Technical/operator view

A later technical view may contain:

- room sensor temperature
- TRV current and target temperature
- Better Thermostat data
- valve positions
- heating-pump status
- unavailable entities
- automation health
- Raspberry Pi system information
- Home Assistant version and uptime
- last restart or crash indicators
- MQTT and Zigbee2MQTT status
- device batteries and maintenance information

Technical data must not clutter the family HMI.

## 10. Backend boundary

The HMI architecture does not prescribe direct exposure of physical entities. A functional Home Assistant entity may abstract one or more physical devices.

Conceptual layers:

```text
Physical device
→ integration/raw entity
→ functional entity or group
→ HMI control
```

Example:

```text
sonoff-mini-11-heating-living-room
→ switch.sonoff_mini_11_heating_living_room
→ climate.living_room
→ HMI: Wohnzimmer / Heizung
```

Physical numbering remains documented and traceable for maintenance, Fritz!Box identification, replacement, and fault diagnosis.

## 11. Implementation strategy

The Lovelace implementation will follow a room-by-room pilot approach:

1. Wohnzimmer
2. Küche
3. Arbeitszimmer
4. remaining rooms by floor
5. technical view

The Wohnzimmer pilot validates:

- Sections layout
- Mushroom climate control
- inline current/target-temperature arrangement
- primary switches
- themes
- responsive behavior

The Kitchen pilot adds multiple lights and conditional dimmers. The Office pilot adds covers, grouping, and separated detail controls.

## 12. Out of scope for the initial YAML pilot

The following items are deliberately deferred:

- favorites-based landing page
- weather card
- stairwell lighting not yet installed
- automatic theme switching
- new lighting groups and scenes
- automated Lotta window heating
- production-system migration
- full technical/admin view
- pixel-perfect recreation of the HTML prototype

## 13. Decision log

| Decision | Status |
|---|---|
| Greenfield dashboard/YAML design | Approved |
| Existing code used only as functional evidence | Approved |
| Backend identifiers in English | Approved |
| Family HMI in concise German | Approved |
| Overview initially shows all rooms/functions | Approved |
| Four floor/garden sections on desktop | Approved |
| Hall first in each floor section | Approved |
| Inline current temperature and target control | Approved |
| Temperature step 0.5 °C | Approved |
| HVAC modes off/auto/heat | Approved |
| Dimmer visible only while light is on | Approved |
| RGB controls in room details | Approved |
| Cover Up/Stop/Down on main card | Approved |
| Cover position slider in details | Deferred |
| Kinderhaus treated as normal room | Approved |
| Technical/operator information separated | Approved |
| Final colors refined in HA themes | Approved |

## 14. Related project documents

This document is complemented by:

- `ENTITY_NAMING.md`
- `HARDWARE_INVENTORY.md`
- `ENTITY_MAPPING.md`

The approved interaction reference is the HTML prototype tagged:

```text
v1.0.0
```
