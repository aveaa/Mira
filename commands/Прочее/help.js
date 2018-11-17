var config = require('../../config.js');
var tools = require('../../modules/tools.js');
var Discord = require('discord.js');

module.exports = {
	name: __filename.slice(__dirname.length + 1).split('.')[0],
	description: 'Список всех доступных команд',
	aliases: ['commands'],
	usage: '[имя команды]',
	guild: false,
	hide: true,
	cooldown: 3,
	cooldownMessage: undefined,
	permissions: undefined,
	group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
	execute(message, args, CooldownReset) {
		var { commands } = message.client;

		var embed = new Discord.RichEmbed()

		if (!args.length) {
			embed.setDescription('Параметры обёрнутые в <> - обязательны, а в [] - нет');
			embed.setAuthor('Список команд');
			var groups = [...new Set(commands.map(command => command.group))];
			for (g of groups) {
				var catList = [...new Set(commands.filter(cmd => (cmd.hide !== true) && (cmd.group === g) && (cmd.permissions === undefined)).map(command => `${config.bot_prefix}**${command.name}** ${command.usage || ''} - ${command.description}`))].join('\n').substring(0, 1024);
				if (!!catList) {
					embed.addField(g, catList, false);
				};
			};
			embed.addField('Подробная информация о команде', `${config.bot_prefix}**help** [имя команды]`, false);
		} else {
			if (!commands.has(args[0])) {
				return message.reply(`команда \`${args[0]}\` не найдена!`);
			};

			var command = commands.get(args[0]);

			embed.setAuthor(`О команде: ${command.aliases ? `${command.name}, ${command.aliases.join(', ')}` : command.name}`, message.client.user.avatarURL);
			embed.setDescription(command.description || 'Описание отсутствует')
			if (command.usage) {
				embed.addField('**Использование**', `${config.bot_prefix}${command.name} ${command.usage}`, false);
			};
			if (command.guild !== undefined) {
				embed.addField('**Только на сервере?**', command.guild ? 'Да' : 'Нет', true);
			};
			if (command.group) {
				embed.addField('**Категория**', command.group, true);
			};
			embed.addField('**Откат**', tools.convertSecondsToTime(command.cooldown || 3), true);
			if (command.permissions) {
				embed.addField('**Привилегии**', permissions.join(', '), true);
			};
		};

		embed.setColor(tools.randomHexColor());

		if (message.guild !== null) {
			var memberRequest = message.guild.members.get(message.author.id);
			embed.setFooter(`Запрос от ${(!memberRequest || !memberRequest.nickname) ? message.author.username : memberRequest.nickname} | ${config.bot_prefix}${this.name}`, message.author.displayAvatarURL);
		};

		message.channel.send({ embed });
	},
};