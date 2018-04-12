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
    function getVerify() {
        if(!checkTellphone()) {
            return false;
        }
        var captchaValue = $.trim(captchaInput.val());
        if (captchaValue.length !== 5) {
            warning('请正确输入验证码', '#captcha');
            return false;
        }
        tellphone = $.trim(tellphoneInput.val())
        var data = {
            purpose: 'reset_password',
            phone: "+86 " + tellphone,
            Source: 'web',
            captcha_token: captchaToken,
            captcha_value: captchaValue
        };
       $.ajax({
            url: 'login/account/v1/send_verify_code',
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
                console.log('手机短信验证码是', ret.verify_code);
                var num = 60;
                function settime() {
                    if (num == 0){
                        $('#verifyBtn').text('发送验证码').attr("disabled",false).removeClass('disabled');
                        clearInterval(int);
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
            phone: "+86 " + tellphone,
            source: 'web',
            new_password: $.trim(passwordInput.val()),
            verify_code: verifyCode
        };
        $.ajax({
            url: 'login/account/v1/reset_password',
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
            warning('请正确输入邮箱和密码', '#submit-group');
            return false;
        } else if(!(/^[a-zA-Z0-9]{8,16}$/.test(passwordInput.val()))){ 
            warning('密码必须包含数字、字母、不得少于8位、不得超过16位', '#password');
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
        verifyCode = $.trim(verifyInput.val())
        if (verifyCode.length !== 6) {
            warning('请正确输入手机验证码', '#verify');
            return false;
        }
        var data = {
            purpose: 'reset_password',
            phone: "+86 " + tellphone,
            source: 'web',
            verify_code: verifyCode
        };
        $.ajax({
            url: 'login/account/v1/check_verify_code',
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
});