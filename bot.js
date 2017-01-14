const Discord = require('discord.js');
const codebottle = require('codebottle');

const bot = new Discord.Client();
const token = '<token>';
var prefix = '!';

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.username}!`);
});

bot.on('message', msg => {
	if (msg.content.startsWith(prefix)) {
		if (msg.content.startsWith(prefix + 'ping')) {
			msg.channel.sendMessage('Pong!');
		} else if (msg.content.startsWith(prefix + 'search')) {
			var terms = msg.content.substr(msg.content.indexOf(' ') + 1);
			codebottle.search(terms, (data, error) => {
				console.log('=> Search: ' + terms);
				if (error) {
					console.log(error);
				} else if (data) {
					const embed = new Discord.RichEmbed();
					embed.setTitle(data[0]['title']);
					embed.setColor('#4caf50');
					embed.setDescription(data[0]['description']);
					embed.setURL('https://codebottle.io/code/' + data[0]['code_id'] + '/');
					msg.channel.sendEmbed(embed);	
				}
			})
		}
	}
})

bot.login(token);