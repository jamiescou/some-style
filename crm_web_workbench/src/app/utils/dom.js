// const whitespace = '[\\x20\\t\\r\\n\\f]';
// let rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g');

let stylePropertyMapping = {
    float: ('styleFloat' in document.createElement('div').style) ? 'styleFloat' : 'cssFloat'
};
const REG_EXP_CAMELIZE = /\-[a-z]/g;
let camelize = (str) => {
    return str.replace(REG_EXP_CAMELIZE, (match) => {
        return match.charAt(1).toUpperCase();
    });
};
let isWindow = (obj) => obj !== null && obj === obj.window;
let getWindow = (ele) => isWindow(ele) ? ele : ele.nodeType === 9 && ele.defaultView;
let nodeName = (ele, name) => ele.nodeName && ele.nodeName.toLowerCase() === name.toLowerCase();


export function windowHeight() {
    return document.documentElement.clientHeight;
}

export function windowWidth() {
    return document.documentElement.clientWidth;
}

export function hasClass(obj, className) {
    return obj.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

export function removeClass(obj, className) {
    if (hasClass(obj, className)) {
        let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}

export function addClass(obj, className) {
    if (hasClass(obj, className)) {
        return false;
    }

    if (obj.className === '') {
        obj.className = className;
    } else {
        obj.className += ' ' + className;
    }
}

export function trim(text) {
    return text === null ? '' : (text + '').replace(/^[\s\u3000\uFEFF\xA0]+|[\s\u3000\uFEFF\xA0]+$/g, '');
}

export function insertAtCaret(el, text) {
    let scrollPos = el.scrollTop;
    let strPos = el.selectionStart;
    let strEnd = el.selectionEnd;
    let front = el.value.substring(0, strPos);
    let back = el.value.substring(strEnd, el.value.length);
    el.value = front + text + back;
    strPos = strPos + text.length;
    el.selectionStart = strPos;
    el.selectionEnd = strPos;
    el.focus();
    el.scrollTop = scrollPos;
}

/**
 * 给元素设置内联样式, 参数接受 CSS语法的stirng 以及object
 * @param ele
 * @param styles
 */
export function setStyle(ele, _styles) {
    let styles = _styles;
    let style = ele.style;
    if (typeof (styles) === 'string') {
        style.cssText += ';' + styles;
        return;
    }

    styles = JSON.parse(JSON.stringify(styles)); // get a save JSON
    let i;
    for (i in styles) {
        if (i === 'float') {
            style.cssFloat = styles[i];
            style.styleFloat = styles[i];
        } else {
            style[i] = styles[i];
        }
    }
}

/**
 * 获取元素的真实样式值
 * @param ele
 * @param styles
 */
export function getStyle(ele, styles) {
    if (ele.nodeType !== 1) { // element node
        return null;
    }
    let doc = ele.ownerDocument;
    let property = styles;
    let camelizedProperty = stylePropertyMapping[styles] || camelize(styles);
    let style = ele.style;
    let currentStyle = ele.currentStyle;
    let styleValue = style[camelizedProperty];
    if (styleValue) {
        return styleValue;
    }

    if (currentStyle) {
        try {
            return currentStyle[camelizedProperty];
        } catch (e) {
            console.log('get style rror');
        }
    }

    let win = doc.defaultView || doc.parentWindow;
    let needsOverflowReset = (property === 'height' || property === 'width') && ele.nodeName === 'TEXTAREA';
    let originalOverflow;
    let returnValue;

    if (win.getComputedStyle) {
        if (needsOverflowReset) {
            originalOverflow = style.overflow;
            style.overflow = 'hidden';
        }
        returnValue = win.getComputedStyle(ele, null).getPropertyValue(property);
        if (needsOverflowReset) {
            style.overflow = originalOverflow || '';
        }
        return returnValue;
    }
}

/**
 * 方法同 getStyle , 但返回整型数字, 用于取长宽高等数值
 * @param ele
 * @param styles
 */
export function getStyleWithNumber(ele, styles) {
    let value = getStyle(ele, styles);
    if (value) {
        value = value.replace('px', '');
    } else {
        value = 0;
    }
    return value | 0;
}

/**
 * 获取元素相对于document的坐标信息
 * @param element
 */
export function getOffset(element) {
    let doc = element && element.ownerDocument;
    let box = {top: 0, left: 0};
    let docElement;
    let win;
    if (!doc) {
        return null;
    }
    docElement = doc.documentElement;

    if (typeof element.getBoundingClientRect !== (typeof undefined)) {
        box = element.getBoundingClientRect();
    }

    win = getWindow(doc);

    return {
        top: box.top + win.pageYOffset - docElement.clientTop,
        left: box.left + win.pageXOffset - docElement.clientLeft,
        width: box.width,
        height: box.height
    };
}

export function setOffset(element, options) {
    let curPostion;
    let curLeft;
    let curCSSLeft;
    let curCSSTop;
    let curTop;
    let curOffset;
    let calculatePostion;
    let position = getStyle(element, 'position');
    let props = {};

    if (position === 'static') {
        element.style.position = 'relative';
    }

    curOffset = getOffset(element);
    curCSSTop = getStyle(element, 'top');
    curCSSLeft = getStyle(element, 'left');
    calculatePostion = (position === 'absolute' || position === 'fixed') && (curCSSTop + curCSSLeft).indexOf('auto') > -1;

    if (calculatePostion) {
        curPostion = getPosition(element);
        curTop = curPostion.top;
        curLeft = curPostion.left;
    } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
    }

    if (options.top !== null) {
        props.top = (options.top - curOffset.top) + curTop + 'px';
    }
    if (options.left !== null) {
        props.left = (options.left - curOffset.left) + curLeft + 'px';
    }
    if (options.width !== null) {
        props.width = options.width + 'px';
    }
    if (options.height !== null) {
        props.height = options.height + 'px';
    }

    setStyle(element, props);
}

export function getOffsetParent(element) {
    let offsetParent = element.offsetParent || document.documentElement;
    while (offsetParent && (!nodeName(offsetParent, 'html')) && getStyle(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || document.documentElement;
}

export function getPosition(element) {
    if (!element) {
        return null;
    }

    let offsetParent;
    let offset;
    let parentOffset = {top: 0, left: 0};

    // fix element are offset from window

    if (getStyle(element, 'position') === 'fixed') {
        offset = element.getBoundingClientRect();
    } else {
        offsetParent = getOffsetParent(element);
        offset = getOffset(element);
        if (!nodeName(offsetParent, 'html')) {
            parentOffset = getOffset(offsetParent);
        }

        parentOffset.top += getStyleWithNumber(offsetParent, 'borderTopWidth');
        parentOffset.left += getStyleWithNumber(offsetParent, 'borderLeftWidth');
    }

    let top = offset.top - parentOffset.top - getStyleWithNumber(offsetParent, 'marginTop');
    let left = offset.left - parentOffset.left - getStyleWithNumber(offsetParent, 'marginLeft');

    return {left, top};
}

