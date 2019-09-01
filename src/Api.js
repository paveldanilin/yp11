import HttpClient from "./HttpClient/HttpClient";
import HttpRequest from "./HttpClient/HttpRequest";
import Post from "./Post";

export default class Api
{
    constructor(options)
    /**
     * Можно улучшить
     * 
     * Передаваемые параметры лучше записывать в параметры класса работы с Api
     * нам точно нужен адрес и токен, укажем на это в конструкторе и получим
     * ключи для более простого обращения constructor({baseUrl, token})
     */
    {
        const token = options.token || null;
        // const { baseUrl, token } = options 
        // будет аналогично получению в constructor({ baseUrl, token })

        if (token === null) {
            throw new Error('Not defined API token option');
        }

        this._httpClient = new HttpClient({
            baseUrl: options.baseUrl || '',
            mode: HttpRequest.MODE_CORS,
            responseFormat: 'json',
            headers: {
                authorization: token
            }
            /**
             * Отличная реализация клиента для запросов
             */
        });
    }

    getUserProfile()
    {
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

    updateUserProfile(profile)
    {
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

    getInitialCards()
    {
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

    addCard(card)
    {
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

    deleteCard(id)
    {
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

    likeCard(id)
    {
        const self = this;

        return new Promise((resolve, reject) => {
            try {
                self._httpClient.put('/cards/like/' + id).then((card) => resolve(card));
            } catch (e) {
                reject(e);
            }
        });
    }

    dislikeCard(id)
    {
        const self = this;

        return new Promise((resolve, reject) => {
            try {
                self._httpClient.delete('/cards/like/' + id).then((card) => resolve(card));
            } catch (e) {
                reject(e);
            }
        });
    }

    getPosts()
    {
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

    // другие методы работы с API
}

/**
 * Отличная работа
 * 
 * Выполнен базовый и дополнительный функционал задания.
 * Можно добавить, удалить карточку и поставить лайк.
 */

 /**
 * Обратить внимание:
 * 
 * Чтобы упростить запуск проекта стоит добавить зависимость
 * npm i --save-dev webpack-dev-server
 * 
 * и скрипт запуска в package.json
 * "dev": "webpack-dev-server --config webpack.config.js --progress"
 */