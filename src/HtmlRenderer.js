export default class HtmlRenderer
{
    static render(definition)
    {
        HtmlRenderer.validateDefinition(definition);

        return HtmlRenderer.doRender(definition);
    }

    static doRender(definition)
    {
        const id          = definition.id || null;
        const name        = definition.name || null;
        const element     = definition.element || null;
        const classList   = definition.classList || [];
        const style       = definition.style || {};
        const textContent = definition.textContent || null;
        const children    = definition.children || [];
        const on          = definition.on || {};

        if (element === null) {
            throw new Error('Not defined "element" property');
        }

        const htmlElement = HtmlRenderer.createHtmlElement(id, name, element, classList, style, on, textContent);

        children.forEach(function (innerChildDefinition) {
            htmlElement.appendChild(HtmlRenderer.doRender(innerChildDefinition));
        });

        return htmlElement;
    }

    static createHtmlElement(id, name, element, classList, style, on, textContent)
    {
        element = element.toLowerCase().trim();

        if (element.length === 0) {
            throw new Error('"element" property must be non empty string');
        }

        const htmlElement = document.createElement(element);

        if (id) {
            htmlElement.id = id;
        }

        if (name) {
            htmlElement.name = name;
        }

        classList.forEach(function(cssClass) {
           htmlElement.classList.add(cssClass);
        });

        Object.keys(style).forEach(function (styleName) {
            htmlElement.style[styleName] = style[styleName];
        });

        if (textContent) {
            htmlElement.textContent = textContent;
        }

        Object.keys(on).forEach(function(onEventName) {
            htmlElement.addEventListener(onEventName, on[onEventName]);
        });

        return htmlElement;
    }

    static validateDefinition(definition)
    {
        const defType = typeof definition;

        if (defType !== 'object') {
            throw new Error('Expected "object", but supplied "' + defType + '"');
        }
    }
}
