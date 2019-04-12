var cache = require('../../bot.js');
var tools = require('../../modules/tools.js');

module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Печеньковые богачи',
    aliases: ['cootop'],
    usage: undefined,
    guild: true,
    hide: false,
    cooldown: 60,
    cooldownMessage: undefined,
    permissions: undefined,
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
    	var list = cache.getCurrency(message.guild.id);

        if (!list) {
              return message.reply(`в этом мире нет печенья... но я здесь и вместе мы сможем исправить это!`);
        };
        
        var topSize = 10;
        if (topSize > list.length) {
        	     topSize = list.length;
        };
    
        var topList = [];
        for (var i = 0; i < topSize; i++) {
           	topList[i] = 0;
        };
        
        var listCopy = [];
        for (id in list) {
           	 listCopy[id] = list[id];
             if (!message.guild.members.get(id) || message.guild.members.get(id).user.bot) {
                 	delete listCopy[id];
             };
        };
        
        topList[0] = Object.keys(listCopy)[0]; //Установка начального значения для сравнения (любое)
        	
        	for (var i = 0; i < topSize; i++) {
            for (id in listCopy) {
        	         if (list[topList[i]] < list[id]) {
        	    	topList[i] = id;
        	     };
            	};
            delete listCopy[topList[i]];
        };
        
        var msg = '\n';
        var user;
        var rangs = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII','VIII', 'IX', 'X'];
        for (var i = 0; i < topSize; i++) {
            	user = message.guild.members.get(topList[i]);
            	msg += `  **${rangs[i]}. ${(!user || !user.nickname) ? user.user.username : user.nickname}** ${tools.separateThousandth(list[topList[i]])}:cookie:\n`;
        };
        
        message.reply(`**печеньковые богачи:** ${msg}`);
    },
};