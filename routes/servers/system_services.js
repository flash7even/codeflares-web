
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
