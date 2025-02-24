//   main.js
//  
//   Diese Datei ist der Einstiegspunkt der Applikation und verbindet alle Kernkomponenten:
//   Model, View, Controller und ViewModal.
//  
//   1. Importieren der Module:
//      - Model: Beinhaltet die Daten und Logik (z. B. Einkaufslisten).
//      - View: Zuständig für das Rendern der Benutzeroberfläche.
//      - Controller: Vermittelt zwischen Model und View, verarbeitet Benutzereingaben.
//      - ViewModal: Verwaltet modale Fenster (z. B. Details einer Liste).
//  
//   2. Instanziierung:
//      - Es wird eine neue Model-Instanz erstellt, die die Daten speichert.
//      - Eine neue View-Instanz wird erstellt, die die Listen darstellt.
//      - Eine neue ViewModal-Instanz wird erstellt (initial ohne Controller).
//  
//   3. Erstellen des Controllers:
//      - Der Controller wird mit den Instanzen von Model, View und ViewModal erstellt.
//  
//   4. Verknüpfung:
//      - Die Controller-Referenz wird sowohl in der View als auch in der ViewModal gesetzt,
//        damit diese bei Bedarf Controller-Methoden aufrufen können.
//  
//   5. Globale Verfügbarkeit:
//      - Der Controller wird als window.controller verfügbar gemacht, um Debugging zu erleichtern.
//      - Eine Hilfsfunktion addEntry wird global verfügbar gemacht, die auf viewModal.addEntry verweist.
//  
//   6. Laden der Initialdaten:
//      - Die Datei data.json wird geladen.
//      - Die geladenen Daten werden an model.loadData() übergeben, um das Model zu initialisieren.
//

// import { Model } from './model.js';
// import { View } from './view.js';
// import { Controller } from './controller.js';
// import { ViewModal } from './viewModal.js';
//
// // Erstelle Instanzen der Kernkomponenten
// const model = new Model();
// const view = new View();
//
// // Erstelle ViewModal zunächst ohne Controller (Controller wird später zugewiesen)
// const viewModal = new ViewModal();
//
// // Erstelle den Controller und übergebe Model, View und ViewModal
// const controller = new Controller(model, view, viewModal);
//
// // Setze die Controller-Referenz in View und ViewModal, damit beide auf Controller-Methoden zugreifen können
// view.controller = controller;
// viewModal.controller = controller;
//
// // Stelle den Controller global zur Verfügung (z. B. zum Debuggen)
// window.controller = controller;
// // Stelle eine Hilfsfunktion zur Verfügung, um direkt addEntry aufzurufen
// window.addEntry = () => viewModal.addEntry();
//
// // Lade die Initialdaten aus der JSON-Datei und initialisiere das Model
// fetch('./data.json')
//     .then(response => response.json())
//     .then(data => model.loadData(data))
//     .catch(error => console.error('Fehler beim Laden der Daten:', error));

import { Model } from './model.js';
import { View } from './view.js';
import { Controller } from './controller.js';
import { User } from './user.js';
import { ShoppingList } from './shoppingList.js';
import { ShoppingItem } from './shoppingItem.js';
import { ViewModal } from './viewModal.js';

const model = new Model();
const view = new View();
const viewModal = new ViewModal();
const controller = new Controller(model, view, viewModal);

view.controller = controller;
viewModal.controller = controller;

window.controller = controller;
window.addEntry = () => viewModal.addEntry();

// Lade die Initialdaten aus data.json
fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        // Da data ein Objekt mit "shoppingLists" und "users" ist:
        model.loadData(data.shoppingLists);
        model.users = data.users;
    })
    .catch(error => console.error('Fehler beim Laden der Daten:', error));

// // Lade die Kategorien aus categories.json
// sinnvoll JSON-File zu nutzen, wenn die Kategorien extern geladen oder später anpassen will, ohne den Code zu ändern
// fetch('./categories.json')
//     .then(response => response.json())
//     .then(data => {
//         // Setze die geladenen Kategorien im Model, z.B.:
//         model.categories = data.categories;
//     })
//     .catch(error => console.error('Fehler beim Laden der Kategorien:', error));