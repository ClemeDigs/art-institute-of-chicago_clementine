export default class Pager {
    /**
     * @param {HTMLElement} pagerElement
     * @param {number} currentPage
     * @param {number} totalPages
     * @param {function(number): void} onPageChange - La fonction à appeler lorsque la page change
     */
    constructor(pagerElement, currentPage, totalPages, onPageChange) {
        /**
         * @type {HTMLElement}
         */
        this.pagerElement = pagerElement;
        /**
         * @type {number}
         */
        this.currentPage = currentPage;
        /**
         * @type {number}
         */
        this.totalPages = totalPages;
        /**
         * @type {function(number): void}
         */
        this.onPageChange = onPageChange; // Fonction callback appelée lors du changement de page
        this.init();
    }

    /**
     * @returns {void}
     */
    init() {
        this.updatePageDisplay();
        this.addPaginationListeners();
    }

    /**
     * @param {number} totalPages - Le nombre total de pages.
     * @returns {void}
     */
    setTotalPages(totalPages) {
        this.totalPages = totalPages;
        this.updatePageDisplay(); // Met à jour l'affichage
    }

    /**
     * Définit la page actuelle et déclenche un rafraîchissement de l'affichage.
     * @param {number} page - La nouvelle page actuelle.
     * @returns {void}
     */
    setCurrentPage(page) {
        this.currentPage = page; // Met à jour la page actuelle
        this.updatePageDisplay(); // Rafraîchit l'affichage
        this.onPageChange(page); // Appelle la fonction callback avec le nouveau numéro de page
    }

    /**
     * Réinitialise la page actuelle à 1 et rafraîchit l'affichage.
     * @returns {void}
     */
    resetCurrentPage() {
        this.currentPage = 1; // Réinitialise la page à 1
        this.updatePageDisplay(); // Met à jour l'affichage
        this.onPageChange(this.currentPage); // Appelle la fonction callback avec la première page
    }

    /**
     * Met à jour l'affichage de la page actuelle et du nombre total de pages.
     * @returns {void}
     */
    updatePageDisplay() {
        /**
         * @type {HTMLElement}
         */
        const pageElement = this.pagerElement.querySelector('.info-page'); // Sélecteur pour l'élément affichant la page actuelle
        /**
         * @type {HTMLElement}
         */
        const totalPagesElement = this.pagerElement.querySelector('.total-pages'); // Sélecteur pour l'élément affichant le nombre total de pages

        // Vérifier si l'élément de la page actuelle existe avant de modifier son contenu
        pageElement.textContent = this.currentPage; // Met à jour le texte de l'élément avec le numéro de page actuel

        // Vérifier si l'élément du nombre total de pages existe avant de modifier son contenu
        totalPagesElement.textContent = `Total pages: ${this.totalPages}`; // Met à jour le texte avec le nombre total de pages
    }

    /**
     * Ajoute les listeners sur les boutons "Suivant" et "Précédent".
     * @returns {void}
     */
    addPaginationListeners() {
        /**
         * @type {HTMLElement}
         */
        const nextButton = this.pagerElement.querySelector('.btn-next'); // Sélectionne le bouton "Suivant"
        /**
         * @type {HTMLElement}
         */
        const prevButton = this.pagerElement.querySelector('.btn-previous'); // Sélectionne le bouton "Précédent"

        // Ajoute un listener au bouton "Suivant" si l'élément existe
        nextButton.addEventListener('click', () => {
            // Si la page actuelle est inférieure au total des pages, on passe à la page suivante
            if (this.currentPage < this.totalPages) {
                this.setCurrentPage(this.currentPage + 1); // Incrémente la page et met à jour l'affichage
            }
        });

        // Ajoute un listener au bouton "Précédent" si l'élément existe
        prevButton.addEventListener('click', () => {
            // Si la page actuelle est supérieure à 1, on passe à la page précédente
            if (this.currentPage > 1) {
                this.setCurrentPage(this.currentPage - 1); // Décrémente la page et met à jour l'affichage
            }
        });
    }
}
