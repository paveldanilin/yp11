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
        return new Promise((resolve, reject) => {
            try {
                this._httpClient.fetch('/users/me').then((userData) => {
                    resolve(userData);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    updateUserProfile({name, about}) {
        return new Promise((resolve, reject) => {
            try {
                this._httpClient.patch('/users/me', {
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({name, about})
                }).then((userData) => {
                    resolve(userData);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    getInitialCards() {
        return new Promise((resolve, reject) => {
            try {
                this._httpClient.fetch('/cards').then((cardsData) => {
                    resolve(cardsData);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    addCard(card) {
        return new Promise((resolve, reject) => {
            try {
                this._httpClient.post('/cards', {
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
        return new Promise((resolve, reject) => {
            try {
                this._httpClient.delete(`/cards/${id}`).then(() => resolve());
            } catch (e) {
                reject(e);
            }
        });
    }

    likeCard(id) {
        return new Promise((resolve, reject) => {
            try {
                this._httpClient.put(`/cards/like/${id}`).then((card) => resolve(card));
            } catch (e) {
                reject(e);
            }
        });
    }

    dislikeCard(id) {
        return new Promise((resolve, reject) => {
            try {
                this._httpClient.delete(`/cards/like/${id}`).then((card) => resolve(card));
            } catch (e) {
                reject(e);
            }
        });
    }

    getPosts() {
       return new Promise((resolve, reject) => {
           try {
               this._httpClient.fetch('/posts').then((data) => {
                   resolve(data.map((postData) => Post.factory(postData)));
               });
           } catch (e) {
               reject(e);
           }
       });
    }
}
