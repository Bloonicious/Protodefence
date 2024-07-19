function showMainMenu() {
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('play-menu').classList.add('hidden');
    document.getElementById('help-menu').classList.add('hidden');
    document.getElementById('game-canvas').classList.add('hidden');
}

function showPlayMenu() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('play-menu').classList.remove('hidden');
    document.getElementById('help-menu').classList.add('hidden');
    document.getElementById('game-canvas').classList.add('hidden');
}

function showHelp() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('play-menu').classList.add('hidden');
    document.getElementById('help-menu').classList.remove('hidden');
    document.getElementById('game-canvas').classList.add('hidden');
}

function startSingleplayer() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('play-menu').classList.add('hidden');
    document.getElementById('help-menu').classList.add('hidden');
    document.getElementById('game-canvas').classList.remove('hidden');

    // Initialize game with level data
    loadLevelData('data/levels.json');
}

function startEndless() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('play-menu').classList.add('hidden');
    document.getElementById('help-menu').classList.add('hidden');
    document.getElementById('game-canvas').classList.remove('hidden');

    // Initialize endless mode
    startEndlessMode();
}

function loadLevelData(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Levels:', data);
            // Initialize the game with levels data
        });
}

function startEndlessMode() {
    console.log('Starting endless mode');
    // Initialize endless mode
}
