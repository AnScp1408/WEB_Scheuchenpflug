export class ShoppingList {
    /**
     * Erstellt eine neue Einkaufslisten-Instanz.
     * @param {number} id - Eindeutige ID der Liste.
     * @param {string} name - Name der Einkaufsliste.
     * @param {number} ownerId - ID des Benutzers, der die Liste erstellt hat.
     */
    constructor(id, name, ownerId) {
        this.id = id;                   // Eindeutige Listen-ID
        this.name = name;               // Name der Liste
        this.ownerId = ownerId;         // ID des Erstellers
        this.items = [];                // Array zur Speicherung der Listeneinträge (ShoppingItem-Objekte)
        this.completed = false;         // Status der Liste: abgeschlossen oder nicht
        this.participants = [];         // IDs von Benutzern, die Zugriff auf diese Liste haben (optional)
    }

    /**
     * Fügt ein neues Item zur Liste hinzu.
     * @param {ShoppingItem} item - Das hinzuzufügende Item.
     */
    addItem(item) {
        this.items.push(item);
    }

    /**
     * Entfernt ein Item anhand seiner ID.
     * @param {number} itemId - ID des zu löschenden Items.
     */
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    /**
     * Markiert die Liste als abgeschlossen.
     */
    markComplete() {
        this.completed = true;
    }

    /**
     * Setzt die Liste auf aktiv (öffnet sie wieder).
     */
    reopen() {
        this.completed = false;
    }

    /**
     * Fügt einen Teilnehmer zur Liste hinzu.
     * @param {number} userId - ID des hinzuzufügenden Benutzers.
     */
    addParticipant(userId) {
        if (!this.participants.includes(userId)) {
            this.participants.push(userId);
        }
    }
}
