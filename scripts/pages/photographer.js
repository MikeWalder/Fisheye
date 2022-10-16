// Récupère l'id du photographe passé en paramètre d'URL
function getIdParameter() {
    let searchParams = new URLSearchParams(window.location.search);
    if(searchParams.has('id')){
        let getId = searchParams.get('id');
        return getId;
    } else {
        window.location.pathname = 'index.html';
    }
}


// Récupérer toute les créations liées à chaque photographe
async function getAllPicturesFromPhotographer(idPhotographer) {
    return fetch('http://127.0.0.1:5500/data/photographers.json')
    .then(function(response) {
        return response.json();
    })
    .then((data) => {
        let albumData = [];
        for(let i = 0; i < data.photographers.length; i++) {
            if(data.photographers[i].id == idPhotographer){
                albumData[0] = data.photographers[i];
            }
        }
        for(let i = 0; i < data.media.length; i++){
            if(data.media[i].photographerId == idPhotographer){
                albumData.push(data.media[i]);
            }
        }
        // console.log(albumData);
        return albumData;
    })
    .catch(err => console.log(err));
}


async function displayData(dataPhotographer){
    const photographerDescription = document.querySelector(".photograph-header");
    photographerDescription.innerHTML = '';
    const contentOrderSelect = document.querySelector("#order-select");
    const photographerCreations = document.querySelector(".creations-section");
    photographerCreations.innerHTML = '';
    const photographerDetails = document.querySelector(".photographer-details");

    const photographer = photographerHeaderFactory(dataPhotographer[0]);
    let userHeaderDOM = null;
    userHeaderDOM = photographer.getUserHeaderDOM();
    photographerDescription.appendChild(userHeaderDOM);

    contentOrderSelect.setAttribute("onchange", "orderSelect()");

    // Récupération des oeuvres du photographe sélectionné
    
    const realisations = cuttingRealisationsFromDatas(dataPhotographer);
    console.log(realisations);

    // Récupération de la valeur du select
    const orderSelectValue = document.querySelector("#order-select").value;

    if(orderSelectValue){
        realisations.sort(function(a, b) {
            if(a[orderSelectValue] < b[orderSelectValue]) return -1;
            if(a[orderSelectValue] > b[orderSelectValue]) return 1;
            return 0;
        });
        console.log(realisations);
    }
    
    // Partie insertion data et DOM des créations du photographe sélectionné
    let tabRealisations = [];
    realisations.forEach((realisation) => {
        const realisationModel = photographerContentFactory(realisation);
        const userContentDOM = realisationModel.getUserDescDOM();
        photographerCreations.appendChild(userContentDOM);
        tabRealisations.push(realisationModel);
    })
    console.log(tabRealisations);
    
    //Calcul du nombre total de likes dans l'encart
    dataPhotographer[0].totalLikes = countTotalLikes(realisations);
    
    // Partie insertion data et DOM dans l'encart en bas à droit de la page du photographe
    const photographerIntelsBox = photographerDetailsFactory(dataPhotographer[0]);
    const photographerDetailsDOM = photographerIntelsBox.getPhotographDetailsDOM();
    photographerDetails.appendChild(photographerDetailsDOM);

    // Insertion des éléments du DOM nécessaires pour la lightbox
    let testTabImages = createLightboxDOM(realisations);
    console.log(testTabImages);

}


// Traitement datas
function cuttingRealisationsFromDatas(datas){
    const realisations = datas.slice(1, datas.length);
    return realisations;
}


// Listing des images / vidéos
function createLightboxDOM(image_datas){
    let tabImages = [];
    image_datas.forEach((image) => {
        if(image.image){
            tabImages.push(image.image);

        }
        if(image.video){
            tabImages.push(image.video);

        }
    })

    console.log(tabImages);

    tabImages.forEach((tabData) => {
        const div = document.createElement('div');
        div.className = 'lightbox-container';
        const image = document.createElement('img');
        let linkData = `assets/creations/images/${tabData}`
        image.setAttribute("src", linkData);
        div.appendChild(image);
        return div;
    })
}


// Gestion du total des likes des créations du photographe sélectionné
function countTotalLikes(datas) {
    let totalLikes = 0;
    datas.forEach((data) => {
        totalLikes += data.likes;
    })
    return totalLikes;
}


function photographerDetailsFactory(data){ // Traitement des données pour l'encart en bas à droite
    const { price, totalLikes } = data;

    function getPhotographDetailsDOM() { // Gestion DOM de l'encart
        const div = document.createElement( 'div' );
        div.className = 'details';

        const divTotalLikes = document.createElement( 'div' );
        divTotalLikes.className = 'totalLikes';
        divTotalLikes.innerHTML = totalLikes + '&nbsp;&#128149;'

        const dailyRate = document.createElement( 'div' );
        dailyRate.className = 'dailyRate';
        dailyRate.innerHTML = price + '€ / jour';

        div.appendChild(divTotalLikes);
        div.appendChild(dailyRate);

        return div;
    }
    return { price, totalLikes, getPhotographDetailsDOM }
}


function photographerContentFactory(data) { // Traitement des données des créations pour chaque photographe
    const { id, title, likes, image, video, date, price } = data;

    // Partie gestion de l'affichage de la lightbox
    const divContainCreation = document.createElement( 'div' );
    divContainCreation.className = 'containCreation';

    divContainCreation.addEventListener('click', function() {
        const divLightbox = document.querySelector(' .lightbox ');
        divLightbox.style.display = "block";
        let lightboxContainerImg = document.querySelector( '.lightbox-container img' );
        const pictureLink = `assets/creations/images/${image}`;
        console.log(data);
        lightboxContainerImg.setAttribute("src", pictureLink);

        const divLightboxPrev = document.querySelector( '.lightbox-prev' );
        divLightboxPrev.addEventListener('click', function() {
            console.log(data);
            
        })

        const divLightboxNext = document.querySelector( '.lightbox-next' );
        divLightboxNext.addEventListener('click', function() {
            console.log(data);
        })

    })


    function getUserDescDOM() { // Gestion DOM des créations du photographe
        const article = document.createElement( 'article' );
        const divRealisation = document.createElement( 'div' );

        divRealisation.className = 'realisation';
        // onclick=addCreationLike('+`${likes}`+','+`${id}`+')
        divRealisation.innerHTML = '<span class="title">' + title + '</span><span><span class="likeCreation' + likes + '" onclick=addCreationLike('+`${likes}`+')>' + likes + '</span><span class="heart' + likes + '">&nbsp;&#10084;</span></span>';

        if(typeof image !== 'undefined') {
            const pictureLink = `assets/creations/images/${image}`;
            const img = document.createElement( 'img' );
            img.setAttribute("src", pictureLink)
            img.setAttribute("alt", title)
            divContainCreation.appendChild(img);
        }

        if(typeof video !== 'undefined') {
            const videoLink = `assets/creations/videos/${video}`;
            const vid = document.createElement( 'video' );
            vid.setAttribute("src", videoLink);
            vid.setAttribute("controls", "controls");
            divContainCreation.appendChild(vid);
        }

        article.appendChild(divContainCreation);
        article.appendChild(divRealisation);

        return (article);
    }
    return {  title, likes, image, video, date, price, getUserDescDOM }
}


function photographerHeaderFactory(data) {
    const { name, city, country, portrait, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserHeaderDOM() { // Gestion DOM du header des informations du photographe
        document.getElementById( 'modal_photograph' ).innerText = '';
        document.getElementById( 'modal_photograph' ).innerText += name;

        const div = document.createElement( 'div' );
        const article = document.createElement( 'article' );

        const h1 = document.createElement( 'h1' );
        h1.innerText = name;
        
        const h2 = document.createElement( 'h2' );
        h2.innerHTML = country + ', ' + city;

        const tag = document.createElement( 'h3' );
        tag.innerHTML = tagline;

        article.appendChild(h1);
        article.appendChild(h2);
        article.appendChild(tag);

        const buttonContact = document.createElement( 'button' );
        buttonContact.classList.add("contact_button");
        buttonContact.setAttribute("onclick", "setTimeout(() => {displayModal()}, 400)");
        buttonContact.textContent = 'Contactez moi';

        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        img.setAttribute("alt", name)

        div.appendChild(article);
        div.appendChild(buttonContact);
        div.appendChild(img);

        return (div);
    }
    return { name, city, country, portrait, tagline, price, getUserHeaderDOM }
}


async function init() {
    let findId = getIdParameter();
    const creationsPhotographer = await getAllPicturesFromPhotographer(findId);
    displayData(creationsPhotographer);

    let creations = null;
    creations = cuttingRealisationsFromDatas(creationsPhotographer)
    console.log(creations);
}


function displayModal() { // Affichage du modal avec effets CSS
    const contactModal = document.getElementById( 'contact_modal' );
    contactModal.style.display = "block";
    contactModal.style.opacity = "0.99";
    const body = document.body;
    body.style.backgroundColor="rgba(0, 0, 0, 0.4)";
}


function closeModal() { // Fermeture du modal avec effet CSS
    const contactModal = document.getElementById( 'contact_modal' );
    contactModal.style.opacity = "0";
    setTimeout(() => {contactModal.style.display = "none";}, 400);
    const body = document.body;
    body.style.backgroundColor="rgba(255, 255, 255, 1)";
}


async function addCreationLike(likes) { // Ajout d'un favori sur une oeuvre
    const divLikeCreation = [...document.querySelectorAll(`[class^="likeCreation"]`)];
    let totalCreationLikes = 0;
    
    // console.log(divLikeCreation);
    
    const divCreationSelected = document.querySelector('.likeCreation' + likes);
    const heartCreationSelected = document.querySelector('.heart' + likes);
    const classTotalLikes = document.querySelector('.totalLikes');

    // console.log(divCreationSelected);
    divCreationSelected.innerHTML = likes + 1;
    divCreationSelected.style.color = 'red';

    divLikeCreation.forEach((likeCreation) => {
        totalCreationLikes += parseInt(likeCreation.innerHTML);
        // console.log(typeof(likeCreation.innerHTML));
    })
    // console.log(totalCreationLikes);

    
    heartCreationSelected.innerHTML = '<span>&#129505;</span>';
    heartCreationSelected.style.color = "red";

    classTotalLikes.innerHTML = '<span>' + totalCreationLikes + '&nbsp;&#128149;</span>';
    // Ajouter le like supplémentaire dans le fichier

    let findId = getIdParameter();
    const creationsPhotographer = await getAllPicturesFromPhotographer(findId);
    // console.log(creationsPhotographer);
}


function orderSelect(){ // Fonction liée au onchange de l'élément HTML <select> (tri)
    init();
}


function displayLightbox(id, portrait) {
    console.log(id);
    console.log(portrait);
    console.log(typeof(portrait));
    const divLightbox = document.querySelector(' .lightbox ');
    divLightbox.style.display = "block";
    let lightboxContainerImg = document.querySelector( '.lightbox-container img' );
    const pictureLink = `assets/creations/images/${portrait}`;
    console.log(pictureLink);
    lightboxContainerImg.setAttribute("src", pictureLink)
}


function closeLightbox() {
    const divLightbox = document.querySelector(' .lightbox ');
    divLightbox.style.display = "none";
}

init();