// Repräsentiert komplette Einkaufsliste
// Enthält Attribute: id, Name, ownerId, items, aktiv oder abgeschlossen, Array mit Teilnehmende)
// Ermöglicht das Verwalten von Listen

export class ShoppingList {
    constructor(id, name, ownerId) {
        this.id = id;                   // Eindeutige Listen-ID
        this.name = name;               // Name der Liste
        this.ownerId = ownerId;         // ID des Erstellers
        this.items = [];                // Array zur Speicherung der Listeneinträge (ShoppingItem-Objekte)
        this.completed = false;         // Status der Liste: abgeschlossen oder nicht
        this.participants = [];         // IDs von Benutzern, die Zugriff auf diese Liste haben (optional)
    }

    // neues Item hinzufügen
    addItem(item) {
        this.items.push(item);
    }

    // entfernt Item
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    // markiert als abgeschlossen
    markComplete() {
        this.completed = true;
    }

    // markiert als aktiv
    reopen() {
        this.completed = false;
    }

    // Teilnehmende hinzufügen
    addParticipant(userId) {
        if (!this.participants.includes(userId)) {
            this.participants.push(userId);
        }
    }
}
