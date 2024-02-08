let img;
let blurred;
let blurRadius;
let isVanishing;
let startingStroke;

let offsetX = 0; // Начальное горизонтальное смещение
let offsetY = 0; // Начальное вертикальное смещение

let isDragging = false; // Переменная для отслеживания, зажата ли кнопка мыши

let chooseFile;
let chooseBackgroundColor;
let chooseDist;
let chooseHeight;
let chooseWaveColor;
let chooseMargin;
let chooseWidth;
let chooseShapeColor;

function preload() {
  // Переменные для элементов управления
  chooseFile = document.getElementById("choose-file");
  chooseBackgroundColor = document.getElementById("choose-background-color");
  chooseDist = document.getElementById("choose-dist");
  chooseHeight = document.getElementById("choose-height");
  chooseWaveColor = document.getElementById("choose-wave-color");
  chooseMargin = document.getElementById("choose-margin");
  chooseWidth = document.getElementById("choose-width");
  chooseShapeColor = document.getElementById("choose-shape-color");

  // Обработчики событий для изменения значений
  chooseFile.addEventListener("change", function () {
    getImgData();
  });

  chooseBackgroundColor.addEventListener("change", function () {
    document.querySelector("#frame").style.backgroundColor = chooseBackgroundColor.value;
  });

  chooseWaveColor.addEventListener("change", function () {
    document.querySelector("#frame").style.waveColor = chooseWaveColor.value;
  });

  chooseShapeColor.addEventListener("change", function () {
    document.querySelector("#frame").style.shapeColor = chooseShapeColor.value;
  });

  
}

function getImgData() {
  isVanishing = false;
  blurRadius = 3;
  const files = chooseFile.files[0];
  if (files) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener("load", function () {
      img = loadImage(`${this.result}`);
    });
  }
}

function setup() {
  createCanvas(600, 600); // Canvas size
  blurred = 0;
  blurRadius = 5;
}

function draw() {
  background(`${chooseBackgroundColor.value}`);

  if (img) {
    if (blurred == 0 || isVanishing) {
      img.filter(BLUR, blurRadius);
      blurred = 1;
    }

    img.resize(200, 200);

    let w = width / img.width;
    let h = height / img.height;

    const hMap = [...Array(img.width)].map((e) => Array(img.height));

    img.loadPixels();
    for (let i = 0; i < img.height; i++) {
      for (let j = 0; j < img.width; j++) {
        const pixelIndex = (i * img.width + j) * 4;
        const r = img.pixels[pixelIndex];
        const g = img.pixels[pixelIndex + 1];
        const b = img.pixels[pixelIndex + 2];
        //heatMap
        hMap[j][i] = (r + g + b) / 3; // Shape volume
      }
    }

    startingStroke = int(chooseWidth.value); // Wave width

    var str = startingStroke;

    var band = int(chooseMargin.value); // Margin

    var waveDist = int(chooseDist.value); // Wave distance

    var waveHeight = int(chooseHeight.value); // Shape volume

    for (let i = 0 + band; i < img.height - band; i += waveDist) {
      noFill();
      strokeWeight(str);

      stroke(`${chooseWaveColor.value}`);

      beginShape();
      for (let j = 0; j < img.width; j++) {
        var y = map(hMap[j][i], 255, 0, 0, waveHeight);
        vertex(j * w + offsetX, i * h + y + offsetY);
      }

      endShape();
      str -= 0;
    }

    str = startingStroke;

    for (let i = 0 + band; i < img.height - band; i += waveDist) {
      noFill();
      strokeWeight(str);

      stroke(`${chooseShapeColor.value}`);

      var shapeEnded = 1;
      beginShape();
      for (let j = 0; j < img.width; j++) {
        if (hMap[j][i] > 200) {
          if (shapeEnded == 1) {
            shapeEnded = 0;
            beginShape();
          }
          var diff = map(hMap[j][i], 255, 0, 0, waveHeight);
          vertex(j * w + offsetX, i * h + diff + offsetY);
        } else {
          endShape();
          shapeEnded = 1;
        }
      }

      endShape();
      str -= 0;
    }
  }
}

// Функция для начала перемещения элемента при зажатии кнопки мыши
function mousePressed() {
  // Проверяем, находится ли курсор мыши в пределах canvas
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    isDragging = true;
    // Устанавливаем предыдущие координаты мыши
    previousMouseX = mouseX;
    previousMouseY = mouseY;
  }
}

// Функция для окончания перемещения элемента при отпускании кнопки мыши
function mouseReleased() {
  isDragging = false;
}

// Функция для изменения offsetX и offsetY с помощью мыши только при зажатой кнопке
function mouseDragged() {
  // Проверяем, зажата ли кнопка мыши
  if (isDragging) {
    // Обновляем смещение только при зажатой кнопке мыши
    offsetX += mouseX - previousMouseX;
    offsetY += mouseY - previousMouseY;
    // Обновляем предыдущие координаты мыши
    previousMouseX = mouseX;
    previousMouseY = mouseY;
  }
}

// Обработчик события для кнопки сохранения изображения
document.getElementById("save-png").addEventListener("click", function () {
      save("wave-logo.png"); // Сохраняем canvas в формате PNG с именем "output"
});
