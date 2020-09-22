let validator = require('validator')

/*************************** Add validate rule ***************************/
// special char
validator.hasEscape = function (str) {
    let pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>?~！@#￥……&*（）——|{}【】‘；：”“’。, 、？]', 'im')

    return !pattern.test(str)
}

// special char white space allowed
validator.hasEscapeWhiteSpaceAllowed = function (str) {
    let pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>?~！@#￥……&*（）——|{}【】‘；：”“’。,、？]', 'im')

    return !pattern.test(str)
}

// file ext
validator.isSupportFileExt = function (str) {
    let pattern = new RegExp('^.[A-Za-z0-9]+$')

    return pattern.test(str)
}

// text
validator.isText = function (str) {
    return str
}

// phone or email
validator.isPhoneOREmail = function (str) {
    return (validator['isPhoneWithLocale'](str) || validator['isEmail'](str))
}

// phone by country
validator.isPhoneWithLocale = function (str) {
    let local_list = ['zh-CN']

    for (let i = 0; i < local_list.length; i++) {
        if (validator.isMobilePhone(str, local_list[i])) {
            return true
        }
    }
    return false
}

// URL or Blank
validator.isUrlORBlank = function (str) {
    return (validator.isURL(str) || str === 'BLANK')
}

// client type
validator.isDefinedClientType = function (str) {
    return (str === 'mgmt' || str === 'client2b' || str === 'client2c')
}

// device type
validator.isDefinedDeviceType = function (str) {
    return (str === 'web' || str === 'ios' || str === 'android')
}

/*************************** Pre-define db type ***************************/
let DBColumnType = {
    string_legal: {
        key_word: {method: 'isText', error_message: '搜索关键字格式错误'}
    },
    number_legal: {
        page: {method: 'isInt', error_message: '不是合法的数字'},
        items_in_page: {method: 'isInt', error_message: '不是合法的数字'},
        currency: {method: 'isFloat', error_message: '不是合法的货币数字'}
    },
    url_legal: {
        page: {method: 'isURL', error_message: '链接格式错误'}
    },
    //header
    header: {
        key_value: {method: 'isInt', error_message: '系统用户ID格式错误'},
        access_token: {method: 'isMD5', error_message: '系统用户密码格式错误'},
        client_type: {method: 'isDefinedClientType', error_message: '客户端类型格式错误'},
        device_type: {method: 'isDefinedDeviceType', error_message: 'OS类型格式错误'}
    },
    //user section
    user_basic: {
        user_id: {method: 'isInt', error_message: '系统用户ID格式错误'},
        password: {method: 'isMD5', error_message: '系统用户密码格式错误'},
        phone: {method: 'isPhoneWithLocale', error_message: '系统用户手机号格式错误'},
        email: {method: 'isEmail', error_message: '系统用户邮箱格式错误'},
        merchant_account_status: {method: 'hasEscape', error_message: '商家账户状态格式错误'},
        consumer_account_status: {method: 'hasEscape', error_message: '消费用户状态格式错误'},
        mgmt_account_status: {method: 'hasEscape', error_message: '后台管理用户状态格式错误'}
    },
    //system_logs section
    user_register_log: {
        user_register_log_id: {method: 'isInt', error_message: '注册系统用户日志ID格式错误'},
        register_source: {method: 'hasEscape', error_message: '系统用户注册来源格式错误'},
        register_time: {method: 'isDate', error_message: '系统用户注册时间格式错误'},
        user_id: {method: 'isInt', error_message: '系统用户注册ID格式错误'},
        register_ip_location: {method: 'hasEscape', error_message: '系统用户注册IP地址格式错误'},
    },
    api_log: {
        api_log_id: {method: 'isInt', error_message: 'API日志ID格式错误'},
        action_subaccount_id: {method: 'isInt', error_message: '操作商家子账户ID格式错误'},
        action_user_id: {method: 'isInt', error_message: '系统用户ID格式错误'},
        action_api: {method: 'hasEscape', error_message: '操作API格式错误'},
        action_user_ip: {method: 'isIP', error_message: '操作系统用户IP格式错误'},
        action_time: {method: 'isDate', error_message: '操作日期格式错误'},
        client_type: {method: 'isDefinedClientType', error_message: '客户端类型格式错误'},
    },
    //verify_code section
    verify_code: {
        verify_code_id: {method: 'isInt', error_message: '验证码ID格式错误'},
        request_target: {method: 'isPhoneOREmail', error_message: '手机号码或邮箱格式错误'},
        target_type: {method: 'hasEscape', error_message: '验证码验证对象格式错误'},
        code: {method: 'hasEscape', error_message: '验证码格式错误'},
        code_type: {method: 'isInt', error_message: '验证码类型格式错误'},
        valid: {method: 'isBoolean', error_message: '验证码是否有效格式错误'},
        create_time: {method: 'isDate', error_message: '验证码创建时间格式错误'},
        expire_time: {method: 'isDate', error_message: '验证码过期时间格式错误'},
        try_count: {method: 'isInt', error_message: '验证验尝试次数格式错误'},
        use_time: {method: 'isDate', error_message: '验证码使用时间格式错误'},
    }
}

exports.validate = function (input_op, done) {
    try {
        //match pre-defined db type
        for (let i = 0; i < input_op.length; i++) {
            let element = input_op[i]
            let validate_value = element.attr_value
            let validate_element = DBColumnType[element.table][element.attr]
            let validate_method = validate_element.method

            let result = validator[validate_method](validate_value)

            if (Boolean(result) === false) {
                return done(new Error('invalid type!'), validate_element)
            }
        }

        //all clear
        return done(null, null)
    }
    catch (error) {
        return done(new Error('invalid type!'), {error_message: '您的请求参数格式错误哦'})
    }
}