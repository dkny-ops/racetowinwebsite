const scene = new THREE.Scene();

scene.background = new THREE.Color(
    0x87CEEB
);

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

//--------------------------------------------------
// UI
//--------------------------------------------------

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const distanceEl =
document.getElementById("distance");

const extraLifeBtn = document.getElementById("extraLifeBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

let extraLifeUsed = false;
let invulnerableUntil = 0;
let gameOverTimer;

const music = new Audio("music/race.mp3");  

music.loop = true;

music.volume = 0.4;

const bgMusic =
document.getElementById(
"bgMusic"
);


const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

const lastScoreEl = document.getElementById("lastScore");
const lastTimeEl = document.getElementById("lastTime");
const totalPointsEl =
document.getElementById("totalPoints");

const playerNameInput = document.getElementById("playerName");

let playerName = localStorage.getItem("raceToWinPlayerName") || "";

let playerId = localStorage.getItem("raceToWinPlayerId");

if (!playerId) {
    playerId = crypto.randomUUID();
    localStorage.setItem("raceToWinPlayerId", playerId);
}

playerNameInput.value = playerName;

playerNameInput.addEventListener("input", () => {
    playerName = playerNameInput.value.trim();

    localStorage.setItem(
        "raceToWinPlayerName",
        playerName
    );
});

const hudPlayerName = document.getElementById("hudPlayerName");

hudPlayerName.textContent = playerName || "PLAYER";


const gameOverEl = document.getElementById("gameOver");
const hud = document.getElementById("hud");

const gameOverScoreEl =
document.getElementById("gameOverScore");

const gameOverHighScoreEl =
document.getElementById("gameOverHighScore");

const cityBuildings = [];

//--------------------------------------------------
// Luces
//--------------------------------------------------

scene.add(
new THREE.AmbientLight(
0xffffff,
1.5
)
);

const sun =
new THREE.DirectionalLight(
0xffffff,
2
);

sun.position.set(
20,
30,
20
);

scene.add(sun);

//--------------------------------------------------
// Piso
//--------------------------------------------------

const grass = new THREE.Mesh(
new THREE.PlaneGeometry(
200,
1000
),
new THREE.MeshStandardMaterial({
color:0x3a3a3a
})
);

grass.rotation.x = -Math.PI/2;
grass.position.y = -0.01;

scene.add(grass);

const road = new THREE.Mesh(
new THREE.PlaneGeometry(
20,
1000
),
new THREE.MeshStandardMaterial({
color:0x181818
})
);


road.rotation.x = -Math.PI/2;

scene.add(road);

createCurbs();



function createCurbs(){

    for(
        let z = -500;
        z < 500;
        z += 4
    ){

        const leftPiece =
        new THREE.Mesh(

            new THREE.PlaneGeometry(
                2,
                4
            ),

            new THREE.MeshStandardMaterial({

                color:
                Math.floor(z / 4) % 2 === 0
                ?
                0xffffff
                :
                0xff0000

            })

        );

        leftPiece.rotation.x =
        -Math.PI / 2;

        leftPiece.position.set(
            -11,
            0.03,
            z
        );

        scene.add(leftPiece);

        const rightPiece =
        leftPiece.clone();

        rightPiece.position.x =
        11;

        scene.add(rightPiece);

    }

}

//--------------------------------------------------
// Lineas
//--------------------------------------------------

const roadLines = [];

for(let i=-10000;i<100;i+=15){


const line = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.4,
        0.05,
        6
    ),
    new THREE.MeshBasicMaterial({
        color:0xffffff
    })
);

line.position.set(
    -3.5,
    0.03,
    i
);

scene.add(line);
roadLines.push(line);


const line2 = line.clone();

line2.position.x = 3;

scene.add(line2);
roadLines.push(line2);


}


//--------------------------------------------------
// Carriles fijos
//--------------------------------------------------

const lanes = [-5,0,5];

let currentLane = 1;

let laneLock = false;

//--------------------------------------------------
// Jugador
//--------------------------------------------------

const player = new THREE.Group();

player.position.set(
    0,
    0.7,
    15
);

scene.add(player);

const loader = new THREE.GLTFLoader();

let taxiModel;
let sedanModel;
let vanModel;
let policeModel;
let suvModel;
let deliveryModel;
let mclarenModel;

let edi1Model;
let edi2Model;
let edi3Model;
let edi4Model;
let edi5Model;
let edi6Model;
let edi7Model;


loader.load(
    "models/edificios/edi-7.glb",
    function(gltf){

        edi7Model = gltf.scene;

        setTimeout(
            createBuildings,
            2000
        );

    }
);




loader.load(
    "models/taxi.glb",
    function(gltf){

        taxiModel = gltf.scene;

        console.log("TAXI CARGADO");

    }
);

loader.load(
    "models/sedan.glb",
    function(gltf){

        sedanModel = gltf.scene;

        console.log("SEDAN CARGADO");

    }
);

loader.load(
    "models/van.glb",
    function(gltf){

        vanModel = gltf.scene;

    }
);

loader.load(
    "models/police.glb",
    function(gltf){

        policeModel = gltf.scene;

    }
);

loader.load(
    "models/suv.glb",
    function(gltf){

        suvModel = gltf.scene;

    }
);

loader.load(
    "models/delivery.glb",
    function(gltf){

        delivery = gltf.scene;

    }
);

loader.load(

    "models/race.glb",

    function(gltf){

        console.log("RACE CARGADO");

        const carModel = gltf.scene;

        carModel.scale.set(
            1.5,
            1.5,
            1.5
        );

        carModel.rotation.y = 3.137

        carModel.position.x = 0;
        Math.PI;

        player.add(carModel);

        console.log("MODELO CARGADO");
 

    },

    undefined,

    function(error){

        console.error(
            "ERROR CARGANDO MODELO",
            error
        );

    }

);

loader.load(
    "models/edificios/edi-1.glb",
    function(gltf){

        edi1Model = gltf.scene;

    }
);

loader.load(
    "models/edificios/edi-2.glb",
    function(gltf){

        edi2Model = gltf.scene;

    }
);

loader.load(
    "models/edificios/edi-3.glb",
    function(gltf){

        edi3Model = gltf.scene;

    }
);

loader.load(
    "models/edificios/edi-4.glb",
    function(gltf){

        edi4Model = gltf.scene;

    }
);

loader.load(
    "models/edificios/edi-5.glb",
    function(gltf){

        edi5Model = gltf.scene;

    }
);

loader.load(
    "models/edificios/edi-6.glb",
    function(gltf){

        edi6Model = gltf.scene;

    }
);

loader.load(
    "models/edificios/edi-7.glb",
    function(gltf){

        edi7Model = gltf.scene;

    }
);


//--------------------------------------------------
// Camara
//--------------------------------------------------

camera.position.set(

0,

10,

30

);

//--------------------------------------------------
// Controles
//--------------------------------------------------

const keys = {};

window.addEventListener(
"keydown",
(e)=>{
keys[
e.key.toLowerCase()
] = true;
}
);

window.addEventListener(
"keyup",
(e)=>{
keys[
e.key.toLowerCase()
] = false;
}
);


// CONTROLES TACTILES

let touchStartX = 0;


window.addEventListener("touchstart", (e) => {

    touchStartX = e.touches[0].clientX;

});


window.addEventListener("touchend", (e) => {

    const touchEndX = e.changedTouches[0].clientX;

    const swipeDistance = touchEndX - touchStartX;


    if(Math.abs(swipeDistance) < 40){
        return;
    }

    if(laneLock){
    return;
}

laneLock = true;

setTimeout(()=>{

    laneLock = false;

},300);


    if(swipeDistance < 0){

        currentLane--;

        if(currentLane < 0){

            currentLane = 0;

        }

    }else{

        currentLane++;

        if(currentLane > 2){

            currentLane = 2;

        }

    }

});

//--------------------------------------------------
// Variables del juego
//--------------------------------------------------

const TRACK_LENGTH = 10000;

let traffic = [];

let score = 0;
let elapsedTime = 0;
let distance = 0;

let speed = 0.3;

let gameRunning = false;
let gameOver = false;

let cameraShake = false;
let shakeStart = 0;

let startTime = 0;

let difficultyStep = 0;

const todayKey =
new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

let weeklyScores =
JSON.parse(localStorage.getItem("raceToWinWeekly")) || {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
};

function calculateWeeklyTotal(){
    let total = 0;

    for(const day in weeklyScores){
        const dayScores = weeklyScores[day] || [];
        total += dayScores.reduce((a,b)=>a+b,0);
    }

    return total;
}


//--------------------------------------------------
// Patrón fijo de 300 metros
//--------------------------------------------------

const obstaclePattern = [];

let seed = 987654321;

function random(){

    seed =
    (seed * 1664525 + 1013904223)
    % 4294967296;

    return seed / 4294967296;

}

for(let z = -100; z > -10000; z -= 20){

    const lane =
    Math.floor(
        random() * 3
    );

    obstaclePattern.push({
        lane: lane,
        z: z
    });

    // 30% de obstáculos dobles
    if(random() < 0.08){

        let secondLane;

        do{

            secondLane =
            Math.floor(
                random() * 3
            );

        }while(
            secondLane === lane
        );

        obstaclePattern.push({
            lane: secondLane,
            z: z
        });

    }

}
//--------------------------------------------------
// Crear coche enemigo
//--------------------------------------------------

function createTrafficCar(
laneIndex,
zPos
){

    let car;

    const type =
    Math.abs(
        Math.floor(zPos / 20)
    ) % 6;

    if(type === 0){

        if(!taxiModel) return;

        car = taxiModel.clone();

    }
    else if(type === 1){

        if(!sedanModel) return;

        car = sedanModel.clone();

    }
    else if(type === 2){

        if(!vanModel) return;

        car = vanModel.clone();

    }
    else if(type === 3){

        if(!policeModel) return;

        car = policeModel.clone();

    }
    else if(type === 4){

        if(!suvModel) return;

        car = suvModel.clone();

    }
    else{

        if(!deliveryModel) return;

        car = deliveryModel.clone();

    }

    car.scale.set(
        1.6,
        1.6,
        1.6
    );

    car.position.set(
        lanes[laneIndex],
        0,
        zPos
    );

    car.rotation.y =
    Math.PI;

    scene.add(car);

    traffic.push(car);

}

function createBuildings(){

    const buildings = [

        edi1Model,
        edi2Model,
        edi3Model,
        edi4Model,
        edi5Model,
        edi6Model,
        edi7Model

    ];

    for(
        let z = 100;
        z > -3000;
        z -= 25
    ){

        const leftModel =
        buildings[
            Math.floor(
                Math.random() *
                buildings.length
            )
        ];

        const rightModel =
        buildings[
            Math.floor(
                Math.random() *
                buildings.length
            )
        ];

        if(leftModel){

            const building =
            leftModel.clone();

            building.scale.set(
                8,
                8,
                8
            );

            building.position.set(
                -20,
                0,
                z
            );

            const backBuildingLeft =
buildings[
Math.floor(
Math.random() *
buildings.length
)
].clone();

backBuildingLeft.scale.set(
    8,
    8,
    8
);

backBuildingLeft.position.set(
    -45,
    0,
    z
);

scene.add(
backBuildingLeft
);

cityBuildings.push(
backBuildingLeft
);

            scene.add(
                building
            );

            cityBuildings.push(building);

        }

        if(rightModel){

            const building =
            rightModel.clone();

            building.scale.set(
                8,
                8,
                8
            );

            building.position.set(
                20,
                0,
                z
            );

            scene.add(
                building
            );

            cityBuildings.push(building);

            const backBuildingRight =
buildings[
Math.floor(
Math.random() *
buildings.length
)
].clone();

backBuildingRight.scale.set(
    8,
    8,
    8
);

backBuildingRight.position.set(
    45,
    0,
    z
);

scene.add(
backBuildingRight
);

cityBuildings.push(
backBuildingRight
);
        }

    }

}

//--------------------------------------------------
// Limpiar trafico
//--------------------------------------------------

function clearTraffic(){


for(const car of traffic){

    scene.remove(car);

}

traffic = [];


}

//--------------------------------------------------
// Crear patrón completo
//--------------------------------------------------

function buildTrackPattern(){


clearTraffic();

for(const obstacle of obstaclePattern){

    createTrafficCar(
        obstacle.lane,
        obstacle.z
    );

}


}

//--------------------------------------------------
// Colisiones
//--------------------------------------------------

function checkCollision(a,b){


return (

    Math.abs(
        a.position.x -
        b.position.x
    ) < 1.5

    &&

    Math.abs(
        a.position.z -
        b.position.z
    ) < 2.5

);


}

function updateWeekUI(){
    const total = calculateWeeklyTotal();

    totalPointsEl.textContent = total;
}

//--------------------------------------------------
// Fin de partida
//--------------------------------------------------

function endGame(){


if(gameOver) return;

gameOver = true;
gameRunning = false;

music.pause();

music.currentTime = 0;

lastScoreEl.textContent =
Math.floor(score);

gameOverScoreEl.textContent =
"Score: " + Math.floor(score);


const todayKey =
new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

if(!weeklyScores[todayKey]){
    weeklyScores[todayKey] = [];
}

weeklyScores[todayKey].push(Math.floor(score));

weeklyScores[todayKey].sort((a,b)=>b-a);

weeklyScores[todayKey] =
weeklyScores[todayKey].slice(0,7);

let playerScores =
JSON.parse(localStorage.getItem("raceToWinPlayers")) || [];


let currentScore = Math.floor(score);


let existingPlayer =
playerScores.find(
    p => p.playerId === playerId
);

gameOverHighScoreEl.textContent =
"High Score: " +
(
    existingPlayer
    ? Math.max(existingPlayer.score, currentScore)
    : currentScore
);


if(existingPlayer){

    existingPlayer.name = playerName || "PLAYER";

    if(currentScore > existingPlayer.score){

        existingPlayer.score = currentScore;

    }

}else{

    playerScores.push({

        playerId: playerId,

        name: playerName || "PLAYER",

        score: currentScore

    });

}


playerScores.sort(
    (a,b)=>b.score-a.score
);


playerScores =
playerScores.slice(0,100);


localStorage.setItem(
    "raceToWinPlayers",
    JSON.stringify(playerScores)
);

localStorage.setItem(
"raceToWinWeekly",
JSON.stringify(weeklyScores)
);


totalPoints = calculateWeeklyTotal();
totalPointsEl.textContent = totalPoints;


distanceEl.textContent =
Math.floor(distance);


const endMinutes =
Math.floor(elapsedTime / 60);

const endSeconds =
Math.floor(elapsedTime % 60);

lastTimeEl.textContent =

endMinutes +
":" +
String(endSeconds)
.padStart(2,"0");

if(extraLifeUsed){

    extraLifeBtn.style.display = "none";

}else{

    extraLifeBtn.style.display = "block";

}

gameOverEl.style.display =
"flex";

gameOverTimer = setTimeout(() => {

    gameOverEl.style.display = "none";

    startScreen.style.display = "flex";

    hud.style.display = "none";

    clearTraffic();

}, 3000);



}

//--------------------------------------------------
// Iniciar juego
//--------------------------------------------------

function startGame(){

    extraLifeUsed = false;

   totalPoints = calculateWeeklyTotal();
totalPointsEl.textContent = totalPoints;

    const countdown =
    document.getElementById(
        "countdown"
    );

    startScreen.style.display =
    "none";

    countdown.style.display =
    "flex";

    countdown.textContent = "3";

    let count = 3;

    const timer = setInterval(()=>{

        count--;

        if(count > 0){

            countdown.textContent =
            count;

        }else if(count === 0){

            countdown.textContent =
            "GO!";

        }else{

            clearInterval(timer);

            countdown.style.display =
            "none";

            difficultyStep = 0;

            clearTraffic();

            buildTrackPattern();

            currentLane = 1;

            player.position.set(
                lanes[currentLane],
                0.7,
                15
            );

            score = 0;

            elapsedTime = 0;

            distance = 0;

            speed = 0.20;

            startTime =
            Date.now();

            gameOver = false;

            gameRunning = true;

            gameOverEl.style.display =
            "none";

            hud.style.display =
            "block";
        }

    },1000);

}

const scoresBtn =
document.getElementById(
"scoresBtn"
);

const scoresPanel =
document.getElementById(
"scoresPanel"
);

const scoresList =
document.getElementById(
"scoresList"
);

const totalScoreEl =
document.getElementById(
"totalScore"
);

const closeScores =
document.getElementById(
"closeScores"
);

const weeklyTab =
document.getElementById("weeklyTab");

const worldTab =
document.getElementById("worldTab");

function showWeeklyScores(){

    weeklyTab.classList.add("active");
worldTab.classList.remove("active");

    scoresPanel.style.display = "flex";

    let html = "";
    let total = 0;

    const daysOrder = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ];

    for(const day of daysOrder){

        const scores = weeklyScores[day] || [];

        let dayTotal = scores.reduce((a,b)=>a+b,0);

        total += dayTotal;

        html += `<h3 style="margin-top:15px; color:#00d4ff;">
        ${day.toUpperCase()} - ${dayTotal}
        </h3>`;

        if(scores.length === 0){

            html += `<p style="color:#777;">No scores</p>`;

        }else{

            for(let i=0;i<scores.length;i++){

                html += `
                <p>
                #${i+1} - ${scores[i]}
                </p>
                `;

            }

        }

    }

    scoresList.innerHTML = html;
    totalScoreEl.textContent = total;

}


scoresBtn.addEventListener("click", () => {

    showWeeklyScores();

});

worldTab.addEventListener("click", () => {

    worldTab.classList.add("active");
weeklyTab.classList.remove("active");

    let playerScores =
    JSON.parse(localStorage.getItem("raceToWinPlayers")) || [];

    let html = "";

    if(playerScores.length === 0){

        html = "<p style='color:#777;'>No players yet</p>";

    }else{

        for(let i = 0; i < playerScores.length; i++){

            html += `
            <p>
            #${i + 1} - ${playerScores[i].name} - ${playerScores[i].score}
            </p>
            `;

        }

    }

    scoresList.innerHTML = html;

    totalScoreEl.textContent = playerScores.length + " Players";

});

weeklyTab.addEventListener("click", () => {

    showWeeklyScores();

});

closeScores.addEventListener(
"click",
()=>{

    scoresPanel.style.display =
    "none";

}
);
startBtn.addEventListener("click", () => {

    if(music.paused){

        music.play().catch(()=>{});

    }

    console.log("BOTON FUNCIONA");

    startGame();

});


playAgainBtn.addEventListener("click", () => {

    clearTimeout(gameOverTimer);

    gameOverEl.style.display = "none";

    music.play().catch(()=>{});

    startGame();

});

extraLifeBtn.addEventListener("click", () => {

    if(extraLifeUsed) return;

    clearTimeout(gameOverTimer);

    extraLifeUsed = true;

    gameOverEl.style.display = "none";

    invulnerableUntil = Date.now() + 5000;

    gameOver = false;
    gameRunning = true;

    music.play().catch(()=>{});

});

//--------------------------------------------------
// Loop principal
//--------------------------------------------------

function animate(){




requestAnimationFrame(
    animate
);

if(gameRunning){

    if(cameraShake){

    camera.position.x =
    (Math.random() - 0.5) * 0.4;

    camera.position.y =
    10 + (Math.random() - 0.5) * 0.2;

    camera.lookAt(
        player.position.x,
        player.position.y,
        player.position.z - 25
    );

    if(Date.now() - shakeStart >= 1000){

        cameraShake = false;

        camera.position.set(
            0,
            10,
            30
        );

        endGame();
    }

    renderer.render(scene, camera);

    return;

}

    for(const building of cityBuildings){

    building.position.z += speed * 2.5;

    if(building.position.z > 50){

        building.position.z -= 3000;

    }

}

    //--------------------------------------------------
    // Tiempo
    //--------------------------------------------------

    elapsedTime =
    (
        Date.now()
        -
        startTime
    ) / 1000;

  if(

    difficultyStep < 10 &&

    elapsedTime >= (difficultyStep + 1) * 20

){

    speed *= 1.10;

    difficultyStep++;

    console.log(
        "Nivel:",
        difficultyStep,
        "Velocidad:",
        speed
    );

}

    //--------------------------------------------------
    // Movimiento por carriles
    //--------------------------------------------------

    if(!laneLock){

        if(
            keys["a"] ||
            keys["arrowleft"]
        ){

            currentLane--;

            if(
                currentLane < 0
            ){
                currentLane = 0;
            }

            laneLock = true;
        }

        if(
            keys["d"] ||
            keys["arrowright"]
        ){

            currentLane++;

            if(
                currentLane > 2
            ){
                currentLane = 2;
            }

            laneLock = true;
        }
    }

    if(

        !keys["a"] &&
        !keys["d"] &&

        !keys["arrowleft"] &&
        !keys["arrowright"]

    ){
        laneLock = false;
    }

    player.position.x +=

    (
        lanes[currentLane]
        -
        player.position.x
    )

    * 0.35;

    //--------------------------------------------------
    // Tráfico fijo
    //--------------------------------------------------

    for(

        let i = 0;

        i < traffic.length;

        i++

    ){

        const car =
        traffic[i];

        car.position.z +=
        speed * 2.5;

        //--------------------------------------------------
// Colisión
//--------------------------------------------------

if(

    Date.now() >= invulnerableUntil &&

    checkCollision(
        player,
        car
    )

){

    cameraShake = true;
    shakeStart = Date.now();

}

        //--------------------------------------------------
        // Repetir exactamente
        // el mismo tramo de 300m
        //--------------------------------------------------

        if(
            car.position.z > 40
        ){

            car.position.z -=
            TRACK_LENGTH;

        }
    }

    //--------------------------------------------------
    // Líneas carretera
    //--------------------------------------------------

    for(

        let i=0;

        i<roadLines.length;

        i++

    ){

        const line =
        roadLines[i];

        line.position.z +=
        speed * 2.5;

        if(
            line.position.z > 40
        ){

            line.position.z -=
            TRACK_LENGTH;

        }
    }

    //--------------------------------------------------
    // Score
    //--------------------------------------------------

    score += 0.15;

    distance += speed;

    scoreEl.textContent =

    Math.floor(
        score
    );

    if(distance < 1000){

    distanceEl.textContent =
    Math.floor(distance) + " m";

}else{

    distanceEl.textContent =
    (distance / 1000).toFixed(1) + " km";

}

   const minutes =
Math.floor(elapsedTime / 60);

const seconds =
Math.floor(elapsedTime % 60);

timeEl.textContent =

minutes +
":" +
String(seconds)
.padStart(2,"0");

    //--------------------------------------------------
    // Cámara
    //--------------------------------------------------

    camera.position.x +=

    (
        player.position.x
        -
        camera.position.x
    )

    * 0.08;

    camera.lookAt(

        player.position.x,

        player.position.y,

        player.position.z
        -
        25

    );
}

renderer.render(
    scene,
    camera
);


}

animate();

//--------------------------------------------------
// Resize
//--------------------------------------------------

window.addEventListener(


"resize",

()=>{

    camera.aspect =

    window.innerWidth
    /
    window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );
}


);
