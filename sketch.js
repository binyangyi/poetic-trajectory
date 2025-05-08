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

// 文字与路径可调整参数
let minSpeed = 0.5; // 影响文字间距的最小鼠标速度阈值
let maxSpeed = 20;  // 影响文字间距的最大鼠标速度阈值
let minSpacingAlongPath = 3; // 路径上文字之间的最小间距（像素）
let maxSpacingAlongPath = 40; // 路径上文字之间的最大间距（像素）
let textFontSize = 12; // 主要诗歌文字的大小（像素）
let textOffsetAboveLine = textFontSize * 0.8; // 文字相对于绘制路径向上偏移的距离
let strokeLineWeight = 1.2; // 绘制路径的线条粗细
let lineAlpha = 200; // 绘制路径线条的透明度 (0-255)
let textAlpha = 255; // 诗歌文字的透明度 (0-255)
let lineStrokeColor = 0; // 绘制路径线条的颜色 (0为黑色, 255为白色)
let minScreenSpacing = textFontSize * 0.7; // 放置文字时，新文字与上一个文字在屏幕上的最小像素距离，防止重叠
let pauseLengthOnPath = 60; // 诗句之间在路径上“停顿”的等效长度（以字符间距单位计）

const PAUSE_MARKER = { isPause: true, length: pauseLengthOnPath };

// 掉落文字粒子参数
let activeFallingTextParticles = [];
let poemCharsNormalForFalling = [];
let fallingCharIndex = 0;
const fallingTextSpawnChance = 0.25; // 每帧生成一个新的掉落文字粒子的几率 (0到1之间)
const fallingTextMaxCount = 50; // 屏幕上允许存在的最大掉落文字粒子数量
const fallingTextInitialLifespan = 120; // 掉落文字粒子的初始生命周期（帧数）
const fallingTextGravity = 0.07; // 作用于掉落文字粒子的重力加速度
const fallingTextFontSize = textFontSize + 2; // 掉落文字的字体大小（像素）

let aktivGroteskFont;

function preload() {
  // aktivGroteskFont = loadFont('AktivGrotesk-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(textFontSize);
  textAlign(CENTER, CENTER);
  textFont('sans-serif');

  prepareFallingTextSource();
  loadPoemData(isShuffledMode ? poemLinesShuffled : poemLinesNormal);
  lastPlacedTextPos = null;
  activeFallingTextParticles = [];
}

function prepareFallingTextSource() {
  poemCharsNormalForFalling = [];
  for (let line of poemLinesNormal) {
    for (let char of line) {
      poemCharsNormalForFalling.push(char);
    }
  }
}

function loadPoemData(sourceLines) {
  poemData = [];
  for (let lineIndex = 0; lineIndex < sourceLines.length; lineIndex++) {
    const currentLineText = sourceLines[lineIndex];
    for (let i = 0; i < currentLineText.length; i++) {
      let char = currentLineText[i];
      poemData.push({ char: char, isEmoji: false, emoji: null });
    }
    if (lineIndex < sourceLines.length - 1) {
      poemData.push(PAUSE_MARKER);
    }
  }
  if (poemData.length > 0 && (poemData.length === 0 || !poemData[poemData.length - 1].isPause)) {
    poemData.push(PAUSE_MARKER);
  }
  currentPoemIndex = 0;
}

function draw() {
  if (allPaths.length === 0 && !isDrawing && currentPath.length === 0) {
    background(250);
    displayInitialMessage();
    if (isShuffledMode) {
      noCursor();
      updateAndDrawFallingTextParticles();
    } else {
      cursor(ARROW);
    }
  } else {
    background(250);
    for (let i = 0; i < allPaths.length; i++) {
      drawPath(allPaths[i], lineStrokeColor, lineAlpha, strokeLineWeight);
      drawTextAlongPath(allDrawnTexts[i]);
    }
    if (isDrawing) {
      let currentMousePos = { x: mouseX, y: mouseY };
      if (dist(currentMousePos.x, currentMousePos.y, lastMousePos.x, lastMousePos.y) > 0.1) {
        currentPath.push(currentMousePos);
        if (currentPath.length > 1) {
          let prevP = currentPath[currentPath.length - 2];
          let currP = currentPath[currentPath.length - 1];
          let distanceMoved = dist(currP.x, currP.y, prevP.x, prevP.y);
          distSinceLastChar += distanceMoved;
          let speed = distanceMoved;
          let charSpacingThreshold = map(speed, minSpeed, maxSpeed, minSpacingAlongPath, maxSpacingAlongPath);
          charSpacingThreshold = constrain(charSpacingThreshold, minSpacingAlongPath, maxSpacingAlongPath);

          while (currentPoemIndex < poemData.length && distSinceLastChar > 0) {
            let data = poemData[currentPoemIndex];
            let itemCost = data.isPause ? data.length : charSpacingThreshold;
            if (itemCost <= 0) itemCost = minSpacingAlongPath;

            if (distSinceLastChar >= itemCost) {
              if (data.isPause) {
                distSinceLastChar -= itemCost;
              } else {
                let charToPlace = data.char;
                let dx = currP.x - prevP.x;
                let dy = currP.y - prevP.y;
                let angle = atan2(dy, dx);
                let initialNormalAngle = angle - HALF_PI;
                let offsetX = cos(initialNormalAngle) * textOffsetAboveLine;
                let offsetY = sin(initialNormalAngle) * textOffsetAboveLine;
                if (offsetY > 0) { offsetX = -offsetX; offsetY = -offsetY; }
                let nextTextX = currP.x + offsetX;
                let nextTextY = currP.y + offsetY;
                let screenDistanceOK = true;
                if (lastPlacedTextPos !== null) {
                  if (dist(nextTextX, nextTextY, lastPlacedTextPos.x, lastPlacedTextPos.y) < minScreenSpacing) {
                    screenDistanceOK = false;
                  }
                }
                if (screenDistanceOK) {
                  currentDrawnText.push({ char: charToPlace, x: nextTextX, y: nextTextY, angle: 0 });
                  lastPlacedTextPos = { x: nextTextX, y: nextTextY };
                  distSinceLastChar -= itemCost;
                } else {
                  distSinceLastChar -= itemCost;
                  if (distSinceLastChar < 0) distSinceLastChar = 0;
                  break;
                }
              }
              currentPoemIndex++;
              if (currentPoemIndex >= poemData.length) currentPoemIndex = 0;
              if (distSinceLastChar < 0) distSinceLastChar = 0;
            } else {
              break;
            }
          }
        }
        lastMousePos = currentMousePos;
      }
      if (currentPath.length > 0) drawPath(currentPath, lineStrokeColor, lineAlpha, strokeLineWeight);
      if (currentDrawnText.length > 0) drawTextAlongPath(currentDrawnText);
    }

    if (isShuffledMode) {
      noCursor();
      updateAndDrawFallingTextParticles();
    } else {
      cursor(ARROW);
    }
  }
}

function drawPath(path, strokeCol, alphaVal, weight) {
  stroke(strokeCol, alphaVal);
  strokeWeight(weight);
  noFill();
  beginShape();
  for (let pt of path) vertex(pt.x, pt.y);
  endShape();
}

function drawTextAlongPath(texts) {
  textSize(textFontSize);
  for (let txt of texts) {
    push();
    translate(txt.x, txt.y);
    fill(0, 0, 0, textAlpha);
    noStroke();
    text(txt.char, 0, 0);
    pop();
  }
}

function updateAndDrawFallingTextParticles() {
  if (poemCharsNormalForFalling.length > 0 && activeFallingTextParticles.length < fallingTextMaxCount && random(1) < fallingTextSpawnChance) {
    let charToFall = poemCharsNormalForFalling[fallingCharIndex];
    fallingCharIndex = (fallingCharIndex + 1) % poemCharsNormalForFalling.length;

    let newParticle = {
      x: mouseX + random(-15, 15),
      y: mouseY + random(-15, 15),
      vx: random(-0.3, 0.3),
      vy: random(-0.8, 0.2),
      char: charToFall,
      rotation: random(-0.1, 0.1),
      rotationSpeed: random(-0.005, 0.005),
      lifespan: fallingTextInitialLifespan,
      initialLifespan: fallingTextInitialLifespan,
      opacity: 255,
      fontSize: fallingTextFontSize,
    };
    activeFallingTextParticles.push(newParticle);
  }

  for (let i = activeFallingTextParticles.length - 1; i >= 0; i--) {
    let p = activeFallingTextParticles[i];
    p.vy += fallingTextGravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.lifespan--;
    p.opacity = map(p.lifespan, 0, p.initialLifespan, 0, 255);

    if (p.lifespan <= 0 || p.y > height + p.fontSize * 2) {
      activeFallingTextParticles.splice(i, 1);
      continue;
    }

    push();
    translate(p.x, p.y);
    rotate(p.rotation);
    fill(0, 0, 0, p.opacity);
    noStroke();
    textSize(p.fontSize);
    text(p.char, 0, 0);
    pop();
  }
}

function mousePressed() {
  isDrawing = true;
  currentPath = [{ x: mouseX, y: mouseY }];
  currentDrawnText = [];
  lastMousePos = { x: mouseX, y: mouseY };
  distSinceLastChar = 0;
  lastPlacedTextPos = null;
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

function mouseReleased() {
  if (isDrawing) {
    isDrawing = false;
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
}

function toggleMode() {
  isShuffledMode = !isShuffledMode;
  clearDrawing();
  loadPoemData(isShuffledMode ? poemLinesShuffled : poemLinesNormal);
  activeFallingTextParticles = [];
  fallingCharIndex = 0;
  let modeNameForConsole = isShuffledMode ? "「雨ニモマケズ」混成" : "「雨ニモマケズ」正順";
  console.log(`${modeNameForConsole}モードに切り替えました。`);
}

function clearDrawing() {
  background(250);
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
}

function clearDrawingAndShowMessage() {
  clearDrawing();
}

function displayInitialMessage() {
  push();
  fill(150);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('sans-serif');
  textSize(14);

  let line1Text;
  if (isShuffledMode) {
    line1Text = "モード：「雨ニモマケズ」混成。クリック＆ドラッグで描画。";
  } else {
    line1Text = "モード：「雨ニモマケズ」正順。クリック＆ドラッグで描画。";
  }

  text(line1Text, width / 2, height / 2 - 30);
  text("SHIFTキーでモード切替。「C」キーでクリア。", width / 2, height / 2);
  text("文字の密度の変化に合わせ、詩を感じてください。", width / 2, height / 2 + 30);

  textSize(textFontSize);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  clearDrawingAndShowMessage();
  prepareFallingTextSource();
  loadPoemData(isShuffledMode ? poemLinesShuffled : poemLinesNormal);
}