var tools = require('../../modules/tools.js');
var cache = require('../../bot.js');
var Discord = require('discord.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Бесплатное ежедневное печенье!',
    aliases: undefined,
    usage: undefined,
    guild: true,
    hide: false,
    cooldown: 86400,
    cooldownMessage:
        [
            'вы сегодня уже получали печенье! Неужели все съели?! (${leftTime})',
            'а вас толстая девочка в садике не кусала? (${leftTime})',
            'ничто так не нарушает красоту души и очарование внутреннего мира, как толстая попа (${leftTime})',
            'скрыть возраст легко, вес – гораздо сложнее (${leftTime})',
            'переедание гасит блеск в наших глазах! (${leftTime})'
        ],
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    async execute(message, args, CooldownReset) {
        var earned = tools.randomInteger(50, 100);
        var currency = cache.getCurrency(message.guild.id, message.author.id);
        cache.setCurrency(message.guild.id, message.author.id, currency + earned);

        var replyMessage = `${message.author}, вы заработали **${tools.separateThousandth(earned)}**:cookie:`;
        var embed = new Discord.RichEmbed()
            .setDescription(`Теперь у вас ${tools.separateThousandth(currency + earned)}:cookie:`);
        message.channel.send(replyMessage, { embed });
    },
};