import HttpClient from "./HttpClient/HttpClient";

export default class BaseWidget {
    constructor(htmlTemplate, context) {
        this._htmlTemplate = htmlTemplate;
        this._htmlElement = null;
        this._context = context || {};
        this._isLoaded = false;
        this._bindings = {};

        const self = this;

        this._proxyContext = new Proxy(this._context, {
            set(target, prop, value) {
                const oldValue = target[prop];

                if (oldValue === value) {
                    return true;
                }

                if (self.onBeforeChange(prop, oldValue, value) === false) {
                    return true;
                }

                target[prop] = value;

                self._updateElement(prop, value);

                self.onChange(prop, oldValue, value);

                return true;
            }
        });
    }

    create(containerId) {
        this._htmlElement = document.getElementById(containerId);
        this._isLoaded = false;
        this._bindings = {};

        this._load().then(() => {
            this._bindModelElements();
            this._bindActions();
            this._updateAll();
            this.onInit();
        });
    }

    onInit() {

        /**
         * Have to be implemented
         */
    }

    onChange(property, oldValue, newValue) {
        return true;
    }

    onBeforeChange(property, oldValue, newValue) {
        return true;
    }

    _updateAll() {
        Object.keys(this._context).forEach((modelName) => {
            this._updateElement(modelName, this._context[modelName]);
        });
    }

    _updateElement(model, value) {
        const elementToUpdate = this._bindings[model] || null;

        if (elementToUpdate) {
            if (elementToUpdate.tagName === 'input') {
                elementToUpdate.value = value;
            } else {
                elementToUpdate.textContent = value;
            }
        }
    }

    _load() {
        if (this.isLoaded()) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            try {
                HttpClient.getRequest(this._htmlTemplate, {responseFormat: 'text'}).then((responseText) => {
                    this._template = responseText;
                    this._htmlElement.innerHTML = responseText;
                    this._isLoaded = true;
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    _bindModelElements() {
        Array.from(this._htmlElement.querySelectorAll('[model]')).forEach((element) => {
            const modelName = element.getAttribute('model');

            const tagName = element.tagName.toLowerCase();

            if (tagName === 'input') {
                element.addEventListener('input', () => {
                    this.setContextValue(modelName, element.value);
                });
            } else {
                this._bindings[modelName] = element;
            }
        });
    }

    _bindActions() {
        Array.from(this._htmlElement.querySelectorAll('[click]')).forEach((element) => {
            const handlerName = element.getAttribute('click');

            const handler = this[handlerName] || null;

            if (! handler) {
                //console.log('Unknown handler');
                return;
            }

            element.addEventListener('click', (event) => {
                handler.call(this, event);
            });
        });
    }

    isLoaded() {
        return this._isLoaded;
    }

    getContextValue(name) {
        return this._proxyContext[name] || null;
    }

    setContextValue(name, value) {
        this._proxyContext[name] = value;
    }

    getHtmlElement() {
        return this._htmlElement;
    }
}
