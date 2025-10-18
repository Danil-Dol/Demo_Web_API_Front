const games_uri = 'api/games';
const genres_uri = 'api/genres';
let games = [];
let genres = [];

function getGames() {
    fetch(games_uri)
        .then(response => response.json())
        .then(data => _displayGames(data))
}

function _displayGames(data) {
    const container = document.getElementById('games-container');
    container.innerHTML = '';
    data.forEach(game => {
        container.innerHTML += `
            <div class="card" style="border-radius:15px; border:1px solid #e0e0e0;">
                <div class="card-content">
                    <span class="card-title" style="font-size:2.8rem; line-height:1.1; margin-bottom:1.2rem;">
                        ${game.title}
                    </span>

                    <p class="flow-text grey-text text-darken-2" style="font-size:1.4rem; margin-bottom:2rem;">
                        ${game.description}
                    </p>

                    <div class="meta-container">
                        <div class="chip deep-purple darken-3 white-text meta-item" style="max-width: max-content">
                            ${game.genre}
                        </div>

                        <div class="meta-item">
                            <i class="material-icons">calendar_today</i>
                            ${game.dateOfRelease}
                        </div>

                        <div class="meta-item">
                            <i class="material-icons" style="color:#ffc107;">star</i>
                            ${game.rating}/100
                        </div>

                        <div class="meta-item price">
                            ${game.price}
                        </div>
                    </div>
                </div>

                <div class="card-action center-align" style="border-top:1px solid #eee; padding-top:1.5rem;">
                    <a class="waves-effect waves-light btn blue" onclick="selectGameForUpdate(${game.id})">
                        <i class="material-icons left">edit</i>Изменить
                    </a>
                    <a class="waves-effect waves-light btn red" onclick="deleteGame(${game.id})">
                        <i class="material-icons left">delete</i>Удалить
                    </a>
                </div>
            </div>
        `;
    });
    games = data;
}

function deleteGame(id) {
    fetch(`${games_uri}/${id}`, {
        method: 'DELETE'
    })
    .then(() => getGames())
    .catch(error => console.error('Unable to delete the game', error))
}

function getGenres() {
    fetch(genres_uri)
        .then(response => response.json())
        .then(data => _displayGenres(data))
        .catch(error => console.error('Unable to get genres', error));
}

function _displayGenres(data) {
    const addSelector = document.getElementById('genre-add-selector');
    const updateSelector = document.getElementById('genre-update-selector');

    data.forEach(genre => {
        addSelector.innerHTML += `
            <option id="${genre.id}">${genre.name}</option>
        `;
        updateSelector.innerHTML += `
            <option id="${genre.id}">${genre.name}</option>
        `;
    });
    genres = data;
}

function addGame() {
    const gameTitle = document.getElementById('game-add-title');
    const gameDescription = document.getElementById('game-add-description');
    const gameGenreSelector = document.getElementById('genre-add-selector');
    const gameReleaseDate = document.getElementById('game-add-release_date');
    const gameRating = document.getElementById('game-add-rating');
    const gamePrice = document.getElementById('game-add-price');

    const game = {
        title: gameTitle.value,
        description: gameDescription.value,
        releaseDate: gameReleaseDate.value,
        price: gamePrice.value,
        rating: gameRating.value,
        genreId: gameGenreSelector[gameGenreSelector.selectedIndex].id
    };

    fetch(games_uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
    })
        .then(response => response.json())
        .then(() => {
            getGames();
        })
        .catch(error => console.error('Unable to add the game', error));
}

function selectGameForUpdate(id) {
    selectedGameId = id;
    const game = games.find(g => g.id === id);

    if (game) {
        document.getElementById('title').value = game.title;
        document.getElementById('description').value = game.description;
        document.getElementById('release_date').value = formatDateForInput(game.dateOfRelease);
        document.getElementById('rating').value = game.rating;
        document.getElementById('price').value = parseFloat(game.price.replace(/[^0-9.-]+/g, ""));

        // Set the genre in the selector
        const genreSelector = document.getElementById('genre-update-selector');
        const options = genreSelector.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].text === game.genre) {
                genreSelector.selectedIndex = i;
                break;
            }
        }
    }
}

function formatDateForInput(dateString) {
    const parts = dateString.split('.');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return '';
}

function updateGame() {
    if (!selectedGameId) return;

    const gameTitle = document.getElementById('title');
    const gameDescription = document.getElementById('description');
    const gameGenreSelector = document.getElementById('genre-update-selector');
    const gameReleaseDate = document.getElementById('release_date');
    const gameRating = document.getElementById('rating');
    const gamePrice = document.getElementById('price');

    const game = {
        title: gameTitle.value,
        description: gameDescription.value,
        releaseDate: gameReleaseDate.value,
        price: gamePrice.value,
        rating: gameRating.value,
        genreId: gameGenreSelector[gameGenreSelector.selectedIndex].id
    };

    fetch(`${games_uri}/${selectedGameId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            getGames();
            // Reset the form
            document.querySelector('#update-form form').reset();
            selectedGameId = null;
        })
        .catch(error => console.error('Unable to update the game', error));
}

// 1. обработка нажатия кнокпи «Изменить» на карточке игры:
//      загрузка данных с карточки на форму изменения
// 2. обработка нажатия книпки «Сохранить» на форме измения игры:
//      изменённые данные сохраняете в БД -> перерендорить карточки для отображения изменений
// деделайн (срок выполнения задания до (не включительно)): 30.04.2025