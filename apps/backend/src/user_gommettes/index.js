const express = require('express');
const ErrorFactory = require('@utils/errors');
const Respond = require('@utils/responses');
const UserGommetteService = require('@app/user_gommettes/service');
const GommetteColorService = require('@app/gommette_colors/service');
const BookService = require('@app/books/service');

const router = express.Router();

if(process.env.IS_TESTING)
    router.use(require('@app/auth/middlewares').mocked_user);
router.use(require('@app/auth/middlewares').is_connected);

router.get('/',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const user_gommettes = await UserGommetteService.get_user_gommettes(req.user.user_id);

    Respond.success(res, `The gommettes of the user ${req.user.user_id} is in data field`, user_gommettes)
});

router.post('/:gommette_color',
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {
    const { gommette_color } = req.params;
    const { assigned_date, book_id } = req.body;

    if(!gommette_color)
        ErrorFactory.bad_argument(`A gommette color must be provided`);
    
    if(!await GommetteColorService.does_color_exist(gommette_color))
        ErrorFactory.bad_argument(`The gommette color ${gommette_color} does not exists`);

    if(book_id && !await BookService.does_exist_by_id(book_id))
        ErrorFactory.bad_argument(`The book ${book_id} does not exists`);

    const new_user_gommette = await UserGommetteService.assign_user_gommettes(req.user.user_id, assigned_date, gommette_color, book_id);

    Respond.success(res, `The new gommette of color ${gommette_color} has been assigned to ${req.user.user_id}`, new_user_gommette);
});

router.delete('/:gommette_id',
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {
    const { gommette_id } = req.params;

    if(!gommette_id)
        ErrorFactory.bad_argument(`A gommette id must be provided`);

    if(! await UserGommetteService.does_gommette_exist(gommette_id))
        ErrorFactory.bad_argument(`The gommette with id ${gommette_id} does not exist`);

    await UserGommetteService.remove_user_gommettes(gommette_id);

    Respond.success(res, `The new gommette of id ${gommette_id} has removed`, {});
});

module.exports = router;