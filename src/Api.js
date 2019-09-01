import HttpClient from "./HttpClient/HttpClient";
import HttpRequest from "./HttpClient/HttpRequest";
import Post from "./Post";

export default class Api {
    constructor({baseUrl, token}) {
        if (token === null) {
            throw new Error('Not defined API token option');
        }

        this._httpClient = new HttpClient({
            baseUrl: baseUrl || '',
            mode: HttpRequest.MODE_CORS,
            responseFormat: 'json',
            headers: {
                authorization: token
            }
        });
    }

    getUserProfile() {
        const self = this;

        return new Promise(function(resolve, reject) {
            try {
                self._httpClient.fetch('/users/me').then((userData) => {
                    resolve(userData);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    updateUserProfile(profile) {
        const self = this;

        return new Promise(function(resolve, reject) {
            try {
                self._httpClient.patch('/users/me', {
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: profile.name,
                        about: profile.about
                    })
                    /**
                     * Можно улучшить
                     *
                     * Запись легко сократить до { name, about }
                     * если получить из объекта профиля с помощью деструктуризации
                     * объекта https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
                     */
                }).then((userData) => {
                    resolve(userData);
                })
            } catch (e) {
                reject(e);
            }
        });
    }

    getInitialCards() {
        const self = this;

        return new Promise(function(resolve, reject) {
            try {
                self._httpClient.fetch('/cards').then((cardsData) => {
                    resolve(cardsData);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    addCard(card) {
        const self = this;

        return new Promise(function(resolve, reject) {
            try {
                self._httpClient.post('/cards', {
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(card)
                }).then((addedCard) => {
                    resolve(addedCard);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    deleteCard(id) {
        const self = this;

        return new Promise((resolve, reject) => {
            try {
                self._httpClient.delete('/cards/' + id).then(() => resolve());
                // можно улучшить - удобнее использовать шаблонные строки
                // `/cards/${id}` вместо конкатенации, особенно если параметров несколько
            } catch (e) {
                reject(e);
            }
        });
    }

    likeCard(id) {
        const self = this;

        return new Promise((resolve, reject) => {
            try {
                self._httpClient.put('/cards/like/' + id).then((card) => resolve(card));
            } catch (e) {
                reject(e);
            }
        });
    }

    dislikeCard(id) {
        const self = this;

        return new Promise((resolve, reject) => {
            try {
                self._httpClient.delete('/cards/like/' + id).then((card) => resolve(card));
            } catch (e) {
                reject(e);
            }
        });
    }

    getPosts() {
        const self = this;
       return new Promise(
           function (resolve, reject) {
               try {
                   self._httpClient.fetch('/posts').then((data) => {
                       resolve(data.map(function (postData) {
                           return Post.factory(postData);
                       }));
                   });
               } catch (e) {
                   reject(e);
               }
           }
       );
    }
}
