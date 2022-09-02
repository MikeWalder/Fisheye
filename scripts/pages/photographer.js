//Mettre le code JavaScript lié à la page photographer.html



function getIdParameter() {
    let searchParams = new URLSearchParams(window.location.search);
    if(searchParams.has('id')){
        let getId = searchParams.get('id');
        return getId;
    } else {
        window.location.pathname = 'index.html';
    }
}

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
    const photographerDescription = document.querySelector(".photographer_description");
    const photographersSection = document.querySelector(".photographer_section");
    console.log(dataPhotographer);
    const photographer = photographerDescFactory(dataPhotographer[0]);
}

async function init() {
    let findId = getIdParameter();
    const creationsPhotographer = await getAllPicturesFromPhotographer(findId);
    console.log(creationsPhotographer);

    displayData(creationsPhotographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
}


function photographerDescFactory(data) {
    const { name, city, country, portrait, tagline, price } = data;
    console.log(data);

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        
        const link = document.createElement( 'a' );
        link.setAttribute("href", "photographer-page.html?id="+id);
        link.setAttribute("title", name);

        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        img.setAttribute("alt", name)

        const h2 = document.createElement( 'h2' );
        h2.innerText = name;
        
        const h4 = document.createElement( 'h4' );
        h4.innerHTML = country + ', ' + city;

        const tag = document.createElement( 'h5' );
        tag.innerHTML = tagline;

        const priceAuthor = document.createElement( 'h6' );
        priceAuthor.innerHTML = price + '€/jour';

        link.appendChild(img);
        article.appendChild(link);
        article.appendChild(h2);
        article.appendChild(h4);
        article.appendChild(tag);
        article.appendChild(priceAuthor);
        return (article);
    }
    return { name, city, country, portrait, tagline, price, getUserCardDOM }
}

init();