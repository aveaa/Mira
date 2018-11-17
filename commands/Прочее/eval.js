var package = require('../../package.json');
var config = require('../../config.js');
var tools = require('../../modules/tools.js');
var Discord = require('discord.js');
var bot = require('../../bot.js');
var cache = bot;

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Выполнить указанный код',
    aliases: ['developer'],
    usage: '<код>',
    guild: false,
    hide: true,
    cooldown: 1,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        if (message.author.tag !== package.author) {
            return message.reply(`команда ${this.name} доступна только разработчику!`);
        };

        if (args[0] === undefined) {
            return message.reply(`вы не указали код для выполнения.`);
        };

        var client = message.client;

        try {
            var code = args.join(' ');
            var evaled = eval(code);

            /*if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled);
            };
			
            message.channel.send(evaled, {code:'xl'});*/
        } catch (err) {
            message.channel.send(`\`\`\`xl\n${err}\n\`\`\``);
        }
    },
};