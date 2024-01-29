// Variable Declarations
const searchBtn = document.getElementById('search-btn')
const movieList = document.getElementById('movie-list')
const watchListPage = document.getElementById('watchlist')

// localStorage.setItem('watchlist', JSON.stringify([]))

console.log("index.js loaded");

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
    console.log(searchResults)

    const moviePromises = searchResults.map(async(result) => {
        const titleOfMovie = result.Title.split(' ').join('-')
        const updatedTitleOfMovie = titleOfMovie.replace(/(?<![a-zA-Z,])'(?![a-zA-Z])/g, '').replace(/,/g, '');
        const movie = await fetch(`https://www.omdbapi.com/?apikey=69a3b158&t=${updatedTitleOfMovie}&type=movie&plot=full&y=${result.Year}`)
        const movieInfo = await movie.json()
        
        const watchlistToJson = localStorage.getItem('watchlist')
        const currentwatchlist = JSON.parse(watchlistToJson)
        const idsToCheck = currentwatchlist.map((movieInWatchlist) => {
            return movieInWatchlist.imdbID
        })
        console.log(movieInfo)
        
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
                        <p>(Already in watchlist)</p>
                    </div>
                    <p class="read-more">${movieInfo.Plot}</p>
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
                    <p class="read-more">${movieInfo.Plot}</p>
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

//watchlist functionality
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('page loaded')
//     renderWatchlist()
// });

// function renderWatchlist() {
//     const currentwatchlist = localStorage.getItem('watchlist') 
    
//     let watchListArray = JSON.parse(currentwatchlist)
    
//     watchListPage.innerHTML = '';
//     const watchListPageHTML = watchListArray.map((movie) => {
        
//         return `
//         <div class="movie-element" id='${movie.imdbID}'>
//             <div class='movielist-img'>
//                 <img src='${movie.Poster}' alt='The movie poster for ${movie.Title}. If there is no poster, there either is none or an error occurred.'>
//             </div>
//             <div class='movie-second-column'>
//                 <div class='movie-title-and-rating'>
//                     <h1>${movie.Title} (${movie.Year})</h1>
//                     <p><i class="fa-solid fa-star"> ${movie.imdbRating}</i>
//                 </div>
//                 <div class='movie-info'>
//                     <p>${movie.Runtime}</p>
//                     <p>${movie.Genre}</p>
//                     <p class='remove-watchlist-button' data-watchlistremove='${movie.imdbID}'><i class="fa-solid fa-xmark"></i> Remove Film</p>
//                 </div>
//                 <p class="read-more">${movie.Plot}</p>
//             </div>
            
//         </div>
//         <hr>
//         `
        
//     }).join('')
    
//     watchListPage.innerHTML = watchListPageHTML 
// }


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
            console.log(watchListArray)
            localStorage.setItem('watchlist', JSON.stringify(watchListArray))
            
        })

    document.querySelector(`p[data-watchlistadd='${movieId}']`).innerHTML = "(Already in watchlist)"
    document.querySelector(`p[data-watchlistadd='${movieId}']`).style.color = 'white'
}

// function removeMovieFromWatchlist(movieId) {
//     const currentwatchlist = localStorage.getItem('watchlist')
//     console.log(movieId)
// }