// Variables globales
let AMP_MIN = 0.002;
let AMP_MAX = 0.035;

let FREC_MIN = 150;
let FREC_MAX = 350;
let debug = true;

let estado = ""; // variable para estado "Vibrar"

let cargaTrazos = [];

let cTrazosDer = [];
let cTrazosIzq = [];
let cTrazosCent = [];

let trazos = [];
let trazosDer = [];
let trazosIzq = [];
let trazosCent = [];

// cantidad de trazos para el fondo
let canT = 4;

// limitar el tamaño de la obra
let margenAncho, margenAlto;

// precargar la paleta
let paleta;

let pg;

// variables del sonido
let mic;
let amp_cruda;
let amp;
let frec_cruda;
let frec;
let pitch;
let audioContext;
let gestorAmp;
let gestorFrec;
const pichModel = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

function preload(){
  paleta = new Paleta('data/paleta0.jpg');
  precargarTrazos();
}

function setup() {
  let alto = windowHeight * 0.9;
  let ancho = alto * 1.1;
  createCanvas(ancho, alto).mousePressed(userStartAudio);
  pg = createGraphics(width, height);
  pg.clear();
  fondo();

  background(255);
  imageMode(CENTER);
  colorMode(RGB);

  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
  userStartAudio();

  gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX);
  gestorFrec = new GestorSenial(FREC_MIN, FREC_MAX);

  dibujarTrazos();
}

function draw() {
  background(255);

  amp_cruda = mic.getLevel();
  gestorAmp.actualizar(amp_cruda);
  amp = gestorAmp.filtrada;

  frec = gestorFrec.filtrada;

  renderizado();
  interacciónActiva();
}

function fondo() {
  pg.clear();
  for (let i = 0; i < canT; i++) {
    let x = random(50, width - 50);
    let y = random(50, height - 50);
    pg.tint(paleta.darUnColor());
    pg.image(cargaTrazos[i % cargaTrazos.length], x, y);
  }
}

function interacciónActiva() {
  let haySonido = amp > 0.02;

  if (haySonido && frec_cruda != null) {
    if (frec_cruda >= 200 && frec_cruda <= 300) {
      for (let i = 0; i < trazosIzq.length; i++) {
        trazosIzq[i].moverIzquierda();
      }
    }
    if (frec_cruda > 300) {
      for (let i = 0; i < trazosDer.length; i++) {
        trazosDer[i].moverDerecha();
      }
    }
    for (let i = 0; i < trazosCent.length; i++) {
      trazosCent[i].rotar(0.02);
    }

    if (frec_cruda >= 55 && frec_cruda <= 60) {
      if (estado !== "Vibrar") {
        estado = "Vibrar";
        console.log(">> CAMBIO A ESTADO: Vibrar");
      }
      for (let t of trazos) {
        t.actualizarVibracion(true);
      }
    } else {
      if (estado === "Vibrar") {
        estado = "";
        for (let t of trazos) {
          t.actualizarVibracion(false);
        }
      }
    }
  } else {
    if (estado === "Vibrar") {
      estado = "";
      for (let t of trazos) {
        t.actualizarVibracion(false);
      }
    }
  }
}

function renderizado(){
  image(pg, width / 2, height / 2);

  for (let f = 0; f < trazos.length; f++) {
    trazos[f].dibujar();
  }

  for (let d = 0; d < trazosDer.length; d++) {
    trazosDer[d].dibujar();
  }

  for (let i = 0; i < trazosIzq.length; i++) {
    trazosIzq[i].dibujar();
  }

  for (let c = 0; c < trazosCent.length; c++) {
    trazosCent[c].dibujar();
  }
}

function dibujarTrazos(){
  for(let i = 0; i < canT; i++){
    let x = random(150, width - 150);
    let y = random(0, height);
    trazos[i] = new Trazo(x, y); 
  }

  for(let i = 0; i < 16; i++){
    let x = random(150, width - 150);
    let y = random(0, height);
    trazosDer[i] = new TrazosDer(x, y, cTrazosDer[i]);
  }
  for(let i = 0; i < 15; i++){
    let x = random(150, width - 150);
    let y = random(0, height);
    trazosIzq[i] = new TrazosIzq(x, y, cTrazosIzq[i]);
  }
  for(let i = 0; i < 23; i++){
    let x = random(150, width - 150);
    let y = random(0, height);
    trazosCent[i] = new TrazosCent(x, y, cTrazosCent[i], null);
  }
}

function precargarTrazos(){
  for(let i = 0; i < canT; i++){
    cargaTrazos[i] = loadImage('data/trazos/fondo/trazo'+ i +'.png');
  }

  for(let i = 0; i < 16; i++){
    cTrazosDer[i] = loadImage('data/trazos/der/trazo'+ i +'.png');
  }

  for(let i = 0; i < 15; i++){
    cTrazosIzq[i] = loadImage('data/trazos/izq/trazo'+ i +'.png');
  }

  for(let i = 0; i < 23; i++){
    cTrazosCent[i] = loadImage('data/trazos/cent/trazo'+ i +'.png');
  }
}

function startPitch() {
  pitch = ml5.pitchDetection(pichModel, audioContext , mic.stream, modelLoaded);
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      frec_cruda = frequency;
      gestorFrec.actualizar(frec_cruda);
    }
    getPitch();
  });
}
