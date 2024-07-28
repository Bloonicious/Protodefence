let currentWave = 0;
let maxWaves = 0;
let waveDensity = [];
let currentLevelData = {};
let defences = [];
let monsters = [];
let placedDefences = [];

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
            data.levels.forEach(level => {
                const button = document.createElement('button');
                button.innerText = level;
                button.onclick = () => startSingleplayer(level);
                levelsList.appendChild(button);
            });
        });
}

function loadLevelData(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Level Data:', data);
            initializeGame(data);
        })
        .catch(error => {
            console.error('Error loading level data:', error);
            showPlayMenu();
        });
}

function initializeGame(levelData) {
    currentLevelData = levelData;
    currentWave = 0;
    maxWaves = levelData.waves;
    waveDensity = levelData.waveDensity;

    defences = [];
    monsters = [];
    placedDefences = [];

    loadDefences(levelData.defences, defences)
        .then(() => {
            loadMonsters(levelData.monsters, monsters)
                .then(() => {
                    console.log('Defences:', defences);
                    console.log('Monsters:', monsters);
                    
                    initializePaths(levelData.paths);
                    initializeDefencePaths(levelData.placeableDefencePaths);
                    setStartingCash(levelData.startingCash);

                    displayAvailableDefences(defences);

                    updateWaveInfo();
                    initializeGrid();
                });
        });
}

function loadDefences(defenceTypes, defences) {
    return Promise.all(defenceTypes.map(type => {
        return fetch(`data/defences/${type}.defence`)
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
    }));
}

function loadMonsters(monsterTypes, monsters) {
    return Promise.all(monsterTypes.map(type => {
        return fetch(`data/monsters/${type}.monster`)
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
    }));
}

function initializePaths(paths) {
    console.log('Paths:', paths);
}

function initializeDefencePaths(defencePaths) {
    console.log('Defence Paths:', defencePaths);
}

function setStartingCash(startingCash) {
    document.getElementById('starting-cash').innerText = `Starting Cash: $${startingCash.toLocaleString('en-US')}`;
    console.log('Starting Cash:', startingCash);
}

function startEndlessMode() {
    console.log('Starting endless mode');
}

function displayAvailableDefences(defences) {
    const defencePanel = document.getElementById('defence-panel');
    defencePanel.innerHTML = '';
    defences.forEach(defence => {
        const div = document.createElement('div');
        div.className = 'draggable-defence';
        div.draggable = true;
        div.ondragstart = (event) => drag(event, defence.type);
        div.innerHTML = `
            <div>${defence.type}</div>
            <div>Cost: $${defence.cost.toLocaleString('en-US')}</div>
        `;
        defencePanel.appendChild(div);
    });
}

function initializeGrid() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const cellSize = 50;

    // Create grid
    for (let x = 0; x < canvas.width; x += cellSize) {
        for (let y = 0; y < canvas.height; y += cellSize) {
            context.strokeRect(x, y, cellSize, cellSize);
        }
    }

    // Add drop zones
    canvas.ondrop = (event) => drop(event);
    canvas.ondragover = (event) => allowDrop(event);
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event, defenceType) {
    event.dataTransfer.setData("defenceType", defenceType);
}

function drop(event) {
    event.preventDefault();
    const defenceType = event.dataTransfer.getData("defenceType");
    const x = event.offsetX;
    const y = event.offsetY;

    const cellX = Math.floor(x / 50) * 50;
    const cellY = Math.floor(y / 50) * 50;

    placeDefence(defenceType, cellX, cellY);
}

function placeDefence(defenceType, x, y) {
    const defence = defences.find(d => d.type === defenceType);
    if (defence) {
        placedDefences.push({ defence, x, y });
        drawDefence(defence, x, y);
    }
}

function drawDefence(defence, x, y) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = defence.sprite;
    image.onload = () => {
        context.drawImage(image, x, y, 50, 50);
    };
}

function startWave() {
    if (currentWave < maxWaves) {
        currentWave++;
        const monsterCount = waveDensity[currentWave - 1];
        console.log(`Starting wave ${currentWave} with ${monsterCount} monsters`);
        spawnMonsters(monsterCount);
        updateWaveInfo();
    } else {
        console.log('All waves completed');
    }
}

function spawnMonsters(count) {
    const monsters = currentLevelData.monsters;
    for (let i = 0; i < count; i++) {
        const monsterType = monsters[i % monsters.length];
        fetch(`data/monsters/${monsterType}.monster`)
            .then(response => response.json())
            .then(monsterData => {
                console.log('Spawning monster:', monsterData);
                // Initialize monster on path
            });
    }
}

function updateWaveInfo() {
    const waveInfo = document.getElementById('wave-info');
    waveInfo.innerText = `Wave ${currentWave}/${maxWaves}`;
}

// Game loop
function gameLoop() {
    // Update monster positions
    // Check for collisions with defences
    // Render game state
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
