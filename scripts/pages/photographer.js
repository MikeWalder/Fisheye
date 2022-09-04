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

    const photographer = photographerHeaderFactory(dataPhotographer[0]);
    const userHeaderDOM = photographer.getUserHeaderDOM();
    photographerDescription.appendChild(userHeaderDOM);

    const realisations = dataPhotographer.slice(1, dataPhotographer.length);
    console.log(realisations);
    
    realisations.forEach((realisation) => {
        const realisationModel = photographerContentFactory(realisation);
        const userContentDOM = realisationModel.getUserDescDOM();
        photographerCreations.appendChild(userContentDOM);
    })
}

function photographerContentFactory(data) {
    const { title, likes, image, date, price } = data;
    console.log(data);

    const picture = `assets/photographers/${image}`;
    console.log(picture);

    function getUserDescDOM() {
        const article = document.createElement( 'article' );

        const divRealisation = document.createElement( 'div' );
        divRealisation.className = 'realisation';

        
        divRealisation.innerHTML = '<span class="title">' + title + '</span><span>' + likes + '&nbsp;&#10084;</span>';

        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        img.setAttribute("alt", title)

        article.appendChild(img);
        article.appendChild(divRealisation);

        return (article);
    }
    return {  title, likes, image, date, price, getUserDescDOM }
}

function photographerHeaderFactory(data) {
    const { name, city, country, portrait, tagline, price } = data;
    console.log(data);

    const picture = `assets/photographers/${portrait}`;

    function getUserHeaderDOM() {
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
    console.log(creationsPhotographer);
    displayData(creationsPhotographer);
}

init();