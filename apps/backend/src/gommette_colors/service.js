const GommetteColor = require('@models/gommette_color');

async function does_color_exist(color){
    return !!(await GommetteColor.findOne({where: {color: color}}));
}

module.exports = {
    does_color_exist,
};