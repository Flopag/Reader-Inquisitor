function success(res, message, data){
    res.status(200).json({
        "success": true,
        "message": message,
        "data": data,
        "error_code": null,
    });
}

module.exports = {
    success,
}