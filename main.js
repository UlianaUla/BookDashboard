import Dashboard from './Dashboard.js';

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    body.className = savedTheme;
    themeToggle.textContent = savedTheme === 'light-theme' ? '🌙 Тёмная тема' : '☀️ Светлая тема';
    
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


function updateRestoreButtonVisibility(dashboard) {
    const restoreContainer = document.getElementById('restoreContainer');
    
    // Проверка существование элемента
    if (!restoreContainer) {
        console.log('Кнопка возврата не найдена - пропускаем');
        return;
    }
    
    const subjectsWidgets = dashboard.widgets.filter(w => w.title && w.title.includes('Книги по теме')).length;
    const authorsWidgets = dashboard.widgets.filter(w => w.title && w.title.includes('Авторы')).length;
    
    const hasSubjects = subjectsWidgets > 0;
    const hasAuthors = authorsWidgets > 0;
    
    if (!hasSubjects || !hasAuthors) {
        restoreContainer.style.display = 'flex';
    } else {
        restoreContainer.style.display = 'none';
    }
}

function initDashboard() {
    const gridElement = document.getElementById('dashboardGrid');
    if (!gridElement) return;
    
    const dashboard = new Dashboard('dashboardGrid');
    
    dashboard.addWidget('subjects');
    dashboard.addWidget('authors');
    
    setupThemeToggle();
    
    const addBtn = document.getElementById('addWorksBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            dashboard.addWidget('works');
        });
    }
    
    const restoreBtn = document.getElementById('restoreWidgetsBtn');
    if (restoreBtn) {
        restoreBtn.addEventListener('click', () => {
            const hasSubjects = dashboard.widgets.some(w => w.title && w.title.includes('Книги по теме'));
            const hasAuthors = dashboard.widgets.some(w => w.title && w.title.includes('Авторы'));
            
            if (!hasSubjects) dashboard.addWidget('subjects');
            if (!hasAuthors) dashboard.addWidget('authors');
            
            updateRestoreButtonVisibility(dashboard);
        });
    }
    
    document.addEventListener('widget:close', () => {
        setTimeout(() => {
            updateRestoreButtonVisibility(dashboard);
        }, 100);
    });
    
    setTimeout(() => {
        updateRestoreButtonVisibility(dashboard);
    }, 500);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}