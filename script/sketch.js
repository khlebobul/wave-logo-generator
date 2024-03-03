let img;
let lines = 100; // Number of horizontal lines
let pointsPerLine = 100; // Number of points per line
let amp;
let bgColor;
let lineColor;
let lineWidth = 2; // Default line width
let imgScale = 0.5; // Default image scale
let dropArea;

function setup() {
  if (windowWidth < 750 && windowWidth >= 470) {
    createCanvas(400, 400);
  } else if (windowWidth < 470) {
    createCanvas(300, 300);
  } else {
    createCanvas(600, 600);
  }
  amp = height / lines;
  noFill();
  bgColor = color('#2541E1'); // Default background color
  lineColor = color('#FFFFFF'); // Default line color
}

function draw() {
  background(bgColor); // Set background color
  if (img) {
    stroke(lineColor); // Set line color
    strokeWeight(lineWidth); // Set line width
    drawLines();
  }
}

function drawLines() {
  let lineHeight = height / (lines + 1);
  for (let i = 1; i <= lines; i++) {
    let y = i * lineHeight;
    beginShape();
    drawPoints(y);
    endShape();
  }
}

function drawPoints(y) {
  let pointSpacing = width / (pointsPerLine + 1);
  for (let i = 1; i <= pointsPerLine; i++) {
    let x = i * pointSpacing;
    let offset = getVerticalOffset(x, y);
    vertex(x, y + offset);
  }
}

function getVerticalOffset(x, y) {
  let [imgX, imgY] = canvasToImageCoords(x, y);
  imgX = floor(imgX);
  imgY = floor(imgY);
  if (imgX < 0 || imgX > img.width - 1 || imgY < 0 || imgY > img.height - 1)
    return 0;

  // Индекс пикселя в массиве изображения
  let index = (imgY * img.width + imgX) * 4; // 4 канала (RGBA)
  
  // Получение значений красного, зеленого, синего и альфа каналов пикселя
  let redValue = img.pixels[index];
  let greenValue = img.pixels[index + 1];
  let blueValue = img.pixels[index + 2];
  let alphaValue = img.pixels[index + 3];
  
  // Если альфа канал равен 0 (прозрачный пиксель), вертикальное смещение равно 0
  if (alphaValue === 0) {
    return 0;
  }
  
  // Иначе возвращаем значение красного канала, как и ранее
  return map(redValue, 0, 255, -amp, 0);
}


function canvasToImageCoords(x, y) {
  x -= width / 2;
  y -= height / 2;
  let scale_ = imgScale; // Use imgScale for scaling, remove mouse-based scaling
  x /= scale_;
  y /= scale_;
  x += img.width / 2;
  y += img.height / 2;
  return [x, y];
}

// Function to handle file selection
document.getElementById('choose-file').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      img = loadImage(event.target.result, function() {
        img.loadPixels();
        document.getElementById('drop-area').style.opacity = "0";
      });
    };
    reader.readAsDataURL(file);
  }
});

// Function to handle file drop
document.getElementById('drop-area').addEventListener('drop', function(event) {
  event.preventDefault();
  event.stopPropagation();
  const file = event.dataTransfer.files[0];
  loadImageFromFile(file);

  document.getElementById('drop-area').style.opacity = "0";
});

// Function to handle drag over drop area
document.getElementById('drop-area').addEventListener('dragover', function(event) {
  event.preventDefault();
  event.stopPropagation();
});

function loadImageFromFile(file) {
  if (file) {
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'svg') {
      const reader = new FileReader();
      reader.onload = function(event) {
        const svgContent = event.target.result;
        // Создаем новый элемент SVG
        const imgElement = new Image();
        imgElement.onload = function() {
          // После успешной загрузки SVG, создаем p5.Image объект
          img = createImage(imgElement.width, imgElement.height);
          img.loadPixels();
          // Копируем пиксели изображения в p5.Image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imgElement, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          img.pixels = imageData.data;
          img.updatePixels();
          // Скрываем область загрузки изображения
          document.getElementById('drop-area').style.opacity = "0";
        };
        imgElement.src = URL.createObjectURL(file);
      };
      reader.readAsDataURL(file);
    } else if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
      const reader = new FileReader();
      reader.onload = function(event) {
        img = loadImage(event.target.result, function() {
          img.loadPixels();
          document.getElementById('drop-area').style.opacity = "0";
        });
      };
      reader.readAsDataURL(file);
    } else {
      console.log("Unsupported file format");
    }
  }
}


// Function to handle background color selection
document.getElementById('choose-background-color').addEventListener('input', function(event) {
  bgColor = color(event.target.value);
});

// Function to handle line color selection
document.getElementById('choose-wave-color').addEventListener('input', function(event) {
  lineColor = color(event.target.value);
});

// Function to handle line width selection
document.getElementById('choose-line-width').addEventListener('input', function(event) {
  lineWidth = parseInt(event.target.value);
});

// Function to handle number of lines selection
document.getElementById('choose-number-of-lines').addEventListener('input', function(event) {
  lines = parseInt(event.target.value);
});

// Function to handle number of points per line selection
document.getElementById('choose-points-per-line').addEventListener('input', function(event) {
  pointsPerLine = parseInt(event.target.value);
});

// Function to handle image scale selection
document.getElementById('choose-icon-size').addEventListener('input', function(event) {
  imgScale = parseFloat(event.target.value);
});

// Function to handle PNG download
document.getElementById('save-png').addEventListener('click', function() {
  saveCanvas('wave-logo-generator', 'png');
});

// Function to dynamically adjust canvas size when window is resized
function windowResized() {
  if (windowWidth < 750 && windowWidth >= 470) {
    resizeCanvas(400, 400);
  } else if (windowWidth < 470) {
    resizeCanvas(300, 300);
  } else {
    resizeCanvas(600, 600);
  }
}

// Lucide incons script

document.addEventListener("DOMContentLoaded", function() {
  var iconGrid = document.getElementById("iconGrid");
  
  // Создаем и добавляем элементы иконок для всех иконок из набора Lucide Icons
  for (var iconName in lucide) {
    var iconNode = lucide[iconName];
    var svgString = iconNodeToString(iconNode);
    // Создаем элемент SVG
    var svgElement = createSVGElement(svgString);
    // Создаем элемент div и добавляем в него SVG
    var iconDiv = document.createElement("div");
    iconDiv.classList.add("icon-wrapper");
    iconDiv.setAttribute("data-lucide", iconName.toLowerCase()); // Устанавливаем атрибут с названием иконки в нижнем регистре
    iconDiv.appendChild(svgElement);
    // Добавляем div в контейнер
    iconGrid.appendChild(iconDiv);
  }
});

function iconNodeToString(iconNode) {
  var tag = iconNode[0];
  var attrs = "";
  if (iconNode[1]) {
    attrs = Object.entries(iconNode[1])
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");
  }
  var children = (iconNode[2] || []).map(childNode => iconNodeToString(childNode)).join("");
  return `<${tag} ${attrs}>${children}</${tag}>`;
}

function createSVGElement(svgString) {
  var div = document.createElement("div");
  div.innerHTML = svgString.trim();
  return div.firstChild;
}

function openModal() {
  document.getElementById("iconPickerModal").style.display = "block";
}

function closeModal() {
  document.getElementById("iconPickerModal").style.display = "none";
}

document.getElementById("searchIconInput").addEventListener("input", function() {
  var searchTerm = this.value.toLowerCase();
  var icons = document.querySelectorAll("#iconGrid .icon-wrapper");
  icons.forEach(function(icon) {
    var iconName = icon.getAttribute("data-lucide");
    if (iconName && iconName.includes(searchTerm)) {
      icon.style.display = "inline-block";
    } else {
      icon.style.display = "none";
    }
  });
});

document.getElementById("iconGrid").addEventListener("click", function(event) {
  var clickedIcon = event.target.closest(".icon-wrapper");
  if (clickedIcon) {
    var iconName = clickedIcon.getAttribute("data-lucide");
    if (iconName) {
      console.log("Выбрана иконка:", iconName);
    }
  }
});
