const express = require('express');
const BookService = require('@app/books/service');
const LogService = require('@app/logs/service');
const ErrorFactory = require('@utils/errors');
const Respond = require('@utils/responses');

const router = express.Router();

if(process.env.IS_TESTING)
    router.use(require('@app/auth/middlewares').mocked_user);
router.use(require('@app/auth/middlewares').is_connected);
router.use(require('@app/auth/middlewares').usurpate);

router.post('/',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    if(!req.body?.book_id || !req.body?.completion)
        ErrorFactory.bad_argument(`A book id and a completion is needed, given: ${req.body}`);

    if(req.body.completion < 0 || req.body.completion > 100)
        ErrorFactory.bad_argument(`The completion must be between 0 and 100, given: ${req.body.completion}`);

    if(!await BookService.does_exist_by_id(req.body.book_id))
        ErrorFactory.bad_argument(`The book with id ${req.body.book_id} does not exist`);

    const lastest_completion = await LogService.get_latest_completion(req.user.user_id, req.body.book_id);

    if(lastest_completion && lastest_completion >= req.body.completion)
        ErrorFactory.bad_argument(`The completion (${req.body.completion}) must be greater than the previous one (${lastest_completion})`);

    const new_log = await LogService.find_or_create(req.user.user_id, req.body.book_id, req.body.completion);

    Respond.success(res, `See data for the new log informations`, new_log.get());
});

router.get('/completion/:book_id',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const { book_id } = req.params;

    if(!book_id)
        ErrorFactory.bad_argument(`The id of the book is missing`);

    if(!await BookService.does_exist_by_id(book_id))
        ErrorFactory.bad_argument(`The book with id=${book_id} does not exist`);

    const data = await LogService.get_latest_completion(req.user.user_id, book_id);

    Respond.success(res, `See data for the last completion corresponding to book id=${book_id}`, data);
});

router.get('/last',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const data = await LogService.get_last_log(req.user.user_id);

    Respond.success(res, `See data for the last log`, data);
});

router.get('/last/:book_id',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const { book_id } = req.params;

    if(!book_id)
        ErrorFactory.bad_argument(`The id of the book is missing`);

    if(!await BookService.does_exist_by_id(book_id))
        ErrorFactory.bad_argument(`The book with id=${book_id} does not exist`);

    const data = await LogService.get_last_log_from_book(req.user.user_id, book_id);

    Respond.success(res, `See data for the last log from book with id=${book_id}`, data);
});

router.get('/',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const data = await LogService.get_all_logs(req.user.user_id);

    Respond.success(res, `See data for the list of all logs`, data);
});

router.get('/:book_id',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const { book_id } = req.params;

    if(!book_id)
        ErrorFactory.bad_argument(`The id of the book is missing`);

    if(!await BookService.does_exist_by_id(book_id))
        ErrorFactory.bad_argument(`The book with id=${book_id} does not exist`);

    const data = await LogService.get_all_logs_by_book(req.user.user_id, book_id);

    Respond.success(res, `See data for the list og logs corresponding to book id=${book_id}`, data);
});

router.post('/reset/:book_id',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const { book_id } = req.params;

    if(!book_id)
        ErrorFactory.bad_argument(`The id of the book is missing`);

    if(!await BookService.does_exist_by_id(book_id))
        ErrorFactory.bad_argument(`The book with id=${book_id} does not exist`);

    const new_log = await LogService.find_or_create(req.user.user_id, book_id, 0);

    Respond.success(res, `The completion for the book id=${book_id} has been reset to 0`, new_log.get());
});

router.delete('/:log_id',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const { log_id } = req.params;

    if(!log_id)
        ErrorFactory.bad_argument(`The id of the log is missing`);

    if(await LogService.destroy_by_id(log_id) === 0)
        ErrorFactory.bad_argument(`The log with id=${log_id} does not exist`);

    Respond.success(res, `The log with id=${log_id} has been successfully deleted`, {});
});

module.exports = router;