import UIComponent from './UIComponent.js';
import SubjectsWidget from './SubjectsWidget.js';
import AuthorsWidget from './AuthorsWidget.js';
import WorksWidget from './WorksWidget.js';

export default class Dashboard {
    constructor(gridId) {
        console.log(`Dashboard constructor: ищем элемент с id "${gridId}"`);
        
        this.grid = document.getElementById(gridId);
        this.widgets = [];
        this.counter = 0;
        
        if (!this.grid) {
            console.error(`Dashboard ERROR: Элемент с id "${gridId}" не найден в DOM`);
            return;
        }
        
        console.log('Dashboard grid найден, инициализация...');
        this.setupDragAndDrop();
        
        document.addEventListener('widget:close', (e) => {
            this.removeWidget(e.detail.widgetId);
        });
    }
    
    setupDragAndDrop() {
        if (!this.grid) return;
        
        let dragged = null;
        
        this.grid.addEventListener('dragstart', (e) => {
            const widget = e.target.closest('.widget');
            if (widget) {
                dragged = widget;
                widget.style.opacity = '0.5';
                widget.style.transform = 'scale(0.98)';
            }
        });
        
        this.grid.addEventListener('dragend', (e) => {
            const widget = e.target.closest('.widget');
            if (widget) {
                widget.style.opacity = '1';
                widget.style.transform = 'scale(1)';
            }
            dragged = null;
        });
        
        this.grid.addEventListener('dragover', (e) => e.preventDefault());
        
        this.grid.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!dragged) return;
            
            const target = e.target.closest('.widget');
            if (!target || target === dragged) return;
            
            const children = [...this.grid.children];
            const draggedIdx = children.indexOf(dragged);
            const targetIdx = children.indexOf(target);
            
            if (draggedIdx < targetIdx) {
                this.grid.insertBefore(dragged, target.nextSibling);
            } else {
                this.grid.insertBefore(dragged, target);
            }
        });
    }
    
    addWidget(type) {
        if (!this.grid) {
            console.error('Dashboard.addWidget: grid не инициализирован');
            return;
        }
        
        let widget;
        this.counter++;
        
        switch(type) {
            case 'subjects':
                widget = new SubjectsWidget({ title: `Книги по теме ${this.counter}` });
                break;
            case 'authors':
                widget = new AuthorsWidget({ title: `Авторы ${this.counter}` });
                break;
            case 'works':
                widget = new WorksWidget({ title: `Произведения ${this.counter}` });
                break;
            default:
                console.error(`Неизвестный тип виджета: ${type}`);
                return;
        }
        
        console.log(`Добавляем виджет типа ${type}`);
        const element = widget.render();
        this.grid.appendChild(element);
        this.widgets.push(widget);
        
        // Появление виджета
        document.dispatchEvent(new CustomEvent('widget:add'));
        
        return widget;
    }
    
    removeWidget(id) {
        const index = this.widgets.findIndex(w => w.id === id);
        if (index !== -1) {
            const widgetTitle = this.widgets[index].title;
            this.widgets[index].destroy();
            this.widgets.splice(index, 1);
            console.log(`Виджет удален: ${widgetTitle}`);
        }
    }
    
    getWidgetsCount() {
        return this.widgets.length;
    }
}