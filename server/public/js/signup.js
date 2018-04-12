$(document).ready(function() {
    var captchaToken = null;
    var verifyCode = null;
    var tellphone = null;
    var captchaInput = $("#captcha input");
    var verifyInput = $("#verify input");
    var passwordInput = $("#password input");
    var confirmInput = $("#confirm input");
    var tellphoneInput = $("#tellphone input");
    getCaptcha();    
    $('#captchaImg').click(function() {
        getCaptcha();
    });
    $('#verifyBtn').click(function() {
        getVerify();
    });
    $('#firstSubmitBtn').click(function() {
        checkVerifyCode();
    });
    $('#secSubmitBtn').click(function() {
        setPassword();
    });
    $('#tipsInput').click(function(){
        if (this.checked) {
            $('#firstSubmitBtn').attr("disabled", false).removeClass('disabledSubmit');
        } else {
            $('#firstSubmitBtn').attr("disabled", true).addClass('disabledSubmit');
        }
    })
    tellphoneInput.blur(function(){
        checkTellphone();
    })
    verifyInput.focus(function(){
        $('.verifytips').fadeIn(300);
    });
    verifyInput.blur(function(){
        $('.verifytips').fadeOut(300);
    });
    passwordInput.focus(function(){
        $('.passwordtips').fadeIn(300);
    });
    passwordInput.blur(function(){
        $('.passwordtips').fadeOut(300);
    });
    passwordInput.keyup(function(){
        var res = checkPasswordStrength(passwordInput.val());
        var strength = res.strength;
        var text = res.text;
        $('.process').find('p').removeClass().addClass(strength);
        $('.strengthText').text(text);
    });
    confirmInput.keyup(function(){
        if(confirmInput.val() !== passwordInput.val()) {
            warning('两次密码输入不一致', '#confirm');
        } else {
            warning('输入一致，可进行下一步', '#confirm', false, 1000);
        }
    })
    function getCaptcha() {
        $.ajax({
            url: 'login/account/v2/get_captcha_token',
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            success:function(ret){
                captchaToken = ret.info.captcha_token;
                console.log('captchaToken', captchaToken)
                $('#captchaImg').attr('src', 'login/account/v2/get_captcha_image?captcha_token=' + captchaToken + '&width=100&height=40');
            }
        });
        captchaInput.val('');
    }
    function getVerify() {
        if(!checkTellphone()) {
            return false;
        }
        tellphone = $.trim(tellphoneInput.val())
        var data = {
            purpose: 'signup',
            phone: tellphone,
            Source: 'web',
            captcha_token: captchaToken,
            captcha_value: $.trim(captchaInput.val())
        };
        $.ajax({
            url: 'login/account/v2/send_verify_code',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=UTF-8',
            error: function(ret) {
                getCaptcha();
                var message = ret.responseJSON.message;
                var code = ret.responseJSON.status_code;
                getWarning(code, message);
            },
            success:function(ret){
                notice('我们将以短信的方式告知你验证码，请注意查收。')
                var num=60;
                clearInterval(int);
                function settime() {
                    if (num == 0){
                        $('#verifyBtn').text('发送验证码').attr("disabled",false).removeClass('disabled');
                    } else {
                        num--;
                        $('#verifyBtn').text('重新发送(' + num + ')').attr("disabled",true).addClass('disabled');
                    }
                }
                var int = setInterval(function() { 
                    settime() 
                },1000)
            }
        });
    }
    function setPassword() {
        if(!checkPassword()) {
            return false;
        }
        var data = {
            phone: tellphone,
            source: 'web',
            password: $.trim(passwordInput.val()),
            verify_code: verifyCode
        };
        $.ajax({
            url: 'login/account/v2/sign_up',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=UTF-8',
            error: function(ret) {
                var message = ret.responseJSON.message;
                var code = ret.responseJSON.status_code;
                getWarning(code, message);
            },
            success:function(ret){
                $('#secStep').hide();
                $('#finish').show();
                finishCountDown();
            }
        });
    }

    function checkForm() {
        var formData = {
            email: $.trim(emailInput.val()),
            password: $.trim(passwordInput.val())
        }
        if (!formData.email || !formData.password) {
            warning('请正确输入邮箱和密码', '.submit-group');
            return false;
        } else if(!(/^[a-zA-Z0-9]{8,20}$/.test(passwordInput.val()))){ 
            warning('密码必须包含数字、字母、不得少于8位、不得超过20位', '#password');
            return false; 
        }
        return true;
    }

    function checkTellphone() {
        if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(tellphoneInput.val()))){ 
            warning('请正确输入手机号', '#tellphone');
            return false; 
        }
        return true;
    }
    function checkVerifyCode() {
        if(!checkTellphone()) {
            return false;
        };
        verifyCode = $.trim(verifyInput.val());
        var data = {
            purpose: 'signup',
            phone: tellphone,
            source: 'web',
            verify_code: verifyCode
        };
        $.ajax({
            url: 'login/account/v2/check_verify_code',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=UTF-8',
            error: function(ret) {
                var message = ret.responseJSON.message;
                var code = ret.responseJSON.status_code;
                getWarning(code, message);
                verifyCode = null;
            },
            success:function(ret){
                $('#firstStep').hide();
                $('#secStep').show();
            }
        });
    }
    function finishCountDown() {
        var num = 3;
        setInterval(function(){
            if (num == 0){
                window.location.href = '/signin';
            } else {
                num--;
                $('.finishTime').text(num);
            }
        },1000)
    };
    function checkPassword() {
        if(!(/^[a-zA-Z0-9!@#$%^&*_`()-+=]{8,20}$/.test(passwordInput.val()))) { 
            warning('密码必须包含数字、字母、不得少于8位、不得超过20位', '#password');
            return false; 
        } else if (passwordInput.val() !== confirmInput.val()) {
            warning('两次密码输入不一致，请确定后重新输入', '#confirm');
            return false;           
        }
        return true;
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
    function checkTellphone() {
        if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(tellphoneInput.val()))){ 
            warning('请正确输入手机号', '#tellphone');
            return false; 
        }
        return true;
    }
});