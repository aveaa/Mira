var cache = require('../../bot.js');
var tools = require('../../modules/tools.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Печеньковые богачи',
    aliases: ['ct'],
    usage: undefined,
    guild: true,
    hide: false,
    cooldown: 180,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        var list = bot.getCurrency(message.guild.id, undefined);

        if (!list) {
            return message.reply(`в этом мире нет печенья... но я здесь и вместе мы сможем исправить это!`);
        };
        
        var topSize = 10;
        if (topSize > list.length) {
        	     topSize = list.length;
        };
      
        var listWithotTop = [];
        for (e in list) {
        	     listWithotTop[e] = list[e];
        };
        
        var temp = 0;
        var top = [];
        for (var i = 0; i < topSize; i++) {
             for (e in listWithotTop) {
 	               if (listWithotTop[e].currency > temp) {
 	    	              temp = e;
 	               };
 	           };
 	           top.push(temp);
 	           delete listWithotTop[temp];
        };
       
        var msg = '';
        for (var i = 0; i < topSize; i++) {
            	msg += `<@!${top[i]}> ${tools.separateThousandth(list(top[i]).currency)}:cookie:\n`;
        };
        
        message.reply(`**печеньковые богачи:**\n${msg}`);
    },
};
