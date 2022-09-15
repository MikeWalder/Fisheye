//Mettre le code JavaScript lié à la page photographer.html

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
        return albumData;
    })
    .catch(err => console.log(err));
}


async function displayData(dataPhotographer){
    const photographerDescription = document.querySelector(".photograph-header");
    photographerDescription.innerHTML = '';
    const contentOrderSelect = document.querySelector("#order-select");
    const photographerCreations = document.querySelector(".photographer-section");
    photographerCreations.innerHTML = '';
    const photographerDetails = document.querySelector(".photographer-details");

    const photographer = photographerHeaderFactory(dataPhotographer[0]);
    let userHeaderDOM = null;
    userHeaderDOM = photographer.getUserHeaderDOM();
    photographerDescription.appendChild(userHeaderDOM);

    contentOrderSelect.setAttribute("onchange", "orderSelect()");

    // Récupération des oeuvres du photographe sélectionné
    const realisations = dataPhotographer.slice(1, dataPhotographer.length);

    // Récupération de la valeur du select
    const orderSelectValue = document.querySelector("#order-select").value;
    // console.log(orderSelectValue);
    // console.log(realisations[0][orderSelectValue]);

    if(orderSelectValue){
        // console.log("your value is " + orderSelectValue + "!");

        realisations.sort(function(a, b) {
            if(a[orderSelectValue] < b[orderSelectValue]) return -1;
            if(a[orderSelectValue] > b[orderSelectValue]) return 1;
            return 0;
        });
        // console.log(realisations);
    }

    // Initialisation du total des likes des créations du photographe sélectionné
    let totalLikes = 0;
    
    // Partie insertion data et DOM des créations du photographe sélectionné
    realisations.forEach((realisation) => {
        const realisationModel = photographerContentFactory(realisation);
        const userContentDOM = realisationModel.getUserDescDOM();
        photographerCreations.appendChild(userContentDOM);
        totalLikes += realisation.likes;
    })
    dataPhotographer[0].totalLikes = totalLikes;
    
    // Partie insertion data et DOM dans l'encart en bas à droit de la page du photographe
    const photographerIntelsBox = photographerDetailsFactory(dataPhotographer[0]);
    const photographerDetailsDOM = photographerIntelsBox.getPhotographDetailsDOM();
    photographerDetails.appendChild(photographerDetailsDOM);

}

function photographerDetailsFactory(data){ //Traitement des données pour l'encart en bas à droite
    const { price, totalLikes } = data;
    // console.log(totalLikes);

    function getPhotographDetailsDOM() {
        const div = document.createElement( 'div' );
        div.className = 'details';

        const divTotalLikes = document.createElement( 'div' );
        divTotalLikes.className = 'totalLikes';
        divTotalLikes.innerHTML = totalLikes + '&nbsp;&#10084;'

        const dailyRate = document.createElement( 'div' );
        dailyRate.className = 'dailyRate';
        dailyRate.innerHTML = price + '€ / jour';

        div.appendChild(divTotalLikes);
        div.appendChild(dailyRate);

        return (div);
    }

    return { price, totalLikes, getPhotographDetailsDOM }
}

function photographerContentFactory(data) {
    const { title, likes, image, video, date, price } = data;

    function getUserDescDOM() { // Gestion DOM des créations du photographe
        const article = document.createElement( 'article' );

        const divRealisation = document.createElement( 'div' );
        divRealisation.className = 'realisation';
        divRealisation.innerHTML = '<span class="title">' + title + '</span><span class="like' + likes + '" onclick="addLike(' + likes + ')">' + likes + '&nbsp;&#10084;</span>';

        if(typeof image !== 'undefined') {
            const pictureLink = `assets/photographers/${image}`;
            const img = document.createElement( 'img' );
            img.setAttribute("src", pictureLink)
            img.setAttribute("alt", title)
            article.appendChild(img);
        }

        if(typeof video !== 'undefined') {
            const videoLink = `assets/photographers/videos/${video}`;
            const vid = document.createElement( 'video' );
            vid.setAttribute("src", videoLink);
            vid.setAttribute("controls", "controls");
            article.appendChild(vid);
        }
        
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
        buttonContact.setAttribute("onclick", "displayModal()");
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
}

function displayModal() { // Affichage du modal
    const contactModal = document.getElementById( 'contact_modal' );
    contactModal.style.display = "block";
    const body = document.body;
    body.style.backgroundColor="rgba(0, 0, 0, 0.4)";
}

function closeModal() { // Fermeture du modal
    const contactModal = document.getElementById( 'contact_modal' );
    contactModal.style.display = "none";
    const body = document.body;
    body.style.backgroundColor="rgba(255, 255, 255, 1)";
}

function addLike(likes) { // Ajout d'un favori sur une oeuvre
    const divLike = document.querySelector('.like' + likes);
    divLike.style.color = 'red';
    divLike.innerHTML = (likes + 1) + '&nbsp;&#10084;';
}

function orderSelect(){ // Fonction liée au onchange de l'élément HTML <select> (tri)
    init();
}

init();
