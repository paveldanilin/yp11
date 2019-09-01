// import {loadHtml} from "./helpers.js";
import HttpClient from "./HttpClient/HttpClient";

export default class BaseWidget
{
    constructor(htmlTemplate, context)
    {
        this._htmlTemplate = htmlTemplate;
        this._htmlElement = null;
        this._context = context || {};
        this._isLoaded = false;
        this._bindings = {};

        const widget = this;
        // Зачем при передаче параметров в Proxy вы добавляете условия, присваиваете переменные и так далее
        this._proxyContext = new Proxy(this._context, {
            set(target, prop, value) {
                const oldValue = target[prop];

                if (oldValue === value) {
                    return true;
                }

                if (widget.onBeforeChange(prop, oldValue, value) === false) {
                    return true;
                }

                target[prop] = value;

                widget._updateElement(prop, value);

                widget.onChange(prop, oldValue, value);

                return true;
            }
        });
    }

    create(containerId)
    {
        this._htmlElement = document.getElementById(containerId);
        this._isLoaded = false;
        this._bindings = {};

        const widget = this;

        this._load().then(() => {
            widget._bindModelElements();
            widget._bindActions();
            widget._updateAll();
            widget.onInit();
        });
    }

    onInit()
    {
    }

    onChange(property, oldValue, newValue)
    {
        return true;
    }

    onBeforeChange(property, oldValue, newValue)
    {
        return true;
    }

    _updateAll()
    {
        const self = this;
        Object.keys(this._context).forEach(function(modelName) {
            self._updateElement(modelName, self._context[modelName]);
        });
    }

    _updateElement(model, value)
    {
        const elementToUpdate = this._bindings[model] || null;

        if (elementToUpdate) {
            if (elementToUpdate.tagName === 'input') {
                elementToUpdate.value = value;
            } else {
                elementToUpdate.textContent = value;
            }
        }
    }

    _load()
    {
        if (this.isLoaded()) {
            return Promise.resolve();
        }

        const widget = this;

        return new Promise(function(resolve, reject) {
            try {
                HttpClient.getRequest(widget._htmlTemplate, {responseFormat: 'text'}).then((responseText) => {
                    //console.log(responseText);
                    widget._template = responseText;
                    widget._htmlElement.innerHTML = responseText;
                    widget._isLoaded = true;
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    _bindModelElements()
    {
        const self = this;

        Array.from(this._htmlElement.querySelectorAll('[model]')).forEach(function (element) {
            const modelName = element.getAttribute('model');

            const tagName = element.tagName.toLowerCase();

            if (tagName === 'input') {
                // console.log('out');
                element.addEventListener('input', function() {
                    self.setContextValue(modelName, element.value);
                });
            } else {
                // console.log('in');
                self._bindings[modelName] = element;
            }
        });


        // console.log(this._bindings);
    }

    _bindActions()
    {
        const self = this;

        Array.from(this._htmlElement.querySelectorAll('[click]')).forEach(function(element) {
            const handlerName = element.getAttribute('click');

            const handler = self[handlerName] || null;

            if (! handler) {
                console.log('Unknown handler');
            }

            element.addEventListener('click', function(event) {
                handler.call(self, event);
            });
        });
    }

    /*
    render(context)
    {
        if (this.isLoaded() && this._template && this._htmlElement) {
            const preparedContext = {};

            Object.keys(context).forEach(function(key) {
                preparedContext['%' + key + '%'] = context[key];
            });

            this._htmlElement.innerHTML = this._template.replace(/%\w+%/g, function(all) {
                return preparedContext[all] || all;
            });
        }
    }
    */

    isLoaded()
    {
        return this._isLoaded;
    }

    getContextValue(name)
    {
        return this._proxyContext[name] || null;
    }

    setContextValue(name, value)
    {
        this._proxyContext[name] = value;
    }

    getHtmlElement()
    {
        return this._htmlElement;
    }
}
