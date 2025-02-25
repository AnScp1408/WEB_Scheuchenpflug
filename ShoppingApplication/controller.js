//   Diese Klasse stellt den Vermittler zwischen Model, View und ViewModal dar und implementiert
//   die Hauptlogik der Shopping-App. Sie verarbeitet alle Benutzeraktionen (z. B. Listen erstellen,
//   öffnen, bearbeiten, löschen und Item-Operationen) und ruft dabei entsprechende Methoden im Model auf.
//  
//   Hauptaufgaben:
//     - Initialisierung der Kernkomponenten (Model, View, ViewModal)
//     - Registrierung der View als Observer im Model, sodass sie bei Datenänderungen aktualisiert wird.
//     - Verarbeitung von Benutzerinteraktionen (z. B. Klick auf "Liste hinzufügen", "Liste öffnen", "Item löschen")
//     - Delegierung von UI-bezogenen Operationen an die ViewModal-Klasse (z. B. Modal öffnen/schließen)
//     - Aufruf von Model-Methoden zur Durchführung der Datenmanipulationen (CRUD-Operationen, Statusänderungen)
//  
//   der Controller bleibt schlank und übernimmt ausschließlich die Vermittlungslogik, während das Model die Daten und
//   Geschäftslogik und die View (inklusive ViewModal) die Darstellung und UI-Interaktionen übernimmt.

export class Controller {
    constructor(model, view, viewModal) {
        this.model = model;  // Referenz zum Model (Daten, Logik)
        this.view = view; // Referenz zur View (Hauptansicht der App)
        this.viewModal = viewModal; // Referenz zur ViewModal (Modal für Listendetails)

        // Registriert die View und wird über Änderungen im Model informiert.
        this.model.addObserver(this.view);

        // Event-Listener für UI Interaktionen in Listenübersicht
        document.getElementById('addListButton').addEventListener('click', () => this.showAddListModal());
        document.getElementById('createListBtn').addEventListener('click', () => this.createList());
    }

    //////////////////
    ////// LISTEN:
    ////// - hinzufügen (Modal öffnen zum adden)
    ////// - erstellen
    ////// - umbenennen
    ////// - löschen
    ////// - generell öffnen viewModal
    ////// - abschließen
    ////// - abgeschlossen?
    ////// - wieder öffnen
    ////// - teilen
    //////////////////

    showAddListModal() {
        const inputField = document.getElementById('listNameInput');
        if (inputField) {
            inputField.value = "";
        }
        const modal = new bootstrap.Modal(document.getElementById('newListModal'));
        modal.show();
    }

    createList() {
        const listName = document.getElementById('listNameInput').value;
        if (listName.trim() !== "") {
            this.model.addList(listName);
            const modal = bootstrap.Modal.getInstance(document.getElementById('newListModal'));
            modal.hide();
        } else {
            alert("Bitte einen gültigen Namen für die Liste eingeben");
        }
    }

    renameList(listId) {
        const list = this.model.getListById(listId);
        if (list) {
            const newName = prompt("Neuer Name:", list.name);
            if (newName && newName.trim() !== "") {
                // Aktualisiere die Liste im Model
                this.model.renameList(listId, newName.trim());
                // Benachrichtige die Observer (die View wird aktualisiert)
                this.model.notifyObservers();
                // Aktualisiere den Header im geöffneten Modal, falls offen
                if (this.viewModal && this.viewModal.modalElement) {
                    const headerEl = this.viewModal.modalElement.querySelector('#listModalLabel');
                    if (headerEl) {
                        headerEl.textContent = newName.trim();
                    }
                }
            } else {
                console.error("Liste mit ID " + listId + " nicht gefunden!");
            }
        }
    }

    deleteList(listId) {
        if (confirm("Möchtest du diese Liste wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
            console.log("Liste wird gelöscht mit ID:", listId);
            // Lösche die Liste im Model.
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

            // Setze die Body-Klasse zurück und entferne eventuell gesetzte Inline-Stile, damit Scrollbars wieder freigegeben werden.
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';

            // Aktualisiere die Ansicht.
            this.model.notifyObservers();
        }
    }

    openList(listId) {
        const list = this.model.getListById(listId);
        if (list) {
            this.viewModal.renderListModal(list);
            this.viewModal.open();

        } else {
            console.error("Liste wurde nicht gefunden");
        }
    }

    markListComplete(listId) {
        this.model.markListComplete(listId);
        if (this.viewModal && this.viewModal.modalElement) {
            this.viewModal.renderItems();
        }
    }

    markListIfComplete(listId) {
        this.model.markListIfComplete(listId);
    }

    reopenList(listId) {
        this.model.reopenList(listId);
        if (this.viewModal && this.viewModal.modalElement) {
            this.viewModal.renderItems();
        }
    }

    shareList(listId, participantName) {
        if (confirm("Möchten Sie diese Liste wirklich mit " + participantName + " teilen?")) {
            this.model.shareList(listId, participantName);
            alert("Liste wurde geteilt mit " + participantName);
        }
    }

    //////////////////
    ////// ITEMS:
    ////// -hinzufügen
    ////// -löschen
    ////// -bearbeiten
    //////////////////

    addEntry(listId, newItem) {
        this.model.addItem(listId, newItem);
    }

    deleteItem(listId, itemIndex) {
        this.model.deleteItem(listId, itemIndex);
    }

    updateItem(listId, itemId, updateData) {
        this.model.updateItem(listId, itemId, updateData);
    }

    //////////////////
    ////// neue Kategorie hinzufügen
    //////////////////

    addCategory() {
        const newCategory = prompt("Bitte geben Sie die neue Kategorie ein:", "");
        if (newCategory && newCategory.trim() !== "") {
            const newCat = newCategory.trim().toLowerCase();
            this.model.addCategory(newCat);
            return newCat;
        }
        return null;
    }
}
