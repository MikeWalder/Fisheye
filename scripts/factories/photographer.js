function photographerFactory(data) {
    const { id, name, city, country, portrait, tagline, price } = data;
    // console.log(data);

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
    return { id, name, city, country, portrait, tagline, price, getUserCardDOM }
}