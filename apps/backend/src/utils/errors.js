var next_error_code = 0;

function bad_argument(message) {
    var err = new Error(`Bad argument error:\n${message}`);
    err.status = 400
    throw err;
}

function forbidden(message) {
    var err = new Error(`Forbidden error:\n${message}`);
    err.status = 403
    throw err;
}

function runtime(message){
    var err = new Error(message);
    throw err;
}

function middleware(err, req, res, next){
    const must_hide = !err.status || err.status == 500;
    res.status(err.status || 500).json({
        "success": false,
        "message": (!must_hide) ? err.message : "Internal Error",
        "data": {},
        "error_code": (!must_hide) ? null : next_error_code,
    });
    if(!err.status || err.status == 500){
        console.error(`[${next_error_code}] Internal error:\n\n  ${err}\n\n  ${err.stack}\n==========`);
        next_error_code++;
    }
};

module.exports = {
    bad_argument,
    forbidden,
    runtime,
    middleware
};