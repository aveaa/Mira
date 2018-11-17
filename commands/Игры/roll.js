var tools = require('../../modules/tools.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Бросить кости',
    aliases: ['кости'],
    usage: '[предельное число]',
    guild: true,
    cooldown: undefined,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        var limit = 100;

        if (!!args[0]) {
            limit = parseInt(args[0], 10);
            if (isNaN(limit)) {
                return message.reply('если задаете свой предел, то указывайте целое число.');
            } else if (limit < 2) {
                return message.reply('а где неопределенность?');
            };
        };

        message.reply(`вы бросаете кости и выпадает **${tools.randomInteger(0, limit)} из ${limit}!**`);
    },
};