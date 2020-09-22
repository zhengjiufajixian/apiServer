let http = require('http');
let querystring = require('querystring');

let config = require('../../config/sys_config.js');
let output_common = require('../../config/output_common');

exports.humanVerifyCheck = function (auth_code, done) {
    if (config.node_env !== 'production') {
        return done(null, null);
    }

    let chunk_result;
    let postData = {
        api_key: config.luosimao_captcha_api_key,
        response: auth_code
    };

    let postDataString = querystring.stringify(postData);

    let options = config.luosimao_server;
    options.headers['Content-Length'] = postDataString.length;

    let req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            chunk_result = chunk;
        });
        res.on('end', function () {
            console.log(chunk_result);
            chunk_result = JSON.parse(chunk_result);

            // if luosimao verify failed, return false
            if (chunk_result.res === 'failed') {
                done(output_common.HUMANVERIFYCHECK_HUMAN_VERIFY_ERR, null);
            } else {
                done(null, null);
            }
        });
    });

    req.on('error', function (error) {
        console.log('humanVerifyCheck error: ', error);
        done(output_common.HUMANVERIFYCHECK_HUMAN_VERIFY_ERR, null);
    });

    req.write(postDataString);
    req.end();
};