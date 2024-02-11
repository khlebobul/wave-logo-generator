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
