var config = require('../../config.js');
var cache = require('../../bot.js');
var tools = require('../../modules/tools.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Выдать печенье',
    aliases: ['gco', 'gcookies'],
    usage: '<@кому> <сколько>',
    guild: true,
    hide: false,
    cooldown: undefined,
    cooldownMessage: undefined,
    permissions: ['ADMINISTRATOR'],
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args) {
        if (!message.member.hasPermission(this.permissions[0])) {
            return message.reply('недостаточно привилегий!');
        };

        if (!(message.mentions.users.size && args[0].length)) {
            return message.reply('вы никого не упомянули.');
        };

        var amount = parseInt(args[1], 10);
        if (!amount) {
            return message.reply('вы не указали количество печенья, которое нужно выдать.');
        } else if (amount <= 0) {
            return message.reply('количество выдаваемого печенья не может быть отрицательным или равно нулю!');
        } else if (amount > 1000000000000) {
            amount = 1000000000000;
        };

        var victim = message.mentions.users.first();
        cache.setCurrency(message.guild.id, victim.id, cache.getCurrency(message.guild.id, victim.id) + amount);
        message.reply(`пользователю ${victim} выдано ${tools.separateThousandth(amount)}:cookie:`);
        //мультивыдача пользователЯМ
    },
};