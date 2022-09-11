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
        // console.log(albumData);
        return albumData;
    })
    .catch(err => console.log(err));
}


async function displayData(dataPhotographer){
    const photographerDescription = document.querySelector(".photograph-header");
    const photographerCreations = document.querySelector(".photographer-section");
    const photographerDetails = document.querySelector(".photographer-details");

    const photographer = photographerHeaderFactory(dataPhotographer[0]);
    const userHeaderDOM = photographer.getUserHeaderDOM();
    photographerDescription.appendChild(userHeaderDOM);

    const realisations = dataPhotographer.slice(1, dataPhotographer.length);
    console.log(realisations);
    console.log(photographer);
    let totalLikes = 0;
    
    realisations.forEach((realisation) => {
        const realisationModel = photographerContentFactory(realisation);
        const userContentDOM = realisationModel.getUserDescDOM();
        photographerCreations.appendChild(userContentDOM);
        totalLikes += realisation.likes;
    })

    dataPhotographer[0].totalLikes = totalLikes;
    
    const photographerIntelsBox = photographerDetailsFactory(dataPhotographer[0]);
    const photographerDetailsDOM = photographerIntelsBox.getPhotographDetailsDOM();
    photographerDetails.appendChild(photographerDetailsDOM);

}

function photographerDetailsFactory(data){
    const { price, totalLikes } = data;
    console.log(totalLikes);

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
    // console.log(likes);

    function getUserDescDOM() {
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

    function getUserHeaderDOM() {
        document.getElementById( 'modal_photograph' ).innerText = name;

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

function displayModal() {
    const contactModal = document.getElementById( 'contact_modal' );
    contactModal.style.display = "block";
    const body = document.body;
    body.style.backgroundColor="rgba(0, 0, 0, 0.4)";
}

function closeModal() {
    const contactModal = document.getElementById( 'contact_modal' );
    contactModal.style.display = "none";
    const body = document.body;
    body.style.backgroundColor="rgba(255, 255, 255, 1)";
}

function addLike(likes) {
    console.log("Bonjour voici un like de plus à " + likes);
    const divLike = document.querySelector('.like' + likes);
    console.log(divLike);
    divLike.style.color = 'red';
    divLike.innerHTML = (likes + 1) + '&nbsp;&#10084;';
}

init();