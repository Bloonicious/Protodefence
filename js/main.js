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
            initializeGame(data);
        });
}

function initializeGame(levels) {
    // Example of loading defences and monsters for level1
    let defences = [];
    let monsters = [];

    // Load defences
    loadDefences(['BoomCannon'], defences);

    // Load monsters
    loadMonsters(['Goblin'], monsters);

    // Continue with initializing the game with defences and monsters
    console.log('Defences:', defences);
    console.log('Monsters:', monsters);
}

function loadDefences(defenceTypes, defences) {
    defenceTypes.forEach(type => {
        fetch(`data/defences/${type}.defence`)
            .then(response => response.json())
            .then(data => {
                defences.push(data);
            });
    });
}

function loadMonsters(monsterTypes, monsters) {
    monsterTypes.forEach(type => {
        fetch(`data/monsters/${type}.monster`)
            .then(response => response.json())
            .then(data => {
                monsters.push(data);
            });
    });
}

function startEndlessMode() {
    console.log('Starting endless mode');
    // Initialize endless mode
}
