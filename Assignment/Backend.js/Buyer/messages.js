
const createAcccountMSG = (data) => {
    return {
        requestType: "CREATE_ACCOUNT",
        data: data
    };
}

const getLoginMSG = (data) => {
    return {
        requestType: "LOGIN",
        data: data
    };
}

const getLogoutMSG = () => {
    return {
        requestType: "LOGOUT",
    };
}
const getSearchItemsMSG = (data) => {
    return {
        requestType: "SEARCH_ITEMS",
        data: data
    };
}
const getAddItemToCartMSG = (data) => {
    return {
        requestType: "ADD_ITEM_TO_CART",
        data: data
    };
}

const getRemoveItemFromCartMSG = (data) => {
    return {
        requestType: "REMOVE_ITEM_FROM_CART",
        data: data
    };
}

const getClearCartMSG = (data) => {
    return {
        requestType: "CLEAR_CART",
        data: data
    };
}

const getDisplayCartMSG = (data) => {
    return {
        requestType: "DISPLAY_CART",
        data: data
    };
}

const getPurchaseCartMSG = (data) => {
    return {
        requestType: "PURCHASE_CART",
        data: data
    };
}

const getProvideFeedbackMSG = (data) => {
    return {
        requestType: "PROVIDE_FEEDBACK",
        data: data
    };
}

const getViewFeedbackMSG = (data) => {
    return {
        requestType: "VIEW_FEEDBACK",
        data: data
    };
}

const getViewPurchaseHistoryMSG = (data) => {
    return {
        requestType: "VIEW_PURCHASE_HISTORY",
        data: data
    };
}


module.exports = {
    createAcccountMSG,
    getLoginMSG,
    getLogoutMSG,
    getSearchItemsMSG,
    getAddItemToCartMSG,
    getRemoveItemFromCartMSG,
    getClearCartMSG,
    getDisplayCartMSG,
    getPurchaseCartMSG,
    getProvideFeedbackMSG,
    getViewFeedbackMSG,
    getViewPurchaseHistoryMSG
}
