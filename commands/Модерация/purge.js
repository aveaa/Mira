module.exports = {
    name: __filename.slice(__dirname.length + 1).split('.')[0],
    description: 'Удаление сообщений',
    aliases: ['remove', 'clear', 'prune'],
    usage: '[@писатель] <кол-во>',
    guild: true,
    hide: false,
    cooldown: 1.5,
    cooldownMessage: undefined,
    permissions: ['MANAGE_MESSAGES'],
    group: __dirname.split(/[\\/]/)[__dirname.split(/[\\/]/).length - 1],
    execute(message, args, CooldownReset) {
        if (!message.channel.permissionsFor(message.member).has(this.permissions[0])) {
            return message.reply(`у тебя недостаточно привилегий!`);
        } else if (!message.channel.permissionsFor(message.client.user).has(this.permissions[0])) {
            return message.reply(`у меня нет привилегии управлять сообщениями!`);
        };

        var user = message.mentions.users.first();
        var amount = !!parseInt(args[0]) ? parseInt(args[0]) : parseInt(args[1])

        if (!amount && !user) {
            return message.reply('пожалуйста, укажите пользователя и количество или просто количество!');
        } else if (!amount || amount < 1 || amount > 100) {
            return message.reply('пожалуйста, укажите число в диапазоне от 1 до 100.');
        };

        message.channel.fetchMessages({
            limit: amount,
        }).then((messages) => {
            if (user) {
                var filterBy = user ? user.id : client.user.id;
                messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
            };
            message.channel.bulkDelete(messages)
                .then(msgs => {
                    message.channel.send(`Удалено сообщений: **${msgs.size}** ${message.author}\nСамоуничтожение через несколько секунд :alarm_clock:`)
                        .then(msg => {
                            setTimeout(() => msg.delete(), 3000)
                        })
                })
                .catch(error => message.reply(`невозможно удалить сообщения, потому что: \n${error}`));
        });
    },
};