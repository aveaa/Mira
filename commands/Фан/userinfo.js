var config = require('../../config.js');
var tools = require('../../modules/tools.js');
var Discord = require('discord.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Информация о пользователе',
    aliases: ['user'],
    usage: '[@упоминание]',
    guild: true,
    hide: false,
    cooldown: undefined,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        var user = message.mentions.users.first() || message.client.users.find(u => u.username === args.join(' ') || (u.username + '#' + u.discriminator) === args.join(' ')) || message.author;
        var member = message.guild.members.get(user.id);

        var embed = new Discord.RichEmbed()
        embed.setAuthor(`Информация о ${(!member || !member.nickname) ? user.username : member.nickname}`, user.avatarURL || user.user.avatarURL)

        embed.setThumbnail(user.avatarURL || user.user.avatarURL)

        embed.addField('Имя аккаунта', `\`${user.tag}\``, true)
        embed.addField('Упоминание', user, true)

        if (!!user.createdAt) {
            embed.addField('Дата создания', tools.toDate(user.createdAt), true);
        };
        if (!!member && !!member.joinedAt) {
            embed.addField('Дата подключения', tools.toDate(member.joinedAt), true);
        };

        embed.setColor(tools.randomHexColor());

        var memberRequest = message.guild.members.get(message.author.id);
        embed.setFooter(`Запрос от ${(!memberRequest || !memberRequest.nickname) ? message.author.username : memberRequest.nickname} | ${config.bot_prefix}${this.name}`, message.author.displayAvatarURL);

        message.channel.send({ embed });
    },
};