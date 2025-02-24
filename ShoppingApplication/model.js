//
//   Model.js
//
//   Diese Klasse verwaltet die zentralen Daten der Applikation – in diesem Fall die Einkaufslisten.
//   Sie implementiert das Observer-Pattern, sodass alle Views (oder andere Observer) automatisch
//   benachrichtigt werden, wenn sich die Daten (Listen) ändern.
//
//   Hauptaufgaben:
//    - Speichern und Verwalten der Einkaufslisten.
//    - Hinzufügen, Löschen und Aktualisieren von Listen.
//    - Benachrichtigen der Observer, wenn sich das Model ändert.
//
//   Methoden:
//    - constructor(): Initialisiert die Listen, die Observer und den Startwert für eindeutige IDs.
//    - addObserver(observer): Fügt einen Observer hinzu, der bei Datenänderungen informiert wird.
//    - notifyObservers(): Informiert alle registrierten Observer über Änderungen im Model.
//    - loadData(data): Lädt Daten (z.B. aus einer JSON-Datei) in das Model, berechnet die nächste freie ID
//                       und benachrichtigt die Observer.
//    - addList(listName): Erstellt eine neue Liste mit einem eindeutigen Namen und fügt sie dem Model hinzu.
//    - deleteList(listId): Löscht eine Liste anhand ihrer ID und benachrichtigt die Observer.
//

export class Model {
    constructor() {
        this.lists = [];          // Array zum Speichern aller Einkaufslisten
        this.observers = [];      // Array für Observer (z. B. Views), die bei Änderungen benachrichtigt werden
        this.currentId = 1;       // Startwert für fortlaufende eindeutige IDs
        this.categories = ["backwaren", "fleischwaren", "milchprodukte", "obst", "gemuese", "gewuerze", "getraenke", "sonstiges"];

    }

    // Observer hinzufügen (z. B. die View)
    addObserver(observer) {
        this.observers.push(observer);
    }

    // Alle Observer benachrichtigen (bei Änderungen im Model)
    notifyObservers() {
        console.log("Notify Observers mit Listen:", this.lists); // Debug: Zeigt aktuelle Listen im Konsolen-Log
        // Jeder Observer erhält die aktuelle Liste zur Aktualisierung
        this.observers.forEach(observer => observer.update(this.lists));
    }

    // Daten (z. B. aus einer JSON-Datei) laden
    loadData(data) {
        this.lists = data; // Übernehme die geladenen Einkaufslisten

        // Berechne die nächste freie ID:
        if (this.lists.length > 0) {
            // Ermittle die höchste ID in den Listen und setze currentId auf diese + 1
            this.currentId = Math.max(...this.lists.map(list => list.id)) + 1;
        } else {
            // Falls keine Listen vorhanden sind, starte mit ID 1
            this.currentId = 1;
        }

        this.notifyObservers(); // Aktualisiere die View nach dem Laden der Daten
    }

    // Neue Liste hinzufügen
    addList(listName) {
        // Erstelle ein neues Listenobjekt
        const newList = {
            id: this.currentId,      // Eindeutige ID vergeben
            name: listName,          // Name der Liste
            items: [],               // Leeres Array für Listeneinträge
            completed: false         // Standardmäßig als "nicht abgeschlossen" markiert
        };
        this.lists.push(newList);    // Füge die neue Liste zum Array hinzu
        this.currentId++;            // Erhöhe die ID für die nächste Liste
        this.notifyObservers();      // Aktualisiere die View
    }

    // Liste löschen
    deleteList(listId) {
        console.log("Aktuelle Listen im Model:", this.lists); // Debug: Zeigt alle Listen vor dem Löschen

        // Finde den Index der Liste im Array anhand ihrer ID
        const listIndex = this.lists.findIndex(list => list.id == listId);
        console.log("Index der Liste:", listIndex); // Debug: Zeigt den gefundenen Index

        if (listIndex !== -1) {
            console.log("Liste gefunden. Lösche Liste mit ID:", listId); // Debug: Liste wird gelöscht

            // Entferne die Liste aus dem Array
            this.lists.splice(listIndex, 1);

            // Benachrichtige alle Observer, damit die View aktualisiert wird
            this.notifyObservers();
        } else {
            console.log("Liste nicht gefunden! Löschen abgebrochen."); // Fehler-Log, falls die Liste nicht existiert
        }
    }
}
