export default class Modal {
    /**
     * @param {string} modalSelector - string car il est utilisé comme une chaîne de texte pour indiquer le sélecteur.
     */
    constructor(modalSelector) {
        /**
         * @type {HTMLElement}
         */
        this.modalHtml = document.querySelector(modalSelector);

        this.modalHtml.addEventListener('click', () => {
            this.hide();
        });

        /**
         * @type {HTMLElement}
         */
        const modalContent = this.modalHtml.querySelector('.modal-content');
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation(); 
        });
    }

    /**
     * @returns {void}
     */
    show() {
        this.modalHtml.classList.remove('hidden');
    }

    /**
     * @returns {void}
     */
    hide() {
        this.modalHtml.classList.add('hidden');
    }
}
