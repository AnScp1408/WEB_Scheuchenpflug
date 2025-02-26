// Repräsentiert einzelne Artikel innerhalb Liste
// enthält die Eigenschaften eines Artikels (Name, Menge, Einheit, Kategorie, Beschreibung, checked oder unchecked (boolean))
// jeder Artikel bleibt eindeutig identifizierbar und bearbeitbar

export class ShoppingItem {
    constructor(id, name, quantity, unit, category, description = "") {
        this.id = id;                   // Eindeutige Item-ID
        this.name = name;               // Name des Produkts
        this.quantity = quantity;       // Anzahl/Menge
        this.unit = unit;               // Einheit (z. B. Stück, Liter)
        this.category = category;       // Kategorie (z. B. Obst, Gemüse)
        this.description = description; // Optionale Beschreibung
        this.completed = false;         // Status: false = noch nicht abgehakt, true = abgehakt
    }

    // checked oder unchecked Überprüfung
    toggleComplete() {
        this.completed = !this.completed;
    }
}
