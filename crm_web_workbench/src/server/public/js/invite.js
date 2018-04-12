$(document).ready(function() {
    var accountToken = decodeURIComponent(getCookie('_accountToken'));
    var emailInput = $("#email input");
    var nameInput = $("#name input");
    var inviteListOpen = false;
    // var acceptId = '';
    var userId = '';
    var currentPhone = getCookie('_currentPhone');
    emailInput.blur(function(){
        checkEmail();
    })
    nameInput.blur(function(){
        checkName();
    })
    $(".invite-list__header span").click(function(){
        if (!inviteListOpen) {
            $(this).find('.invite-list__header-line').addClass('invite-list__header-line-open');
            inviteListOpen = true;
        } else {
            $(this).find('.invite-list__header-line').removeClass('invite-list__header-line-open');
            inviteListOpen = false;
        }
        $('.invite-list__body').toggle();
    })
    // $('.invite-modal .invite-modal__close').click(function(){
    //     $('.invite-modal').fadeOut(300);
    // })
    // $('#acceptBtn').click(function(){
    //     acceptInvite(acceptId)
    // })
    $('#signout').click(function(){
        signOut();
    })
    var inviteList = [];
    var companyList = [];
    getInviteList();
    getCompanyList();
    function getInviteList() {
        $.ajax({
            url: 'tenant-gateway/account/invitations',
            type: 'GET',
            headers: {
                'Authorization': accountToken
            },
            contentType: 'application/json; charset=UTF-8',
            error: function(ret) {
                console.log('ret', ret);
            },
            success:function(ret){
                if(ret.code !== 0) {
                    tokenErr(ret.code)
                }
                console.log('ret', ret)
                inviteList = ret.body.items || [];
                buildInviteList();
            }
        });
    }
    function getCompanyList() {
        $.ajax({
            url: 'tenant-gateway/account/relations',
            type: 'GET',
            headers: {
                'Authorization': accountToken
            },
            contentType: 'application/json; charset=UTF-8',
            error: function(ret) {
                console.log('ret', ret);
            },
            success:function(ret){
                if(ret.code !== 0) {
                    tokenErr(ret.code)
                }
                companyList = ret.body.items || [];
                buildCompanyList();                
            }
        });        
    }
    function refreshPage() {
        buildInviteList();
        buildCompanyList();
    }
    function buildInviteList() {
        var inviteLi = $('.invite-list__body');
        inviteLi.empty();
        $('.invite-list__header-tip').hide();
        // var oFragmeng = document.createDocumentFragment();
        if (inviteList.length === 0) {
            var eUl = $('<ul></ul>').addClass('invite-list__empty');
            var eImg = $('<img>').attr("src", "/public/img/gray-logo.svg");
            var eText = $('<p></p>').text('友情提示：您的列表为空！');
            eUl.append(eImg).append(eText);
            inviteLi.append(eUl);
        } else {
            for(var i in inviteList) {
                var d = inviteList[i];
                var iUl = $('<ul></ul>')
                var iLogo = $('<img>').attr("src", "/public/img/logo.svg").addClass('invite-list__logo');
                var iContent = $('<div></div>').addClass('invite-list__content');
                var iBGroup = $('<div></div>').addClass('invite-list__button-group');
                var iName = $('<p></p>').addClass('invite-list__name').text(d.org_name + ' 邀请您加入!');
                var iTime = $('<p></p>').addClass('invite-list__time').text('有效期至： ' + unixToDate(d.expired_at));
                var idenyButton = $('<button></button>').addClass('invite-list__deny invite-button__neutral').text('拒绝');
                var iAcceptButton = $('<button></button>').addClass('invite-list__accept invite-button__brand').text('同意');
                var iText = $('<p></p>').addClass('invite-list__text-invalid');
                iContent.append(iName).append(iTime);
                if (d.status == 'init' && !d.expired) {
                    iBGroup.append(idenyButton).append(iAcceptButton);
                    $('.invite-list__header-tip').show();
                } else {
                    // 名字变灰
                    iName.addClass('invite-deny');
                    if (d.status == 'accept') {
                        iBGroup.append(iText.text('已同意'))
                    } else if (d.status == 'deny'){
                        iBGroup.append(iText.text('已拒绝'))
                    } else if (d.status == 'cancel') {
                        iBGroup.append(iText.text('已取消'))
                    } else if (d.expired) {
                        iBGroup.append(iText.text('已过期'))
                    }
                }
                iUl.append(iLogo).append(iContent).append(iBGroup);
                inviteLi.append(iUl);
                (function(d){
                    idenyButton.click(function(){
                        denyInvite(d.id);
                    });
                    iAcceptButton.click(function(){
                        // $('.invite-modal').fadeIn(300);
                        acceptInvite(d.id)
                        // acceptId = d.id;
                    })
                })(d)
            }
        }
    }
    function signOut() {
        $.ajax({
            url: 'login/account/v1/sign_out',
            type: 'POST',
            headers: {
                'Authorization': accountToken
            },
            contentType: 'application/json; charset=UTF-8',
            error: function(ret) {
                console.log('ret', ret);
            },
            success:function(ret){
                if(ret.code !== 0) {
                    tokenErr(ret.code)
                }
                setCookie('_accountToken', '', -1);
                setCookie('_accessToken', '', -1);
                setCookie('_refreshToken', '', -1);
                window.location.href = '/signin';
            }
        });
    }
    function buildCompanyList() {
        var companyLi = $('.company-list__body');
        companyLi.empty();
        for(var i in companyList) {
            var d = companyList[i];
            var cUl = $('<ul></ul>')
            var cLogo = $('<img>').attr("src", "/public/img/logo.svg").addClass('company-list__logo');
            var cContent = $('<div></div>').addClass('company-list__content');
            var cBGroup = $('<div></div>').addClass('company-list__button-group');
            var cName = $('<p></p>').addClass('company-list__name').text(d.org_name);
            var cEnter = $('<p></p>').addClass('company-list__button-enter').text('进入企业');
            cBGroup.append(cEnter);
            cContent.append(cName);
            cUl.append(cLogo).append(cContent).append(cBGroup);
            companyLi.append(cUl);
            (function(d){
                cEnter.click(function(){
                    enterCompany(d)
                })
                cName.click(function(){
                    enterCompany(d)
                })
                cLogo.click(function(){
                    enterCompany(d)
                })
            })(d)
        }
    }
    function denyInvite(id) {
        $.ajax({
            url: 'tenant-gateway/account/deny_invitation/' + id,
            type: 'POST',
            headers: {
                'Authorization': accountToken
            },
            contentType: 'application/json; charset=UTF-8',
            error: function(ret) {
                console.log('ret', ret);
            },
            success:function(ret){
                if(ret.code !== 0) {
                    tokenErr(ret.code)
                }
                getInviteList();
            }
        });
    }
    // function openModal() {
    //     $('.invite-modal').fadeIn(300);    
    // }
    function acceptInvite(id) {
        // if(!checkEmail()) {
        //     return false;
        // }
        // if(!checkName()) {
        //     return false;
        // }
        // var params = {
        //     email: $.trim(emailInput.val()),
        //     name: $.trim(nameInput.val())
        // };
        $.ajax({
            url: 'tenant-gateway/account/accept_invitation/' + id,
            type: 'POST',
            headers: {
                'Authorization': accountToken
            },
            data: JSON.stringify({}),
            contentType: 'application/json; charset=UTF-8',
            error: function(ret) {
                console.log('ret', ret);
            },
            success:function(ret){
                if(ret.code !== 0) {
                    tokenErr(ret.code)
                }
                emailInput.val();
                nameInput.val();
                // $('.invite-modal').fadeOut(300);
                getInviteList();
                getCompanyList();
            }
        });
    }
    function enterCompany(data) {
        var id = data.tenant_id;
        userId = data.user_id;
        var params = {
            source: 'web',
            tenant_id: id
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
                console.log('ret', ret);
            },
            success:function(ret){
                if(ret.code !== 0) {
                    tokenErr(ret.code)
                }
                console.log('ret', ret)
                var expires = 7 * 86400000;
                setCookie('_userId', userId, expires);
                setCookie('_tenant_id', id, expires);
                // 用于记录此次登录的企业
                saveSignData(id, userId);
                // 目前先写固定 meiqia
                setCookie('_orgname', 'meiqia', expires);
                setCookie('_accessToken', ret.body.access_token, expires);
                setCookie('_refreshToken', ret.body.refresh_token, expires);
                window.location.href = '/';
            }
        });
    }

    // 时间戳转化成 2017/6/9 0:33 AM 这种格式的时间
    function saveSignData(tenant_id, user_id) {
        var keyName = '_' + currentPhone;
        var data = {
            userId: user_id,
            tenantId: tenant_id
        }
        var expires = 7 * 86400000;
        setCookie(keyName, JSON.stringify(data), expires);
    }
    function unixToDate(unixTime) {
        if (typeof unixTime == 'string') {
            unixTime = parseInt(unixTime);
        }
        var time = new Date(unixTime * 1000);
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
    function checkEmail() {
        if(!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(emailInput.val()))){
            warning('请正确输入邮箱', '#tellphone');
            return false; 
        }
        return true;
    }
    function checkName() {
        if(nameInput.val() === ''){
            warning('名字不能为空', '#name');
            return false; 
        }
        return true;
    }
    function tokenErr(code) {
        console.log('code', code);
        if ([106102, 102202, 106002].indexOf(code) >= 0) {
            setCookie('_accountToken', '', -1);
            setCookie('_accessToken', '', -1);
            setCookie('_refreshToken', '', -1);
            // setCookie('_userId', '', -1);
            window.location.href='./signin';
        }
        return false;
    }
});

