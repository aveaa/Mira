var cache = require('../../bot.js');
var tools = require('../../modules/tools.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Баланс печенек',
    aliases: ['co', 'coo', 'cook', 'points', 'money', 'credits'],
    usage: '[@упоминания]',
    guild: true,
    hide: false,
    cooldown: undefined,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        var victim = message.mentions.members.first() || message.author;
        var appeal = message.author.id === victim.id ? 'вас' : victim;
        var currency = cache.getCurrency(message.guild.id, victim.id);

        if (!currency) {
            message.reply(`у ${appeal} совсем-совсем нет печенья!`);
        } else {
            message.reply(`у ${appeal} ${tools.separateThousandth(currency)}:cookie:`);
        };
    },
};