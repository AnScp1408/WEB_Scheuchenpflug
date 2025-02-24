export class User {
    /**
     * Erstellt einen neuen Benutzer.
     * @param {number} id - Eindeutige Benutzer-ID.
     * @param {string} username - Benutzername.
     * @param {string} email - E-Mail-Adresse des Benutzers.
     */
    constructor(id, username, email) {
        this.id = id;                   // Eindeutige Benutzer-ID
        this.username = username;       // Benutzername
        this.email = email;             // E-Mail-Adresse
        this.ownedLists = [];           // IDs der Listen, die der Benutzer erstellt hat
        this.sharedLists = [];          // IDs der Listen, die mit diesem Benutzer geteilt wurden (optional)
    }

    /**
     * Fügt eine Liste zur Sammlung der Listen hinzu, die der Benutzer besitzt.
     * @param {number} listId - ID der Liste.
     */
    addOwnedList(listId) {
        if (!this.ownedLists.includes(listId)) {
            this.ownedLists.push(listId);
        }
    }

    /**
     * Fügt eine Liste zur Sammlung der Listen hinzu, die mit dem Benutzer geteilt wurden.
     * @param {number} listId - ID der Liste.
     */
    addSharedList(listId) {
        if (!this.sharedLists.includes(listId)) {
            this.sharedLists.push(listId);
        }
    }


}
