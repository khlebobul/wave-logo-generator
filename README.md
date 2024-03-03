# Wave-logo-generator

Web applications for logitype creation based on p5.js library algorithm. 

### Demo
- [ ] Load video

### Algorithm
``` function drawLines() {
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
```

### Image 

``` function loadImageFromFile(file) {
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
```

Made by Gleb (a.k.a. khlebobul). Check my [Website](https://bento.me/khlebobul) and [Twitter(X)](https://twitter.com/khlebobul).
Support this project through [Buy Me a Coffee](https://bmc.link/khlebobul) or [Cloudtips](https://pay.cloudtips.ru/p/edff283a).
Thanks to [Ivan](https://ivandianov.com/) and [Adam](https://cdarr.ru/) from [setka.design](https://setka.design) for their help, inspiration and great [course](https://setka.design).
Thanks to Lucide for the [Icons](https://lucide.dev/).  
For bugs and features [sbgleb10@gmail.com](mailto:sbgleb10@gmail.com).
