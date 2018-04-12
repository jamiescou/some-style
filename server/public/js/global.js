// 注意:公共方法定义在 jQuery 启动方法之外,不然打包会打不进去。
var warningTimeout;
function warning(msg, ele, changeBorder, time) {
    if (changeBorder == undefined) {
        var cb = true;
    } else {
        cb = changeBorder;
    }
    console.log('changeBorder', changeBorder)
    var time = time || 3000;
    clearTimeout(warningTimeout);
    var input = $(ele).find('input');
    var warning = $(ele).find('.warning');
    warning.text(msg).show();
    if(cb) {
        input.addClass('input-warning')
    } else {
        warning.addClass('text-pass');
        input.removeClass('input-warning');
    }
    warningTimeout = setTimeout(function() {
        $('.warning').hide();
        input.removeClass('input-warning');
    }, time);
}

function setCookie(c_name, value, expires) {
    var exdate = new Date()
    exdate.setTime(exdate.getTime() + expires);
    var val = c_name+ "=" + escape(value) +
        (expires? "; path=/; expires="+exdate.toGMTString() : "; path=/");
    document.cookie=val;
}

function getCookie(cookieName) {
    var cookie = document.cookie;
    if (cookie.length > 0) {
        var start = cookie.indexOf(cookieName + '=');
        if (start !== -1) {
            start = start + cookieName.length + 1;
            var end = cookie.indexOf(';', start);
            if (end === -1){
                end = cookie.length;
            }

            return cookie.substring(start, end);
        }
    }
    return '';
}
var noticeTimeout;
function notice(msg, time) {
    var time = time || 8000;
    clearTimeout(noticeTimeout);
    $('.notice p').text(msg);
    $('.notice').fadeIn(300);
    noticeTimeout = setTimeout(function(){
        $('.notice').fadeOut(300);
    }, time);
}
$('.clear').click(
	function() {
		$(this).prev().val('');
        $(this).hide();
	}
)
$('.clear').prev().keyup(function(){
    if ($(this).val() !== '') {
        $(this).next().show();
    } else {
        $(this).next().hide();
    }
})
$('.notice .close').click(
    function(){
        $('.notice').fadeOut(300);
    }
)

function getWarning(code, message) {
    switch (code) {
        case 40002: warning(message, '#email')
            break;
        case 40010:
        case 40018: warning(message, '#captcha')
            break;
        case 40004:      
        case 40006:
        case 40013: warning(message, '#tellphone')
            break;
        case 40009:
        case 40015: warning(message, '#verify')
            break;
        case 40005:
        case 40017:
        case 40019: warning(message, '#password')
            break;
        case 501:
        case 601:
        case 701:
        case 40000:
        case 40001:
        case 40003:
        case 40007:
        case 40008:
        case 40011:
        case 40012:
        case 40014:
        case 40016:
        default: warning(message, '.submit-group')
            break;
    }
}

function checkPasswordStrength(key) {
    var r = /^[0-9a-zA-Z!@#$%^&*_`()-+=]{8,20}$/;//特殊字符可以补充，与后续校验同步即可
    var strength = '';
    var text = '';
    if(r.test(key)){
        var a = /[0-9]/.exec(key)!=null ? 1:0;
        var b = /[a-zA-Z]/.exec(key)!=null ? 1:0;
        var c = /[!@#$%^&*_`()-+=]/.exec(key)!=null ? 1:0;
        var d = key.length > 12 ? 1:0;
        var s = a + b + c + d;
        console.log('heh', a, b, c, d, s)
        switch (s) {
            case 4: strength = 'strong';
                    text = '强';
            break;
            case 3: strength = 'normal';
                    text = '一般';
            break;
            case 2: strength = 'weak';
                    text = '弱';
            break;
            default: strength = '';
                     text = '';
            break;
        }
    }
    var res = {
        strength: strength,
        text: text
    }
    return res;
}