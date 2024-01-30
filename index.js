// Variable Declarations
const searchBtn = document.getElementById('search-btn')
const movieList = document.getElementById('movie-list')
const watchListPage = document.getElementById('watchlist')

//Making Watchlist in local storage
document.addEventListener('DOMContentLoaded', () => {

    if(!localStorage.getItem('watchlist')) {
        localStorage.setItem('watchlist', JSON.stringify([]))
    }
})

//Search Functionality
searchBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    
    const search = document.getElementById('search').value
    let searchData = await handleSearch(search)
    movieList.innerHTML = searchData
    
})

async function handleSearch(searchInput) {
    const updatedTitle = searchInput.split(' ').join('-')

    const res = await fetch(`https://www.omdbapi.com/?apikey=69a3b158&s=${updatedTitle}&type=movie`)
    const data = await res.json()
    const searchResults = data.Search

    const moviePromises = searchResults.map(async(result) => {
        const titleOfMovie = result.Title.split(' ').join('-')
        const updatedTitleOfMovie = titleOfMovie.replace(/(?<![a-zA-Z])'(?<![a-zA-Z])/g, '').replace(/,/g, '') //checking to make sure the ' isn't between letters. If it is, it wont'get replaced
        const movie = await fetch(`https://www.omdbapi.com/?apikey=69a3b158&t=${updatedTitleOfMovie}&type=movie&y=${result.Year}`)
        const movieInfo = await movie.json()
        if(movieInfo.Response === "False") {
            return
        }
        
        const watchlistToJson = localStorage.getItem('watchlist')
        console.log(watchlistToJson)
        const currentwatchlist = JSON.parse(watchlistToJson)
        const idsToCheck = currentwatchlist.map((movieInWatchlist) => {
            return movieInWatchlist.imdbID
        })
        
        if (idsToCheck.includes(movieInfo.imdbID)) {
            return `
            <div class="movie-element" id='${movieInfo.imdbID}'>
                <div class='movielist-img'>
                    <img src='${movieInfo.Poster}' >
                </div>
                <div class='movie-second-column'>
                    <div class='movie-title-and-rating'>
                        <h1>${movieInfo.Title} (${movieInfo.Year})</h1>
                        <p><i class="fa-solid fa-star"> ${movieInfo.imdbRating}</i>
                    </div>
                    <div class='movie-info'>
                        <p>${movieInfo.Runtime}</p>
                        <p>${movieInfo.Genre}</p>
                        <p class='already-watched'>(Already in watchlist)</p>
                    </div>
                    <p class="read-more read-more-toggle">${movieInfo.Plot}</p>
                </div>
                
            </div>
            <hr>
        `
        } else {
            return `
            <div class="movie-element" id='${movieInfo.imdbID}'>
                <div class='movielist-img'>
                    <img src='${movieInfo.Poster}' >
                </div>
                <div class='movie-second-column'>
                    <div class='movie-title-and-rating'>
                        <h1>${movieInfo.Title} (${movieInfo.Year})</h1>
                        <p><i class="fa-solid fa-star"> ${movieInfo.imdbRating}</i>
                    </div>
                    <div class='movie-info'>
                        <p>${movieInfo.Runtime}</p>
                        <p>${movieInfo.Genre}</p>
                        <p class='add-watchlist-button' data-watchlistadd='${movieInfo.imdbID}'><i class="fa-solid fa-plus"></i> Watchlist</p>
                    </div>
                    <p class="read-more read-more-toggle">${movieInfo.Plot}</p>
                </div>
                
            </div>
            <hr>
        `
        }
            
    })

    const movieWatchlistArray = await Promise.all(moviePromises)

    const movieWatchlistHTML = movieWatchlistArray.join('')
 
    return movieWatchlistHTML
}

//Watchlist Functionality

document.addEventListener('click', (e) => {

    if(e.target.dataset.watchlistadd) {
        addMovieToWatchlist(e.target.dataset.watchlistadd)
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
            localStorage.setItem('watchlist', JSON.stringify(watchListArray))
            
        })

    document.querySelector(`p[data-watchlistadd='${movieId}']`).innerHTML = "(Already in watchlist)"
    document.querySelector(`p[data-watchlistadd='${movieId}']`).style.color = '#A9A9A9'
}