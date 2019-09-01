export default class Popup
{
    constructor(htmlContainerElement)
    {
        this._htmlContainerElement = htmlContainerElement;
        this._cssClassIsOpen = 'popup_is-opened';
        this._isOpened = false;

        const popup = this;

        // CLOSE
        this._closeButton = this._htmlContainerElement.querySelector('[data-popup-close]');

        if (this._closeButton) {
            this._closeButton.addEventListener('click', () => {
                this.close();
                if (popup._onCancel) {
                    popup._onCancel();
                }
            });
        }

        // OK
        this._okButton = this._htmlContainerElement.querySelector('[data-popup-ok]');

        if (this._okButton) {
            //const dataHandler = this._okButton.getAttribute('data-popup-ok');

            // const popup = this;
            const htmlElement = this._htmlContainerElement;

            this._okButton.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();

                // TODO: move to method from constructor
                const forms = htmlElement.getElementsByTagName('form');

                let inputs = {};

                Array.from(forms).forEach(function (form) {
                    const formName = form.getAttribute('name');

                    inputs[formName] = {};

                    inputs[formName]['_isValid'] = form.checkValidity();
                    inputs[formName]['_htmlElement'] = form;
                    inputs[formName]['_validity'] = {};

                    Array.from(form.getElementsByTagName('input')).forEach(function (input) {
                        inputs[formName][input.name] = input.value;
                        inputs[formName]['_validity'][input.name] = input.validity;
                    })
                });

                if (popup._onOk) {

                    const popupResult = popup._onOk(inputs);

                    if (popupResult instanceof Promise) {
                        popupResult.then((result) => {
                            if (result) {
                                popup.close();
                            }
                        });
                    } else if (popupResult === true) {
                        popup.close();
                    }
                }

                /*
                if (typeof window[dataHandler] === 'function') {
                    if (window[dataHandler](inputs) === true) {
                        popup.close();
                    }
                }*/
            });
        }

        // ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && popup.isOpened()) {
                popup.close();
                if (popup._onCancel) {
                    popup._onCancel();
                }
            }
        });
    }

    set onCancel(callback)
    {
        this._onCancel = callback;
    }

    set onOk(callback)
    {
        this._onOk = callback;
    }

    open()
    {
        if (this._htmlContainerElement && ! this._htmlContainerElement.classList.contains(this._cssClassIsOpen)) {
            this._htmlContainerElement.classList.add(this._cssClassIsOpen);
            Array.from(this._htmlContainerElement.getElementsByTagName('form')).forEach((form) => form.reset());
            this._isOpened = true;
        }
    }

    close()
    {
        if (this._htmlContainerElement && this._htmlContainerElement.classList.contains(this._cssClassIsOpen)) {
            this._htmlContainerElement.classList.remove(this._cssClassIsOpen);
            this._isOpened = false;
        }
    }

    isOpened()
    {
        return this._isOpened;
    }

    getHtmlElement()
    {
        return this._htmlContainerElement;
    }
}
