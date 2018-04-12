// 注意:公共方法定义在 jQuery 启动方法之外,不然打包会打不进去。
// 输入框的红色错误提示信息， changeBorder为false时 为绿色表示通过input不变色
var warningTimeout;
function warning(msg, ele, changeBorder, time) {
    if (changeBorder == undefined) {
        var cb = true;
    } else {
        cb = changeBorder;
    }
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
//上方绿色提示框
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
//输入框的删除按钮
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
// 通过ajax返回code进行对应的报错
function getWarning(code, message) {
    switch (code) {
        case 40002: warning(message, '#email')
            break;
        case 40010:
        // 图形验证码
        case 40018: warning(message, '#captcha')
            break;
        case 102108:
        case 40004:      
        case 40006:
        case 40013: warning(message, '#tellphone')
            break;
        case 40009:
        // 手机验证码
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
        // 显示按钮下面
        default: warning(message, '.submit-group')
            break;
    }
}
// 密码强弱判断
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

// 时间戳转化成 2017/6/9 0:33 AM 这种格式的时间
function unixToDate(unixTime) {
    if (typeof unixTime == 'string') {
        unixTime = parseInt(unixTime);
    }
    var time = new Date(unixTime);
    var myDate = "";
    myDate += time.getFullYear() + "/";
    myDate += (time.getMonth()+1) + "/";
    myDate += time.getDate();
    myDate += " " + time.getHours() + ":";
    if (time.getMinutes() < 10){
        myDate += '0' + time.getMinutes();
    } else {
        myDate += time.getMinutes();
    }
        
    if (time.getHours() > 12 && time.getMinutes() != 0) {
        myDate += " " + 'PM';
    } else {
        myDate += " " + 'AM';
    }
    return myDate;
}
// 测试服务器使用 当获取不到验证码的时候在控制台给出提示
function captchaImgErr(token) {
    $.ajax({
        url: 'login/account/v1/get_captcha_image?captcha_token=' + token,
        type: 'GET',
        contentType: 'application/json; charset=UTF-8',
        success:function(ret){
            console.log('图形验证码是', ret.captcha_value)
        }
    });
}
