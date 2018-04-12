$(document).ready(function() {
    var inviteListOpen = false;
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
    $('.invite-modal .invite-modal__close').click(function(){
        $('.invite-modal').fadeOut(300);
    })
    var mock = [
        {
            expired_at: '1496994503948',
            tenant_id: '11111',
            status: 'agree',
            name: '雨雨集团'
        },
        {
            expired_at: '1496999903948',
            tenant_id: '222222',
            status: 'required',
            name: '润润集团'
        }
    ]
    buildInviteList();
    buildEnterpriseList();
    function getInviteList() {
        if(!checkPassword()) {
            return false;
        }
        $.ajax({
            url: 'login/tenant/v2/user_invitation',
            type: 'GET',
            // data: JSON.stringify(data),
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
    function buildInviteList() {
        var initeLi = $('.invite-list__body');
        initeLi.empty();
        // var oFragmeng = document.createDocumentFragment();
        for(var i in mock) {
            var d = mock[i];
            var iUl = $('<ul></ul>')
            var iLogo = $('<img>').attr("src", "http://pic.yue365.com/singer/150/3/5887.jpg").addClass('invite-list__logo');
            var iContent = $('<div></div>').addClass('invite-list__content');
            var iBGroup = $('<div></div>').addClass('invite-list__button-group');
            var iName = $('<p></p>').addClass('invite-list__name').text(d.name + ' 邀请您加入!');
            var iTime = $('<p></p>').addClass('invite-list__time').text('有效期至： ' + d.expired_at);
            var iRejectButton = $('<button></button>').addClass('invite-list__reject invite-button__neutral').text('拒绝');
            var iAgreeButton = $('<button></button>').addClass('invite-list__agree invite-button__brand').text('同意');
            iContent.append(iName).append(iTime);
            iBGroup.append(iRejectButton).append(iAgreeButton);
            iUl.append(iLogo).append(iContent).append(iBGroup);
            initeLi.append(iUl);
        }
    }
    function buildEnterpriseList() {
        var enterpriseLi = $('.enterprise-list__body');
        enterpriseLi.empty();
        // var oFragmeng = document.createDocumentFragment();
        for(var i in mock) {
            var d = mock[i];
            var eUl = $('<ul></ul>')
            var eLogo = $('<img>').attr("src", "http://pic.yue365.com/singer/150/3/5887.jpg").addClass('enterprise-list__logo');
            var eContent = $('<div></div>').addClass('enterprise-list__content');
            var eBGroup = $('<div></div>').addClass('enterprise-list__button-group');
            var eName = $('<p></p>').addClass('enterprise-list__name').text(d.name);
            var eActivateButton = $('<p></p>').addClass('enterprise-list__button-activate').text('去激活');
            var eDeleteButton = $('<p></p>').addClass('enterprise-list__button-delete').text('删除');
            var eActivateImg = $('<img>').attr("src", "public/img/activate.svg").addClass('enterprise-list__button-activate');
            var eDeleteImg = $('<img>').attr("src", "public/img/delete.svg").addClass('enterprise-list__button-delete');
            eActivateButton.prepend(eActivateImg);
            eDeleteButton.prepend(eDeleteImg);
            eContent.append(eName);
            eBGroup.append(eActivateButton).append(eDeleteButton);
            eUl.append(eLogo).append(eContent).append(eBGroup);
            enterpriseLi.append(eUl);
        }
    }
});