require('log-timestamp');

module.exports.add_session_alert = function(req, alert_text){
    var sess = req.session;
    var alert_list = []
    if(sess.alert_list){
        alert_list = sess.alert_list
    }
    var alert_data = { "alert_text": alert_text}
    alert_list.push(alert_data)
    sess.alert_list = alert_list
};

module.exports.clean_session_alert = function(req){
    var sess = req.session;
    var alert_list = []
    if(sess.alert_list){
        alert_list = sess.alert_list
        sess.alert_list = []
    }
    return alert_list
};

module.exports.add_toast = function(req, toast_text, toast_type = 'primary'){
    var sess = req.session;
    sess.toast_data = {
        "toast_text": toast_text,
        "toast_type": toast_type
    }
};

module.exports.toast_update = function(req, data){
    var sess = req.session;
    if(sess.toast_data){
        var toast_text = sess.toast_data.toast_text
        if(toast_text.length > 0){
            data['toast_data'] = sess.toast_data
        }
    }
    sess.toast_data = {
        "toast_text": '',
        "toast_type": ''
    }
    return data
};


module.exports.verifyAccessRole = async function(req, res, required_role){
    var sess = req.session;
    if(sess.user_role){
        var user_role = sess.user_role;
        var role_levels = ['contestant', 'service', 'moderator', 'manager', 'admin', 'root']
        var role_order = {
            'contestant': 1,
            'service': 2,
            'moderator': 3,
            'manager': 4,
            'admin': 8,
            'root': 10,
        }
        var user_role_order = role_order[user_role]
        var required_role_order = role_order[required_role]
        console.log('user_role_order: ' + user_role_order)
        console.log('required_role_order: ' + required_role_order)
        if(user_role_order < required_role_order){
            res.redirect('/request/error/')
            req.end()
        }
    }else{
        res.redirect('/request/error/')
        req.end()
    }
};
