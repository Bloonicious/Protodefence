let currentWave = 0;
let maxWaves = 0;
let waveDensity = [];
let currentLevelData = {};

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

    let defences = [];
    let monsters = [];

    loadDefences(levelData.defences, defences)
        .then(() => {
            loadMonsters(levelData.monsters, monsters)
                .then(() => {
                    console.log('Defences:', defences);
                    console.log('Monsters:', monsters);
                    
                    initializePaths(levelData.paths);
                    initializeDefencePaths(levelData.placeableDefencePaths);
                    setStartingCash(defences);

                    displayAvailableDefences(defences);

                    updateWaveInfo();
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

function setStartingCash(defences) {
    let startingCash = defences.reduce((sum, defence) => sum + defence.cost, 0);
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
        div.innerHTML = `
            <div>${defence.type}</div>
            <div>Cost: $${defence.cost.toLocaleString('en-US')}</div>
        `;
        defencePanel.appendChild(div);
    });
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
            });
    }
}

function updateWaveInfo() {
    const waveInfo = document.getElementById('wave-info');
    waveInfo.innerText = `Wave ${currentWave}/${maxWaves}`;
}
