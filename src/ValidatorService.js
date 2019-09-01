export default class ValidatorService
{
    static getError(element)
    {
        if (element.checkValidity()) {
            return false;
        }

        if (element.validity.valueMissing) {
            return element.getAttribute('data-value-missing') || 'Value missing';
        }

        if (element.validity.typeMismatch) {
            return element.getAttribute('data-type-mismatch') || 'Type mismatch';
        }

        if (element.validity.tooLong) {
            return element.getAttribute('data-too-long') || 'Too long';
        }

        if (element.validity.tooShort) {
            return element.getAttribute('data-too-short') || 'Too short';
        }

        return 'Unknown error';
    }

    static check(element)
    {
        const errorMessage = ValidatorService.getError(element);

        const idErrorMessage = element.getAttribute('data-error-container') || null;

        const errorMessageElement = document.getElementById(idErrorMessage);

        if (errorMessage !== false) {
            if (errorMessageElement) {
                errorMessageElement.textContent = errorMessage;
                errorMessageElement.classList.add('error_is-visible');
            }
            return true;
        } else {
            if (errorMessageElement) {
                errorMessageElement.classList.remove('error_is-visible');
            }
            return false;
        }
    }

    static hide(element)
    {
        const idErrorMessage = element.getAttribute('data-error-container') || null;

        const errorMessageElement = document.getElementById(idErrorMessage);

        if (errorMessageElement) {
            errorMessageElement.classList.remove('error_is-visible');
        }
    }
}
