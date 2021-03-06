exports.mgmt_auth_config = {
    // common file
    '/mgmt/auth/getUsernameStatus': [],
    '/mgmt/auth/getPhoneVerifyCode': [],
    '/mgmt/auth/getEmailVerifyCode': [],
    '/mgmt/auth/login': [],
    '/mgmt/auth/loginWithVerifyCode': [],
    '/mgmt/auth/register': [],
    '/mgmt/auth/registerTemp': [],
    '/mgmt/auth/resetPassword': [],
    '/mgmt/auth/editPhone': [],
    '/mgmt/auth/editEmailAddress': [],
    '/mgmt/oss/getOSSParams': [100, 200, 300, 301, 302, 400, 401, 402, 500, 501, 502, 600, 601, 602],

    // mgmt file
    '/mgmt/callback/pingxxRefund': [100, 300],
    '/mgmt/callback/uploadAppversionFile': [100, 500],
    '/mgmt/callback/uploadBannerImage': [100, 300],
    '/mgmt/callback/updateDefaultUserProfileImage': [100, 300],
    '/mgmt/callback/uploadHotPatchFile': [100, 500],
    '/mgmt/callback/uploadMdseGroupDisplayImage': [100, 300],
    '/mgmt/callback/uploadMdseRenderImage': [100, 300],
    '/mgmt/callback/uploadMdseSubGroupDisplayImage': [100, 300],
    '/mgmt/callback/uploadMdseTypeDeliveryImage': [100, 300],
    '/mgmt/callback/uploadMdseTypeDescImage': [100, 300],
    '/mgmt/callback/uploadMdseTypeComponentImage': [100, 300],
    '/mgmt/callback/uploadMdseTypeDetailImage': [100, 300],
    '/mgmt/callback/uploadMdseTypeDisplayImage': [100, 300],
    '/mgmt/callback/uploadMdseTypeModelImage': [100, 300],
    '/mgmt/callback/uploadMdseTypeSizeImage': [100, 300],
    '/mgmt/callback/uploadDefaultUserProfileImage': [100, 300],
    '/mgmt/callback/uploadSystemIconLabelDisplayImage': [100, 300],
    '/mgmt/callback/uploadSystemIcon': [100, 300],
    '/mgmt/callback/uploadSystemFontDisplayImage': [100, 300],
    '/mgmt/callback/uploadSystemFont': [100, 300],

    '/mgmt/userBasic/search': [100, 300],
    '/mgmt/userBasic/downloadEmail': [100, 300],
    '/mgmt/userBasic/getRegisterStat': [100, 300],

    '/mgmt/userAddress/search': [100, 300],
    '/mgmt/userInvoice/search': [100, 300],
    '/mgmt/userMessage/search': [100, 300],

    '/mgmt/mgmtUserBasic/add': [100, 200],
    '/mgmt/mgmtUserBasic/delete': [100, 200],
    '/mgmt/mgmtUserBasic/update': [100, 200],
    '/mgmt/mgmtUserBasic/search': [100, 200,300],

    '/mgmt/consumerUserBasic/search': [100, 300],
    '/mgmt/consumerUserBasic/frozeAccount': [100, 300],
    '/mgmt/consumerUserBasic/unfrozeAccount': [100, 300],
    '/mgmt/consumerUserShoppingCart/search': [100, 300, 301, 302],

	'/mgmt/consumerUserInvoiceRecord/search': [100, 300, 301, 302],
	'/mgmt/consumerUserInvoiceRecord/audit': [100, 300],

    '/mgmt/merchantUserBasic/search': [100, 300],
    '/mgmt/merchantUserBasic/frozeAccount': [100, 300],
    '/mgmt/merchantUserBasic/unfrozeAccount': [100, 300],
    '/mgmt/merchantUserBasic/getTotalUserAccountBalance': [100,300],
    '/mgmt/merchantUserAccounting/search': [100, 300],
    '/mgmt/merchantUserWalletRecord/search': [100, 300],

    '/mgmt/merchantUserSupplyinfo/add': [100, 300],
    '/mgmt/merchantUserSupplyinfo/delete': [100, 300],
    '/mgmt/merchantUserSupplyinfo/update': [100, 300],
    '/mgmt/merchantUserSupplyinfo/search': [100, 300],

    '/mgmt/merchantUserPackage/search': [100, 300],
    '/mgmt/merchantUserTag/search': [100, 300],
    '/mgmt/merchantUserPlatform2C/search': [100, 300],
    '/mgmt/merchantUserSubaccountRole/search': [100, 300],

    '/mgmt/merchantUserAgreement/search': [100, 300, 301, 302],
    '/mgmt/merchantUserAgreement/audit': [100, 300],
    '/mgmt/merchantUserAgreement/update': [100, 300],

    '/mgmt/merchantUserInvoiceRecord/search': [100, 300, 301, 302],
    '/mgmt/merchantUserInvoiceRecord/audit': [100, 300],

    '/mgmt/merchantRole/add': [100, 300],
    '/mgmt/merchantRole/delete': [100, 300],
    '/mgmt/merchantRole/update': [100, 300],
    '/mgmt/merchantRole/searchAll': [100, 300, 301, 302],

    '/mgmt/merchantCatagory/add': [100, 300],
    '/mgmt/merchantCatagory/delete': [100, 300],
    '/mgmt/merchantCatagory/update': [100, 300],
    '/mgmt/merchantCatagory/searchAll': [100, 300, 301, 302],

    '/mgmt/merchantFeesCatagory/add': [100, 300],
    '/mgmt/merchantFeesCatagory/delete': [100, 300],
    '/mgmt/merchantFeesCatagory/update': [100, 300],
    '/mgmt/merchantFeesCatagory/searchAll': [100, 300, 301, 302],

    '/mgmt/userArtwork/search':  [100, 300, 301, 302],

    '/mgmt/userArtworkRelatedLabel/search': [100, 300, 301, 302],
    '/mgmt/userIcon/search': [100, 300, 301, 302],
    '/mgmt/systemIcon/add': [100, 300,],
    '/mgmt/systemIcon/delete': [100, 300],
    '/mgmt/systemIcon/update': [100, 300],
    '/mgmt/systemIconLabel/add': [100, 300],
    '/mgmt/systemIcon/searchAll': [100, 300, 301, 302],

    '/mgmt/systemIconLabel/delete': [100, 300],
    '/mgmt/systemIconLabel/update': [100, 300],
    '/mgmt/systemIconLabel/searchAll': [100, 300, 301, 302],

    '/mgmt/systemFont/add': [100, 300],
    '/mgmt/systemFont/delete': [100, 300],
    '/mgmt/systemFont/update': [100, 300],
    '/mgmt/systemFont/searchAll': [100, 300, 301, 302],

    '/mgmt/userArtworkLabel/search': [100, 300, 301, 302],
    '/mgmt/systemArtworkLabel/add': [100, 300],
    '/mgmt/systemArtworkLabel/delete': [100, 300],
    '/mgmt/systemArtworkLabel/update': [100, 300],
    '/mgmt/systemArtworkLabel/searchAll': [100, 300, 301, 302],

    '/mgmt/mdseinfo/search': [100, 300, 400, 401, 402],
    '/mgmt/mdseinfo/getStat': [100, 300, 400, 401, 402],
    '/mgmt/mdseinfo/getManuImage': [100, 300, 400, 401, 402],
    '/mgmt/mdseinfo/getManuImageStatus': [100, 300, 400, 401, 402],
    '/mgmt/mdseinfo/getMdseinfoDetail': [100, 300, 400, 401, 402],
    '/mgmt/mdseinfo/deleteManuImage': [100, 300, 400, 401, 402],

    '/mgmt/experMdseinfo/search': [100, 300, 400, 401, 402],
    '/mgmt/experMdseinfo/getStat': [100, 300, 400, 401, 402],

    '/mgmt/order/search': [100, 300, 400, 401, 402],
    '/mgmt/order/getStat': [100, 300, 400, 401, 402],
    '/mgmt/order/refundOrderPass': [100, 300],
    '/mgmt/order/refundOrderReject': [100, 300],
	'/mgmt/order/editExchangeOrder': [100, 300],
    '/mgmt/order/refundOrderRejectExchange': [100,300],
    '/mgmt/order/endLogistic': [100, 300, 400, 401, 402],
    '/mgmt/order/finishOrder': [100, 300, 400],
    '/mgmt/order/printManuLabel': [100, 300, 400, 401, 402],
    '/mgmt/orderMdse/getOrderMdseDetail': [100, 300, 400, 401, 402],
    '/mgmt/orderMdse/getOrderMdseManuImage': [100, 300, 400, 401, 402],
    '/mgmt/orderMdse/getManuImageStatus': [100, 300, 400, 401, 402],
    '/mgmt/orderMdse/deleteOrderMdseManuImage': [100, 300, 400, 401, 402],

    '/mgmt/orderLogistic/add': [100, 300, 400, 401, 402],
    '/mgmt/orderLogistic/createOrderLogistic': [100, 300, 400, 401, 402],
    '/mgmt/orderLogistic/delete': [100, 300, 400, 401, 402],
    '/mgmt/orderLogistic/search': [100, 300, 400, 401, 402],
    '/mgmt/orderLogistic/printLogisticLabel': [100, 300, 400, 401, 402],
    
    '/mgmt/mdseGroup/add': [100, 300],
    '/mgmt/mdseGroup/delete': [100, 300],
    '/mgmt/mdseGroup/update': [100, 300],
    '/mgmt/mdseGroup/searchAll': [100, 300, 600, 601, 602],

    '/mgmt/mdseType/add': [100, 300],
    '/mgmt/mdseType/delete': [100, 300],
    '/mgmt/mdseType/update': [100, 300],
    '/mgmt/mdseType/searchAll': [100, 300, 600, 601, 602],

    '/mgmt/mdseTypeDetailImage/add': [100, 300],
    '/mgmt/mdseTypeDetailImage/delete': [100, 300],
    '/mgmt/mdseTypeDetailImage/update': [100, 300],
    '/mgmt/mdseTypeDetailImage/searchAll': [100, 300, 600, 601, 602],

    '/mgmt/mdseTypeColorOption/add': [100, 300],
    '/mgmt/mdseTypeColorOption/delete': [100, 300],
    '/mgmt/mdseTypeColorOption/update': [100, 300],
    '/mgmt/mdseTypeColorOption/searchAll': [100, 300, 600, 601, 602],

    '/mgmt/mdseTypeComponentImage/add': [100, 300],
    '/mgmt/mdseTypeComponentImage/delete': [100, 300],
    '/mgmt/mdseTypeComponentImage/update': [100, 300],
    '/mgmt/mdseTypeComponentImage/searchAll': [100, 300, 600, 601, 602],

    '/mgmt/mdseTypeRenderImage/add':  [100, 300],
    '/mgmt/mdseTypeRenderImage/delete':  [100, 300],
    '/mgmt/mdseTypeRenderImage/update':  [100, 300],
    '/mgmt/mdseTypeRenderImage/searchAll':  [100, 300, 600, 601, 602],

    '/mgmt/mdseTypeGenerateImageName/add':  [100, 300],
    '/mgmt/mdseTypeGenerateImageName/delete':  [100, 300],
    '/mgmt/mdseTypeGenerateImageName/update':  [100, 300],
    '/mgmt/mdseTypeGenerateImageName/searchAll':  [100, 300, 600, 601, 602],
    
    '/mgmt/mdseTypeAttr/add':  [100, 300],
    '/mgmt/mdseTypeAttr/delete':  [100, 300],
    '/mgmt/mdseTypeAttr/update':  [100, 300],
    '/mgmt/mdseTypeAttr/searchAll':  [100, 300, 600, 601, 602],

    '/mgmt/banner/add': [100, 300],
    '/mgmt/banner/delete': [100, 300],
    '/mgmt/banner/update': [100, 300],
    '/mgmt/banner/searchAll': [100, 300, 600, 601, 602],

    '/mgmt/appVersion/add': [100, 500],
    '/mgmt/appVersion/delete': [100, 500],
    '/mgmt/appVersion/update': [100, 500],
    '/mgmt/appVersion/searchAll': [100, 500, 501, 502],

    '/mgmt/hotPatch/add': [100, 500],
    '/mgmt/hotPatch/delete': [100, 500],
    '/mgmt/hotPatch/update': [100, 500],
    '/mgmt/hotPatch/searchAll': [100, 500, 501, 502],

    '/mgmt/systemLog/searchUserRegisterLog': [100, 300],
    '/mgmt/systemLog/searchAPILog': [100, 300],
    '/mgmt/verifyCode/search': [100, 300],
};