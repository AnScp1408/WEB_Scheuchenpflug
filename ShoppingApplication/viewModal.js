//   Diese Klasse verwaltet das modale Fenster (Modal), das die Detailansicht einer
//   ausgewählten Einkaufslisten anzeigt und bearbeitet. Sie ist Teil der View-Schicht im
//   MVC-Modell und ist verantwortlich für:
//  
//     - Dynamisches Erzeugen und Rendern des Modal-HTMLs, basierend auf den übergebenen Listendaten.
//     - Darstellung der Liste (Header, Items, Filter- und Sortieroptionen) im Modal.
//     - Verwaltung von Benutzerinteraktionen im Modal, wie z.B.:
//         • Hinzufügen von neuen Items (über einfache oder erweiterte Eingabefelder)
//         • Bearbeiten und Löschen von Items (inklusive Toggle des "completed"-Status)
//         • Aktualisieren von UI-Elementen (z.B. Aktualisierung des Listennamens im Modal-Header)
//         • Dynamisches Generieren von Kategorie-Dropdown-Optionen, inklusive Option zum Anlegen
//           neuer Kategorien.
//     - Bereitstellen von Methoden zum Öffnen (open()) und Schließen (close()) des Modals,
//       inklusive des Aufräumens von Backdrop-Elementen und dem Entfernen von CSS-Klassen,
//       um den Body wieder scrollbar zu machen.
//  
//   Architektur (MVC):
//     - Die ViewModal-Klasse gehört zur View und kümmert sich ausschließlich um die Darstellung
//       und UI-bezogene Logik.
//     - Alle datenbezogenen Änderungen (z.B. das Hinzufügen, Bearbeiten oder Löschen von Items)
//       werden über den Controller angestoßen, der dann auf das Model zugreift.
//  
//   Wichtige Methoden:
//     - renderListModal(list): Baut das Modal-HTML dynamisch auf und fügt es in den DOM ein.
//     - renderItems(): Aktualisiert die Darstellung der Items innerhalb des Modals (aufgeteilt in offene und
//       abgeschlossene Items), basierend auf der aktuell geladenen Liste.
//     - createItemElement(item, index): Erstellt ein DOM-Element für ein einzelnes Item, inklusive
//       Bearbeitungsbereich und zugehöriger Event-Listener.
//     - addEntry(): Liest die Eingaben aus den Formularfeldern im Modal aus, erstellt ein neues Item-Objekt
//       und löst über den Controller das Hinzufügen des Items im Model aus.
//     - open(): Öffnet das Modal, indem eine Bootstrap-Modal-Instanz erzeugt und angezeigt wird.
//     - close(): Schließt das Modal und räumt auf (entfernt den Backdrop und die "modal-open"-Klasse vom Body).
//  
//   Diese Struktur stellt sicher, dass alle UI-spezifischen Operationen sauber in der ViewModal-Klasse
//   gekapselt sind, während die Logik im Model und die Vermittlungslogik im Controller verbleiben.
//

export class ViewModal {
    constructor(controller) {
        this.controller = controller; // Referenz zum Controller, um Aktionen weiterzuleiten
        this.modalElement = null;       // Referenz auf das aktuell geöffnete Modal
        this.activeFilter = "all";      // Standardfilter (z. B. "all" oder "categoriess")
        this.sortOrder = "default";     // Standard-Sortierreihenfolge (z. B. "asc" oder "desc")
        this.currentList = null;        // Die aktuell im Modal angezeigte Liste
    }


    //////////////////
    ////// Generiert die HTML-Optionen für das Kategorie-Dropdown.
    //////////////////

    generateCategoryOptions(selectedCategory) {
        // Holt Kategorien-Array aus dem Model
        const categories = this.controller.model.categories;
        let optionsHTML = "";
        categories.forEach(cat => {
            // Setze "selected", wenn der aktuelle Wert passt
            optionsHTML += `<option value="${cat}" ${selectedCategory && selectedCategory.toLowerCase() === cat ? "selected" : ""}>${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`;
        });
        //Option zum Hinzufügen einer neuen Kategorie hinzu
        optionsHTML += `<option value="new">Neue Kategorie hinzufügen...</option>`;
        return optionsHTML;
    }

    //////////////////
    ////// Rendert Details der übergebenen Liste.
    //////////////////

    renderListModal(list) {
        // Speichere die Referenz zur aktuellen Liste
        this.currentList = list;

        // Schließe und entferne ein bestehendes Modal, bevor ein neues erstellt wird
        if (this.modalElement) {
            const existingModal = bootstrap.Modal.getInstance(this.modalElement);
            if (existingModal) {
                existingModal.hide();
            }
            this.modalElement.remove();
        }
        // Generiere dynamisch die Options für die Kategorie im "Erweiterten Eingabefeld"
        const categoryOptions = this.generateCategoryOptions("");

        // Erstelle das Modal-HTML; Kategorie-Dropdown dynamisch
        const modalHTML = `
            <div class="modal fade" id="listModal" tabindex="-1" aria-labelledby="listModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <!-- Modal-Header: Zeigt den Listennamen und Dropdown-Aktionen -->
                        <div class="modal-header d-flex justify-content-between align-items-center w-100">
                            <h5 class="modal-title text-center flex-grow-1" id="listModalLabel">${list.name}</h5>
                            <div class="dropdown">
                                <button class="btn btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                                    <i class="bi bi-three-dots"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item rename-list" href="#" data-id="${list.id}">Name ändern</a></li>
                                    <li><a class="dropdown-item participants-list" href="#" data-id="${list.id}">Liste teilen <i class="bi bi-share"></i></a></li>
                                    <li><a class="dropdown-item delete-list text-danger" href="#" data-id="${list.id}">Liste löschen <i class="bi bi-trash3"></i></a></li>
                                </ul>
                            </div>
                        </div>
        
                        <!-- Modal-Body -->
                        <div class="modal-body">
                            <!-- Eingabegruppe für neuen Eintrag -->
                            <div class="input-group mb-3 gap-2">
                                <input type="text" class="form-control" placeholder="Artikel hinzufügen" id="itemName" list="frequentItems">
                                <datalist id="frequentItems">
                                    <option value="Nudeln"></option>
                                    <option value="Reis"></option>
                                    <option value="Hafermilch"></option>
                                    <option value="Tofu"></option>
                                    <option value="Tomaten"></option>
                                    <option value="Paprika"></option>
                                    <option value="Banane"></option>
                                </datalist>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEntryForm" aria-expanded="false" aria-controls="collapseEntryForm">
                                        <i class="bi bi-caret-down-fill"></i>
                                    </button>
                                    <button class="btn btn-outline-primary" type="button" id="addEntryButton"><i class="bi bi-cart-plus"></i></button>
                                </div>
                            </div>
        
                            <!-- Erweiterte Eingabefelder (collapsed) -->
                            <div class="collapse mb-3" id="collapseEntryForm">
                                <div class="card card-body">
                                    <div class="mb-2">
                                        <label for="entryQuantity" class="form-label">Menge</label>
                                        <div class="input-group">
                                            <input type="number" id="entryQuantity" class="form-control" placeholder="Zahl">
                                            <select class="form-select w-auto" id="entryUnit">
                                                <option value="" selected>Einheit wählen</option>
                                                <option value="ml">ml</option>
                                                <option value="liter">Liter</option>
                                                <option value="becher">Becher</option> 
                                                <option value="g">g</option>
                                                <option value="kg">kg</option>
                                                <option value="dag">dag</option>
                                                <option value="stück">Stück</option>
                                            </select>
                                        </div>
                                    </div>
        
                                    <!-- Kategorie-Dropdown dynamisch -->
                                    <div class="mb-2">
                                        <label for="entryCategory" class="form-label">Kategorie</label>
                                        <select class="form-select select-small" id="entryCategory">
                                            ${categoryOptions}
                                        </select>
                                    </div>
        
                                    <div class="mb-2">
                                        <label for="entryDescription" class="form-label">Beschreibung</label>
                                        <textarea id="entryDescription" class="form-control" placeholder="Beschreibung hinzufügen"></textarea>
                                    </div>
        
                                    <button class="btn btn-success w-100" id="addEntryBtnExtended">Hinzufügen <i class="bi bi-cart-plus"></i></button>
                                    <input type="hidden" id="selectedCategory">
                                </div>
                            </div>
        
                            <!-- Filteroptionen -->
                            <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="mb-0">Offene Items</h6>
                                <div class="dropdown">
                                    <button class="btn btn-outline-primary dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown">
                                        Filter <i class="bi bi-funnel"></i>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <li><a class="dropdown-item filter-option" data-filter="all" href="#">Alle</a></li>
                                        <li><a class="dropdown-item filter-option" data-filter="categoriess" href="#">Kategorien <i class="bi bi-tag"></i></a></li>
                                        <li><a class="dropdown-item sort-option" data-sort="asc" href="#"><i class="bi bi-sort-alpha-down"></i></a></li>
                                        <li><a class="dropdown-item sort-option" data-sort="desc" href="#"><i class="bi bi-sort-alpha-down-alt"></i></a></li>
                                    </ul>
                                </div>
                            </div>
        
                            <!-- Container für Items -->

                            <ul id="openItems" class="list-group mb-3"></ul>
                            <h6>Abgeschlossene Items</h6>
                            <ul id="completedItems" class="list-group text-muted"></ul>
                        </div>
        
                        <!-- Modal Footer -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="closeModalBtn">Schließen <i class="bi bi-x-lg"></i></button>
                        </div>
                    </div>
                </div>
            </div>`;


        // Füge das Modal in den DOM ein und speichere die Referenz
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modalElement = document.getElementById('listModal');

        // Erstelle und zeige die Bootstrap-Modal-Instanz
        const bootstrapModal = new bootstrap.Modal(this.modalElement);
        bootstrapModal.show();

        // Verzögertes Rendern der Items (um sicherzustellen, dass das Modal im DOM ist)
        setTimeout(() => this.renderItems(), 100);

        // Registriere Event-Listener für das Schließen des Modals
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            bootstrapModal.hide();
            this.modalElement.remove();
        });

        // Registriere Event-Listener für das Hinzufügen von Items
        document.getElementById('addEntryButton').addEventListener('click', () => this.addEntry());
        document.getElementById('addEntryBtnExtended').addEventListener('click', () => this.addEntry());

        // Registriere Event-Listener für Filteroptionen
        document.querySelectorAll(".sort-option").forEach(option => {
            option.addEventListener("click", (event) => {
                event.preventDefault();
                this.sortOrder = option.getAttribute("data-sort");
                this.renderItems();
            });
        });
        document.querySelectorAll(".filter-option").forEach(option => {
            option.addEventListener("click", (event) => {
                event.preventDefault();
                this.activeFilter = option.getAttribute("data-filter");
                this.renderItems();
            });
        });

        // Automatisches Setzen von Einheit und Kategorie basierend auf dem eingegebenen Artikelnamen
        document.getElementById('itemName').addEventListener('change', function () {
            const enteredItem = this.value.trim();
            const frequentDefaults = {
                "Nudeln": { unit: "kg", category: "sonstiges" },
                "Reis": { unit: "kg", category: "sonstiges" },
                "Hafermilch": { unit: "liter", category: "milchalternativen" },
                "Tofu": { unit: "dag", category: "fleischalternativen" },
                "Tomaten": { unit: "stück", category: "gemuese" },
                "Paprika": { unit: "stück", category: "gemuese" },
                "Banane": { unit: "stück", category: "obst" }
            };
            // Nur setzen, wenn ein Eintrag in den Defaults existiert:
            if (frequentDefaults[enteredItem]) {
                document.getElementById('entryUnit').value = frequentDefaults[enteredItem].unit;
                document.getElementById('entryCategory').value = frequentDefaults[enteredItem].category;
            } else {
                // Falls nicht, sollen die Felder den Platzhalter behalten (d.h. leer bleiben)
                document.getElementById('entryUnit').value = "";
                document.getElementById('entryCategory').value = "";
            }
        });

        document.querySelector('[data-bs-toggle="dropdown"]').addEventListener('hidden.bs.dropdown', function () {
            this.blur(); // Entfernt den Fokus, sodass der farbliche Zustand verschwindet
            this.classList.remove('active'); // Falls die "active"-Klasse gesetzt wurde
        });


        // Registriere einen Event-Listener für den Kategorie-Dropdown im "add entry"-Bereich,
        // der auf die Option "Neue Kategorie hinzufügen..." reagiert.
        const entryCategorySelect = document.getElementById('entryCategory');
        entryCategorySelect.addEventListener("change", (event) => {
            const selectEl = event.target;
            if (selectEl.value === "new") {
                // Rufe die zentrale Methode im Controller auf
                const newCat = this.controller.addCategory();
                if (newCat) {
                    // Aktualisiere den Dropdown-Inhalt mithilfe unserer generateCategoryOptions-Methode
                    selectEl.innerHTML = this.generateCategoryOptions(newCat);
                    selectEl.value = newCat;
                } else {
                    selectEl.value = "";
                }
            }
        })
    }

    //////////////////
    ////// Rendert alle Items der aktuellen Liste
    //////////////////

    renderItems() {
        const openItemsContainer = document.getElementById('openItems');
        const completedItemsContainer = document.getElementById('completedItems');
        openItemsContainer.innerHTML = '';
        completedItemsContainer.innerHTML = '';

        let items = this.currentList.items;

        if (this.activeFilter === "categoriess") {
            // Gruppiere Items nach Kategorie (verwende "sonstiges", wenn keine Kategorie angegeben)
            const groupedItems = {};
            items.forEach(item => {
                let cat = (item.category && item.category.trim() !== "") ? item.category.toLowerCase() : "sonstiges";
                if (!groupedItems[cat]) {
                    groupedItems[cat] = [];
                }
                groupedItems[cat].push(item);
            });

            const sortedCategories = Object.keys(groupedItems).sort();
            let globalIndex = 0;

            sortedCategories.forEach(category => {
                const openItemsInCategory = groupedItems[category].filter(item => !item.completed);
                if (openItemsInCategory.length > 0) {
                    const categoryHeader = document.createElement('li');
                    categoryHeader.classList.add('list-group-item', 'fw-bold', 'bg-light');
                    categoryHeader.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                    openItemsContainer.appendChild(categoryHeader);
                }
                groupedItems[category].forEach(item => {
                    const listItem = this.createItemElement(item, globalIndex);
                    (item.completed ? completedItemsContainer : openItemsContainer).appendChild(listItem);
                    globalIndex++;
                });
            });

            if (openItemsContainer.innerHTML.trim() === '') {
                openItemsContainer.innerHTML = '<li class="list-group-item text-muted">Keine offenen Items</li>';
            }
        } else {
            // Alphabetische Sortierung
            if (this.sortOrder === "asc") {
                // Kopie des Arrays erstellen und alphabetisch A-Z sortieren
                items = items.slice().sort((a, b) => a.name.localeCompare(b.name));
            } else if (this.sortOrder === "desc") {
                // Kopie des Arrays erstellen und alphabetisch Z-A sortieren
                items = items.slice().sort((a, b) => b.name.localeCompare(a.name));
            }

            // Iteriere über die sortierten Items und füge sie in die entsprechenden Container ein
            items.forEach((item, index) => {
                const listItem = this.createItemElement(item, index);
                (item.completed ? completedItemsContainer : openItemsContainer).appendChild(listItem);
            });

            // Fallback-Meldungen, falls keine Items vorhanden sind
            if (openItemsContainer.innerHTML.trim() === '') {
                openItemsContainer.innerHTML = '<li class="list-group-item text-muted">Keine offenen Items</li>';
            }
            if (completedItemsContainer.innerHTML.trim() === '') {
                completedItemsContainer.innerHTML = '<li class="list-group-item text-muted">Keine abgeschlossenen Items</li>';
            }
        }
    }

    //////////////////
    ////// Erstellt das Collapse für ein einzelnes Item
    //////////////////

    createItemElement(item, index) {
        const listItem = document.createElement('div');
        listItem.classList.add('mb-2');

        // Dynamisch generierter Options-HTML für das Editierfeld der Kategorie
        const editCategoryOptions = this.generateCategoryOptions(item.category);

        listItem.innerHTML = `
        <li class="list-group-item d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
                <input type="checkbox" class="form-check-input" ${item.completed ? 'checked' : ''}>
                <span class="item-name">${item.name}</span>
                <span class="item-quantity ms-2">${item.quantity}</span>
                <span class="item-unit ms-1">${item.unit}</span>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-warning edit-item" data-bs-toggle="collapse" data-bs-target="#editForm-${index}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-item"><i class="bi bi-trash3"></i></button>
            </div>
        </li>

        <!-- Editierbereich (grundsätzlich collapsed) -->
        <div class="collapse" id="editForm-${index}">
            <div class="card card-body mt-2">
                <div class="row g-2">
                    <div class="col-12">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-control edit-name" value="${item.name}">
                    </div>
                    <div class="col-6">
                        <label class="form-label">Menge</label>
                        <input type="number" class="form-control edit-quantity" value="${item.quantity}">
                    </div>
                    <div class="col-6">
                        <label class="form-label">Einheit</label>
                        <select class="form-select edit-unit select-small">
                            <option value="ml" ${item.unit === "ml" ? "selected" : ""}>ml</option>
                            <option value="liter" ${item.unit === "liter" ? "selected" : ""}>Liter</option>
                            <option value="becher" ${item.unit === "becher" ? "selected" : ""}>Becher</option>
                            <option value="g" ${item.unit === "g" ? "selected" : ""}>g</option>
                            <option value="kg" ${item.unit === "kg" ? "selected" : ""}>kg</option>
                            <option value="dag" ${item.unit === "dag" ? "selected" : ""}>dag</option>
                            <option value="stück" ${item.unit === "stück" ? "selected" : ""}>Stück</option>
                        </select>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Kategorie</label>
                        <select class="form-select edit-category select-small">
                            ${editCategoryOptions}
                        </select>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Beschreibung</label>
                        <textarea class="form-control edit-description">${item.description}</textarea>
                    </div>
                    <div class="col-12 d-grid">
                        <button class="btn btn-success save-edit">Speichern <i class="bi bi-floppy"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;

        // Checkbox-Event: Umschalten des "completed"-Status und Neurendern
        const checkbox = listItem.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            item.completed = checkbox.checked;
            this.controller.markListIfComplete(this.currentList.id);
            this.renderItems();
        });

        // Löschen-Event
        listItem.querySelector(".delete-item").addEventListener("click", () => {
            if (confirm("Möchtest du diesen Artikel wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
                listItem.classList.add("swipe-out");
                // Warte auf das Ende der Animation, um das Element aus der Liste zu entfernen
                listItem.addEventListener("animationend", function handler() {
                    listItem.removeEventListener("animationend", handler);
                    // Lösche den Artikel aus dem Model
                    this.controller.deleteItem(this.currentList.id, index);
                    // Aktualisiere die Anzeige nach dem Entfernen
                    this.renderItems();
                }.bind(this)); //Event nur einmal
            }
        });



        // Speichern-Event
        listItem.querySelector(".save-edit").addEventListener("click", () => {
            const editedName = listItem.querySelector(".edit-name").value;
            const editedQuantity = listItem.querySelector(".edit-quantity").value;
            const editedUnit = listItem.querySelector(".edit-unit").value;
            const editedCategory = listItem.querySelector(".edit-category").value;
            const editedDescription = listItem.querySelector(".edit-description").value;

            item.name = editedName;
            item.quantity = editedQuantity;
            item.unit = editedUnit;
            item.category = editedCategory;
            item.description = editedDescription;

            const collapseEl = listItem.querySelector(`#editForm-${index}`);
            let bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
            if (!bsCollapse) {
                bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });
            }
            bsCollapse.hide();

            this.renderItems();
        });

        // Kategorie-Hinzufügen im Editierbereich
        const editCategorySelect = listItem.querySelector(".edit-category");
        editCategorySelect.addEventListener("change", () => {
            if (editCategorySelect.value === "new") {
                const newCategory = prompt("Bitte geben Sie die neue Kategorie ein:", "");
                if (newCategory && newCategory.trim() !== "") {
                    const newCat = newCategory.trim().toLowerCase();

                    // Füge neue Kategorie hinzu, wenn sie nicht existiert
                    if (!this.controller.model.categories.includes(newCat)) {
                        this.controller.model.categories.push(newCat);
                    }

                    // Aktualisiere das Dropdown
                    editCategorySelect.innerHTML = this.generateCategoryOptions(newCat) + `<option value="new">Neue Kategorie hinzufügen...</option>`;
                    editCategorySelect.value = newCat;

                    // Global aktualisieren (auch im "Hinzufügen"-Bereich)
                    document.getElementById('entryCategory').innerHTML = this.generateCategoryOptions();
                } else {
                    editCategorySelect.value = item.category || "";
                }
            }
        });

        return listItem;
    }

    //////////////////
    ////// Fügt einen neuen Eintrag zur aktuellen Liste hinzu
    //////////////////

    addEntry() {
        const inputField = document.querySelector('#listModal #itemName');
        const quantityField = document.querySelector('#listModal #entryQuantity');
        const unitField = document.querySelector('#listModal #entryUnit');
        const categoryField = document.querySelector('#listModal #entryCategory');
        const descriptionField = document.querySelector('#listModal #entryDescription');

        const name = inputField.value.trim();
        const quantity = quantityField.value.trim();
        const unit = unitField.value;
        const category = categoryField.value;
        const description = descriptionField.value;

        if (name === ''){
            alert("Artikel benötigt einen Namen");
            inputField.focus();
            return;// Abbruch, falls kein Name eingegeben wurde
        }

        const newItem = {
            name: name,
            quantity: quantity,
            unit: unit,
            category: category,
            description: description,
            completed: false
        };

        // Füge den neuen Eintrag über den Controller hinzu
        this.controller.addEntry(this.currentList.id, newItem);

        // Aktualisiere die Ansicht
        this.renderItems();

        // Schließe den Collapse-Bereich für die erweiterten Eingabefelder
        const collapseElement = document.getElementById('collapseEntryForm');
        if (collapseElement) {
            let bsCollapse = bootstrap.Collapse.getInstance(collapseElement);
            if (!bsCollapse) {
                bsCollapse = new bootstrap.Collapse(collapseElement, {toggle: false});
            }
            bsCollapse.hide();
        }

        // Setze die Eingabefelder zurück
        inputField.value = '';
        quantityField.value = '';
        descriptionField.value = '';
    }

    //////////////////
    ////// Öffnen und schließen des Modals
    //////////////////

    // Öffnet das Modal, indem eine neue Bootstrap-Modal-Instanz erstellt und angezeigt wird
    open() {
        const bootstrapModal = new bootstrap.Modal(this.modalElement);
        bootstrapModal.show();
    }

    // Schließt das Modal und räumt auf (entfernt Backdrop und "modal-open"-Klasse)
    close() {
        const bootstrapModal = bootstrap.Modal.getInstance(this.modalElement);
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
        document.body.classList.remove('modal-open');
    }

}

