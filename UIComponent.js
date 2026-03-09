export default class UIComponent {
    constructor(config = {}) {
        if (new.target === UIComponent) {
            throw new Error('UIComponent is abstract');
        }
        
        this.id = config.id || `widget-${Date.now()}-${Math.random()}`;
        this.title = config.title || 'Виджет';
        this.element = null;
        this.isMinimized = false;
        this.listeners = [];
    }
    
    createBaseElement() {
        const widget = document.createElement('div');
        widget.className = 'widget';
        widget.dataset.widgetId = this.id;
        widget.draggable = true;
        
        const header = document.createElement('div');
        header.className = 'widget-header';
        
        const title = document.createElement('h3');
        title.className = 'widget-title';
        title.textContent = this.title;
        
        const controls = document.createElement('div');
        controls.className = 'widget-controls';
        
        const minimizeBtn = document.createElement('button');
        minimizeBtn.className = 'widget-btn minimize-btn';
        minimizeBtn.textContent = '−';
        this.addEvent(minimizeBtn, 'click', (e) => this.toggleMinimize(e));
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'widget-btn close-btn';
        closeBtn.textContent = '×';
        this.addEvent(closeBtn, 'click', (e) => this.close(e));
        
        controls.appendChild(minimizeBtn);
        controls.appendChild(closeBtn);
        
        header.appendChild(title);
        header.appendChild(controls);
        
        const content = document.createElement('div');
        content.className = 'widget-content';
        
        widget.appendChild(header);
        widget.appendChild(content);
        
        return { widget, content };
    }
    
    render() {
        throw new Error('Implement render()');
    }
    
    destroy() {
        this.listeners.forEach(({el, type, handler}) => 
            el.removeEventListener(type, handler));
        if (this.element?.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
    
    toggleMinimize(e) {
        e.preventDefault();
        this.isMinimized = !this.isMinimized;
        const content = this.element.querySelector('.widget-content');
        const btn = this.element.querySelector('.minimize-btn');
        
        if (content) {
            content.style.display = this.isMinimized ? 'none' : 'block';
            btn.textContent = this.isMinimized ? '+' : '−';
        }
    }
    
    close(e) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('widget:close', {
            detail: { widgetId: this.id }
        }));
    }
    
    addEvent(el, type, handler) {
        el.addEventListener(type, handler);
        this.listeners.push({ el, type, handler });
    }
}