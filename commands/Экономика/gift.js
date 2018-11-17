var config = require('../../config.js');
var cache = require('../../bot.js');
var tools = require('../../modules/tools.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Поделиться печеньем',
    aliases: ['share', 'give'],
    usage: '<@кому> <сколько>',
    guild: true,
    hide: false,
    cooldown: 6,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        if (!(message.mentions.users.size && args[0].length)) {
            return message.reply('вы никого не упомянули.');
        };

        var amount = parseInt(args[1], 10);
        if (!amount) {
            return message.reply('вы не указали количество печенья, которое хотите передать.');
        } else if (amount <= 0) {
            return message.reply('количество передаваемого печенья не может быть отрицательным или равно нулю!');
        };

        var currency = cache.getCurrency(message.guild.id, message.author.id);
        if (!currency) {
            return message.reply('вам нечего передавать!');
        } else if (currency < amount) {
            return message.reply('не хватает!');
        };

        var victim = message.mentions.members.first();
        if (message.author.id === victim.id) {
            cache.setCurrency(message.guild.id, message.author.id, currency - amount);
            message.reply('я съела печенье, которое вы хотели передать самому себе ... оно ведь вам было не нужно?')
        } else {
            cache.setCurrency(message.guild.id, message.author.id, currency - amount);
            cache.setCurrency(message.guild.id, victim.id, cache.getCurrency(message.guild.id, victim.id) + amount);
            message.reply(`вы передали ${victim} ${tools.separateThousandth(amount)}:cookie:`);
        };
    },
};