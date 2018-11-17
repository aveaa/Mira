var config = require('../../config.js');
var Discord = require('discord.js');

module.exports = {
	name: __filename.slice(__dirname.length + 1).split('.')[0],
	description: 'Поддержать разработчика',
	aliases: ['donut'],
	usage: undefined,
	guild: false,
	hide: true,
	cooldown: undefined,
	cooldownMessage: undefined,
	permissions: undefined,
	group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
	execute(message, args, CooldownReset) {
		var embed = new Discord.RichEmbed()
			.setAuthor('Благодарю за поддержку!')
			.setTitle('Яндекс.Деньги')
			.setURL('https://money.yandex.ru/to/410014841265118')
			.setDescription('Вы так же можете поддержать меня словом, рассказывая о найденных ошибках или как вам понравилось что-нибудь ;)')
			.setColor('#6DC066');

		message.author.send({ embed }).catch(err => {
			var memberRequest = message.guild.members.get(message.author.id);
			embed.setFooter(`Запрос от ${(!memberRequest || !memberRequest.nickname) ? message.author.username : memberRequest.nickname} | ${config.bot_prefix}${this.name}`, message.author.displayAvatarURL);

			message.channel.send({ embed });
		});
	},
};