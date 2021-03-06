export default class Popup {
    constructor(htmlContainerElement) {
        this._htmlContainerElement = htmlContainerElement;
        this._cssClassIsOpen = 'popup_is-opened';
        this._isOpened = false;

        this._initCloseButton();
        this._initOkButton();
        this._closeOnEsc();
    }

    set onCancel(callback) {
        this._onCancel = callback;
    }

    set onOk(callback) {
        this._onOk = callback;
    }

    open() {
        if (this._htmlContainerElement && ! this._htmlContainerElement.classList.contains(this._cssClassIsOpen)) {
            this._htmlContainerElement.classList.add(this._cssClassIsOpen);
            Array.from(this._htmlContainerElement.getElementsByTagName('form')).forEach((form) => form.reset());
            this._isOpened = true;
        }
    }

    close() {
        if (this._htmlContainerElement && this._htmlContainerElement.classList.contains(this._cssClassIsOpen)) {
            this._htmlContainerElement.classList.remove(this._cssClassIsOpen);
            this._isOpened = false;
        }
    }

    isOpened() {
        return this._isOpened;
    }

    getHtmlElement() {
        return this._htmlContainerElement;
    }

    _onCloseHandler() {
        this.close();
        if (this._onCancel) {
            this._onCancel();
        }
    }

    _initCloseButton() {
        this._closeButton = this._htmlContainerElement.querySelector('[data-popup-close]');

        if (! this._closeButton) {
            return;
        }

        this._closeButton.addEventListener('click', () => this._onCloseHandler());
    }

    _onOkHandler(event) {
        event.preventDefault();
        event.stopPropagation();

        const forms = this._htmlContainerElement.getElementsByTagName('form');

        let inputs = {};

        Array.from(forms).forEach((form) => {
            const formName = form.getAttribute('name');

            inputs[formName] = {};

            inputs[formName]._isValid = form.checkValidity();
            inputs[formName]._htmlElement = form;
            inputs[formName]._validity = {};

            Array.from(form.getElementsByTagName('input')).forEach((input) => {
                inputs[formName][input.name] = input.value;
                inputs[formName]._validity[input.name] = input.validity;
            });
        });

        if (this._onOk) {
            const popupResult = this._onOk(inputs);

            if (popupResult instanceof Promise) {
                popupResult.then((result) => {
                    if (result) {
                        this.close();
                    }
                });
            } else if (popupResult === true) {
                this.close();
            }
        }
    }

    _initOkButton() {
        this._okButton = this._htmlContainerElement.querySelector('[data-popup-ok]');

        if (! this._okButton) {
            return;
        }

        this._okButton.addEventListener('click', (event) => {this._onOkHandler(event);});
    }

    _closeOnEsc() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpened()) {
                this.close();
                if (this._onCancel) {
                    this._onCancel();
                }
            }
        });
    }
}
