import Card from "./Card.js";

export default class CardCollection
{
    constructor(containerId, cards)
    {
        this._htmlContainerElement = document.getElementById(containerId);
        this._collection = [];

        if (cards) {
            cards.forEach(function (card) {
                add(card);
            });
        }
    }

    add(card)
    {
        if (card instanceof Card) {
            if (this.has(card) === false) {
                const self = this;
                card.onDelete = function (card) {
                    self.remove(card);
                };
                this._collection.push(card);
            }
        } else {
            throw new Error('Expected an instance of Card');
        }
    }

    remove(card)
    {
        const cardIndex = this.findIndexOf(card);

        if (cardIndex >= 0) {
            this._collection.splice(cardIndex, 1);
            return true;
        }

        return false;
    }

    has(card)
    {
        return this.findIndexOf(card) >= 0;
    }

    render()
    {
        const htmlElement = this._htmlContainerElement;

        while (htmlElement.firstChild) {
            htmlElement.removeChild(htmlElement.firstChild);
        }

        this._collection.forEach(function (card) {
            htmlElement.appendChild(card.render());
        });
    }

    findIndexOf(card)
    {
        if (card instanceof Card) {
            return this._collection.findIndex(function (item, index, array) {
                return card.getId() === item.getId();
            });
        }

        return -1;
    }
}
