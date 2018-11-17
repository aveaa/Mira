var config = require('../../config.js');
var tools = require('../../modules/tools.js');
var Discord = require('discord.js');
var gifs = require('../../data/gifs.json');

var cats = [];
var emotions = [];
for (category of Object.keys(gifs)) {
    cats.push(category);
    emotions.push(`${config.bot_prefix}**${category}** [@] - ${gifs[category].description}`);
};

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Список эмоций',
    aliases: ['emotions', 'emote'].concat(cats),
    usage: undefined,
    guild: true,
    hide: false,
    cooldown: undefined,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        var emotion = message.content.slice(1).split(/ +/)[0];
        var embed = new Discord.RichEmbed();

        if (cats.includes(emotion)) {
            var victim = message.mentions.users.first()

            var gif = gifs[emotion].gif[tools.randomInteger(0, gifs[emotion].gif.length - 1)];
            var msg = gifs[emotion].msg[tools.randomInteger(0, gifs[emotion].msg.length - 1)];
            
            if (!!victim) {
                embed.setDescription(msg.replace(/\$1/g, message.author).replace(/\$2/g, victim))
            };

            embed.setImage(gif);
            embed.setColor('#ffffff');

            var memberRequest = message.guild.members.get(message.author.id);
            embed.setFooter(`Запрос от ${(!memberRequest || !memberRequest.nickname) ? message.author.username : memberRequest.nickname} | ${config.bot_prefix}${this.name}`, message.author.displayAvatarURL);

            return message.channel.send({ embed });
        };

        embed.setAuthor('Список доступных эмоций');
        embed.setDescription(emotions.join('\n').substring(0, 1024));
        embed.setColor(tools.randomHexColor());

        var memberRequest = message.guild.members.get(message.author.id);
        embed.setFooter(`Запрос от ${(!memberRequest || !memberRequest.nickname) ? message.author.username : memberRequest.nickname} | ${config.bot_prefix}${this.name}`, message.author.displayAvatarURL);

        message.channel.send({ embed });
    },
};