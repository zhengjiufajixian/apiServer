let kue = require("kue");
let path = require("path");
let maxmind = require("maxmind");
    
let node_env = process.env.NODE_ENV;
exports.node_env = node_env ? node_env : "development";

/***************************************************** set prodution_authkeys_json ******************************************/
let prodution_authkeys_json;
if (node_env === "production") {
    prodution_authkeys_json = require("./../config/prodution-authkeys-json.json");
}

/***************************************************** API request Related Config ******************************************/
//250ms per click on the same request
exports.limiter_time_gap = 250;
exports.limiter_token_prefix = "V4_limiter_";

/******************************************************* Login Related Config ***********************************************/
if (node_env === "production") {
    exports.token_secret = prodution_authkeys_json.token_secret;
    exports.token_exp_milsec = 7 * 24 * 60 * 60 * 1000;
} else {
    exports.token_secret = "aMdoeb5ed87zoFRdkDferFejmplx";
    exports.token_exp_milsec = 7 * 24 * 60 * 60 * 1000;
}

exports.client2c_token_postfix = "_Client2C_V4_Token";
exports.login_human_verify_postfix = "_V4_VerifyTimes";
exports.login_retry_times = 5;

/******************************************************* Node Server Related Config ***********************************************/
if (node_env === "production") {
    exports.node_port = 8100;
} else if (node_env === "staging") {
    exports.node_port = 8100;
} else {
    exports.node_port = 8100;
}

if (node_env === "production") {
    exports.node_host_url = "https://api.xxxx.com/";
} else if (node_env === "staging") {
    exports.node_host_url = "http://api-stg.xxxx.com/";
} else {
    exports.node_host_url = "http://127.0.0.1:8100/";
}

/******************************************************* Geo Location Config *******************************************************/
exports.maxmind_lookup = maxmind.open(
    path.join(__dirname + "./../library/registerHelper/GeoLite2-City.mmdb")
);

/******************************************************* DB Related Config ******************************************************/
// mysql
if (node_env === "production") {
    exports.mysqldb_config = {
        connectionLimit: 180,
        host: prodution_authkeys_json.mysql_host,
        database: prodution_authkeys_json.mysql_database,
        user: prodution_authkeys_json.mysql_user,
        password: prodution_authkeys_json.mysql_password,
        charset: "utf8mb4",
        // debug: ['ComQueryPacket'],
        timezone: "UTC",
    };
    exports.mysqldb_readonly_config = [
        {
            connectionLimit: 180,
            host: prodution_authkeys_json.mysql_read_only_host_1,
            database: prodution_authkeys_json.mysql_database,
            user: prodution_authkeys_json.mysql_user,
            password: prodution_authkeys_json.mysql_password,
            charset: "utf8mb4",
            // debug: ['ComQueryPacket'],
            timezone: "UTC",
        },
    ];
} else {
    exports.mysqldb_config = {
        connectionLimit: 20,
        host: "127.0.0.1",
        database: "app",
        user: "root",
        password: "123456",
        charset: "utf8mb4",
        debug: ["ComQueryPacket"],
        timezone: "UTC",
    };
    exports.mysqldb_readonly_config = [
        {
            connectionLimit: 20,
            host: "127.0.0.1",
            database: "app",
            user: "root",
            password: "123456",
            charset: "utf8mb4",
            debug: ["ComQueryPacket"],
            timezone: "UTC",
        },
    ];
}

// redis
if (node_env === "production") {
    exports.redisdb_host = prodution_authkeys_json.redisdb_host;
    exports.redisdb_port = prodution_authkeys_json.redisdb_port;
} else if (node_env === "staging") {
    exports.redisdb_host = "127.0.0.1";
    exports.redisdb_port = 6379;
} else {
    exports.redisdb_host = "127.0.0.1";
    exports.redisdb_port = 6379;
}

/******************************************************* Job Queue Related Config ******************************************************/
let kue_redis_setting;
if (node_env === "production") {
    kue_redis_setting = {
        host: prodution_authkeys_json.redisdb_host,
        port: prodution_authkeys_json.redisdb_port,
        db: 3,
    };
} else if (node_env === "staging") {
    kue_redis_setting = {
        host: "127.0.0.1",
        port: 6379,
        db: 3,
    };
} else {
    kue_redis_setting = {
        host: "127.0.0.1",
        port: 6379,
        db: 3,
    };
}

/********************************************** Daily Queue *******************************************/
// LogisticInfo Collection Config
// let kue_redis_logisticinfo_update_queue_prefix = "kue_redis_logisticinfo_update";
// let kue_redis_logisticinfo_update_queue_option = {
//     prefix: kue_redis_logisticinfo_update_queue_prefix,
//     redis: kue_redis_setting,
// };
// exports.logisticinfo_update_queue_name = kue_redis_logisticinfo_update_queue_prefix;
// exports.logisticinfo_update_queue = kue.createQueue(
//     kue_redis_logisticinfo_update_queue_option
// );
// exports.logisticinfo_update_queue_ttl = 60 * 1000; //60 seconds

// exports.logisticinfo_update_queue_start_time = {
//     hour: 4,
//     minute: 0,
//     second: 0,
// }; //4am
// exports.logisticinfo_update_queue_retry_time = 1;

// Order Status Update Config
// let kue_redis_order_status_update_queue_prefix =
//     "kue_redis_order_status_update";
// let kue_redis_order_status_update_queue_option = {
//     prefix: kue_redis_order_status_update_queue_prefix,
//     redis: kue_redis_setting,
// };
// exports.order_status_update_queue_name = kue_redis_order_status_update_queue_prefix;
// exports.order_status_update_queue = kue.createQueue(
//     kue_redis_order_status_update_queue_option
// );
// exports.order_status_update_queue_ttl = 60 * 1000; //60 seconds

// exports.order_status_update_queue_start_time = {
//     hour: 3,
//     minute: 0,
//     second: 0,
// }; //3am
// exports.order_status_update_queue_retry_time = 1;
// exports.order_status_logistic_no_update_day = 10;

/************************************************ SMS Message Related Config ******************************************/
let kue_redis_text_message_queue_prefix = "kue_redis_text_message";
let kue_redis_text_message_queue_option = {
    prefix: kue_redis_text_message_queue_prefix,
    redis: kue_redis_setting,
};
exports.text_message_queue = kue.createQueue(
    kue_redis_text_message_queue_option
);
exports.text_message_queue_name = kue_redis_text_message_queue_prefix;
exports.text_message_queue_ttl = 60 * 1000; //60 seconds
exports.text_message_queue_max_attempts = 3;
exports.text_message_queue_attempt_delay = 5 * 1000;

// China Mainland Cellphone Regular Exp
exports.china_mainland_phone_regex = /^0?1[3|4|5|8|7][0-9]\d{8}$/;

exports.logistic_lost_text_message_start_time = 12; //12am
exports.order_refund_reject_text_message_start_time = 12; //12am
exports.order_refund_pass_text_message_start_time = 12; //12am
exports.luosimao_text_app_token_key = "i^y_z@s*h";
exports.luosimao_text_message_options = {
    // host: "sms-api.luosimao.com",
    path: "/v1/send.json",
    method: "POST",
    auth: "api:key-dc78b50fbd01959ebd1cb7baf4f5cf5a",
    agent: false,
    rejectUnauthorized: false,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
};

/***************************************************** wechat config ******************************************/
// if (node_env === "production") {
//     exports.wechat_AppID = "wx9b2b1b13ce9a56db";
//     exports.wechat_AppSecret = "def6a9f82cee90220b146d161899c8ab";
// } else {
//     exports.wechat_AppID = "wx9b2b1b13ce9a56db";
//     exports.wechat_AppSecret = "def6a9f82cee90220b146d161899c8ab";
// }

/******************************************************* System Email Related Config ***************************************/
let kue_redis_email_queue_prefix = "kue_redis_email";
let kue_redis_email_queue_option = {
    prefix: kue_redis_email_queue_prefix,
    redis: kue_redis_setting,
};
exports.client_email_queue = kue.createQueue(kue_redis_email_queue_option);
exports.client_email_queue_name = kue_redis_email_queue_prefix;
exports.client_email_queue_ttl = 60 * 1000; //60 seconds
exports.client_email_max_queue_attempts = 3;
exports.client_email_queue_attempt_delay = 10 * 1000;

if (node_env === "production") {
    exports.send_email_account = "HEMAYIN<system@email.hemayin.com>";
    exports.email_username = "system@email.hemayin.com";
    exports.email_password = prodution_authkeys_json.email_password;
    exports.email_host = "smtpdm.aliyun.com";
    exports.email_port = "25";

    exports.sendEmailOptions = {
        charset: "UTF-8",
        from: "system@email.hemayin.com",
        subject: "请查阅您河马印帐户的邮件验证码",
    };
} else {
    exports.send_email_account = "HEMAYIN<dev@email.hemayin.com>";
    exports.email_username = "dev@email.hemayin.com";
    exports.email_password = "7SgP9wGZLa";
    exports.email_host = "smtpdm.aliyun.com";
    exports.email_port = "25";

    exports.sendEmailOptions = {
        charset: "UTF-8",
        from: "dev@email.hemayin.com",
        subject: "请查阅您河马印帐户的邮件验证码",
    };
}

/*********************************************** Manu & Logistic Label Related Config *************************************/
exports.label_printer_server_password = "Ob7wBAlaVWqMFFtzbrDqdhhTHRzOKK";

/*********************************************** User Default Setting Related Config ******************************************/
exports.default_user_profile_image_filename = "default_user_profile_image";
exports.default_user_profile_image_file_ext = ".png";
exports.user_profile_image_height = 180;
exports.user_profile_image_width = 180;
exports.nickname_max_length = 25;

/******************************************************* Validation Related Config *********************************************/
exports.verify_code_length = 4;

exports.verify_code_type_phone_register = 1;
exports.verify_code_type_phone_edit_phone = 2;
exports.verify_code_type_phone_reset_password = 3;
exports.verify_code_type_phone_temp_register = 4;
exports.verify_code_type_phone_verify_code_login = 5;

exports.verify_code_type_email_register = 1001;
exports.verify_code_type_email_edit_email = 1002;
exports.verify_code_type_email_reset_password = 1003;
exports.verify_code_type_email_verify_code_login = 1004;

//15 minutes valid time or 3 tries valid tries, which ever come first
exports.verify_code_text_valid_retry_times = 3;
exports.verify_code_text_valid_time_milsec = 15 * 60 * 1000;

//Limited verification text messaging to 10 request in 2 hours
exports.verify_code_text_request_freq_limit = 10;
exports.verify_code_text_request_freq_limit_milsec = 2 * 60 * 60 * 1000;

//15 minutes valid time or 3 tries valid tries, which ever come first
exports.verify_code_email_valid_retry_times = 3;
exports.verify_code_email_valid_time_milsec = 15 * 60 * 1000;

//Limited verification text messaging to 20 request in 2 hours
exports.verify_code_email_request_freq_limit = 20;
exports.verify_code_email_request_freq_limit_milsec = 2 * 60 * 60 * 1000;

// /********************************************************** Captcha Config *************************************************/
// if (node_env === "production") {
//     exports.luosimao_captcha_api_key =
//         prodution_authkeys_json.luosimao_captcha_api_key;
// } else if (node_env === "staging") {
//     exports.luosimao_captcha_api_key = "96543a54a572f2a056c850da9f0fb2f7";
// } else {
//     exports.luosimao_captcha_api_key = "96543a54a572f2a056c850da9f0fb2f7";
// }

// exports.luosimao_server = {
//     host: "captcha.luosimao.com",
//     port: 80,
//     path: "/api/site_verify",
//     method: "POST",
//     headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//     },
// };

//message validation config
// exports.luosimao_url = "https://captcha.luosimao.com/api/site_verify";

/******************************************************* Display Related Config ***********************************************/
exports.items_in_page = 10;
exports.standard_time_format = "YYYY-MM-DD HH:mm:ss";

/**************************************************** User Message Related Config ******************************************/
exports.max_message_center_message_list_length = 300;

/*********************************************** ZTO Express Message Related Config ****************************************/
exports.create_logistic_request_timeout = 30 * 1000;

exports.logistic_update_start_time = 4; //4am
exports.logistic_update_retry_time = 5;
exports.logistic_update_requeue_time = 1000 * 60 * 60 * 24; //24hrs
exports.logistic_to_utc_period = 8; //8hrs china to utc time
exports.logistic_to_utc_period_type = "hours";
exports.logistic_to_lost_period = "10";
exports.logistic_to_lost_period_type = "days";

if (node_env === "production") {
    exports.zto_req_host = prodution_authkeys_json.zto_req_host;
    exports.zto_req_style = "json";
    exports.zto_req_partner = prodution_authkeys_json.zto_req_partner;
    exports.zto_req_pass = prodution_authkeys_json.zto_req_pass;
    exports.zto_order_id = "";

    exports.zto_sender_name = "河马印";
    exports.zto_sender_phone = "075561688188";
    exports.zto_sender_province = "广东省";
    exports.zto_sender_city = "深圳市";
    exports.zto_sender_district = "南山区";
    exports.zto_sender_address = "科技园北区朗山二号路8号豪威大厦二楼B206-1室";
} else {
    exports.zto_req_host = "http://58.40.16.125:9001/partnerInsertSubmitagent";
    exports.zto_get_mart_host = "http://58.40.16.125:9001/bagAddrMarkGetmark";
    exports.zto_company_id = "ea8c719489de4ad0bf475477bad43dc6";
    exports.zto_key = "submitordertest==";
    exports.zto_req_partner = "test";
    exports.zto_sender_name = "TESTING IT";
    exports.zto_sender_phone = "075561688188";
    exports.zto_order_id = "xfs101100111011";
    // unuse
    exports.zto_req_style = "json";
    exports.zto_req_pass = "ZTO123";
    exports.zto_sender_province = "广东省";
    exports.zto_sender_city = "深圳市";
    exports.zto_sender_district = "南山区";
    exports.zto_sender_address = "科技园北区朗山二号路8号豪威大厦二楼B206-1室";
}

exports.logistic_order_status = {
    0: 302, //在途中: 待收货
    1: 301, //已发货: 已发货
    2: 302, //疑难件: 待收货
    3: 303, //已签收: 已签收
    4: 304, //已退货: 快递退回
    5: 302, //派送中: 待收货
};

//运单状态表
//case 0: value = "在途中"; break;
//case 1: value = "已发货"; break;
//case 2: value = "疑难件"; break;
//case 3: value = "已签收"; break;
//case 4: value = "已退货"; break;
//case 5: value = "派送中"; break;

exports.logistic_order_status_text = {
    0: "已发货",
    1: "已发货",
    2: "疑难件",
    3: "已签收",
    4: "已退货",
    5: "派送中",
};

exports.logistic_to_utc_period = 8; //8hrs china to utc time
exports.logistic_to_utc_period_type = "hours";

exports.logistic_carrier_phone = {
    zhongtong: "95311",
};

// 订单状态表
// 支付相关状态
// 101待确认; 102已确认;
//
// 退款相关状态
// 201已申请退款;
// 202已退款;
// 203退款驳回;
//
// 物流相关状态
// 301部分发货(快递揽件); 302全部发货
// 303待收货(快递途中);
// 304部分签收(快递送达); 305全部签收
// 306存在快递退回（拒签, 无人签收）;307存在快递丢失(10天快递无更新状态)
//
// 生产相关
// 401正在生产;

/*********************************************** Order Status**************************************/
exports.order_logistics_receive_all = 304;
exports.order_apply_for_refund = 201;
exports.order_logistics_receive_all_2c = 8304;
exports.order_apply_for_refund_2c = 8201;
exports.order_expire_period = 30;
exports.order_expire_period_type = "minutes";

/***************************************************** Operation Related Config *****************************************/
exports.refund_reminder = "您已经申请退款";
exports.bill_reminder = "您已经申请提供发票";
exports.support_phone = "0755-61688898";

/***************************************************** Payment Related Config *******************************************/
if (node_env === "production") {
    exports.pxx_api_key = prodution_authkeys_json.pxx_api_key;
    exports.pxx_api_id = prodution_authkeys_json.pxx_api_id;
} else {
    exports.pxx_api_key = "sk_live_bn5088PGuDuLzLiDSCf9W580";
    exports.pxx_api_id = "app_j5Sq98ibzn9Gjb1S";
}
exports.pingxx_merchant_rsa_private_key_path = path.join(
    __dirname + "/pingxx_merchant_rsa_private_key.pem"
);
exports.pingpp_create_refund_timeout = 1 * 60 * 1000;
exports.pingpp_charge_create_timeout = 1 * 60 * 1000;
exports.pingpp_charge_transfer_timeout = 1 * 60 * 1000;

/***************************************************** Refund Related Config ********************************************/
exports.refund_expire_period = 7;
exports.refund_expire_period_type = "days";
exports.order_refund_image_max_limit = 6;

/*********************************************** System setting Related Config **********************************************/
exports.android_client_type = 1;
exports.ios_client_type = 2;
exports.web_client_type = 3;

/**************************************************** Temp Order Related Config **********************************************/
exports.temp_regsiter_password_length = 6;

/**************************************************** Wechat Related Config **********************************************/
if (node_env === "production") {
    exports.weixin_key = prodution_authkeys_json.wechat_appid;
    exports.weixin_secret = prodution_authkeys_json.wechat_app_secret;
} else if (node_env === "staging") {
    exports.weixin_key = "wxb460ad993725ffdd";
    exports.weixin_secret = "f13e9535c4e53d1db07eb717d8166056";
} else {
    exports.weixin_key = "wxb460ad993725ffdd";
    exports.weixin_secret = "f13e9535c4e53d1db07eb717d8166056";
}

/*********************************************** File Size Limit Config (in KB) ************************************************/
exports.max_user_default_profile_image_size = 1 * 1024 * 1024;
exports.max_banner_image_size = 10 * 1024 * 1024;
exports.max_user_profile_image_size = 2 * 1024 * 1024;