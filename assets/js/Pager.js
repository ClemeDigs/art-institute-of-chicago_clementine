export default class Pager {
    /**
     * @param {HTMLElement} pagerElement
     * @param {number} currentPage
     * @param {number} totalPages
     * @param {function(number): void} onPageChange - Fonction qui sera appelée lorsqu'il y aura un changement de page, en prenant en paramètre le numéro de la nouvelle page.
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
        this.onPageChange = onPageChange; // Stocke la fonction de rappel pour gérer le changement de page.
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
     * @param {number} totalPages
     * @returns {void}
     */
    setTotalPages(totalPages) {
        this.totalPages = totalPages;
        this.updatePageDisplay(); 
    }

    /**
     * @param {number} page - La nouvelle page actuelle.
     * @returns {void}
     */
    setCurrentPage(page) {
        this.currentPage = page; 
        this.updatePageDisplay(); 
        this.onPageChange(page); // Appelle la fonction callback avec le nouveau numéro de page
    }

    /**
     * @returns {void}
     */
    resetCurrentPage() {
        this.currentPage = 1; 
        this.updatePageDisplay();
        this.onPageChange(this.currentPage); // Appelle la fonction callback avec la première page
    }

    /**
     * @returns {void}
     */
    updatePageDisplay() {
        /**
         * @type {HTMLElement}
         */
        const pageElement = this.pagerElement.querySelector('.info-page');
        /**
         * @type {HTMLElement}
         */
        const totalPagesElement = this.pagerElement.querySelector('.total-pages');

        pageElement.textContent = this.currentPage; 
        totalPagesElement.textContent = `Total pages: ${this.totalPages}`; 
    }

    /**
     * @returns {void}
     */
    addPaginationListeners() {
        /**
         * @type {HTMLElement}
         */
        const nextButton = this.pagerElement.querySelector('.btn-next');
        /**
         * @type {HTMLElement}
         */
        const prevButton = this.pagerElement.querySelector('.btn-previous');

        nextButton.addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.setCurrentPage(this.currentPage + 1);
            }
        });

        prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.setCurrentPage(this.currentPage - 1);
            }
        });
    }
}
