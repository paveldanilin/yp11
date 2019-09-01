import HtmlRenderer from './HtmlRenderer.js';
import PopupService from './PopupService.js';
import {random} from './helpers.js';

export default class Card
{
    constructor(title, imageUrl, likes, deletable)
    {
        this.title    = title;
        this.imageUrl = imageUrl;
        this._likes = likes || [];
        this._deletable = deletable || false;
        this._owner = null;

        this._pforileId = null;

        this._onDelete = [];
        this._onLike = [];
        this._onDislike = [];
    }

    setPopupService(popupService)
    {
        if (popupService instanceof PopupService) {
            this._popupService = popupService;
        } else {
            throw new Error('Expected PopupService');
        }
    }

    set profileId(pid)
    {
        this._pforileId = pid;
    }

    set onDelete(newValue)
    {
        if (newValue === null || typeof newValue === 'function') {
            this._onDelete.push(newValue);
        }
    }
    // Очень много геттеров и сеттеров
    get onDelete()
    {
        return this._onDelete;
    }

    set onLike(func)
    {
        this._onLike.push(func);
    }

    set onDislike(func)
    {
        this._onDislike.push(func);
    }

    set cssClassCad(newValue)
    {
        this._cssClassCard = newValue;
    }

    get cssClassCard()
    {
        return this._cssClassCard || 'place-card';
    }

    set cssClassDeleteIcon(newValue)
    {
        this._cssClassDeleteIcon = newValue;
    }

    get cssClassDeleteIcon()
    {
        return this._cssClassDeleteIcon || 'place-card__delete-icon';
    }

    set cssClassCardImage(newValue)
    {
        this._cssClassCardImage = newValue;
    }

    get cssClassCardImage()
    {
        return this._cssClassCardImage || 'place-card__image';
    }

    set cssClassCardName(newValue)
    {
        this._cssClassCardName = newValue;
    }

    get cssClassCardName()
    {
        return this._cssClassCardName || 'place-card__name';
    }

    set cssClassLikeIcon(newValue)
    {
        this._cssClassLikeIcon = newValue;
    }

    get cssClassLikeIcon()
    {
        return this._cssClassLikeIcon || 'place-card__like-icon';
    }

    set cssClassLikedIcon(newValue)
    {
        this._cssClassLikedIcon = newValue;
    }

    get cssClassLikedIcon()
    {
        return this._cssClassLikedIcon || 'place-card__like-icon_liked';
    }

    set cssClassCardDescription(newValue)
    {
        this._cssClassCardDescription = newValue;
    }

    get cssClassCardDescription()
    {
        return this._cssClassCardDescription || 'place-card__description';
    }

    set id(id)
    {
        this._id = id;
    }

    get id()
    {
        return this._id;
    }

    set likes(likes)
    {
        this._likes = likes;

        document.getElementById(this.getLikesCountId()).textContent = this._likes.length.toString();
    }

    set owner(owner)
    {
        this._owner = owner;
    }

    set title(newValue)
    {
        const type = typeof newValue;

        if (type !== 'string') {
            throw Error('"title" must be non empty string, but supplied "' + type + '"');
        }

        const trimmedString = newValue.trim();

        if (trimmedString.length === 0) {
            throw Error('"title" must be non empty string');
        }

        this._title = trimmedString;

        if (this._cardHTMLElement) {
            const titleElement = document.getElementById(this.getTitleId());

            if (titleElement) {
                titleElement.textContent = this._title;
            }
        }
    }

    get title()
    {
        return this._title;
    }

    set imageUrl(newValue)
    {
        const type = typeof newValue;

        if (type !== 'string') {
            throw Error('"imageUrl" must be non empty string, but supplied "' + type + '"');
        }

        const trimmedString = newValue.trim();

        if (trimmedString.length === 0) {
            throw Error('"imageUrl" must be non empty string');
        }

        this._imageUrl = trimmedString;

        if (this._cardHTMLElement) {
            const bgImageElement = document.getElementById(this.getBackgroundId());

            if (bgImageElement) {
                bgImageElement.style.backgroundImage = `url(${this._imageUrl})`;
            }
        }
    }

    get imageUrl()
    {
        return this._imageUrl;
    }

    like()
    { 
        if (this._cardHTMLElement) {
            // очень сложно читать этот участок кода. Нет понимания 
            const self = this;
            const likeElement = document.getElementById(this.getLikeIconId());

            if (likeElement) {
                if (likeElement.classList.toggle(this.cssClassLikedIcon)) {
                    this._onLike.forEach((f) => {
                        f(self);
                    });
                } else {
                    this._onDislike.forEach((f) => {
                        f(self);
                    });
                }
            }
        }
    }

    delete(e)
    {
        if (this._cardHTMLElement) {

            let skip = false;

            for(let i = 0 ; i < this._onDelete.length; i++) {
                const onDeleteFunc = this._onDelete[i];

                if (onDeleteFunc(this) === false) {
                    skip = true;
                    break;
                }
            }

            if (skip) {
                e.stopPropagation();
                return;
            }

            this._cardHTMLElement.remove();
            this._cardHTMLElement = undefined;
        }
    }

    zoom()
    {
        if (this._cardHTMLElement) {
            this._popupService.load('image-zoom-popup').then((popup) => {
                popup.open();

                document.getElementById('card-image').src = this._imageUrl;
            });
        }
    }

    render()
    {
        let likesCount = this._likes.length;

        let imgChildren = [];

        if (this._deletable) {
            imgChildren.push( {
                element: 'button',
                classList: [this.cssClassDeleteIcon],
                on: {
                    click: (e) => this.delete(e)
                }
            });
        }

        let likeIcon = [this.cssClassLikeIcon];
        // Это надо выносить в отдельный метод
        for(let i = 0 ;i < this._likes.length; i++) {
            const likeOwner = this._likes[i];

            if (likeOwner._id === this._pforileId) {
                likeIcon.push(this.cssClassLikedIcon);
                break;
            }
        }
        // Это надо выносить в отдельный метод
        const elements = [
            {
                id: this.getBackgroundId(),
                element: 'div',
                classList: [this.cssClassCardImage],
                style: {
                    backgroundImage: `url(${this._imageUrl})`,
                    cursor: 'pointer'
                },
                on: {
                    click: () => this.zoom()
                },
                children: imgChildren
            },
            {
                element: 'div',
                classList: [this.cssClassCardDescription],
                children: [
                    {
                        id: this.getTitleId(),
                        element: 'h3',
                        classList: [this.cssClassCardName],
                        textContent: this._title
                    },
                    {
                        element: 'span',
                        classList: [],
                        style: {
                            'grid-template-column': '1fr',
                            'grid-row-gap': '3px',
                            display: 'grid'
                        },
                        children: [
                            {
                                id: this.getLikeIconId(),
                                element: 'button',
                                classList: likeIcon,
                                on: {
                                    click: () => this.like()
                                }
                            },
                            {
                                id: this.getLikesCountId(),
                                element: 'span',
                                classList: ['place-card__like-count'],
                                textContent: likesCount.toString()
                            }
                        ]
                    }
                ]
            }
        ];

        // TODO: use BaseWidget instead
        this._cardHTMLElement = HtmlRenderer.render({
            id: this.getId(),
            element: 'div',
            classList: [this.cssClassCard],
            children: elements
        });

        return this._cardHTMLElement;
    }

    getLikesCountId()
    {
        return this.getId() + '_likes-count';
    }

    getId()
    {
        if (! this._cardId) {
            this._cardId = this.generateId('card');
        }

        return this._cardId;
    }

    getLikeIconId()
    {
        if (! this._likeElementId) {
            this._likeElementId = this.generateId('like');
        }

        return this._likeElementId;
    }

    getTitleId()
    {
        if (! this._titleId) {
            this._titleId = this.generateId('title');
        }

        return this._titleId;
    }

    getBackgroundId()
    {
        if (! this._backgroundId) {
            this._backgroundId = this.generateId('background');
        }

        return this._backgroundId;
    }

    generateId(salt)
    {
        return this._title + '_' + random(0, 100000) + '_' + salt;
    }
}
