let express = require('express');
let router = express.Router();

// 共用接口
/******************************用户验证(Auth)**************************/
let getPhoneVerifyCode = require('../controllers/common/Auth/getPhoneVerifyCode').getPhoneVerifyCode;
let getEmailVerifyCode = require('../controllers/common/Auth/getEmailVerifyCode').getEmailVerifyCode;
let login = require('../controllers/common/Auth/login').login;
let register = require('../controllers/common/Auth/register').register;

router.post('/client2c/auth/getPhoneVerifyCode', getPhoneVerifyCode);              //用户-获取手机验证码
router.post('/client2c/auth/getEmailVerifyCode', getEmailVerifyCode);              //用户-获取邮箱验证码
router.post('/client2c/auth/login', login);                                        //用户-普通登录
router.post('/client2c/auth/register', register);                                  //用户-普通注册

module.exports = router;