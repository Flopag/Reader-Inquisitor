const express = require('express');
const BookService = require('@app/books/service');
const LogService = require('@app/logs/service');
const Response = require('@utils/response');

const router = express.Router();

if(process.env.IS_TESTING)
    router.use(require('@app/auth/middlewares').mocked_user);
router.use(require('@app/auth/middlewares').is_connected);

router.post('/',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    if(!req.body.book_id || !req.body.completion){
        Response.bad_argument(res, `A book id and a completion is needed, given: ${req.body}`);
        return;
    }

    if(req.body.completion < 0 || req.body.completion > 100){
        Response.bad_argument(res, `The completion must be between 0 and 100, given: ${req.body.completion}`);
        return;
    }

    try {
        if(!await BookService.does_exist_by_id(req.body.book_id)){
            Response.bad_argument(res, `The book with id ${req.body.book_id} does not exist`);
            return;
        }
    } catch (err) {
        Response.query_error(res, 'post /logs/', err);
        return;
    }

    const lastest_completion = await LogService.get_latest_completion(req.user.user_id, req.body.book_id);

    if(lastest_completion && lastest_completion >= req.body.completion){
        Response.bad_argument(res, `The completion (${req.body.completion}) must be greater than the previous one (${lastest_completion})`);
        return;
    }

    var new_log;

    try {
        new_log = await LogService.find_or_create(req.user.user_id, req.body.book_id, req.body.completion);
    } catch (err) {
        Response.query_error(res, 'post /logs/', err);
        return;
    }

    res.status(200).json({
        "success": true,
        "message": `See data for the new log informations`,
        "data": new_log.get(),
        "error_code": null,
    });
});

module.exports = router;