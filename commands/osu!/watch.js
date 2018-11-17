var Discord = require('discord.js')
var osu = require('../../modules/osu.js');
var tools = require('../../modules/tools.js');
var config = require('../../config.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Ссылка для наблюдения',
    aliases: ['w', 'spectate'],
    usage: '[@ или ник]',
    guild: true,
    cooldown: undefined,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    async execute(message, args, CooldownReset) {
        var { nick, mode, server } = await osu.searchPlayer(message, args);

        var embed = new Discord.RichEmbed()
            .setAuthor('Ссылка для наблюдения')
            .setTitle(`<osu://spectate/${nick}>`)

        var osuUser = osu.get_user(nick, null, server);
        if (!(!osuUser || !osuUser.length)) {
            var links = osu.getValueOnKeyFromJson('links', server);
            embed.setImage(links['avatar'].replace('ID', osuUser[0].user_id));
        };

        embed.setColor(tools.randomHexColor());

        var requestMember = message.guild.members.get(message.author.id);
        embed.setFooter(`Запрос от ${requestMember['nickname'] ? requestMember.nickname : message.author.username} | ${config.bot_prefix}${this.name}${server === 'ppy' ? '' : ` | ${osu.getValueOnKeyFromJson('server', server)}`}`, message.author.displayAvatarURL);

        message.channel.send({ embed });
    },
};