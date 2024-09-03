const apiKey = '2163432933fb97fdb00b76b9248eb373'; 
const apiUrl = 'https://api.themoviedb.org/3';

async function fetchMovies() {
    try {
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
    }
}

function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        movieItem.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="fetchMovieDetails(${movie.id})">Ver Detalhes</button>
            <button onclick="addToFavorites(${JSON.stringify(movie)})">Adicionar aos Favoritos</button>
        `;
        movieList.appendChild(movieItem);
    });
}

async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}`);
        const movie = await response.json();
        displayMovieDetails(movie);
    } catch (error) {
        console.error('Erro ao carregar detalhes do filme:', error);
    }
}

function displayMovieDetails(movie) {
    const movieDetails = document.getElementById('movie-details');
    movieDetails.innerHTML = `
        <h3>${movie.title}</h3>
        <p>${movie.overview}</p>
        <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" alt="${movie.title}">
    `;
    movieDetails.style.display = 'block';
}

async function searchMovies() {
    const query = document.getElementById('search-input').value;
    if (query) {
        try {
            const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
        }
    }
}

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function addToFavorites(movie) {
    if (!favorites.some(fav => fav.id === movie.id)) {
        favorites.push(movie);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}

function displayFavorites() {
    const favoriteList = document.getElementById('favorite-list');
    favoriteList.innerHTML = '';
    favorites.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        movieItem.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="removeFromFavorites(${movie.id})">Remover dos Favoritos</button>
        `;
        favoriteList.appendChild(movieItem);
    });
}

function removeFromFavorites(movieId) {
    favorites = favorites.filter(movie => movie.id !== movieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}


displayFavorites();


fetchMovies();
