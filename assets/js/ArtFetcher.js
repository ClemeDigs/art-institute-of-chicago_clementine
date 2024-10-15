import Modal from './Modal.js';
import Pager from './Pager.js';

export default class ArtFetcher {
    constructor() {
        this.cardContainer = document.querySelector('.card-container');
        this.inputSearch = document.querySelector('#search');
        this.btnSearch = document.querySelector('.btn-search');
        this.modal = new Modal('.modal');
        
        this.pager = new Pager(
            document.querySelector('.btn-previous'),
            document.querySelector('.btn-next'),
            (page) => this.fetchPage(page)
        );

        this.currentSearchQuery = '';

        this.initialize();
    }

    initialize() {
        this.btnSearch.addEventListener('click', () => {
            this.handleSearch();
        });

        this.fetchPage(1);
    }

    handleSearch() {
        this.currentSearchQuery = this.inputSearch.value.trim();
        this.pager.currentPage = 1; 
        this.fetchPage(1);
    }

    fetchPage(page) {
        const url = this.currentSearchQuery ? 
            `https://api.artic.edu/api/v1/artworks/search?q=${this.currentSearchQuery}&page=${page}` : 
            `https://api.artic.edu/api/v1/artworks?page=${page}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.pager.setTotalPages(data.pagination.total_pages);  // Mettre à jour la pagination
                this.displayArtworks(data.data);
            })
            .catch(error => {
                console.error(`Error fetching page: ${error}`);
            });
    }

    // Afficher les œuvres récupérées
    displayArtworks(artworks) {
        this.cardContainer.innerHTML = '';

        artworks.forEach(artwork => {
            const cardHtml = this.createCard(artwork); 
            this.cardContainer.insertAdjacentHTML('beforeend', cardHtml);

            // Si l'image existe, on l'affiche, sinon on fetch les détails de l'œuvre
            if (artwork.image_id) {
                this.updateCardImage(artwork.id, artwork.image_id);
            } else {
                this.fetchArtDetails(artwork.api_link, artwork.id);
            }
        });

        this.addModalEventListeners();
    }

    // Créer la carte HTML pour une œuvre
    createCard(artwork) {
        return `
            <div class="card" id="card-${artwork.id}">
                <h3>${artwork.title}</h3>
                <img class="img-card" src="../assets/img/logo.svg" alt="Image placeholder" id="img-${artwork.id}" />
                <button class="btn-primary btn-more" data-url="${artwork.api_link}">More</button>
            </div>
        `;
    }

    // Ajouter des écouteurs d'événements pour ouvrir la modale
    addModalEventListeners() {
        const btnsMore = document.querySelectorAll('.btn-more');
        btnsMore.forEach(btn => {
            btn.addEventListener('click', () => {
                this.modal.show();
                this.fetchArtDetails(btn.getAttribute('data-url'));
            });
        });
    }

    // Mettre à jour l'image de la carte
    updateCardImage(artworkId, imageId) {
        const imgUrl = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
        const imgElement = document.getElementById(`img-${artworkId}`);
        if (imgElement) {
            imgElement.src = imgUrl;
            imgElement.alt = `Artwork ID: ${artworkId}`;
        }
    }

    // Fetch des détails supplémentaires pour une œuvre
    fetchArtDetails(url, artworkId) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const artwork = data.data;
                if (artwork.image_id) {
                    this.updateCardImage(artworkId, artwork.image_id);
                }
                this.updateModalContent(artwork);
            })
            .catch(error => {
                console.error(`Error fetching artwork details: ${error}`);
            });
    }

    // Mettre à jour le contenu de la modale avec les détails de l'œuvre
    updateModalContent(artwork) {
        const artist = artwork.artist_title || 'Unknown Artist';
        const description = artwork.description || 'No description available';
        const classifications = this.createList(artwork.classification_titles);
        const materials = this.createList(artwork.material_titles, 'Unknown');
        
        this.modal.modalHtml.querySelector('.modal-content').innerHTML = `
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

        // Fermer la modale lorsqu'on clique sur le bouton X
        this.modal.modalHtml.querySelector('.btn-close').addEventListener('click', () => {
            this.modal.hide();
        });
    }

    // Créer une liste HTML à partir d'un tableau
    createList(items, defaultValue = 'Unknown') {
        if (Array.isArray(items) && items.length > 0) {
            return items.map(item => `<li>${item}</li>`).join('');
        } else {
            return `<li>${defaultValue}</li>`;
        }
    }
}
