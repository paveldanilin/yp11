import BaseWidget from "./BaseWidget.js";
import PopupService from './PopupService.js';
import ValidatorService from './ValidatorService.js';
import Card from "./Card";

export default class Profile extends BaseWidget
{
    constructor(name, about, avatar)
    {
        super('templates/profile.template.html', {name: name, about: about, avatar: avatar});
        // super(containerId, 'templates/profile.template.html', {name: name, about: about});

        this.id = null;
        this.cohort = null;
        this.name = name;
        this.about = about;
        this.avatar = avatar;

        this.update = null;
        this.onAddNewCard = null;
    }

    setPopupService(popupService)
    {
        if (popupService instanceof PopupService) {
            this._popupService = popupService;
        } else {
            throw new Error('Expected PopupService');
        }
    }

    set update(callback)
    {
        this._update = callback;
    }

    set onAddNewCard(callback)
    {
        this._onAddNewCard = callback;
    }

    onInit()
    {
        this._refreshAvatar();
    }

    onChange(property, oldValue, newValue)
    {
        if (property === 'avatar') {
            this._refreshAvatar();
        }
    }

    onEdit()
    {
        const profile = this;

        this._popupService.load('edit-profile-popup').then((popup) => {
            popup.open();

            const startName = profile.name;
            const startAbout = profile.about;

            const profileForm = document.getElementById('edit-profile-form');

            const profileNameInput = document.getElementById('profile-name');
            profileNameInput.value = profile.name;

            const profileAboutInput = document.getElementById('profile-about');
            profileAboutInput.value = profile.about;

            const inputs = profileForm.querySelectorAll('input');

            Array.from(inputs).forEach((inputElement) =>
                inputElement.addEventListener('input', () =>
                    profile._checkInput(profileForm, inputElement, 'profile-save-button')));


            /*
            const bindings = popup.getHtmlElement().querySelectorAll('[data-bind]');

            Array.from(bindings).forEach(function (htmlElement) {
                const bindTo = htmlElement.getAttribute('data-bind');

                htmlElement.addEventListener('input', function () {
                    profile.setContextValue(bindTo, htmlElement.value);
                    profile._checkInput(profileForm, htmlElement, 'profile-save-button');
                });
            });*/

            profile._checkForm(profileForm, 'profile-save-button', true);

            popup.onCancel = function() {
                profile.name = startName;
                profile.about = startAbout;
                profile._clearErrors(profileForm);
            };

            popup.onOk = function(form) {

                if (form.profile._isValid === false) {
                    return false;
                }

                const about = form.profile.about || null;
                const name = form.profile.name || null;

                if (about && name) {

                    if (profile._update) {
                        const saveButton = document.getElementById('profile-save-button');
                        saveButton.textContent = 'Загрузка...';
                        // Это надо выносить в отдельный метод
                        return new Promise(function (resolve, reject) {
                            try {
                                profile._update({
                                    name: name,
                                    about: about
                                }).then(() => {
                                    saveButton.textContent = 'Сохранить'
                                    profile.name = name;
                                    profile.about = about;
                                    resolve(true);
                                });
                            } catch (e) {
                                reject(e);
                            }

                        });
                    }
                }

                return true;
            };
        });
    }


    onNewCard()
    {
        const profile = this;

        this._popupService.load('new-card-popup').then((popup) => {
                popup.open();

                const newCardForm = document.getElementById('new-card-form');

                const inputs = newCardForm.querySelectorAll('input');

                Array.from(inputs).forEach((inputElement) =>
                    inputElement.addEventListener('input', () =>
                        profile._checkInput(newCardForm, inputElement, 'place-save-button')));

                profile._checkForm(newCardForm, 'place-save-button', true);

                popup.onCancel = function() {
                    profile._clearErrors(newCardForm);
                };

                popup.onOk = function (form)
                {
                    if (form.new._isValid === false) {
                        return false;
                    }

                    const link = form.new.link || null;
                    const name = form.new.name || null;

                    if (link && name) {
                        // cardCollection.add(new Card(name, link, popupService));
                        // cardCollection.render();
                        if (profile._onAddNewCard) {
                            const saveButton = document.getElementById('place-save-button');
                            saveButton.textContent = 'Загрузка...';

                        // Это надо выносить в отдельный метод
                            return new Promise(function (resolve, reject) {
                                try {
                                    profile._onAddNewCard(
                                        name,
                                        link
                                    ).then(() => {
                                        saveButton.textContent = 'Сохранить'
                                        resolve(true);
                                    });
                                } catch (e) {
                                    reject(e);
                                }

                            });
                            // profile._onAddNewCard(name, link);
                        }
                    }

                    return true;
                }
            });
    }
    // Теряется смысл, контекст и читабельность когда с большим количеством сеттеров и геттеров
    set id(id)
    {
        this._id = id;
    }

    get id()
    {
        return this._id;
    }

    set cohort(cohort)
    {
        this._cohort = cohort;
    }

    get cohort()
    {
        return this._cohort;
    }

    set name(newValue)
    {
        this.setContextValue('name', newValue);
    }

    get name()
    {
        return this.getContextValue('name');
    }

    set about(newValue)
    {
        this.setContextValue('about', newValue);
    }

    get about()
    {
        return this.getContextValue('about');
    }

    set avatar(avatar)
    {
        this.setContextValue('avatar', avatar);
    }

    get avatar()
    {
        return this.getContextValue('avatar');
    }

    _refreshAvatar()
    {
        const avatarElement = document.getElementById('profile-photo');

        avatarElement.style.backgroundImage = `url(${this.avatar})`;
    }

    _checkForm(form, okButtonId, skipElementValidation)
    {
        if (skipElementValidation !== true) {
            const inputs = form.querySelectorAll('input');
            Array.from(inputs).forEach((inputElement) => ValidatorService.check(inputElement));
        }

        const okButton = document.getElementById(okButtonId);

        if (! okButton) {
            return;
        }

        if (form.checkValidity()) {
            okButton.classList.add('popup_active-button');
        } else {
            okButton.classList.remove('popup_active-button');
        }
    }

    _checkInput(form, inputElement, okButtonId)
    {
        ValidatorService.check(inputElement);

        this._checkForm(form, okButtonId, true);
    }

    _clearErrors(form)
    {
        const inputs = form.querySelectorAll('input');
        Array.from(inputs).forEach((inputElement) => ValidatorService.hide(inputElement));
    }
}
