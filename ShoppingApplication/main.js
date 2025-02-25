//   Einstiegspunkt der Shopping-App.
//  
//   Diese Datei initialisiert die Kernkomponenten der Anwendung gemäß dem MVC-Prinzip:
//  
//   1. Model: Verwalten der Daten (Einkaufslisten, Benutzer, Artikel usw.).
//   2. View: Zuständig für das Rendering der Benutzeroberfläche.
//   3. Controller: Vermittelt zwischen Model und View; verarbeitet Benutzeraktionen und steuert
//      den Ablauf der Anwendung.
//   4. ViewModal: Spezielle View-Komponente zum Verwalten von modalen Fenstern (z.B. für die Detailansicht einer Liste).
//  
//   Zudem werden hier die Initialdaten aus der data.json geladen und ins Model eingespeist.
//  
//   Hinweise:
//   - Die Zeile `window.controller = controller;` stellt den Controller global bereit (z. B. zum Debugging).

//////////////////
////// Imports von Modulen/Klassen
//////////////////
import { Model } from './model.js';
import { View } from './view.js';
import { Controller } from './controller.js';
import { User } from './user.js';
import { ShoppingList } from './shoppingList.js';
import { ShoppingItem } from './shoppingItem.js';
import { ViewModal } from './viewModal.js';

//////////////////
////// Instanzen werden erstellt
//////////////////
const model = new Model();
const view = new View();
const viewModal = new ViewModal();
const controller = new Controller(model, view, viewModal);

//////////////////
////// Zuweisung und Referenz zu controller, damit event-handling delegiert werden kann zu controller
//////////////////
view.controller = controller;
viewModal.controller = controller;

//////////////////
////// globaler Zugriff zu controller
//////////////////
window.controller = controller;

//////////////////
////// Inhalte laden aus data.json mithilfe model
//////////////////
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