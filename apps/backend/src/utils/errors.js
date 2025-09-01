var next_error_code = 0;

function bad_argument(message) {
    var err = new Error(`Bad argument error:\n${message}`);
    err.status = 400
    throw err;
}

function runtime(message){
    var err = new Error(message);
    throw err;
}

function middleware(err, req, res, next){
    res.status(err.status || 500).json({
        "success": false,
        "message": (err.status) ? err.message : "Internal Error",
        "data": {},
        "error_code": (err.status) ? null : next_error_code,
    });
    if(!err.status){
        console.error(`[${next_error_code}] Internal error:\n\n  ${err}\n\n  ${err.stack}\n==========`);
        next_error_code++;
    }
};

module.exports = {
    bad_argument,
    runtime,
    middleware
};