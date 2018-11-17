var tools = require('../../modules/tools.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Подбросить монетку',
    aliases: ['монетка'],
    usage: undefined,
    guild: true,
    cooldown: undefined,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        var result;

        if (tools.randomBoolean()) {
            result = 'выпала **решка** :sparkles:';
        } else {
            result = 'выпал **орёл** :eagle:';
        };

        message.reply(result);
    },
};