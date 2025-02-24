export class ShoppingItem {
    /**
     * Erstellt einen neuen Listeneintrag.
     * @param {number} id - Eindeutige ID des Items.
     * @param {string} name - Name des Produkts.
     * @param {number} quantity - Menge oder Anzahl des Produkts.
     * @param {string} unit - Einheit des Produkts (z. B. Stück, Liter, kg).
     * @param {string} category - Kategorie des Produkts (z. B. Obst, Gemüse, Backwaren).
     * @param {string} [description=""] - Optionale Beschreibung des Produkts.
     */
    constructor(id, name, quantity, unit, category, description = "") {
        this.id = id;                   // Eindeutige Item-ID
        this.name = name;               // Name des Produkts
        this.quantity = quantity;       // Anzahl/Menge
        this.unit = unit;               // Einheit (z. B. Stück, Liter)
        this.category = category;       // Kategorie (z. B. Obst, Gemüse)
        this.description = description; // Optionale Beschreibung
        this.completed = false;         // Status: false = noch nicht abgehakt, true = abgehakt
    }

    /**
     * Schaltet den Abschlussstatus des Items um.
     */
    toggleComplete() {
        this.completed = !this.completed;
    }
}
