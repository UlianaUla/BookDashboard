import Dashboard from './Dashboard.js';

// Функция переключения темы
function setupThemeToggle(dashboard) {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    body.className = savedTheme;
    themeToggle.textContent = savedTheme === 'light-theme' ? '🌙 Тёмная тема' : '☀️ Светлая тема';
    
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            themeToggle.textContent = '☀️ Светлая тема';
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
            themeToggle.textContent = '🌙 Тёмная тема';
        }
    });
}

// Функция проверки и обновления видимости кнопки возврата
function updateRestoreButtonVisibility(dashboard) {
    const restoreContainer = document.getElementById('restoreContainer');
    const subjectsWidgets = dashboard.widgets.filter(w => w.title.includes('Книги по теме')).length;
    const authorsWidgets = dashboard.widgets.filter(w => w.title.includes('Авторы')).length;
    
    // Проверяем, есть ли хотя бы один виджет каждого типа
    const hasSubjects = subjectsWidgets > 0;
    const hasAuthors = authorsWidgets > 0;
    
    // Если нет ни одного виджета книг по теме ИЛИ ни одного виджета авторов
    if (!hasSubjects || !hasAuthors) {
        restoreContainer.style.display = 'flex';  // Показываем кнопку
    } else {
        restoreContainer.style.display = 'none';   // Скрываем кнопку
    }
}

// Функция инициализации дашборда
function initDashboard() {
    console.log('Инициализация дашборда...');
    
    const gridElement = document.getElementById('dashboardGrid');
    if (!gridElement) {
        console.error('Элемент dashboardGrid не найден!');
        return;
    }
    
    console.log('Элемент dashboardGrid найден, создаем дашборд');
    
    // Создаем экземпляр Dashboard
    const dashboard = new Dashboard('dashboardGrid');
    
    // Добавляем два виджета сразу
    dashboard.addWidget('subjects');
    dashboard.addWidget('authors');
    
    // Настраиваем переключатель темы
    setupThemeToggle(dashboard);
    
    // Кнопка для третьего виджета
    const addBtn = document.getElementById('addWorksBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            dashboard.addWidget('works');
        });
    }
    
    // Кнопка возврата виджетов
    const restoreBtn = document.getElementById('restoreWidgetsBtn');
    if (restoreBtn) {
        restoreBtn.addEventListener('click', () => {
            // Проверяем, каких виджетов не хватает
            const hasSubjects = dashboard.widgets.some(w => w.title.includes('Книги по теме'));
            const hasAuthors = dashboard.widgets.some(w => w.title.includes('Авторы'));
            
            if (!hasSubjects) {
                dashboard.addWidget('subjects');
            }
            if (!hasAuthors) {
                dashboard.addWidget('authors');
            }
            
            // Обновляем видимость кнопки
            updateRestoreButtonVisibility(dashboard);
        });
    }
    
    // Слушаем события закрытия виджетов
    document.addEventListener('widget:close', () => {
        // Даем время на удаление виджета, потом обновляем кнопку
        setTimeout(() => {
            updateRestoreButtonVisibility(dashboard);
        }, 100);
    });
    
    // Первоначальная проверка (скрываем кнопку, так как виджеты есть)
    setTimeout(() => {
        updateRestoreButtonVisibility(dashboard);
    }, 500);
}

// Запускаем после полной загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}