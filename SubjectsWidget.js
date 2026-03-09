import UIComponent from './UIComponent.js';

export default class SubjectsWidget extends UIComponent {
    constructor(config) {
        super(config);
        this.apiUrl = 'https://openlibrary.org';
    }
    
    render() {
        const { widget, content } = this.createBaseElement();
        
        const form = document.createElement('div');
        form.className = 'search-form';
        
        const input = document.createElement('input');
        input.className = 'search-input';
        input.placeholder = '🔍 Введите тему (science, love...)';
        input.value = 'science';
        
        const btn = document.createElement('button');
        btn.className = 'subjects-btn';
        btn.textContent = 'Найти книги';
        
        form.appendChild(input);
        form.appendChild(btn);
        
        const results = document.createElement('div');
        results.className = 'subjects-results';
        
        content.appendChild(form);
        content.appendChild(results);
        
        this.addEvent(btn, 'click', () => this.search(input.value, results));
        this.addEvent(input, 'keypress', (e) => {
            if (e.key === 'Enter') this.search(input.value, results);
        });
        
        this.search('science', results);
        
        this.element = widget;
        return widget;
    }
    
    async search(query, container) {
        if (!query) {
            container.innerHTML = '<div class="error">✗ Введите тему</div>';
            return;
        }
        
        container.innerHTML = '<div class="loader">⋯ Загрузка ⋯</div>';
        
        try {
            const response = await fetch(
                `${this.apiUrl}/subjects/${query}.json?limit=5`,
                { headers: { 'User-Agent': 'DashboardApp' } }
            );
            
            if (!response.ok) throw new Error('Ошибка');
            
            const data = await response.json();
            
            if (data.works?.length) {
                this.display(data.works, query, container);
            } else {
                container.innerHTML = '<div class="no-results">✗ Ничего не найдено</div>';
            }
        } catch (error) {
            container.innerHTML = '<div class="error">✗ Ошибка загрузки</div>';
        }
    }
    
    display(works, subject, container) {
        const list = document.createElement('div');
        
        const card = document.createElement('div');
        card.className = 'card';
        
        const title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = `📌 ${subject}`;
        card.appendChild(title);
        
        works.slice(0, 5).forEach(work => {
            const item = document.createElement('div');
            item.className = 'card-item';
            
            const workTitle = document.createElement('div');
            workTitle.style.fontWeight = '700';
            workTitle.style.fontSize = '20px';
            workTitle.textContent = work.title;
            
            const author = document.createElement('div');
            author.className = 'card-author';
            author.textContent = work.authors?.[0]?.name || 'Неизвестный автор';
            
            item.appendChild(workTitle);
            item.appendChild(author);
            card.appendChild(item);
        });
        
        list.appendChild(card);
        container.innerHTML = '';
        container.appendChild(list);
    }
}