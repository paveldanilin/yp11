import {loadHtml} from "./helpers.js";
import Popup from "./Popup.js";

export default class PopupService
{
    constructor()
    {
        this._popupMap = new Map();
    }

    load(containerId)
    {
        const popupMap = this._popupMap;

        if (this._popupMap.has(containerId)) {
            return new Promise(function(resolve, reject) {
                return resolve(popupMap.get(containerId));
            });
        }

        const containerElement = document.getElementById(containerId);

        if (containerElement) {
            const dataPopupTemplate = containerElement.getAttribute('data-popup-template');

            if (dataPopupTemplate === null) {
                throw new Error('Not defined "data-popup-template" attribute at "' + containerId + '"');
            }

            return new Promise(function (resolve, reject) {
                loadHtml(dataPopupTemplate, function(HTML) {
                    if (HTML) {
                        containerElement.innerHTML = HTML.documentElement.innerHTML;
                        const popupComponent = new Popup(containerElement);
                        popupMap.set(containerId, popupComponent);
                        resolve(popupComponent);
                    } else {
                        // А если сервер пришлёт 500
                        reject(new Error('Could not load Popup HTML template'));
                    }
                });
            });
        }

        return new Promise(function(resolve, reject) {
            return reject(new Error('Could not load popup with id "' + containerId + '"'));
        });
    }
}
