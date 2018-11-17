var package = require('../../package.json');
var config = require('../../config.js');
var tools = require('../../modules/tools.js');
var Discord = require('discord.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: `Информация о ${package.name}`,
    aliases: ['info', 'version', 'developer'],
    usage: undefined,
    guild: false,
    hide: true,
    cooldown: undefined,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        var embed = new Discord.RichEmbed()
            .setAuthor('Информация о боте', 'https://i.imgur.com/wSTFkRM.png')
            .setURL('https://discord.js.org')

            .addField('Обновлен', package.version, true)
            .addField('Префикс', config.bot_prefix, true)
            .addField('Разработчик', package.author, true)

            .setColor(tools.randomHexColor());

        if (message.guild !== null) {
            var memberRequest = message.guild.members.get(message.author.id);
            embed.setFooter(`Запрос от ${(!memberRequest || !memberRequest.nickname) ? message.author.username : memberRequest.nickname} | ${config.bot_prefix}${this.name}`, message.author.displayAvatarURL);
        };

        message.channel.send({ embed });
    },
};