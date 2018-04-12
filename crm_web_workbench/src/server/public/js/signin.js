$(document).ready(function() {
    var captchaToken = null;
    var leftTimes = null;
    var tellphoneInput = $("#tellphone input");
    var passwordInput = $("#password input");
    var captchaInput = $("#captcha input");
    var needCaptcha = false;
    var accountToken = '';
    var tenantId = getCookie('_tenant_id');
    var userId = getCookie('userId');
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
        var tellphone = $.trim(tellphoneInput.val());

        var params = {
            phone: "+86 " + tellphone,
            password: $.trim(passwordInput.val()),
			source: "web"
        };
        if (needCaptcha) {
            params.captcha_token = captchaToken;
            params.captcha_value = $.trim(captchaInput.val());
        }
        var headers = {};

        $.ajax({
            url: 'login/account/v1/sign_in',
            type: 'POST',
            data: JSON.stringify(params),
            contentType: 'application/json; charset=UTF-8',
            error: function(ret) {
                captchaShow();
                getCaptcha();
                leftTimes = ret.responseJSON.left_times;
                var message = ret.responseJSON.message;
                var code = ret.responseJSON.status_code;
                getWarning(code, message);
            },
            success:function(ret){
                accountToken = ret.token
                var expires = 12 * 3600000;
                setCookie('_accountToken', accountToken, expires);
                setCookie('_currentPhone', tellphone, expires);
                var keyName = '_' + tellphone;
                if ( getCookie(keyName) !== '') {
                    enterCompany(keyName);
                } else {
                    window.location.href = '/invite';
                    warning(ret.message);                    
                };
            }
        });
        return false;
    });

    // var orgBtnText = '登录';
    // var toggleBtnTimeout;
    function getCaptcha() {
        $.ajax({
            url: 'login/account/v1/get_captcha_token',
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            success:function(ret){
                captchaToken = ret.captcha_token;
                $('#captchaImg').attr('src', 'login/account/v1/get_captcha_image?captcha_token=' + captchaToken + '&width=100&height=40');
                $('#captchaImg').error(function(){
                    captchaImgErr(captchaToken)
                })
            }
        });
        captchaInput.val('');
    }
    function enterCompany(key) {
        var str = getCookie(key);
        var data = JSON.parse(decodeURIComponent(str));
        var params = {
            source: 'web',
            tenant_id: data.tenantId
        };
        $.ajax({
            url: 'tenant-gateway/account/signin',
            type: 'POST',
            headers: {
                'Authorization': accountToken
            },
            data: JSON.stringify(params),
            contentType: 'application/json; charset=UTF-8',
            error: function(ret) {
                window.location.href = '/invite';
                warning(ret.message);
            },
            success:function(ret){
                var expires = 7 * 86400000;
                setCookie('_userId', data.userId, expires);
                setCookie('_tenant_id', data.tenantId, expires);
                // setCookie('_orgname', 'meiqia', expires);
                setCookie('_accessToken', ret.body.access_token, expires);
                setCookie('_refreshToken', ret.body.refresh_token, expires);
                window.location.href = '/';
            }
        });
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