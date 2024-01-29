const watchListPage = document.getElementById('watchlist')

document.addEventListener('DOMContentLoaded', () => {
    console.log('page loaded')
    renderWatchlist()
});

function renderWatchlist() {
    const currentwatchlist = localStorage.getItem('watchlist') 
    
    let watchListArray = JSON.parse(currentwatchlist)
    
    watchListPage.innerHTML = '';
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
                <p class="read-more">${movie.Plot}</p>
            </div>
            
        </div>
        <hr>
        `
        
    }).join('')
    
    watchListPage.innerHTML = watchListPageHTML 
}


document.addEventListener('click', (e) => {

    if(e.target.dataset.watchlistremove) {   
        removeMovieFromWatchlist(e.target.dataset.watchlistremove)
    }

})

async function addMovieToWatchlist(movieId) {
    fetch(`http://www.omdbapi.com/?apikey=69a3b158&i=${movieId}`)
        .then(res => res.json())
        .then(async (data) => {
            let newMovie = data
            const newWatchlistData = newMovie
            const currentwatchlist = localStorage.getItem('watchlist')
            
            let watchListArray = JSON.parse(currentwatchlist)
            
            watchListArray.push(newWatchlistData)
            console.log(watchListArray)
            localStorage.setItem('watchlist', JSON.stringify(watchListArray))
            
        })
}

function removeMovieFromWatchlist(movieId) {
    const currentwatchlist = localStorage.getItem('watchlist')
    const watchlistToTest = JSON.parse(currentwatchlist)
    const newWatchlist = watchlistToTest.filter((movie) => movie.imdbID !== movieId)
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist))
    renderWatchlist()
}