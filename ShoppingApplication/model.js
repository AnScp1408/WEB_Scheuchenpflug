//   Diese Klasse verwaltet alle Daten der Einkaufslistenapplikation.
//   Sie speichert Einkaufslisten, Items und Kategorien und implementiert die gesamte
//   Geschäftslogik der Anwendung. Dabei werden alle CRUD-Operationen (Create, Read, Update, Delete)
//   sowie Statusänderungen (z. B. Listen abschließen, wieder öffnen) durchgeführt.
//  
//   Zudem implementiert das Model das Observer-Pattern:
//   - Observer (z. B. Views) können sich registrieren und werden benachrichtigt, wenn sich
//     die Daten im Model ändern.
//  
//   Diese Klasse ist Teil der Model-Schicht im MVC-Architekturmodell und enthält keine
//   UI-spezifische Logik.
//

export class Model {
    constructor() {
        this.lists = [];          // Array zum Speichern aller Einkaufslisten
        this.observers = [];      // Array für Observer (z. B. Views), die bei Änderungen benachrichtigt werden
        this.currentId = 1;       // Startwert für fortlaufende eindeutige IDs
        this.categories = ["backwaren", "fleischwaren", "milchprodukte", "obst", "gemuese", "gewuerze", "getraenke", "sonstiges"]; // Standard Kategorien

    }

    //////////////////
    ////// Observer hinzufügen (wird benachrichtigt, wenn sich Daten ändern)
    ////// Parameter observer, ist Objekt mit update() Methode
    //////und
    ////// Observer benachrichtigen, wenn Daten ändern, mit Debug Ausgabe
    //////////////////

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        console.log("Notify Observers mit Listen:", this.lists); //Zeigt aktuelle Listen im Konsolen-Log
        // Jeder Observer erhält die aktuelle Liste zur Aktualisierung
        this.observers.forEach(observer => observer.update(this.lists));
    }

    //////////////////
    ////// Daten (z. B. aus einer JSON-Datei) laden, wird in main aufgerufen
    ////// interner Zähler, weil die ID immer einzigartig bleiben muss
    //////////////////

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

    //////////////////
    ////// LISTEN:
    ////// - hinzufügen
    ////// - löschen
    ////// - umbenennen
    ////// - ID herausfinden
    ////// - abschließen
    ////// - wieder öffnen
    ////// - abgeschlossen?
    ////// - teilen
    //////////////////

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

    deleteList(listId) {
        this.lists = this.lists.filter(list => list.id != listId);
        this.notifyObservers();
    }

    renameList(listId, newName) {
        const list = this.getListById(listId);
        if (list) {
            list.name = newName;
            this.notifyObservers();
        }
    }

    getListById(listId) {
        return this.lists.find(list => list.id == listId);
    }

    markListComplete(listId) {
        const list = this.getListById(listId);
        if (list) {
            list.completed = true;
            list.items.forEach(item => item.completed = true);
            this.notifyObservers();
        } else {
            console.error("Liste mit ID " + listId + " nicht gefunden!");
        }
    }

    reopenList(listId) {
        const list = this.getListById(listId);
        if (list) {
            list.completed = false;
            list.items.forEach(item => item.completed = false);
            this.notifyObservers();
        } else {
            console.error("Liste nicht gefunden");
        }
    }

    markListIfComplete(listId) {
        const list = this.getListById(listId);
        if (list) {
            list.completed = list.items.length > 0 && list.items.every(item => item.completed);
            this.notifyObservers();
        }
    }

    shareList(listId, participantName) {
        const list = this.getListById(listId);
        if (list) {
            if (!list.participants) {
                list.participants = [];
            }
            if (!list.participants.includes(participantName)) {
                list.participants.push(participantName);
                this.notifyObservers();
            }
        } else {
            console.error("Liste mit ID " + listId + " nicht gefunden!");
        }
    }

    //////////////////
    ////// ITEMS:
    ////// -hinzufügen
    ////// -löschen
    ////// -bearbeiten
    //////////////////

    addItem(listId, newItem) {
        const list = this.getListById(listId);
        if (list) {
            // Optional: Eine eindeutige ID für den neuen Eintrag vergeben
            newItem.id = this.currentId++;
            list.items.push(newItem);
            this.notifyObservers();
        } else {
            console.error("Liste nicht gefunden!");
        }
    }

    deleteItem(listId, itemIndex) {
        const list = this.getListById(listId);
        if (list && list.items[itemIndex] !== undefined) {
            list.items.splice(itemIndex, 1);
            this.notifyObservers();
        } else {
            console.error("Liste oder Item nicht gefunden!");
        }
    }

    updateItem(listId, itemId, updateData) {
        const list = this.getListById(listId);
        if (list) {
            const item = list.items.find(item => item.id == itemId);
            if (item) {
                Object.assign(item, updateData);
                this.notifyObservers();
            } else {
                console.error("Item nicht gefunden");
            }
        } else {
            console.error("Liste nicht gefunden");
        }
    }

    //////////////////
    ////// neue Kategorie hinzufügen
    //////////////////

    addCategory(categoryName) {
        const cat = categoryName.toLowerCase();
        if (!this.categories.includes(cat)) {
            this.categories.push(cat);
            this.notifyObservers();
        }
    }
}
