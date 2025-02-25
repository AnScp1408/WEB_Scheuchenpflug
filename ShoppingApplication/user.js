// Repräsentiert Benutzerin
// Speichert Infos wie Id, Name und e-mail
// Verwaltet die Listen
// Wichtig für spätere Zugriffsberechtigungen (owned oder shared List, wäre für spätere Implementierungen notwendig,
// da vorgesehen ist, dass Listen nur von Admins gelöscht/umbenannt werden sollen)

export class User {
    constructor(id, username, email) {
        this.id = id;                   // Eindeutige Benutzer-ID
        this.username = username;       // Benutzername
        this.email = email;             // E-Mail-Adresse
        this.ownedLists = [];           // IDs der Listen, die der Benutzer erstellt hat
        this.sharedLists = [];          // IDs der Listen, die mit diesem Benutzer geteilt wurden (optional)
    }

    // Fügt eine Liste zur Sammlung der Listen hinzu, die der Benutzer besitzt.
    addOwnedList(listId) {
        if (!this.ownedLists.includes(listId)) {
            this.ownedLists.push(listId);
        }
    }

    //Fügt eine Liste zur Sammlung der Listen hinzu, die mit der Benutzerin geteilt wurden.
    addSharedList(listId) {
        if (!this.sharedLists.includes(listId)) {
            this.sharedLists.push(listId);
        }
    }


}
