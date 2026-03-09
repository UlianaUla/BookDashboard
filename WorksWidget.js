import UIComponent from './UIComponent.js';

export default class WorksWidget extends UIComponent {
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
        input.placeholder = '📖 Введите название книги...';
        input.value = 'lord of the rings';
        
        const btn = document.createElement('button');
        btn.className = 'works-btn';
        btn.textContent = 'Найти книгу';
        
        form.appendChild(input);
        form.appendChild(btn);
        
        const results = document.createElement('div');
        results.className = 'works-results';
        
        content.appendChild(form);
        content.appendChild(results);
        
        this.addEvent(btn, 'click', () => this.search(input.value, results));
        this.addEvent(input, 'keypress', (e) => {
            if (e.key === 'Enter') this.search(input.value, results);
        });
        
        this.search('lord of the rings', results);
        
        this.element = widget;
        return widget;
    }
    
    async search(query, container) {
        if (!query) {
            container.innerHTML = '<div class="error">✗ Введите название</div>';
            return;
        }
        
        container.innerHTML = '<div class="loader">⋯ Поиск ⋯</div>';
        
        try {
            const response = await fetch(
                `${this.apiUrl}/search.json?q=${query}&limit=3`,
                { headers: { 'User-Agent': 'DashboardApp' } }
            );
            
            if (!response.ok) throw new Error('Ошибка');
            
            const data = await response.json();
            
            if (data.docs?.length) {
                this.display(data.docs, container);
            } else {
                container.innerHTML = '<div class="no-results">✗ Не найдено</div>';
            }
        } catch (error) {
            container.innerHTML = '<div class="error">✗ Ошибка</div>';
        }
    }
    
    display(works, container) {
        const list = document.createElement('div');
        
        works.forEach(work => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const title = document.createElement('div');
            title.className = 'card-title';
            title.textContent = work.title;
            
            const author = document.createElement('div');
            author.className = 'card-author';
            author.textContent = work.author_name?.join(', ') || 'Неизвестный автор';
            
            card.appendChild(title);
            card.appendChild(author);
            
            if (work.first_publish_year) {
                const year = document.createElement('div');
                year.style.fontSize = '16px';
                year.style.color = '#a17f6b';
                year.style.marginTop = '5px';
                year.textContent = `📅 ${work.first_publish_year}`;
                card.appendChild(year);
            }
            
            list.appendChild(card);
        });
        
        container.innerHTML = '';
        container.appendChild(list);
    }
}