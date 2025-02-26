//
//   view.js
//  
//   Diese Datei implementiert die View-Klasse für die Einkaufslisten-Webapplikation.
//   Sie ist verantwortlich für:
//    - Das dynamische Rendern von Modalen (z. B. zum Erstellen einer neuen Liste).
//    - Das Rendern der Listen in zwei Containern: aktive Listen und abgeschlossene Listen.
//    - Das Anzeigen von UI-Elementen wie Dropdown-Menüs, Buttons, etc.
//    - Das Registrieren globaler Event-Listener, die Benutzeraktionen (Öffnen, Löschen, Umbenennen,
//      als abgeschlossen markieren, wieder öffnen) an den Controller weiterleiten.
//    - Das Aktualisieren der Ansicht, wenn das Model (über das Observer-Pattern) Änderungen meldet.
//  
//   Methoden:
//    - constructor(controller)
//        - Initialisiert die View mit einer Referenz zum Controller.
//        - Holt den Container für die aktiven Listen und den Body.
//        - Rendert das Modal für das Erstellen einer neuen Liste.
//        - Registriert globale Event-Listener.
//  
//    - addGlobalEventListeners()
//        - Fügt einen globalen Klick-Event-Listener hinzu, der mithilfe von Event-Delegation
//          auf verschiedene UI-Elemente reagiert:
//            • "Liste öffnen" ruft controller.openList() auf.
//            • "Liste löschen" ruft controller.deleteList() auf.
//            • "Name ändern" ruft controller.renameList() auf.
//            • "Als abgeschlossen markieren" ruft controller.markListComplete() auf.
//            • "Wieder öffnen" ruft controller.markListActive() auf.
//  
//    - renderNewListModal()
//        - Fügt den HTML-Code für ein Modal zum Erstellen einer neuen Liste in den Body ein.
//  
//    - render(lists, users)
//        - Rendert die Listen anhand ihres Status (aktiv oder abgeschlossen) in den entsprechenden Containern.
//        - Für jede Liste werden Informationen wie Listenname und (optional) Teilnehmerinnen-Badges
//          angezeigt. Zudem gibt es Dropdown-Menüs für Aktionen wie "Name ändern", "Liste löschen", etc.
//  
//    - update(lists)
//        - Wird vom Model als Observer aufgerufen, um die Ansicht neu zu rendern.
//

export class View {
    constructor(controller) {
        this.controller = controller;
        this.listContainer = document.getElementById('listContaineractive');
        this.body = document.querySelector('body');

        // Dynamisch das Modal für neue Liste rendern
        this.renderNewListModal();

        // Event-Listener nur EINMAL hinzufügen
        this.addGlobalEventListeners();
    }

    // ✅ Event-Listener korrekt registrieren
    addGlobalEventListeners() {
        // Event-Delegation am Container
        document.addEventListener('click', (event) => {
            const target = event.target;

            // === 📂 Liste öffnen ===
            if (target.classList.contains('open-list')) {
                const listId = target.getAttribute('data-id');
                console.log("Event-Listener für 'Liste öffnen' wurde ausgelöst mit ID:", listId);
                this.controller.openList(listId);
            }

            // === 🗑️ Liste löschen ===
            if (target.classList.contains('delete-list')) {
                const listId = target.getAttribute('data-id');
                console.log("Event-Listener für Löschen wurde ausgelöst mit ID:", listId);
                this.controller.deleteList(listId);
            }

            // === ✏️ Name ändern ===
            if (target.classList.contains('rename-list')) {
                const listId = target.getAttribute('data-id');
                console.log("Name ändern für Liste ID:", listId);
                this.controller.renameList(listId);
            }

            // === ✅ Als abgeschlossen markieren ===
            if (target.classList.contains('mark-complete')) {
                const listId = target.getAttribute('data-id');
                console.log("Liste als abgeschlossen markieren, ID:", listId);
                this.controller.markListComplete(listId);
            }

            // === 🔄 Wieder öffnen ===
            if (target.classList.contains('mark-active')) {
                const listId = target.getAttribute('data-id');
                console.log("Liste wieder öffnen, ID:", listId);
                this.controller.reopenList(listId);
            }

            // === Liste teilen ===
            if (target.classList.contains('participants-list')) {
                const listId = target.getAttribute('data-id');
                // Öffne ein Prompt, in dem der Benutzer den Vornamen eingeben kann
                const participantName = prompt("Liste teilen mit:");
                if (participantName && participantName.trim() !== "") {
                    // Delegiere die Logik an den Controller
                    this.controller.shareList(listId, participantName.trim());
                }
            }
        });
    }

    // ✅ Modal für neue Liste
    renderNewListModal() {
        const newListModalHTML = `
            <div class="modal fade" id="newListModal" tabindex="-1" aria-labelledby="newListModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="newListModalLabel">Neue Liste erstellen</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <input type="text" class="form-control" placeholder="Listenname" id="listNameInput">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Abbrechen</button>
                            <button type="button" class="btn btn-primary" id="createListBtn">Erstellen</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.body.insertAdjacentHTML('beforeend', newListModalHTML);
    }

    // ✅ Methode zum Rendern der Listen
    render(lists) {
        console.log("Rendere Listen:", lists);

        const activeListContainer = document.getElementById('listContaineractive');
        const completedListContainer = document.getElementById('listContainercompleted');

        // Leere die Container
        activeListContainer.innerHTML = '';
        completedListContainer.innerHTML = '';

        // Aktive und abgeschlossene Listen trennen
        const activeLists = lists.filter(list => !list.completed);
        const completedLists = lists.filter(list => list.completed);

        // === 📋 Aktive Listen ===
        activeLists.forEach(list => {
            const listItem = document.createElement('div');
            listItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-3');
            listItem.innerHTML = `
                <div class="card position-relative">
                      <div class="card-header d-flex justify-content-between align-items-center">
                        <span>${list.name}</span>
                          <div class="list-actions dropup">
                              <button class="btn btn-link" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-three-dots"></i>
                              </button>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item rename-list" href="#" data-id="${list.id}">Name ändern</a></li>
                                <li><a class="dropdown-item participants-list" href="#" data-id="${list.id}">Liste teilen <i class="bi bi-share"></i></a></li>
                                <li><a class="dropdown-item mark-complete" href="#" data-id="${list.id}">Als abgeschlossen markieren</a></li>
                                <li><a class="dropdown-item delete-list text-danger" href="#" data-id="${list.id}">Liste löschen <i class="bi bi-trash3"></i></a></li>
                              </ul>
                            </div>

                      </div>
                    <div class="card-body">
                        <button class="btn btn-sm btn-outline-primary open-list" data-id="${list.id}">Liste öffnen <i class="bi bi-box-arrow-in-right"></i></button>
                    </div>
                </div>
            `;
            activeListContainer.appendChild(listItem);
        });

        // === ✅ Abgeschlossene Listen ===
        if (completedLists.length > 0) {
            const completedHeader = document.createElement('h3');
            completedHeader.textContent = "Abgeschlossene Listen";
            completedListContainer.appendChild(completedHeader);

            completedLists.forEach(list => {
                const listItem = document.createElement('div');
                listItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-3');
                listItem.innerHTML = `
                    <div class="card position-relative">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <span>${list.name}</span>
                            <div class="list-actions">
                                <button class="btn btn-link" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item rename-list" href="#" data-id="${list.id}">Name ändern</a></li>
                                    <li><a class="dropdown-item mark-active" href="#" data-id="${list.id}">Wieder öffnen</a></li>
                                    <li><a class="dropdown-item text-danger delete-list" href="#" data-id="${list.id}">Liste löschen</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="card-body">
                            <button class="btn btn-sm btn-outline-primary open-list" data-id="${list.id}">Liste öffnen <i class="bi bi-box-arrow-in-right"></i></button>
                        </div>
                    </div>
                `;
                completedListContainer.appendChild(listItem);
            });
        }
    }

    // ✅ Update-Methode zur Aktualisierung der Ansicht
    update(lists) {
        console.log("Update der View mit folgenden Listen:", lists);
        this.render(lists);
    }
}
