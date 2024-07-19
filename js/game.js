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
    loadLevelList();
}

function showHelp() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('play-menu').classList.add('hidden');
    document.getElementById('help-menu').classList.remove('hidden');
    document.getElementById('game-canvas').classList.add('hidden');
}

function startSingleplayer(level) {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('play-menu').classList.add('hidden');
    document.getElementById('help-menu').classList.add('hidden');
    document.getElementById('game-canvas').classList.remove('hidden');

    // Initialize game with selected level data
    loadLevelData(`data/levels/${level}.json`);
}

function startEndless() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('play-menu').classList.add('hidden');
    document.getElementById('help-menu').classList.add('hidden');
    document.getElementById('game-canvas').classList.remove('hidden');

    // Initialize endless mode
    startEndlessMode();
}

function loadLevelList() {
    fetch('data/levels.json')
        .then(response => response.json())
        .then(data => {
            const levelsList = document.getElementById('levels-list');
            levelsList.innerHTML = '';
            Object.keys(data).forEach(level => {
                const button = document.createElement('button');
                button.innerText = level;
                button.onclick = () => startSingleplayer(level);
                levelsList.appendChild(button);
            });
        });
}

function loadLevelData(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Level Data:', data);
            // Initialize the game with levels data
            initializeGame(data);
        });
}

function initializeGame(levelData) {
    // Example of loading defences and monsters for a level
    let defences = [];
    let monsters = [];

    // Load defences and monsters based on level configuration
    loadDefences(['BoomCannon'], defences);
    loadMonsters(['Goblin', 'Orc'], monsters);

    // Continue with initializing the game with defences and monsters
    console.log('Defences:', defences);
    console.log('Monsters:', monsters);

    // Further initialization like paths, starting cash, etc.
    initializePaths(levelData.paths);
    initializeDefencePaths(levelData.placeableDefencePaths);
    setStartingCash(levelData.startingCash);
}

function loadDefences(defenceTypes, defences) {
    defenceTypes.forEach(type => {
        fetch(`data/defences/${type}.defence`)
            .then(response => response.json())
            .then(data => {
                const defence = {
                    type: data.type,
                    damage: data.damage,
                    range: data.range,
                    cost: data.cost,
                    targetingMode: data.targetingMode,
                    projectile: data.projectile.map(proj => ({
                        image: `data/images/${proj.image}`,
                        speed: proj.speed,
                        hitbox: proj.hitbox
                    })),
                    statusEffects: data.statusEffects,
                    sprite: `data/images/${data.sprite}.png`
                };
                defences.push(defence);
            });
    });
}

function loadMonsters(monsterTypes, monsters) {
    monsterTypes.forEach(type => {
        fetch(`data/monsters/${type}.monster`)
            .then(response => response.json())
            .then(data => {
                const monster = {
                    type: data.type,
                    health: data.health,
                    speed: data.speed,
                    radius: data.radius,
                    children: data.children.map(child => `data/monsters/${child}.monster`),
                    sprite: `data/images/${data.sprite}`,
                    immunities: data.immunities
                };
                monsters.push(monster);
            });
    });
}

function initializePaths(paths) {
    // Logic to initialize paths for the level
    console.log('Paths:', paths);
}

function initializeDefencePaths(defencePaths) {
    // Logic to initialize placeable defence paths
    console.log('Defence Paths:', defencePaths);
}

function setStartingCash(cash) {
    // Logic to set the starting cash for the player
    console.log('Starting Cash:', cash);
}

function startEndlessMode() {
    console.log('Starting endless mode');
    // Initialize endless mode
}
