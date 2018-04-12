$(document).ready(function() {
    var captchaToken = null;
    var leftTimes = null;
    var tellphoneInput = $("#tellphone input");
    var passwordInput = $("#password input");
    var captchaInput = $("#captcha input");
    var needCaptcha = false;
    tellphoneInput.blur(function(){
        checkTellphone();
    })
    $('#captchaImg').click(function() {
        getCaptcha();
    });
    $('#submitBtn').click(function() {
        if(!checkTellphone()) {
            return false;
        } else if (!checkPassword()){
            return false;
        }


        var params = {
            phone: $.trim(tellphoneInput.val()),
            password: $.trim(passwordInput.val()),
			source: "web"
        };
        if (needCaptcha) {
            params.captcha_token = captchaToken;
            params.captcha_value = $.trim(captchaInput.val());
        }
        var headers = {};

        $.ajax({
            url: 'login/account/v2/sign_in',
            type: 'POST',
            data: JSON.stringify(params),
            contentType: 'application/json; charset=UTF-8',
            error: function(ret) {
                captchaShow();
                getCaptcha();
                console.log('ret', ret)
                leftTimes = ret.responseJSON.info.left_times;
                var message = ret.responseJSON.message;
                var code = ret.responseJSON.status_code;
                getWarning(code, message);
            },
            success:function(ret){
                var expires = new Date().getTime() + 7 * 86400000;
                var accessExpires = new Date().getTime() + 120 * 60000;
                Cookie.set('_accessToken', ret.info.access_token, accessExpires);
                // setCookie('_refreshToken', ret.info.refresh_token, expires);
                warning(ret.message);
                window.location.href = '/';
            }
        });
        return false;
    });

    var orgBtnText = '登录';
    var toggleBtnTimeout;
    function getCaptcha() {
        $.ajax({
            url: 'login/account/v2/get_captcha_token',
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            success:function(ret){
                captchaToken = ret.info.captcha_token;
                $('#captchaImg').attr('src', 'login/account/v2/get_captcha_image?captcha_token=' + captchaToken + '&width=100&height=40');
            }
        });
        captchaInput.val('');
    }

    function captchaShow() {
        needCaptcha = true;
        $('#captcha').show();
    }
    function checkTellphone() {
        if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(tellphoneInput.val()))){ 
            warning('请正确输入手机号', '#tellphone');
            return false; 
        }
        return true;
    }
    function checkPassword() {
        if(!(/^[a-zA-Z0-9!@#$%^&*_`()-+=]{8,20}$/.test(passwordInput.val()))) { 
            warning('密码必须包含数字、字母、不得少于8位、不得超过20位', '#password');
            return false; 
        }
        return true;
    }
});