    

    async function requestAllPhotographers() {
        return fetch('http://127.0.0.1:5500/data/photographers.json')
        .then(function(response) {
            return response.json();
        })
        .then((data) => {
            // console.log(data);
            return data;
        })
        .catch(err => console.log(err));
    }

    async function getPhotographers() {
        // Penser à remplacer par les données récupérées dans le json
        const photographers = requestAllPhotographers();
        console.log(photographers);
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.photographers.forEach((photographer) => {
            const photographerModel = photographerFactory(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    };

    async function init() {
        // Récupère les datas des photographes
        const photographers = await requestAllPhotographers();
        // console.log(photographers);
        displayData(photographers);
    };
    
    init();
    