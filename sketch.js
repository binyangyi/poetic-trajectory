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

let minSpeed = 0.5; // 绘制速度影响文字间距的最小阈值
let maxSpeed = 20; // 绘制速度影响文字间距的最大阈值
let minSpacingAlongPath = 3; // 沿路径的最小文字间距
let maxSpacingAlongPath = 40; // 沿路径的最大文字间距
let textFontSize = 12; // 路径上文字的字体大小
let textOffsetAboveLine = textFontSize * 0.8; // 文字相对于绘制线的垂直偏移量
let strokeLineWeight = 1.2; // 绘制线的粗细
let lineAlpha = 200; // 绘制线的透明度 (0-255)
let textAlpha = 255; // 路径上文字的透明度 (0-255)
let lineStrokeColor = 0; // 绘制线的颜色 (0为黑, 255为白, 或 color(r,g,b))
let minScreenSpacing = textFontSize * 0.7; // 防止文字在屏幕上过于重叠的最小间距
let pauseLengthOnPath = 60; // 诗句之间停顿的等效路径长度

const PAUSE_MARKER = { isPause: true, length: pauseLengthOnPath };

let activeFallingTextParticles = [];
let poemCharsNormalForFalling = [];
let fallingCharIndex = 0;
const fallingTextSpawnChance = 0.25; // 飘落文字生成的几率 (0-1)
const fallingTextMaxCount = 50; // 屏幕上最大飘落文字数量
const fallingTextInitialLifespan = 120; // 飘落文字初始生命周期 (帧)
const fallingTextGravity = 0.07; // 飘落文字的重力加速度
const fallingTextFontSize = textFontSize + 2; // 飘落文字的字体大小

let initialMessageContainer;
let msgLine1Elem, msgLine2Elem, msgLine3Elem;

function preload() { }

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(textFontSize);
  textAlign(CENTER, CENTER);
  textFont('sans-serif');
  initialMessageContainer = document.getElementById('initial-message-container');
  msgLine1Elem = document.getElementById('message-line1');
  msgLine2Elem = document.getElementById('message-line2');
  msgLine3Elem = document.getElementById('message-line3');
  prepareFallingTextSource();
  loadPoemData(isShuffledMode ? poemLinesShuffled : poemLinesNormal);
  lastPlacedTextPos = null;
  activeFallingTextParticles = [];
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
    if (initialMessageContainer && initialMessageContainer.classList.contains('visible')) {
      initialMessageContainer.classList.remove('visible');
    }
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

function mousePressed(event) {
  if (event && event.target) {
    const clickedElement = event.target;
    const clickedElementId = clickedElement.id;
    const parentOfClickedElement = clickedElement.parentElement;
    const parentOfClickedElementId = parentOfClickedElement ? parentOfClickedElement.id : null;
    const buttonIds = ['toggleModeTextBtnBackground', 'clearCanvasTextBtnBackground', 'saveCanvasBtnBackground'];
    if (buttonIds.includes(clickedElementId) || (parentOfClickedElementId && buttonIds.includes(parentOfClickedElementId))) {
      return;
    }
  }
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
  if (key === 's' || key === 'S') {
    saveArtwork();
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

function saveArtwork() {
  if (allPaths.length === 0) {
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
    save(offscreenBuffer, filename);
    offscreenBuffer.remove();
  } else {
    saveCanvas(filename);
  }
  console.log(`キャンバスを「${filename}」として保存しようとしました。`);
}

function displayInitialMessage() {
  if (!initialMessageContainer || !msgLine1Elem || !msgLine2Elem || !msgLine3Elem) {
    console.error("HTML message elements not found!");
    return;
  }
  let line1Text, line2Text, line3Text;
  if (isShuffledMode) {
    line1Text = "モード「雨ニモマケズ」混成。クリック＆ドラッグで描画。";
  } else {
    line1Text = "モード「雨ニモマケズ」正順。クリック＆ドラッグで描画。";
  }
  if (windowWidth < 600) {  // 移动设备
    line2Text = "右下の文字ボタンで操作。";
  } else {
    line2Text = "右下の文字ボタン、またはShift/C/Sキーで操作。";
  }
  line3Text = "文字間の疎密の変化を通して、詩のリズムを感じてみてください。";
  msgLine1Elem.textContent = line1Text;
  msgLine2Elem.textContent = line2Text;
  msgLine3Elem.textContent = line3Text;
  if (!initialMessageContainer.classList.contains('visible')) {
    initialMessageContainer.classList.add('visible');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
