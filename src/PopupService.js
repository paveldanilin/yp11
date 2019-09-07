import {loadHtml} from "./helpers.js";
import Popup from "./Popup.js";

export default class PopupService {
    constructor() {
        this._popupMap = new Map();
    }

    load(containerId) {
        const popupMap = this._popupMap;

        if (this._popupMap.has(containerId)) {
            return new Promise((resolve) => resolve(popupMap.get(containerId)));
        }

        const containerElement = document.getElementById(containerId);

        if (containerElement) {
            const dataPopupTemplate = containerElement.getAttribute('data-popup-template');

            if (dataPopupTemplate === null) {
                throw new Error(`Not defined "data-popup-template" attribute at ${containerId}`);
            }

            return new Promise((resolve, reject) => {
                loadHtml(dataPopupTemplate, (HTML) => {
                    if (HTML) {
                        containerElement.innerHTML = HTML.documentElement.innerHTML;
                        const popupComponent = new Popup(containerElement);
                        popupMap.set(containerId, popupComponent);
                        resolve(popupComponent);
                    } else {
                        reject(new Error('Could not load Popup HTML template'));
                    }
                });
            });
        }

        return new Promise((resolve, reject) => reject(new Error(`Could not load popup with id ${containerId}`)));
    }
}
