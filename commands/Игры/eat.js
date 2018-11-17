var config = require('../../config.js');
var tools = require('../../modules/tools.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Съесть печенье',
    aliases: undefined,
    usage: '<кол-во>',
    guild: true,
    hide: true,
    cooldown: undefined,
    cooldownMessage: undefined,
    permissions: undefined,
	group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        var currency = cache.getCurrency(message.guild.id, message.author);
        
        if (!currency) {
            message.reply(`у вас нет печенья, чтобы его съедать!`);
        };
        
        message.reply(`как-то раз вы уже попытались съесть печенье, но вам стало очень жалко его и вы отказались от этой идеи навсегда!`);
    },
};