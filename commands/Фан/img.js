var config = require('../../config.js');
var tools = require('../../modules/tools.js');
var Discord = require('discord.js')

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Показать аватар участника',
    aliases: ['avatar'],
    usage: '[@ или ник или имя]',
    guild: true,
    hide: false,
    cooldown: undefined,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        var user = message.mentions.users.first()
            || ((user = message.guild.members.find(m => m.nickname === args.join(' '))) !== null ? user.user : undefined)
            || message.client.users.find(u => u.tag === args.join(' ') || u.username === args.join(' '))
            || message.author;

        var member = message.guild.members.get(user.id);

        var embed = new Discord.RichEmbed()
            .setTitle(`Аватар: ${(!member || !member.nickname) ? user.username : member.nickname}`)
            .setImage(user.displayAvatarURL)
            .setColor('#ffffff');

        var memberRequest = message.guild.members.get(message.author.id);
        embed.setFooter(`Запрос от ${(!memberRequest || !memberRequest.nickname) ? message.author.username : memberRequest.nickname} | ${config.bot_prefix}${this.name}`, message.author.displayAvatarURL);

        message.channel.send({ embed });
    },
};