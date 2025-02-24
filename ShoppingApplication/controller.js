//
//   Controller.js
//
//   Diese Controller-Klasse vermittelt zwischen Model und View/ViewModal und steuert
//   die Hauptlogik der Applikation. Sie enthält Methoden zum Erstellen, Öffnen,
//   Bearbeiten, Löschen und Aktualisieren von Einkaufslisten sowie zum Verwalten
//   von Listeneinträgen.
//
//   Hauptfunktionen:
//   - Initialisiert das Model, die View und die ViewModal und registriert die View als Observer im Model.
//   - Verarbeitet Benutzeraktionen (z.B. Listen hinzufügen, öffnen, umbenennen, abschließen, wieder öffnen)
//     und leitet diese an das Model weiter.
//   - Aktualisiert die Ansicht, indem es nach Änderungen im Model die Observer benachrichtigt.
//
//   Methoden:
//
//   constructor(model, view, viewModal)
//     - Speichert die übergebenen Instanzen von Model, View und ViewModal.
//     - Registriert die View als Observer im Model, sodass sie bei Modelländerungen aktualisiert wird.
//     - Fügt Event-Listener für die Erstellung neuer Listen hinzu.
//
//   showAddListModal()
//     - Zeigt das Modal zum Erstellen einer neuen Liste an.
//
//   createList()
//     - Liest den neuen Listennamen aus dem Eingabefeld und fügt über das Model eine neue Liste hinzu.
//     - Schließt anschließend das Modal.
//
//   renameList(listId)
//     - Sucht die Liste im Model anhand der ID und öffnet ein Prompt, um einen neuen Namen einzugeben.
//     - Aktualisiert den Namen der Liste, falls eine gültige Eingabe erfolgt, und benachrichtigt die Observer.
//
//   deleteList(listId)
//     - Fragt den Benutzer nach einer Bestätigung zum Löschen.
//     - Löscht die Liste aus dem Model, schließt und entfernt das zugehörige Modal,
//       entfernt eventuelle Backdrop-Elemente und aktualisiert die Ansicht.
//
//   openList(listId)
//     - Sucht die Liste im Model anhand der ID.
//     - Rendert das Listen-Detail im Modal (über die ViewModal-Klasse) und öffnet dieses Modal.
//
//   addEntry(listId, newItem)
//     - Fügt der Liste (identifiziert durch listId) einen neuen Eintrag (newItem) hinzu.
//     - Benachrichtigt die Observer, um die Ansicht zu aktualisieren.
//
//   updateItem(listId, itemIndex, updatedData)
//     - Aktualisiert einen bestehenden Eintrag in einer Liste, indem die Daten des Items mit den neuen Werten überschrieben werden.
//     - Benachrichtigt die Observer.
//
//   deleteItem(listId, itemIndex)
//     - Fragt den Benutzer nach einer Bestätigung zum Löschen eines Eintrags.
//     - Löscht den Eintrag an der angegebenen Position (itemIndex) in der Liste und aktualisiert die Ansicht.
//
//   markListComplete(listId)
//     - Markiert die gesamte Liste als abgeschlossen und benachrichtigt die Observer.
//
//   markListActive(listId)
//     - Markiert eine abgeschlossene Liste wieder als aktiv und benachrichtigt die Observer.
//
//   markListIfComplete(listId)
//     - Überprüft, ob alle Einträge einer Liste als abgeschlossen markiert sind.
//     - Setzt den Status der Liste entsprechend (abgeschlossen oder nicht) und benachrichtigt die Observer.
//
//   reopenList(listId)
//     - Setzt eine abgeschlossene Liste wieder als aktiv, indem sie den Listenstatus auf "nicht abgeschlossen" setzt
//       und alle Einträge auf "unchecked" zurücksetzt.
//     - Benachrichtigt die Observer zur Aktualisierung der Ansicht.
//

export class Controller {
    constructor(model, view, viewModal) {
        this.model = model;
        this.view = view;
        this.viewModal = viewModal;

        // Observer-Pattern: Die View wird über Änderungen im Model informiert.
        this.model.addObserver(this.view);

        // Event-Listener für den "Liste hinzufügen"-Button.
        document.getElementById('addListButton').addEventListener('click', () => this.showAddListModal());
        document.getElementById('createListBtn').addEventListener('click', () => this.createList());
    }

    // Zeigt das Modal zum Erstellen einer neuen Liste an.
    showAddListModal() {
        const modal = new bootstrap.Modal(document.getElementById('newListModal'));
        modal.show();
    }

    // Liest den Namen aus dem Eingabefeld und erstellt über das Model eine neue Liste.
    createList() {
        const listName = document.getElementById('listNameInput').value;
        if (listName) {
            this.model.addList(listName);
            const modal = bootstrap.Modal.getInstance(document.getElementById('newListModal'));
            modal.hide();
        }
    }

    // Ändert den Namen einer bestehenden Liste.
    renameList(listId) {
        // Suche die Liste im Modell.
        const list = this.model.lists.find(l => l.id == listId);
        if (list) {
            // Öffne ein Prompt, um einen neuen Namen einzugeben.
            const newName = prompt("Bitte neuen Namen eingeben:", list.name);
            if (newName && newName.trim() !== "") {
                list.name = newName.trim();
                this.model.notifyObservers();

                // Wenn das Modal offen ist, aktualisiere den Header direkt:
                if (this.viewModal && this.viewModal.modalElement) {
                    const headerEl = this.viewModal.modalElement.querySelector('#listModalLabel');
                    if (headerEl) {
                        headerEl.textContent = list.name;
                    }
                }
            }
        } else {
            console.error("Liste mit ID " + listId + " nicht gefunden!");
        }
    }


    // Löscht eine Liste, nachdem der Benutzer dies bestätigt hat.
    deleteList(listId) {
        if (confirm("Möchtest du diese Liste wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
            console.log("Liste wird gelöscht mit ID:", listId);
            // Lösche die Liste im Modell.
            this.model.deleteList(listId);

            // Schließe und entferne das Modal vollständig.
            const modalElement = document.getElementById('listModal');
            if (modalElement) {
                const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
                if (bootstrapModal) {
                    bootstrapModal.hide();
                    bootstrapModal.dispose();  // Bereinigt das Modal und entfernt den Backdrop.
                }
                modalElement.remove();
            }

            // Entferne eventuelle hängengebliebene Backdrop-Elemente.
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }

            // Setze die Body-Klasse zurück, damit Scrollbars wieder freigegeben werden.
            document.body.classList.remove('modal-open');

            // Aktualisiere die Ansicht.
            this.model.notifyObservers();
        }
    }

    // Öffnet eine Liste, indem das entsprechende Modal mit den Listendetails gerendert wird.
    openList(listId) {
        const list = this.model.lists.find(list => list.id == listId);
        if (list) {
            console.log("Öffne Modal für Liste ID:", listId);
            this.viewModal.renderListModal(list); // Rendert das Modal mit den Items der Liste.
            this.viewModal.open(); // Öffnet das Modal.
        } else {
            console.error("Liste nicht gefunden");
        }
    }

    // Fügt einen neuen Eintrag zu einer Liste hinzu.
    addEntry(listId, newItem) {
        const list = this.model.lists.find(l => l.id == listId);
        if (list) {
            list.items.push(newItem);
            // Benachrichtige die Observer, um die View zu aktualisieren.
            this.model.notifyObservers();
        } else {
            console.error("Liste nicht gefunden!");
        }
    }

    // Aktualisiert einen Eintrag in einer Liste mit neuen Daten.
    updateItem(listId, itemIndex, updatedData) {
        const list = this.model.lists.find(l => l.id == listId);
        if (list && list.items[itemIndex] !== undefined) {
            // Überschreibt die vorhandenen Daten des Items mit den neuen Werten.
            list.items[itemIndex] = { ...list.items[itemIndex], ...updatedData };
            this.model.notifyObservers();
        } else {
            console.error("Liste oder Item nicht gefunden!");
        }
    }

    // Löscht einen Eintrag aus einer Liste nach Bestätigung durch den Benutzer.
    deleteItem(listId, itemIndex) {
        if (confirm("Möchtest du diesen Artikel wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
            console.log("Bestätigung erhalten. listId:", listId, "itemIndex:", itemIndex);
            const list = this.model.lists.find(l => l.id == listId);
            console.log("Gefundene Liste:", list);
            if (list && list.items[itemIndex] !== undefined) {
                console.log("Lösche Artikel:", list.items[itemIndex]);
                list.items.splice(itemIndex, 1);
                this.model.notifyObservers();
            } else {
                console.error("Liste oder Item nicht gefunden!");
            }
        }
    }

// Markiert eine Liste als abgeschlossen.
    markListComplete(listId) {
        const list = this.model.lists.find(l => l.id == listId);
        if (list) {
            list.completed = true;
            // Setze alle Items in der Liste auf abgeschlossen (true)
            list.items.forEach(item => item.completed = true);

            this.model.notifyObservers();

            // ✅ Aktualisiere das Modal direkt, wenn es offen ist
            if (this.viewModal && this.viewModal.modalElement) {
                this.viewModal.renderItems(); // Nur Items neu rendern
            }
        } else {
            console.error("Liste mit ID " + listId + " nicht gefunden!");
        }
    }

    // // Setzt eine abgeschlossene Liste wieder auf aktiv.
    // markListActive(listId) {
    //     const list = this.model.lists.find(l => l.id == listId);
    //     if (list) {
    //         list.completed = false;
    //         this.model.notifyObservers();
    //     } else {
    //         console.error("Liste mit ID " + listId + " nicht gefunden!");
    //     }
    // }

    // Überprüft, ob alle Items in einer Liste abgeschlossen sind, und aktualisiert den Listenstatus entsprechend.
    markListIfComplete(listId) {
        const list = this.model.lists.find(l => l.id == listId);
        if (list) {
            const allCompleted = list.items.length > 0 && list.items.every(item => item.completed);
            list.completed = allCompleted;
            this.model.notifyObservers();
        }
    }

// Setzt eine abgeschlossene Liste wieder auf aktiv, indem sie alle Items wieder auf "nicht abgeschlossen" setzt.
    reopenList(listId) {
        const list = this.model.lists.find(l => l.id == listId);
        if (list) {
            list.completed = false;
            // Setze alle Items in der Liste auf "nicht abgeschlossen" (false)
            list.items.forEach(item => {
                item.completed = false;
                console.log(`Item ${item.id} (${item.name}) set to completed: ${item.completed}`);
            });

            this.model.notifyObservers();

            // ✅ Aktualisiere das Modal direkt, wenn es offen ist
            if (this.viewModal && this.viewModal.modalElement) {
                this.viewModal.renderItems(); // Nur Items neu rendern
            }
        } else {
            console.error("Liste nicht gefunden");
        }
    }

    // Fügt eine neue Kategorie hinzu, falls der Benutzer eine eingibt.
    // Öffnet ein Prompt und gibt den neuen Kategorienamen (in Kleinbuchstaben) zurück,
    // oder null, wenn keine gültige Eingabe erfolgt.
    addCategory() {
        const newCategory = prompt("Bitte geben Sie die neue Kategorie ein:", "");
        if (newCategory && newCategory.trim() !== "") {
            const newCat = newCategory.trim().toLowerCase();
            // Füge die Kategorie nur hinzu, wenn sie noch nicht existiert
            if (!this.model.categories.includes(newCat)) {
                this.model.categories.push(newCat);
            }
            return newCat;
        }
        return null;
    }

    // Controller-Methode zum Teilen einer Liste mit einem Teilnehmer
    shareList(listId, participantName) {
        // Optional: Bestätigung einholen
        if (confirm("Möchten Sie diese Liste wirklich mit " + participantName + " teilen?")) {
            console.log("Liste wird geteilt mit", participantName, "für Liste ID:", listId);
            // Hier könntest du die Logik einbauen, um den Teilnehmer zur Liste hinzuzufügen.
            // Beispiel: Finde die Liste und füge den Teilnehmer hinzu (wenn du IDs oder Objekte verwaltest):
            const list = this.model.lists.find(l => l.id == listId);
            if (list) {
                // Hier ein Beispiel: Wenn du einfach den Namen speicherst, kannst du das so machen:
                if (!list.participants) {
                    list.participants = [];
                }
                // Füge den Teilnehmernamen hinzu, falls er noch nicht vorhanden ist
                if (!list.participants.includes(participantName)) {
                    list.participants.push(participantName);
                }
                alert("Liste wurde geteilt mit " + participantName);
                this.model.notifyObservers();
            } else {
                console.error("Liste mit ID " + listId + " nicht gefunden!");
            }
        }
    }


}
