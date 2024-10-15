import Modal from './Modal.js';
import Pager from './Pager.js';

/**
 * @type {HTMLElement}
 */
const cardContainer = document.querySelector('.card-container');
/**
 * @type {HTMLElement}
 */
const modalContentHtml = document.querySelector('.modal-content')
/**
 * @type {HTMLElement}
 */;
const inputSearch = document.querySelector('#search');
/**
 * @type {HTMLElement}
 */
const btnSearch = document.querySelector('.btn-search');


/**
 * @type {Modal}
 */
const modal = new Modal('.modal');
/**
 * @type {string}
 */
let currentSearchValue = '';


/** Initialisation de la pagination avec un appel initial
 * @type {Pager}
 */
const pager = new Pager(document.querySelector('.pager'), 1, 1, (page) => {
    fetchList(`https://api.artic.edu/api/v1/artworks/search?q=${currentSearchValue}&page=${page}`);
});


btnSearch.addEventListener('click', () => {
    currentSearchValue = inputSearch.value;
    pager.resetCurrentPage();
    fetchList(`https://api.artic.edu/api/v1/artworks/search?q=${currentSearchValue}&page=1`);
});

/**
 * @param {string} url
 * @returns {void}
 */
function fetchList(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            cardContainer.innerHTML = '';

            data.data.forEach(item => {
                /**
                 * @type {HTMLElement}
                 */
                const cardHtml = createCard(item);
                cardContainer.innerHTML += cardHtml;

                if (!item.image_id) {
                    fetchArtDetails(item.api_link, item.id);
                } else {
                    updateCardImage(item.id, item.image_id);
                }
            });
            /**
             * @type {number}
             */
            const totalPages = data.pagination.total_pages;
            pager.setTotalPages(totalPages);
            addModalEventListeners();
        })
        .catch(error => console.error(`Erreur de fetch: ${error}`));
}

/**
 * @param {Object} artwork
 * @returns {HTMLElement}
 */
function createCard(artwork) {
    return `
        <div class="card" id="card-${artwork.id}">
            <h3>${artwork.title}</h3>
            <img class="img-card" src="../assets/img/logo.svg" alt="Image placeholder" id="img-${artwork.id}" />
            <button class="btn-primary btn-more" data-url="${artwork.api_link}">More</button>
        </div>
    `;
}

/**
 * @returns {void}
 */
function addModalEventListeners() {
    /**
     * @type {HTMLElement}
     */
    const btnsMore = document.querySelectorAll('.btn-more');
    btnsMore.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.show();
            fetchArtDetails(btn.getAttribute('data-url'));
        });
    });
}

/**
 * @returns {void}
 */
function updateCardImage(artworkId, imageId) {
    /**
     * @param {number} artworkId
     * @param {string} imageId
     * @type {string}
     */
    const imgUrl = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
    /**
     * @type {HTMLElement}
     */
    const imgElement = document.getElementById(`img-${artworkId}`);
    if (imgElement) {
        imgElement.src = imgUrl;
        imgElement.alt = `Artwork ID: ${artworkId}`;
    }
}

/**
 * @param {string} url
 * @param {number} [artworkId]
 * @returns {void}
 */
function fetchArtDetails(url, artworkId) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            /**
             * @type {Object}
             */
            const artwork = data.data;
            if (artwork.image_id) {
                updateCardImage(artworkId, artwork.image_id);
            }
            updateModalContent(artwork);
        })
        .catch(error => {
            console.error(`Erreur de fetch: ${error}`);
        });
}


/**
 * @param {Object} artwork
 * @returns {void}
 */
function updateModalContent(artwork) {
    /**
     * @type {string}
     */
    let artist = 'Unknown Artist';
    if (artwork.artist_title) {
        artist = artwork.artist_title;
    }

    /**
     * @type {string}
     */
    let description = 'No description available';
    if (artwork.description) {
        description = artwork.description;
    }

    /**
     * @type {HTMLElement}
     */
    const classifications = createList(artwork.classification_titles);
    /**
     * @type {HTMLElement}
     */
    const materials = createList(artwork.material_titles);

    modalContentHtml.innerHTML = `
        <button class="btn-close btn-primary">X</button>
        <div class="modal-content-wrapper">
            <h3 class="title">${artwork.title}</h3>
            <h4 class="artist">By ${artist}</h4>
            <img class="img-card" src="https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg"/>
            <p class="date">Date: ${artwork.date_display}</p>
            <p>Description: ${description}</p>
            <p>Classifications:<ul>${classifications}</ul></p>
            <p>Materials:<ul>${materials}</ul></p>
        </div>
    `;

    modalContentHtml.querySelector('.btn-close').addEventListener('click', () => {
        modal.hide();
    });
}

/**
 * @param {string[]} items
 * @param {string}
 * @returns {HTMLElement}
 */
function createList(items, defaultValue = 'Unknown') {
    if (Array.isArray(items) && items.length > 0) {
        return items.map(item => `<li>${item}</li>`).join('');
    } else {
        return `<li>${defaultValue}</li>`;
    }
}

fetchList('https://api.artic.edu/api/v1/artworks');
