function photographerFactory(data) {
    const { title, image, likes } = data;
    console.log(data);

    const picture = `assets/photographers/${image}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        img.setAttribute("alt", picture)
        const h2 = document.createElement( 'h2' );
        h2.innerHTML = '<div class="presenter"><span>&nbsp;' + title + '</span><span class="like">' + likes + '&nbsp;&#x2665;&nbsp;</span></div>';
        article.appendChild(img);
        article.appendChild(h2);
        return (article);
    }
    return { title, image, likes, getUserCardDOM }
}