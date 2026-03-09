import Dashboard from './Dashboard.js';

// Функция переключения темы
function setupThemeToggle(dashboard) {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    if (!themeToggle) {
        console.error('Кнопка переключения темы не найдена');
        return;
    }
    
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    body.className = savedTheme;
    themeToggle.textContent = savedTheme === 'light-theme' ? ' Тёмная тема' : ' Светлая тема';
    
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            themeToggle.textContent = ' Светлая тема';
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
            themeToggle.textContent = ' Тёмная тема';
        }
    });
}

// Функция проверки и обновления видимости кнопки возврата
function updateRestoreButtonVisibility(dashboard) {
    const restoreContainer = document.getElementById('restoreContainer');
    
    // Если элемент не найден
    if (!restoreContainer) {
        console.log('Кнопка возврата не найдена в DOM');
        return;
    }
    
    const subjectsWidgets = dashboard.widgets.filter(w => w.title && w.title.includes('Книги по теме')).length;
    const authorsWidgets = dashboard.widgets.filter(w => w.title && w.title.includes('Авторы')).length;
    
    // Проверка хотя бы одного виджета
    const hasSubjects = subjectsWidgets > 0;
    const hasAuthors = authorsWidgets > 0;
    
    
    if (!hasSubjects || !hasAuthors) {
        restoreContainer.style.display = 'flex';  // Показ кнопк
        console.log('Показываем кнопку возврата');
    } else {
        restoreContainer.style.display = 'none';   // скрытие кнопки
        console.log('Скрываем кнопку возврата');
    }
}

// инициализация дашборда
function initDashboard() {
    console.log('Инициализация дашборда...');
    
    const gridElement = document.getElementById('dashboardGrid');
    if (!gridElement) {
        console.error('Элемент dashboardGrid не найден!');
        return;
    }
    
    console.log('Элемент dashboardGrid найден, создаем дашборд');
    
    // Создание дашборда
    const dashboard = new Dashboard('dashboardGrid');
    
    // Добавление двух виджетот сразу
    dashboard.addWidget('subjects');
    dashboard.addWidget('authors');
    
    // переключатель темы
    setupThemeToggle(dashboard);
    
    // Кнопка для третьего виджета
    const addBtn = document.getElementById('addWorksBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            dashboard.addWidget('works');
        });
    }
    
    // Кнопка возврата виджетов (проверка существования)
    const restoreBtn = document.getElementById('restoreWidgetsBtn');
    if (restoreBtn) {
        restoreBtn.addEventListener('click', () => {
            // Проверяем, каких виджетов не хватает
            const hasSubjects = dashboard.widgets.some(w => w.title && w.title.includes('Книги по теме'));
            const hasAuthors = dashboard.widgets.some(w => w.title && w.title.includes('Авторы'));
            
            if (!hasSubjects) {
                dashboard.addWidget('subjects');
            }
            if (!hasAuthors) {
                dashboard.addWidget('authors');
            }
            
            // видимость кнопки
            updateRestoreButtonVisibility(dashboard);
        });
    } else {
        console.log('Кнопка возврата не найдена - функция недоступна');
    }
    
    
    document.addEventListener('widget:close', () => {
        
        setTimeout(() => {
            updateRestoreButtonVisibility(dashboard);
        }, 100);
    });
    
    // Первоначальная проверка 
    setTimeout(() => {
        updateRestoreButtonVisibility(dashboard);
    }, 500);
}

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}