let iconsData; // Переместим переменную в глобальную область видимости
let displayedIcons = []; // Переместим переменную в глобальную область видимости

function displayIcons(iconsData) {
  const iconGrid = document.getElementById("iconGrid");
  iconGrid.innerHTML = '';

  displayedIcons = []; // Очищаем массив перед отображением иконок

  iconsData.forEach(function(iconEntry) {
    const iconName = iconEntry[0]; // Получаем название иконки
    const icon = document.createElement("div"); // Создаем элемент div для иконки
    icon.classList.add("icon");
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="${iconName}" class="lucide lucide-${iconName} icon"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M17 12h-2l-2 5-2 10-2 5H7"></path></svg>`;
    icon.onclick = function() {
      selectIcon(iconName);
    };
    iconGrid.appendChild(icon);
    displayedIcons.push(icon);
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
    iconsData = Object.entries(data); // Преобразуем объект в массив ключ-значение
    displayIcons(iconsData); // Отображаем иконки после загрузки
  })
  .catch(error => {
    console.error('Ошибка загрузки иконок:', error);
  });

document.getElementById("searchIconInput").addEventListener("input", function() {
  const searchQuery = this.value.toLowerCase();
  const filteredIconsData = iconsData.filter(function(iconEntry) {
    const iconName = iconEntry[0]; // Получаем название иконки
    return iconName.includes(searchQuery); // Возвращаем true, если название иконки содержит поисковой запрос
  });

  displayIcons(filteredIconsData); // Обновляем отображение иконок
});

function selectIcon(iconName) {
  console.log("Выбрана иконка:", iconName);
  closeModal();
}
