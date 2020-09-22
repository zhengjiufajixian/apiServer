let fs = require('fs');
let uuid = require('uuid');
let moment = require('moment');
let random = require("random-js");
let npm_validator = require('validator');

let config = require('../config/sys_config.js');

// get current time in milseconds
exports.getTime = function () {
    return new Date().getTime();
};

// get current utc date
exports.getDate = function (time_format) {
    if (time_format === null ||
        time_format == "" ||
        typeof time_format === 'undefined') {
        return moment.utc().format(config.standard_time_format);
    } else {
        return moment.utc().format(time_format);
    }
};

// trans date format
exports.transTimestampToDate = function (timestamp) {
    return moment(timestamp).utc().format(config.standard_time_format);
};

// get current local date
exports.getLocalTime = function () {
    return moment().format(config.standard_time_format);
};

// get ZTO API document date
exports.getZTOAPITime = function () {
    return moment().utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');
};

// compare if first date is before sec date
// 判断第一个时间参数是否早于第二个时间参数
exports.isDateBefore = function (first_date, sec_date) {
    return moment(first_date).isBefore(sec_date);
};

// get first day of this month
exports.getFirstDayOfMonth = function () {
    return moment().startOf('month').utc().format();
};

// get last day of this month
exports.getLastDayOfMonth = function () {
    return moment().endOf('month').utc().format();
};

// get first day of this week
exports.getFirstDayOfWeek = function () {
    return moment().startOf('week').utc().format();
};

// get last day of this week
exports.getLastDayOfWeek = function () {
    return moment().endOf('week').utc().format();
};

// get begin of this day
exports.getBeginOfDay = function () {
    return moment().startOf('day').utc().format();
};

// get end of this day
exports.getEndOfDay = function () {
    return moment().endOf('day').utc().format();
};

// add some time to date
exports.addTimetoDate = function (date, time_to_be_added, time_to_be_added_type) {
    return moment(date).add(time_to_be_added, time_to_be_added_type).format(config.standard_time_format);
};

// get a random password
exports.getRandomPassword = function (length) {
    let pool = "ABCDEFGHJKMNOPQRSTUVWXYZ023456789";
    return new random().string(length, pool);
};

// get a random int string
exports.getRandomInt = function (length) {
    let pool = "0123456789";
    return new random().string(length, pool);
};

// get a random string
exports.getRandomString = function (length) {
    return new random().string(length);
};

// get a random string without repeat
exports.getRandomStringNoRepeat = function (length) {
    let pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return new random().sample(pool, length);
};

// get an universal unique ID
exports.getUUID = function () {
    return uuid.v1();
};

// getVerifyCodeExpTime
exports.getVerifyCodeExpTime = function (code_type) {
    if (code_type < 1000) {
        return moment().add(config.verify_code_text_valid_time_milsec, 'milliseconds').utc().format(config.standard_time_format);
    } else {
        // email
        return moment().add(config.verify_code_email_valid_time_milsec, 'milliseconds').utc().format(config.standard_time_format);
    }
};

// make an array into key-value map
exports.makeKeyValueMap = function (array, key) {
    let obj = {};
    for (let i = 0; i < array.length; i++) {
        //obj.key = value
        obj[array[i][key]] = array[i];
    }
    return obj;
};

// make list from an object
exports.makeArray = function (object) {
    let arr = [];
    for (let key in object) {
        arr.push(object[key])
    }
    return arr;
};

// shuffle array
exports.shuffleArray = function (array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

// getFullHttpURL
exports.getFullHttpURL = function (str) {
    if (str && str.indexOf('http') == -1) {
        return config.oss_public_cdn_url + str;
    }
    else if (str == 0) {
        return '';
    }
    else {
        return str;
    }
};

// removeFullHttpURL
exports.removeFullHttpURL = function (str) {
    if (str && str.indexOf('http') == -1) {
        return str;
    }
    else if (str == 0) {
        return '';
    }
    else {
        return str.replace(config.oss_public_cdn_url, '');
    }
};

// get page_start_num, and items_in_page
exports.getPaginateParams = function (page, items_in_page) {
    let page_start_num;

    if (page < 1 ||
        (typeof page === "number") &&
        (isFinite(page)) &&
        (Math.floor(page) === page) == false) {
        page = 1;
    }

    if (items_in_page > 1 && items_in_page < 300) {
        page_start_num = (page - 1) * parseInt(items_in_page);
    }
    else if (items_in_page > 300) {
        items_in_page = 300;
        page_start_num = (page - 1) * parseInt(items_in_page);
    }
    else {
        items_in_page = config.items_in_page;
        page_start_num = (page - 1) * parseInt(config.items_in_page);
    }

    return {
        page_start_num: Number(page_start_num),
        items_in_page: Number(items_in_page)
    }
};


// judge if appversion ext is supported
exports.isAppversionExtSupported = function (file_type) {
    return file_type == 'apk';
};

// judge if hotpatch ext is supported
exports.isHotPatchExtSupported = function () {
    return true;
};

// judge if image ext is supported
exports.isImageExtSupported = function (image_ext) {
    return image_ext == 'jpg' || image_ext == 'jpeg' || image_ext == 'tiff' || image_ext == 'tif' || image_ext == 'png';
};

// judge if banner_image ext is supported
exports.isBannerImageExtSupported = function (image_ext) {
    return image_ext == 'jpg' || image_ext == 'jpeg' || image_ext == 'tiff' || image_ext == 'tif' || image_ext == 'png' || image_ext == 'gif';
};

// judge if font ext is supported
exports.isFontExtSupported = function (file_type) {
    return file_type == 'ttf' || file_type == 'otf';
};

// judge if file size is over limit
exports.checkFileOverLimit = function (image_file, max_size_in_bytes) {
    if (image_file === null || image_file === "" || typeof image_file == "undefined") {
        return false;
    } else {
        let stats = fs.statSync(image_file);
        let image_size_in_bytes = stats.size;
        return (image_size_in_bytes > max_size_in_bytes);
    }
};

// res user profile image filename
exports.getUserProfileImageFilename = function (user_profile_image_uuid, user_profile_image_ext) {
    if (Boolean(user_profile_image_uuid) == false) {
        return config.default_user_profile_image_filename + config.default_user_profile_image_file_ext;
    } else if (Boolean(user_profile_image_uuid) == true && Boolean(user_profile_image_ext) == false) {
        return user_profile_image_uuid;
    } else {
        return user_profile_image_uuid + user_profile_image_ext;
    }
};

// filter and replace qq phone email in comment
exports.regexpReplaceComment = function (comment, replacestr) {
    let comment_regexp = {
        email: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/g,
        mobile_phone_cn: /(13|14|15|17|18)[0-9]{9}/g,
        phone_cn: /\(?\d{3,4}\)?-?\d{7,8}/g,
        qq: /[1-9]([0-9]{5,11})/g
    };

    for (let key in comment_regexp) {
        comment = comment.replace(new RegExp(comment_regexp[key]), replacestr);
    }
    return comment;
};

// check if username is correctly formatted
exports.checkUsernameType = function (username) {
    let username_type;

    if (npm_validator.isMobilePhone(username, 'zh-CN')) {
        username_type = 'phone';
    }
    if (npm_validator.isEmail(username)) {
        username_type = 'email';
    }
    return username_type;
};

exports.isEmptyObject = function (obj) {
    for (let k in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(k)) {
            return false
        }
    }
    return true
}