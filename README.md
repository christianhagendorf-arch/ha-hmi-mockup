# Home Assistant HMI Mockup

Interaktiver HTML-Prototyp für die Neuentwicklung eines
raumorientierten Home-Assistant-Dashboards.

## Status

Der HTML-Prototyp wurde als `v1.0.0` funktional abgenommen.

Der Prototyp dient als Referenz für:

- Informationsarchitektur
- Raum- und Etagenstruktur
- Bedienlogik
- responsive Darstellung
- Light- und Dark-Theme
- Mushroom-orientierte Steuerkarten
- Detailansichten

## Enthaltene Funktionen

- Übersicht für Erdgeschoss, Obergeschoss, Dachgeschoss und Garten
- Etagenfilter
- Lichtschalter und bedingte Dimmer
- Heizungssteuerung in 0,5-°C-Schritten
- HVAC-Modi Aus, Auto und Heizen
- Rollladensteuerung
- RGB-Presets
- separate Fensterheizung in Lottas Zimmer
- Raumdetails als responsive Dialoge
- persistente Simulationswerte
- Demo-Reset
- Light- und Dark-Theme

## Projektphasen

1. HTML-HMI-Prototyp: abgeschlossen
2. Architektur- und Namensdokumentation: in Arbeit
3. Entitäten- und Hardware-Mapping: geplant
4. Home-Assistant-YAML-Pilot: geplant
5. Migration auf das Testsystem: geplant

## Hinweise

Der Prototyp verwendet simulierte Zustände und besitzt keine
Verbindung zu Home Assistant.

Backend-Entitäten werden künftig strikt englisch benannt.
Die Benutzeroberfläche bleibt deutschsprachig und verwendet
kurze, familiengerechte Bezeichnungen.