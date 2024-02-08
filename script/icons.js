function displayIcons(iconsData) {
  const iconGrid = document.getElementById("iconGrid");
  iconGrid.innerHTML = '';

  iconsData.forEach(function(iconEntry) {
    const iconName = iconEntry[0];
    const categories = iconEntry[1];

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
fetch('iconsCategories.json')
  .then(response => response.json())
  .then(data => {
    const iconsData = Object.entries(data); // Преобразование объекта в массив пар [ключ, значение]
    displayIcons(iconsData); // Отображение иконок после загрузки
  })
  .catch(error => {
    console.error('Ошибка загрузки иконок:', error);
  });

document.getElementById("searchIconInput").addEventListener("input", function() {
  const searchQuery = this.value.toLowerCase();
  const filteredIconsData = iconsData.filter(function(iconEntry) {
    const iconName = iconEntry[0];
    return iconName.includes(searchQuery);
  });

  displayIcons(filteredIconsData);
});

function selectIcon(iconName) {
  console.log("Selected icon:", iconName);
  closeModal();
}
