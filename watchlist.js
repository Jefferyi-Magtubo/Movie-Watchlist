const watchListPage = document.getElementById('watchlist')

document.addEventListener('DOMContentLoaded', () => {
    renderWatchlist()
});

function renderWatchlist() {
    const currentwatchlist = localStorage.getItem('watchlist') 
    
    let watchListArray = JSON.parse(currentwatchlist)

    if (watchListArray.length === 0) {
        return
    } else {
        const watchListPageHTML = watchListArray.map((movie) => {
        
            return `
            <div class="movie-element" id='${movie.imdbID}'>
                <div class='movielist-img'>
                    <img src='${movie.Poster}' alt='The movie poster for ${movie.Title}. If there is no poster, there either is none or an error occurred.'>
                </div>
                <div class='movie-second-column'>
                    <div class='movie-title-and-rating'>
                        <h1>${movie.Title} (${movie.Year})</h1>
                        <p><i class="fa-solid fa-star"> ${movie.imdbRating}</i>
                    </div>
                    <div class='movie-info'>
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <p class='remove-watchlist-button' data-watchlistremove='${movie.imdbID}'><i class="fa-solid fa-xmark"></i> Remove Film</p>
                    </div>
                    <p class="read-more read-more-toggle">${movie.Plot}</p>
                </div>
                
            </div>
            <hr>
            `
            
        }).join('')
        
        watchListPage.innerHTML = watchListPageHTML 
    }
}


document.addEventListener('click', (e) => {

    if(e.target.dataset.watchlistremove) {   
        removeMovieFromWatchlist(e.target.dataset.watchlistremove)
    }

})

function removeMovieFromWatchlist(movieId) {
    const currentwatchlist = localStorage.getItem('watchlist')
    const watchlistToTest = JSON.parse(currentwatchlist)
    const newWatchlist = watchlistToTest.filter((movie) => movie.imdbID !== movieId)
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist))
    renderWatchlist()

    if (newWatchlist.length === 0) {
        watchListPage.innerHTML = `
            <div class="default-watchlist-message">
                <p>Your watchlist is looking a little empty...</p>
                <p><a href='/index.html'><i class="fa-solid fa-plus"></i> Let's add some movies!</a></p>
            </div>
        `
    }
}