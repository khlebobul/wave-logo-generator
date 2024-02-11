let iconsData; // Перемещаем переменную в глобальную область видимости

function displayIcons(iconsData) {
  const iconGrid = document.getElementById("iconGrid");
  iconGrid.innerHTML = '';

  iconsData.forEach(function(iconEntry) {
    const iconName = iconEntry;

    const icon = document.createElement("i");
    icon.classList.add("icon");
    icon.setAttribute("data-lucide", iconName);
    icon.innerHTML = iconName;
    icon.onclick = function() {
      selectIcon(iconName);
    };
    iconGrid.appendChild(icon);
  });
}

function openModal() {
  document.getElementById("iconPickerModal").style.display = "block";
}

function closeModal() {
  document.getElementById("iconPickerModal").style.display = "none";
}

// Загрузка иконок из JSON-файла
fetch('icons.json')
  .then(response => response.json())
  .then(data => {
    iconsData = Object.keys(data); // Получаем только названия иконок
    displayIcons(iconsData); // Отображение иконок после загрузки
  })
  .catch(error => {
    console.error('Ошибка загрузки иконок:', error);
  });

document.getElementById("searchIconInput").addEventListener("input", function() {
  const searchQuery = this.value.toLowerCase();
  const filteredIconsData = iconsData.filter(function(iconName) {
    return iconName.includes(searchQuery);
  });

  displayIcons(filteredIconsData);
});

function selectIcon(iconName) {
  console.log("Selected icon:", iconName);
  closeModal();
}
