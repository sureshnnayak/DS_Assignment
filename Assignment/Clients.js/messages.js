
const createAcccountMSG = (data) => {
    return {
        requestType: "CREATE_ACCOUNT",
        data: data,
    };
}

const getLoginMSG = (data) => {
    return {
        requestType: "LOGIN",
        data: data,
    };
}

const getLogoutMSG = () => {
    return {
        requestType: "LOGOUT",
    };
}

const getSellerRatingMSG = (data) => {
    return {
        requestType: "GET_SELLER_RATING",
        data: data,
    };
}

const getPutItemForSaleMSG = (data) => {
    return {
        requestType: "PUT_ITEM_FOR_SALE",
        data: data,
    };
}

const getRemoveItemFromSaleMSG = (data) => {
    return {
        requestType: "REMOVE_ITEM_FROM_SALE",
        data: data,
    };
}

const getDisplayItemsForSaleMSG = (data) => {
    return {
        requestType: "DISPLAY_ITEMS_FOR_SALE",
        data: data,
    };
}



module.exports = {
    createAcccountMSG,
    getLoginMSG,
    getLogoutMSG,
    getSellerRatingMSG,
    getPutItemForSaleMSG,
    getRemoveItemFromSaleMSG,
    getDisplayItemsForSaleMSG
}


