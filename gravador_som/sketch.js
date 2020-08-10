let mic, recorder, soundFile;

let state = -2; // mousePress will increment from Record, to Stop, to Play
let timer = 0;
let tempoGravacao = 3; // Quantos segundos para gravar

function setup() {
  createCanvas(400, 400);
  drawMics("Clique para iniciar a contagem regressiva", 255, 248, 248);

  // create an audio in
  mic = new p5.AudioIn();

  // users must manually enable their browser microphone for recording to work properly!
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);

  // create an empty sound file that we will use to playback the recording
  soundFile = new p5.SoundFile();
}

function drawMics(texto, b1, b2, b3) {
  background(b1, b2, b3); // Limpa tela
  fill(0);
  textSize(15);
  textAlign(LEFT, CENTER);
  text(texto, 20, 20);
}

function drawCountdown(tempo) {
  textAlign(CENTER, CENTER); // Alinha texto
  textSize(100); // Fonte grande
  text(tempo, width/2, height/2); // Posiciona texto
}

function mousePressed() {
  state = -1; // Volta tudo no começo
  timer = 5;
}
function evaluateMicState() {
  // use the '.enabled' boolean to make sure user enabled the mic (otherwise we'd record silence)
  if (state === 0 && mic.enabled) {
    // Tell recorder to record to a p5.SoundFile which we will use for playback
    recorder.record(soundFile);

    drawMics('Recording now! Click to stop.', 255, 0, 0);
  } else if (state === 1) {
    recorder.stop(); // stop recorder, and send the result to soundFile

    drawMics('Terminou de gravar. Em breve, playback e download', 0, 255, 0);
  } else if (state === 2) {
    drawMics('Para repetir, clique na tela', 255, 255, 255);
    soundFile.play(); // play the result!
    saveSound(soundFile, 'Teste.wav'); // save file
    state = -2; // Uma vez apenas
  }
}

function draw() {
  if(state == -1){
    drawMics("Espere a contagem", 255, 255, 255);
  }
  drawCountdown(timer);
  
  if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer --;
  }
  if ((timer == 0) && (state == -1)) {
    timer = tempoGravacao;
    state++;
  }
  if ((timer == 0) && (state == 0)) {
    timer = 2;
    state++;
  }
  if ((timer == 0) && (state == 1)) {
    state++;
  }
  evaluateMicState()
}
