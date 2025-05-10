// ------------------------------------------------------------------------------------
// Adjustable Global Variables / 可调节的全局变量
// ------------------------------------------------------------------------------------

let minSpeed = 5;                         // 绘制时影响文字间距的最小速度阈值
let maxSpeed = 20;                        // 绘制时影响文字间距的最大速度阈值
let minSpacingAlongPath = 8;              // 路径上文字的最小间距
let maxSpacingAlongPath = 40;             // 路径上文字的最大间距
let textFontSize = 12;                    // 文本字体大小
let strokeLineWeight = 1.2;               // 绘制线条的粗细
let lineAlpha = 200;                      // 绘制线条的透明度
let textAlpha = 255;                      // 文本的透明度
let lineStrokeColor = 0;                  // 绘制线条的颜色 (0为黑色)
let pauseLengthOnPath = 85;               // 诗句之间停顿在路径上对应的“距离”
const fallingTextSpawnChance = 0.25;      // “混成”模式下，文字颗粒生成几率 (0-1)
const fallingTextMaxCount = 50;           // “混成”模式下，屏幕上文字颗粒的最大数量
const fallingTextInitialLifespan = 120;   // “混成”模式下，文字颗粒的初始生命周期 (帧)
const fallingTextGravity = 0.07;          // “混成”模式下，文字颗粒的重力加速度
let soundSpeedCapForCharSound = 22;       // 字符放置音效，速度映射到音高的上限值
let textOffsetAboveLine;                  // 文字中心相对绘制线条的垂直偏移量
let minScreenSpacing;                     // 文字之间的最小屏幕显示间距，防止重叠
let fallingTextFontSize;                  // “混成”模式下，飘落文字的字体大小

// ------------------------------------------------------------------------------------
// Constants / 固定常量
// ------------------------------------------------------------------------------------

const poemLinesNormal = [
  "雨ニモマケズ", "風ニモマケズ", "雪ニモ夏ノ暑サニモマケヌ",
  "丈夫ナカラダヲモチ", "慾ハナク", "決シテ瞋ラズ", "イツモシヅカニワラッテヰル",
  "一日ニ玄米四合ト", "味噌ト少シノ野菜ヲタベ", "アラユルコトヲ",
  "ジブンヲカンジョウニ入レズニ", "ヨクミキキシワカリ", "ソシテワスレズ",
  "野原ノ松ノ林ノカゲノ", "小サナ萓ブキノ小屋ニヰテ",
  "東ニ病気ノコドモアレバ", "行ッテ看病シテヤリ",
  "西ニツカレタ母アレバ", "行ッテソノ稲ノ朿ヲ負ヒ",
  "南ニ死ニサウナ人アレバ", "行ッテコハガラナクテモイヽトイヒ",
  "北ニケンクヮヤソショウガアレバ", "ツマラナイカラヤメロトイヒ",
  "ヒドリノトキハナミダヲナガシ",
  "サムサノナツハオロオロアルキ", "ミンナニデクノボートヨバレ",
  "ホメラレモセズ", "クニモサレズ", "サウイフモノニ",
  "ワタシハナリタイ",
  "南無無辺行菩薩", "南無上行菩薩", "南無多宝如来",
  "南無妙法蓮華経", "南無釈迦牟尼仏", "南無浄行菩萨", "南無安立行菩薩"
];
const poemLinesShuffled = [
  "慾ハナク", "決シテ瞋ラズ", "イツモシヅカニワラッテヰル",
  "一日ニ玄米四合ト", "味噌ト少シノ野菜ヲタベ", "アラユルコトヲ",
  "ジブンヲカンジョウニ入レズニ", "ヨクミキキシワカリ", "ソシテワスレズ",
  "雨ニモマケズ", "風ニモマケズ", "雪ニモ夏ノ暑サニモマケヌ",
  "丈夫ナカラダヲモチ",
  "野原ノ松ノ林ノカゲノ", "小サナ萓ブキノ小屋ニヰテ",
  "南ニ死ニサウナ人アレバ", "行ッテコハガラナクテモイヽトイヒ",
  "東ニ病気ノコドモアレバ", "行ッテ看病シテヤリ",
  "北ニケンクヮヤソショウガアレバ", "ツマラナイカラヤメロトイヒ",
  "西ニツカレタ母アレバ", "行ッテソノ稲ノ朿ヲ負ヒ",
  "ヒドリノトキハナミダヲナガシ", "サムサノナツハオロオロアルキ",
  "ミンナニデクノボートヨバレ", "ホメラレモセズ", "クニモサレズ",
  "サウイフモノニ", "ワタシハナリタイ",
  "南無妙法蓮華経", "南無釈迦牟尼仏", "南無多宝如来",
  "南無無辺行菩薩", "南無上行菩萨", "南無浄行菩萨", "南無安立行菩薩"
];

const PAUSE_MARKER = { isPause: true, length: pauseLengthOnPath };

const PEN_DOWN_BASE_FREQ = 329.63;
const PEN_DOWN_PITCH_RANDOM_RANGE = 5;
const PEN_DOWN_VOL_BASE = 0.25;
const PEN_DOWN_VOL_RANDOM_RANGE = 0.03;
const PEN_UP_BASE_FREQ = 220.00;
const PEN_UP_PITCH_RANDOM_RANGE = 4;
const PEN_UP_VOL_BASE = 0.20;
const PEN_UP_VOL_RANDOM_RANGE = 0.02;
const CHAR_PLACE_BASE_FREQ = 659.25;
const CHAR_PLACE_PITCH_RANDOM_RANGE = 5;
const CHAR_PLACE_PITCH_MULTIPLIER_MIN = 0.95;
const CHAR_PLACE_PITCH_MULTIPLIER_MAX = 1.15;
const CHAR_PLACE_VOL_MIN = 0.08;
const CHAR_PLACE_VOL_MAX = 0.15;
const CHAR_PLACE_HIGH_PITCH_VOL_REDUCTION_THRESHOLD_VERY_HIGH = 1.12;
const CHAR_PLACE_HIGH_PITCH_VOL_REDUCTION_FACTOR_VERY_HIGH = 0.6;
const CHAR_PLACE_HIGH_PITCH_VOL_REDUCTION_THRESHOLD_MODERATE = 1.06;
const CHAR_PLACE_HIGH_PITCH_VOL_REDUCTION_FACTOR_MODERATE = 0.8;

// ------------------------------------------------------------------------------------
// State Variables / 状态变量
// ------------------------------------------------------------------------------------

let poemData = [];
let isShuffledMode = false;
let allPaths = [];
let allDrawnTexts = [];
let currentPath = [];
let currentDrawnText = [];
let lastPlacedTextPos = null;
let currentPoemIndex = 0;
let isDrawing = false;
let distSinceLastChar = 0;
let lastMousePos = { x: 0, y: 0 };

let activeFallingTextParticles = [];
let poemCharsNormalForFalling = [];
let fallingCharIndex = 0;

let penDownSoundOsc, penUpSoundOsc, charPlaceSoundOsc;
let penDownSoundEnv, penUpSoundEnv, charPlaceSoundEnv;
let masterReverbEffect;
let originalPenDownADSR, originalPenUpADSR;

// ------------------------------------------------------------------------------------
// DOM Element Variables / DOM元素变量
// ------------------------------------------------------------------------------------

let initialMessageContainer;
let msgLine1Elem, msgLine2Elem, msgLine3Elem;

// ------------------------------------------------------------------------------------
// p5.js Lifecycle Functions / p5.js生命周期函数
// ------------------------------------------------------------------------------------

function preload() { }

function setup() {
  createCanvas(windowWidth, windowHeight);
  updateDependentVariables();
  textAlign(CENTER, CENTER);
  textFont('sans-serif');

  initialMessageContainer = document.getElementById('initial-message-container');
  msgLine1Elem = document.getElementById('message-line1');
  msgLine2Elem = document.getElementById('message-line2');
  msgLine3Elem = document.getElementById('message-line3');

  prepareFallingTextSource();
  loadPoemData(isShuffledMode ? poemLinesShuffled : poemLinesNormal);
  initializeSoundEngine();
  setupButtonListeners();

  lastPlacedTextPos = null;
  activeFallingTextParticles = [];
}

function draw() {
  if (allPaths.length === 0 && !isDrawing && currentPath.length === 0) {
    background(250);
    displayInitialMessage();
    updateCursorAndParticlesVisibility();
  } else {
    if (initialMessageContainer && initialMessageContainer.classList.contains('visible')) {
      initialMessageContainer.classList.remove('visible');
    }
    background(250);

    for (let i = 0; i < allPaths.length; i++) {
      drawPath(allPaths[i], lineStrokeColor, lineAlpha, strokeLineWeight);
      drawTextAlongPath(allDrawnTexts[i]);
    }

    if (isDrawing) {
      handleDrawingInput();
      if (currentPath.length > 0) drawPath(currentPath, lineStrokeColor, lineAlpha, strokeLineWeight);
      if (currentDrawnText.length > 0) drawTextAlongPath(currentDrawnText);
    }
    updateCursorAndParticlesVisibility();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ------------------------------------------------------------------------------------
// Event Handlers / 事件处理函数
// ------------------------------------------------------------------------------------

function mousePressed(event) {
  // --- MODIFICATION START ---
  // Attempt to start/resume the audio context on any mouse press if it's not already running.
  // This is crucial for mobile browsers (especially iOS) which require a user gesture to enable audio.
  // Call this at the beginning of the function to ensure it runs even if the click is on a UI button.
  if (typeof getAudioContext === 'function' && getAudioContext().state !== 'running') {
    userStartAudio();
  }
  // --- MODIFICATION END ---

  // Check if the click was on a UI button.
  // If so, we've already attempted to start audio (above), so just return to avoid drawing.
  if (event && event.target) {
    const clickedElement = event.target;
    const clickedElementId = clickedElement.id;
    const parentOfClickedElement = clickedElement.parentElement;
    const parentOfClickedElementId = parentOfClickedElement ? parentOfClickedElement.id : null;
    const buttonIds = ['toggleModeTextBtnBackground', 'clearCanvasTextBtnBackground', 'saveCanvasBtnBackground'];
    
    if (buttonIds.includes(clickedElementId) || (parentOfClickedElementId && buttonIds.includes(parentOfClickedElementId))) {
      return; // Interaction was with a UI button, so don't proceed with drawing logic.
    }
  }

  // If the click was not on a UI button (i.e., it's on the canvas), proceed with drawing logic.
  playPenDownSound();

  isDrawing = true;
  currentPath = [{ x: mouseX, y: mouseY }];
  currentDrawnText = [];
  lastMousePos = { x: mouseX, y: mouseY };
  distSinceLastChar = 0;
  lastPlacedTextPos = null;

  advancePoemIndexPastPauses();
}

function mouseReleased() {
  if (isDrawing) {
    isDrawing = false;
    playPenUpSound();
    if (currentPath.length > 1) {
      allPaths.push([...currentPath]);
      allDrawnTexts.push([...currentDrawnText]);
    }
  }
}

function keyPressed() {
  if (keyCode === SHIFT) {
    toggleMode();
  }
}

function keyTyped() {
  if (key === 'c' || key === 'C') {
    clearDrawingAndShowMessage();
  }
  if (key === 's' || key === 'S') {
    saveArtwork();
  }
}

// ------------------------------------------------------------------------------------
// Initialization and Configuration / 初始化与配置
// ------------------------------------------------------------------------------------
function updateDependentVariables() {
  textOffsetAboveLine = textFontSize * 0.8;
  minScreenSpacing = textFontSize * 0.7;
  fallingTextFontSize = textFontSize + 2;
  PAUSE_MARKER.length = pauseLengthOnPath;
  if (typeof textSize === 'function') textSize(textFontSize);
}


function setupButtonListeners() {
  const toggleBtnText = document.getElementById('toggleModeTextBtnBackground');
  const clearBtnText = document.getElementById('clearCanvasTextBtnBackground');
  const saveBtnText = document.getElementById('saveCanvasBtnBackground');

  if (toggleBtnText) {
    toggleBtnText.addEventListener('click', (event) => {
      toggleMode();
      event.stopPropagation();
    });
  }
  if (clearBtnText) {
    clearBtnText.addEventListener('click', (event) => {
      clearDrawingAndShowMessage();
      event.stopPropagation();
    });
  }
  if (saveBtnText) {
    saveBtnText.addEventListener('click', (event) => {
      saveArtwork();
      event.stopPropagation();
    });
  }
}

// ------------------------------------------------------------------------------------
// Poem Data Management / 诗歌数据管理
// ------------------------------------------------------------------------------------

function loadPoemData(sourceLines) {
  poemData = [];
  for (let lineIndex = 0; lineIndex < sourceLines.length; lineIndex++) {
    const currentLineText = sourceLines[lineIndex];
    for (let i = 0; i < currentLineText.length; i++) {
      poemData.push({ char: currentLineText[i] });
    }
    if (lineIndex < sourceLines.length - 1) {
      poemData.push(PAUSE_MARKER);
    }
  }
  if (poemData.length > 0 && (!poemData[poemData.length - 1].isPause)) {
    poemData.push(PAUSE_MARKER);
  }
  currentPoemIndex = 0;
}

function prepareFallingTextSource() {
  poemCharsNormalForFalling = [];
  for (let line of poemLinesNormal) {
    for (let char of line) {
      poemCharsNormalForFalling.push(char);
    }
  }
}

function advancePoemIndexPastPauses() {
  if (poemData.length > 0) {
    while (currentPoemIndex < poemData.length && poemData[currentPoemIndex].isPause) {
      currentPoemIndex++;
      if (currentPoemIndex >= poemData.length) {
        currentPoemIndex = 0;
        if (poemData.every(item => item.isPause)) break;
      }
    }
  }
}

// ------------------------------------------------------------------------------------
// Drawing Logic / 绘制逻辑
// ------------------------------------------------------------------------------------

function handleDrawingInput() {
  let currentMousePos = { x: mouseX, y: mouseY };
  if (dist(currentMousePos.x, currentMousePos.y, lastMousePos.x, lastMousePos.y) > 0.1) {
    currentPath.push(currentMousePos);
    if (currentPath.length > 1) {
      let prevP = currentPath[currentPath.length - 2];
      let currP = currentPath[currentPath.length - 1];
      let distanceMoved = dist(currP.x, currP.y, prevP.x, prevP.y);
      distSinceLastChar += distanceMoved;
      let speed = distanceMoved;

      placeTextItemsAlongPath(currP, prevP, speed);
    }
    lastMousePos = currentMousePos;
  }
}

function placeTextItemsAlongPath(currP, prevP, speed) {
  let charSpacingThreshold = map(speed, minSpeed, maxSpeed, minSpacingAlongPath, maxSpacingAlongPath);
  charSpacingThreshold = constrain(charSpacingThreshold, minSpacingAlongPath, maxSpacingAlongPath);

  while (currentPoemIndex < poemData.length && distSinceLastChar > 0) {
    let data = poemData[currentPoemIndex];
    let itemCost = data.isPause ? data.length : charSpacingThreshold;
    if (itemCost <= 0) itemCost = minSpacingAlongPath;

    if (distSinceLastChar >= itemCost) {
      let poemIndexShouldAdvance = false;

      if (data.isPause) {
        distSinceLastChar -= itemCost;
        poemIndexShouldAdvance = true;
      } else {
        let charToPlace = data.char;
        let dx = currP.x - prevP.x;
        let dy = currP.y - prevP.y;
        let angle = atan2(dy, dx);
        let initialNormalAngle = angle - HALF_PI;

        let offsetX = cos(initialNormalAngle) * textOffsetAboveLine;
        let offsetY = sin(initialNormalAngle) * textOffsetAboveLine;

        if (offsetY > 0) {
          offsetX = -offsetX;
          offsetY = -offsetY;
        }

        let nextTextX = currP.x + offsetX;
        let nextTextY = currP.y + offsetY;

        let screenDistanceOK = true;
        if (lastPlacedTextPos !== null) {
          if (dist(nextTextX, nextTextY, lastPlacedTextPos.x, lastPlacedTextPos.y) < minScreenSpacing) {
            screenDistanceOK = false;
          }
        }

        if (screenDistanceOK) {
          let finalRenderY = nextTextY;
          if (nextTextY + (textFontSize / 2) > currP.y) {
            finalRenderY = currP.y - (textFontSize / 2);
          }

          currentDrawnText.push({ char: charToPlace, x: nextTextX, y: finalRenderY, angle: 0 });
          lastPlacedTextPos = { x: nextTextX, y: finalRenderY };

          distSinceLastChar -= itemCost;
          playCharPlacementSound(speed);
          poemIndexShouldAdvance = true;
        } else {
          distSinceLastChar -= itemCost;
          if (distSinceLastChar < 0) distSinceLastChar = 0;
          break;
        }
      }

      if (poemIndexShouldAdvance) {
        currentPoemIndex++;
        if (currentPoemIndex >= poemData.length) currentPoemIndex = 0;
      }
      if (distSinceLastChar < 0) distSinceLastChar = 0;

    } else {
      break;
    }
  }
}


function drawPath(path, strokeCol, alphaVal, weight, renderer = this) {
  renderer.stroke(strokeCol, alphaVal);
  renderer.strokeWeight(weight);
  renderer.noFill();
  renderer.beginShape();
  for (let pt of path) renderer.vertex(pt.x, pt.y);
  renderer.endShape();
}

function drawTextAlongPath(texts, renderer = this) {
  renderer.textSize(textFontSize);
  for (let txt of texts) {
    renderer.push();
    renderer.translate(txt.x, txt.y);
    renderer.fill(0, 0, 0, textAlpha);
    renderer.noStroke();
    renderer.text(txt.char, 0, 0);
    renderer.pop();
  }
}

// ------------------------------------------------------------------------------------
// Falling Text Particle System / 飘落文字颗粒系统
// ------------------------------------------------------------------------------------

function updateAndDrawFallingTextParticles() {
  if (poemCharsNormalForFalling.length > 0 && activeFallingTextParticles.length < fallingTextMaxCount && random(1) < fallingTextSpawnChance) {
    let charToFall = poemCharsNormalForFalling[fallingCharIndex];
    fallingCharIndex = (fallingCharIndex + 1) % poemCharsNormalForFalling.length;
    let newParticle = {
      x: mouseX + random(-15, 15), y: mouseY + random(-15, 15),
      vx: random(-0.3, 0.3), vy: random(-0.8, 0.2),
      char: charToFall, rotation: random(-0.1, 0.1),
      rotationSpeed: random(-0.005, 0.005), lifespan: fallingTextInitialLifespan,
      initialLifespan: fallingTextInitialLifespan, opacity: 255, fontSize: fallingTextFontSize,
    };
    activeFallingTextParticles.push(newParticle);
  }

  for (let i = activeFallingTextParticles.length - 1; i >= 0; i--) {
    let p = activeFallingTextParticles[i];
    p.vy += fallingTextGravity; p.x += p.vx; p.y += p.vy;
    p.rotation += p.rotationSpeed; p.lifespan--;
    p.opacity = map(p.lifespan, 0, p.initialLifespan, 0, 255);

    if (p.lifespan <= 0 || p.y > height + p.fontSize * 2) {
      activeFallingTextParticles.splice(i, 1); continue;
    }
    push();
    translate(p.x, p.y); rotate(p.rotation);
    fill(0, 0, 0, p.opacity); noStroke(); textSize(p.fontSize);
    text(p.char, 0, 0);
    pop();
  }
}

// ------------------------------------------------------------------------------------
// Sound Engine / 音效引擎
// ------------------------------------------------------------------------------------

function initializeSoundEngine() {
  masterReverbEffect = new p5.Reverb();

  penDownSoundOsc = new p5.Oscillator('sine');
  penDownSoundOsc.freq(PEN_DOWN_BASE_FREQ);
  penDownSoundEnv = new p5.Envelope();
  originalPenDownADSR = { a: 0.01, d: 0.1, s: 0.1, r: 0.2 };
  penDownSoundEnv.setADSR(originalPenDownADSR.a, originalPenDownADSR.d, originalPenDownADSR.s, originalPenDownADSR.r);
  penDownSoundEnv.setRange(PEN_DOWN_VOL_BASE, 0);
  penDownSoundOsc.amp(penDownSoundEnv);
  penDownSoundOsc.start();
  penDownSoundOsc.connect(masterReverbEffect);

  penUpSoundOsc = new p5.Oscillator('sine');
  penUpSoundOsc.freq(PEN_UP_BASE_FREQ);
  penUpSoundEnv = new p5.Envelope();
  originalPenUpADSR = { a: 0.01, d: 0.15, s: 0.05, r: 0.25 };
  penUpSoundEnv.setADSR(originalPenUpADSR.a, originalPenUpADSR.d, originalPenUpADSR.s, originalPenUpADSR.r);
  penUpSoundEnv.setRange(PEN_UP_VOL_BASE, 0);
  penUpSoundOsc.amp(penUpSoundEnv);
  penUpSoundOsc.start();
  penUpSoundOsc.connect(masterReverbEffect);

  charPlaceSoundOsc = new p5.Oscillator('sine');
  charPlaceSoundEnv = new p5.Envelope();
  charPlaceSoundEnv.setADSR(0.002, 0.05, 0, 0.06);
  charPlaceSoundEnv.setRange(0.12, 0);
  charPlaceSoundOsc.amp(charPlaceSoundEnv);
  charPlaceSoundOsc.start();
  charPlaceSoundOsc.connect(masterReverbEffect);

  masterReverbEffect.set(0.3, 0.2);
  masterReverbEffect.amp(0.08);
}

function playPenDownSound() {
  if (penDownSoundEnv && typeof getAudioContext === 'function' && getAudioContext().state === 'running') {
    penDownSoundOsc.freq(PEN_DOWN_BASE_FREQ + random(-PEN_DOWN_PITCH_RANDOM_RANGE, PEN_DOWN_PITCH_RANDOM_RANGE));
    penDownSoundEnv.setADSR(
      max(0.001, originalPenDownADSR.a + random(-0.005, 0.005)),
      max(0.01, originalPenDownADSR.d + random(-0.02, 0.02)),
      originalPenDownADSR.s,
      max(0.01, originalPenDownADSR.r + random(-0.05, 0.05))
    );
    penDownSoundEnv.setRange(PEN_DOWN_VOL_BASE + random(-PEN_DOWN_VOL_RANDOM_RANGE, PEN_DOWN_VOL_RANDOM_RANGE), 0);
    penDownSoundEnv.play();
  }
}

function playPenUpSound() {
  if (penUpSoundEnv && typeof getAudioContext === 'function' && getAudioContext().state === 'running') {
    penUpSoundOsc.freq(PEN_UP_BASE_FREQ + random(-PEN_UP_PITCH_RANDOM_RANGE, PEN_UP_PITCH_RANDOM_RANGE));
    penUpSoundEnv.setADSR(
      max(0.001, originalPenUpADSR.a + random(-0.005, 0.005)),
      max(0.01, originalPenUpADSR.d + random(-0.03, 0.03)),
      originalPenUpADSR.s,
      max(0.01, originalPenUpADSR.r + random(-0.05, 0.05))
    );
    penUpSoundEnv.setRange(PEN_UP_VOL_BASE + random(-PEN_UP_VOL_RANDOM_RANGE, PEN_UP_VOL_RANDOM_RANGE), 0);
    penUpSoundEnv.play();
  }
}

function playCharPlacementSound(currentDrawingSpeed) {
  if (charPlaceSoundEnv && typeof getAudioContext === 'function' && getAudioContext().state === 'running') {
    let randomOffset = random(-CHAR_PLACE_PITCH_RANDOM_RANGE, CHAR_PLACE_PITCH_RANDOM_RANGE);
    let cappedSpeed = min(currentDrawingSpeed, soundSpeedCapForCharSound);
    let pitchMultiplier = map(cappedSpeed, 0, soundSpeedCapForCharSound, CHAR_PLACE_PITCH_MULTIPLIER_MIN, CHAR_PLACE_PITCH_MULTIPLIER_MAX);
    pitchMultiplier = constrain(pitchMultiplier, CHAR_PLACE_PITCH_MULTIPLIER_MIN, CHAR_PLACE_PITCH_MULTIPLIER_MAX);
    let finalFreq = (CHAR_PLACE_BASE_FREQ + randomOffset) * pitchMultiplier;
    charPlaceSoundOsc.freq(finalFreq);

    let volume = map(cappedSpeed, 0, soundSpeedCapForCharSound, CHAR_PLACE_VOL_MIN, CHAR_PLACE_VOL_MAX);
    volume = constrain(volume, CHAR_PLACE_VOL_MIN, CHAR_PLACE_VOL_MAX);

    if (finalFreq > CHAR_PLACE_BASE_FREQ * CHAR_PLACE_HIGH_PITCH_VOL_REDUCTION_THRESHOLD_VERY_HIGH) {
      volume *= CHAR_PLACE_HIGH_PITCH_VOL_REDUCTION_FACTOR_VERY_HIGH;
    } else if (finalFreq > CHAR_PLACE_BASE_FREQ * CHAR_PLACE_HIGH_PITCH_VOL_REDUCTION_THRESHOLD_MODERATE) {
      volume *= CHAR_PLACE_HIGH_PITCH_VOL_REDUCTION_FACTOR_MODERATE;
    }
    charPlaceSoundEnv.setRange(volume, 0);
    charPlaceSoundEnv.play();
  }
}

// ------------------------------------------------------------------------------------
// UI and Application Control / UI与程序控制
// ------------------------------------------------------------------------------------

function displayInitialMessage() {
  if (!initialMessageContainer || !msgLine1Elem || !msgLine2Elem || !msgLine3Elem) {
    return;
  }
  let line1Text, line2Text, line3Text;
  if (isShuffledMode) {
    line1Text = "モード「雨ニモマケズ」混成。クリック＆ドラッグで描画。";
  } else {
    line1Text = "モード「雨ニモマケズ」正順。クリック＆ドラッグで描画。";
  }
  if (windowWidth < 600) {
    line2Text = "右下の文字ボタンで操作。";
  } else {
    line2Text = "右下の文字ボタン、またはSHIFT/C/Sキーで操作。";
  }
  line3Text = "文字間の疎密の変化を通して、詩のリズムを感じてみてください。";

  msgLine1Elem.textContent = line1Text;
  msgLine2Elem.textContent = line2Text;
  msgLine3Elem.textContent = line3Text;

  if (!initialMessageContainer.classList.contains('visible')) {
    initialMessageContainer.classList.add('visible');
  }
}

function updateCursorAndParticlesVisibility() {
  if (isShuffledMode) {
    noCursor();
    updateAndDrawFallingTextParticles();
  } else {
    cursor(ARROW);
  }
}

function toggleMode() {
  isShuffledMode = !isShuffledMode;
  clearDrawingInternal();
  loadPoemData(isShuffledMode ? poemLinesShuffled : poemLinesNormal);
  activeFallingTextParticles = [];
  fallingCharIndex = 0;
}

function clearDrawingInternal() {
  allPaths = [];
  allDrawnTexts = [];
  currentPath = [];
  currentDrawnText = [];
  distSinceLastChar = 0;
  isDrawing = false;
  lastPlacedTextPos = null;
  currentPoemIndex = 0;
  activeFallingTextParticles = [];
  fallingCharIndex = 0;
  if (typeof background === 'function') background(250);
}

function clearDrawingAndShowMessage() {
  clearDrawingInternal();
}

function saveArtwork() {
  if (allPaths.length === 0 && currentPath.length < 2) {
    return;
  }
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timestamp = `${month}${day}-${hours}${minutes}`;
  const filename = `軌跡_${timestamp}.png`;

  if (isShuffledMode) {
    let offscreenBuffer = createGraphics(width, height);
    offscreenBuffer.background(250);
    offscreenBuffer.textAlign(CENTER, CENTER);
    offscreenBuffer.textSize(textFontSize);
    offscreenBuffer.textFont('sans-serif');

    for (let i = 0; i < allPaths.length; i++) {
      drawPath(allPaths[i], lineStrokeColor, lineAlpha, strokeLineWeight, offscreenBuffer);
      drawTextAlongPath(allDrawnTexts[i], offscreenBuffer);
    }
    if (isDrawing && currentPath.length > 1) {
      drawPath(currentPath, lineStrokeColor, lineAlpha, strokeLineWeight, offscreenBuffer);
      drawTextAlongPath(currentDrawnText, offscreenBuffer);
    }
    save(offscreenBuffer, filename);
    offscreenBuffer.remove();
  } else {
    saveCanvas(filename);
  }
}
