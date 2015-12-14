/**
 * Created by mc on 12/11/15.
 */
function Htmhelper()
{

}

Htmhelper.prototype.addClassesToElement = function(element, classes) {
    for (var i=0;i<classes.length;i++) {
        element.classList.add(classes[i]);
    }
};

Htmhelper.prototype.addStyleToElement = function(element, style) {
    for (var property in style) {
        if (style.hasOwnProperty(property)) {
            element.style[property] = style[property];
        }
    }
};

Htmhelper.prototype.createElement = function(type, attrs) {
    var self = this;
    var element = document.createElement(type);
    for (var attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
            switch (attr) {
                case "classList":
                    self.addClassesToElement(element,attrs[attr]);
                    break;
                case "style":
                    self.addStyleToElement(element, attrs[attr]);
                    break;
                default:
                    element[attr] = attrs[attr];
                    break;
            }
        }
    }
    return element;
};

Htmhelper.prototype.findParentWithClass = function(element, classToFind) {
    if (element.classList.contains(classToFind)) {
        return element;
    } else {
        return this.findParentWithClass(element.parentNode, classToFind);
    }
};

var hh = new Htmhelper();