import UIComponent from './UIComponent.js';

export default class AuthorsWidget extends UIComponent {
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
        input.placeholder = ' Введите имя автора (...)';
        input.value = 'tolkien';
        
        const btn = document.createElement('button');
        btn.className = 'authors-btn';
        btn.textContent = 'Найти автора';
        
        form.appendChild(input);
        form.appendChild(btn);
        
        const results = document.createElement('div');
        results.className = 'authors-results';
        
        content.appendChild(form);
        content.appendChild(results);
        
        this.addEvent(btn, 'click', () => this.search(input.value, results));
        this.addEvent(input, 'keypress', (e) => {
            if (e.key === 'Enter') this.search(input.value, results);
        });
        
        this.search('tolkien', results);
        
        this.element = widget;
        return widget;
    }
    
    async search(query, container) {
        if (!query) {
            container.innerHTML = '<div class="error">✗ Введите имя</div>';
            return;
        }
        
        container.innerHTML = '<div class="loader">⋯ Поиск ⋯</div>';
        
        try {
            const response = await fetch(
                `${this.apiUrl}/search/authors.json?q=${query}&limit=2`,
                { headers: { 'User-Agent': 'DashboardApp' } }
            );
            
            if (!response.ok) throw new Error('Ошибка');
            
            const data = await response.json();
            
            if (data.docs?.length) {
                const authors = await Promise.all(
                    data.docs.map(a => this.getAuthor(a.key))
                );
                this.display(authors.filter(Boolean), container);
            } else {
                container.innerHTML = '<div class="no-results">✗ Не найдено</div>';
            }
        } catch (error) {
            container.innerHTML = '<div class="error">✗ Ошибка</div>';
        }
    }
    
    async getAuthor(key) {
        try {
            const res = await fetch(`${this.apiUrl}${key}.json`, {
                headers: { 'User-Agent': 'DashboardApp' }
            });
            return res.ok ? await res.json() : null;
        } catch {
            return null;
        }
    }
    
    display(authors, container) {
        const list = document.createElement('div');
        
        authors.forEach(author => {
            if (!author) return;
            
            const card = document.createElement('div');
            card.className = 'card';
            
            const name = document.createElement('div');
            name.className = 'card-title';
            name.textContent = author.name;
            
            const bio = document.createElement('div');
            bio.className = 'card-author';
            bio.textContent = author.bio?.substring?.(0, 100) + '...' || ' Нет биографии';
            
            card.appendChild(name);
            card.appendChild(bio);
            list.appendChild(card);
        });
        
        container.innerHTML = '';
        container.appendChild(list);
    }
}