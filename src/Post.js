export default class Post {
    constructor(id, body, title, userId) {
        this._id = id;
        this._body = body;
        this._title = title;
        this._userId = userId;
    }

    render() {
        const container = document.createElement('div');
        container.style.border = '1px solid red';

        const id = document.createElement('div');
        id.textContent = this._id;
        id.style.color = 'yellow';

        const title = document.createElement('div');
        title.textContent = this._title;
        title.style.color = 'white';

        const body = document.createElement('div');
        body.textContent = this._body;
        body.style.color = 'green';

        container.appendChild(id);
        container.appendChild(title);
        container.appendChild(body);

        return container;
    }

    static factory(data) {
        return new Post(data.id, data.body, data.title, data.userId);
    }
}
