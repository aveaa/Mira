var tools = require('../../modules/tools.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Бросить кубик',
    aliases: ['кубик'],
    usage: undefined,
    guild: true,
    cooldown: undefined,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        message.reply(`вы бросаете шестигранный кубик и выпадает **${tools.randomInteger(1, 6)}!**`);
    },
};