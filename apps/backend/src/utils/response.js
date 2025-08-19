function bad_argument(res, message) {
    res.status(400).json({
        "success": false,
        "message": message,
        "data": {},
        "error_code": null,
    });
}

function query_error(res, localisation, err) {
    console.error(`[${localisation}]: An error occured with the database:`, err);
    res.status(500).json({
        "success": false,
        "message": `An error occured with the database`,
        "data": {},
        "error_code": null,
    });
}

module.exports = {
    bad_argument,
    query_error,
};