/**
 * Revised by SIMDD on 2018/01/05.
 */

'use strict';

/**************************Example [-start_code, -end_code)************************
 getExample.js  [-start_code, -(start_code+100))
 exports.CONTROLLERSNAME_FILENAME_ERRORNAME = {
    status: -start_code,
    result: {},
    message: 'displayed to the user',
    dev_message: 'displayed to the developer'
};
 **************************************************************************************/


/***************************Specific [0, -1000)*************************/
// Status Always -2
exports.DB_ERR = {
    status: -2,
    result: {},
    message: '系统有点小问题, 程序员正在修复呢',
    dev_message: '数据库错误'
};

// Status Always -3
exports.VALIDATE_ERR = {
    status: -3,
    result: {},
    message: '',
    dev_message: ''
};

// Status Alway -4
exports.DELETE_FILE_ERR = {
    status: -4,
    result: {},
    message: '删除文件错误',
    dev_message: '删除文件错误'
};

// Status Alway -5
exports.SAVE_FILE_ERR = {
    status: -5,
    result: {},
    message: '保存文件错误',
    dev_message: '保存文件错误'
};

// Status Alway -6
exports.COPY_FILE_ERR = {
    status: -6,
    result: {},
    message: '复制文件错误',
    dev_message: '复制文件错误'
};


/***************************MiddleWare [-1000, -3000)*************************/
// tokenValidate.js
exports.MIDDLEWARE_TOKENVALIDATE_TOKEN_EXPIRED = {
    status: -1000,
    result: {},
    message: '登录状态异常, 请重新登录',
    dev_message: 'TOKEN失效'
};
exports.MIDDLEWARE_TOKENVALIDATE_TOKEN_DENIED = {
    status: -1001,
    result: {},
    message: '登录状态异常, 请重新登录',
    dev_message: 'TOKEN被拒绝'
};

// merchantPermissionCheck.js
exports.MIDDLEWARE_MERCHANT_PERMISSION_CHECK_DENIED = {
    status: -1200,
    result: {},
    message: '权限不足, 暂时无法使用该功能',
    dev_message: '权限不足, 暂时无法使用该功能'
};

// limiter.js
exports.MIDDLEWARE_LIMITER_TOO_FREQ = {
    status: -2000,
    result: {},
    message: '点击太快了请慢一点',
    dev_message: '请求太频繁'
};

/*****************************Library [-3000, -10000)**************************/
/**** emailContentHelper [-3000, -3200) ****/
/**** experMdseinfoHelper [-3200, -3400) ****/
/**** factoryImageHelper [-3400, -3600) ****/
/**** humanVerifyHelper [-3600, -3800) ****/
// humanVerifyCheck.js  [-3600, -3620)
exports.HUMANVERIFYCHECK_HUMAN_VERIFY_ERR = {
    status: -3600,
    result: {},
    message: '人机验证错误, 请重再试一次',
    dev_message: '人机验证错误, 请重再试一次'
};
/**** keywordFilterHelper [-3800, -4000) ****/
/**** loginHelper [-4000, -4200) ****/
// loginHumanVerifyTimer.js  [-4000, -4020)
exports.LOGINHUMANVERIFYTIMER_REDIS_GET_ERR = {
    status: -4000,
    result: {},
    message: '出现了一点小问题, 请重试一次',
    dev_message: 'redis获取登录验证次数错误'
};
exports.LOGINHUMANVERIFYTIMER_REDIS_SET_ERR = {
    status: -4001,
    result: {},
    message: '出现了一点小问题, 请重试一次',
    dev_message: 'redis set登录验证次数错误'
};
// loginVerifyCheck.js  [-3000, -3100)
exports.LOGINVERIFYCHECK_USERINFO_INCORRECT_ERR = {
    status: -4002,
    result: {},
    message: '您的用户名密码组合不正确。',
    dev_message: '您的用户名密码组合不正确。'
};
exports.LOGINVERIFYCHECK_USERINFO_NOTFOUND_ERR = {
    status: -4003,
    result: {},
    message: '无用户信息记录。',
    dev_message: '无用户信息记录。'
};
exports.LOGINVERIFYCHECK_USER_ACCOUNT_FORZE_ERR = {
    status: -4004,
    result: {},
    message: '您的账户已冻结。',
    dev_message: '您的账户已冻结。'
};
exports.LOGINVERIFYCHECK_USERNAME_INCORRECT_ERR = {
    status: -4005,
    result: {},
    message: '您的用户名格式不正确',
    dev_message: '您的用户名格式不正确'
};

// searchConditionHelper.js  [-5200, -5220)
exports.SEARCHCONDITIONHELPER_SEARCH_PARAMS_ERR = {
    status: -5200,
    result: {},
    message: '搜索条件错误',
    dev_message: '搜索条件错误'
};
// searchKeywordHelper.js  [-5220, -5240)
exports.SEARCHKEYWORDHELPER_EMPTY_KEYWORD = {
    status: -5220,
    result: {},
    message: '',
    dev_message: '搜索关键字为空'
};
/**** verifyCodeHelper [-6000, -6200) ****/
// checkVerifyCode.js  [-6000, -6200)
exports.CHECKVERIFYCODE_VERIFYCODE_NOT_EXIST = {
    status: -6000,
    result: {},
    message: '验证码不存在, 请重新获取',
    dev_message: '验证码不存在。'
};
exports.CHECKVERIFYCODE_VERIFYCODE_NOT_VALID = {
    status: -6001,
    result: {},
    message: '验证码已经失效, 请重新获取',
    dev_message: '验证码已经失效。'
};
exports.CHECKVERIFYCODE_VERIFYCODE_EXPIRED = {
    status: -6002,
    result: {},
    message: '验证码已过期, 请重新获取',
    dev_message: '验证码已过期。'
};
exports.CHECKVERIFYCODE_VERIFYCODE_OUT_OF_TRY = {
    status: -6003,
    result: {},
    message: '验证码使用次数过多, 已失效',
    dev_message: '验证码使用次数过多。'
};
exports.CHECKVERIFYCODE_VERIFYCODE_NOT_MISMATCH = {
    status: -6004,
    result: {},
    message: '验证码不匹配。',
    dev_message: '验证码不匹配。'
};
exports.CHECKVERIFYCODE_VERIFYCODE_UPDATE_ERR = {
    status: -6005,
    result: {},
    message: '啊哦, 出错了。',
    dev_message: '更新验证码 affectedRow:0'
};
// checkVerifyCodePolicy.js  [-6020, -6040)
exports.CHECKVERIFYCODEPOLICY_REQUEST_TOO_FREQ = {
    status: -6020,
    result: {},
    message: '验证码请求太频繁，请过一段时间再试',
    dev_message: '验证码请求太频繁，请过一段时间再试。'
};
/**** tokenGenerator [-6200, -6400) ****/
// tokenGenerator.js  [-6200, -6220)
exports.TOKENGENERATOR_GEN_TOKEN_ERR = {
    status: -6200,
    result: {},
    message: '啊哦, 出错了。',
    dev_message: 'GEN TOKEN错误。'
};

/*****************************Queue [-10000, -12000)**************************/
// textMessager.js  [-10000, -10100)
exports.TEXTMESSAGER_SEND_MESSAGE_ERR = {
    status: -10000,
    result: {},
    message: '啊哦, 发送短信出错了。',
    dev_message: '发送短信出错了'
};

// emailSender.js  [-10100, -10200)
exports.EMAILSENDER_SEND_EMAIL_ERR = {
    status: -10100,
    result: {},
    message: '啊哦, 发送Email出错了。',
    dev_message: '发送Email出错了'
};

/************************Auth [-12000, -15000)************************/
// getUsernameStatus.js  [-12000, -12100)
exports.AUTH_GETUSERNAMESTATUS_USERNAME_INCORRECT_ERR = {
    status: -12000,
    result: {},
    message: '您的用户名格式不正确',
    dev_message: '您的用户名格式不正确'
};
exports.AUTH_GETUSERNAMESTATUS_SUCCESS = {
    status: 1,
    result: {},
    message: '获取注册状态成功',
    dev_message: '获取注册状态成功'
};

// getPhoneVerifyCode.js  [-12100, -12200)
exports.AUTH_GETPHONEVERIFYCODE_PHONE_ALREADY_REG = {
    status: -12100,
    result: {},
    message: '该手机号已经注册了',
    dev_message: '该手机号已经被注册了'
};
exports.AUTH_GETPHONEVERIFYCODE_PHONE_NO_EXIST = {
    status: -12101,
    result: {},
    message: '该手机号未绑定任何账户',
    dev_message: '该手机号未绑定任何账户'
};
exports.AUTH_GETPHONEVERIFYCODE_SAVE_ERR = {
    status: -12102,
    result: {},
    message: '出现了一点小问题, 请重试一次',
    dev_message: '验证码保存错误'
};
exports.AUTH_GETPHONEVERIFYCODE_ILLEGAL_CODE_TYPE = {
    status: -12103,
    result: {},
    message: '出现了一点小问题, 请重试一次',
    dev_message: '非法的验证码类型'
};
exports.AUTH_GETPHONEVERIFYCODE_SUCCESS = {
    status: 1,
    result: {},
    message: '获取手机验证码成功',
    dev_message: '获取手机验证码成功'
};

// getEmailVerifyCode.js  [-12200, -12300)
exports.AUTH_GETEMAILVERIFYCODE_EMAIL_ALREADY_REG = {
    status: -12200,
    result: {},
    message: '该邮箱已经注册了',
    dev_message: '该邮箱已经被注册了'
};
exports.AUTH_GETEMAILVERIFYCODE_EMAIL_NO_EXIST = {
    status: -12201,
    result: {},
    message: '该邮箱未绑定任何账户',
    dev_message: '该邮箱未绑定任何账户'
};
exports.AUTH_GETEMAILVERIFYCODE_SAVE_ERR = {
    status: -12202,
    result: {},
    message: '出现了一点小问题, 请重试一次',
    dev_message: '验证码保存错误'
};
exports.AUTH_GETEMAILVERIFYCODE_ILLEGAL_CODE_TYPE = {
    status: -12203,
    result: {},
    message: '出现了一点小问题, 请重试一次',
    dev_message: '非法的验证码类型'
};
exports.AUTH_GETEMAILVERIFYCODE_SUCCESS = {
    status: 1,
    result: {},
    message: '获取邮箱验证码成功',
    dev_message: '获取邮箱验证码成功'
};

// login.js  [-12300, -12400)
exports.AUTH_LOGIN_SUCCESS = {
    status: 1,
    result: {},
    message: '登录成功。',
    dev_message: '登录成功。'
};

// loginWithVerifyCode.js  [-12400, -12500)
exports.AUTH_LOGINWITHVERIFYCODE_USERNAME_INCORRECT_ERR = {
    status: -12400,
    result: {},
    message: '您的用户名格式不正确',
    dev_message: '您的用户名格式不正确'
};
exports.AUTH_LOGINWITHVERIFYCODE_SUCCESS = {
    status: 1,
    result: {},
    message: '登录成功。',
    dev_message: '登录成功。'
};

// register.js  [-12500, -12600)
exports.AUTH_REGISTER_ALREADY_REGISTER_ERR = {
    status: -12500,
    result: {},
    message: '该用户名已经注册过',
    dev_message: '该用户名已经注册过'
};
exports.AUTH_REGISTER_USERNAME_INCORRECT_ERR = {
    status: -12501,
    result: {},
    message: '您的用户名格式不正确',
    dev_message: '您的用户名格式不正确'
};
exports.AUTH_REGISTER_SUCCESS = {
    status: 1,
    result: {},
    message: '注册成功',
    dev_message: '注册成功'
};

// resetPassword.js  [-12700, -12800)
exports.AUTH_RESETPASSWORD_USER_NOT_EXIST = {
    status: -12700,
    result: {},
    message: '您的账户不存在',
    dev_message: '您的账户不存在'
};
exports.AUTH_RESETPASSWORD_SAVE_NEW_PWD_ERR = {
    status: -12701,
    result: {},
    message: '新密码更新失败',
    dev_message: '新密码更新失败'
};
exports.AUTH_RESETPASSWORD_USERNAME_INCORRECT_ERR = {
    status: -12702,
    result: {},
    message: '您的用户名格式不正确',
    dev_message: '您的用户名格式不正确'
};
exports.AUTH_RESETPASSWORD_SUCCESS = {
    status: 1,
    result: {},
    message: '更新密码成功',
    dev_message: '更新密码成功'
};

// editPhone.js  [-12800, -12900)
exports.AUTH_EDITPHONE_PASSWORD_NOT_MATCH = {
    status: -12800,
    result: {},
    message: '您的输入密码不匹配',
    dev_message: '您的输入密码不匹配'
};
exports.AUTH_EDITPHONE_PHONE_ALREADY_USERD = {
    status: -12801,
    result: {},
    message: '手机号码已使用',
    dev_message: '手机号码已使用'
};
exports.AUTH_EDITPHONE_SUCCESS = {
    status: 1,
    result: {},
    message: '编辑手机成功',
    dev_message: '编辑手机成功'
};

// editEmailAddress.js  [-12900, -13000)
exports.AUTH_EMAILADDRESS_PASSWORD_NOT_MATCH = {
    status: -12900,
    result: {},
    message: '您的输入密码不匹配',
    dev_message: '您的输入密码不匹配'
};
exports.AUTH_EMAILADDRESS_EMAIL_ALREADY_USERD = {
    status: -12901,
    result: {},
    message: '邮箱地址已使用',
    dev_message: '邮箱地址已使用'
};
exports.AUTH_EMAILADDRESS_SUCCESS = {
    status: 1,
    result: {},
    message: '编辑邮箱成功',
    dev_message: '编辑邮箱成功'
};