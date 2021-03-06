require('dotenv').config();

const Discord = require('discord.js');
const codebottle = require('codebottle');

const bot = new Discord.Client();
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;

bot.on('ready', () => console.log(`Logged in as ${bot.user.username}!`));
bot.on('message', msg => {
	if (!msg.content.startsWith(prefix) || (msg.guild && !msg.channel.permissionsFor(bot.client.user).has('SEND_MESSAGES')))
		return;

	const command = msg.content.split(' ')[0].substring(1).toLowerCase().trim();
	const rest = msg.content.substring(command.length + 2); // 1 for prefix + 1 for trailing space

	switch(command) {
		case 'search':
			codebottle.search(rest).then(response => {
				const description = response[0].description ? response[0].description : '*No description provided.*';
				const embed = new Discord.RichEmbed()
					.setTitle(response[0].title)
					.setColor('#272727')
					.setDescription(description)
					.setURL(`https://codebottle.io/s/${response[0].id}`)
					.setAuthor(response[0].username);
				msg.channel.send(embed);
			}).catch(e => msg.react('⛔'));
			break;
		case 'get':
			codebottle.get(rest).then(response => {
				const description = response.description ? response.description : '*No description provided.*';
				const embed = new Discord.RichEmbed()
					.setTitle(response.title)
					.setColor('#272727')
					.setDescription(response.description)
					.setURL(`https://codebottle.io/s/${response.id}`)
					.setAuthor(response.username);
				msg.channel.send(embed);
			}).catch(e => msg.react('⛔'));
			break;
		case 'help':
			const embed = new Discord.RichEmbed()
				.setTitle('CodeBottle')
				.setColor('#272727')
				.setDescription(`
This is a bot for https://codebottle.io/

\`!search <keywords>\` - Search snippets with keywords
\`!get <id>\` - Get a snippet by its ID`);
			msg.channel.send(embed);
			break;
		}
	}
})

bot.login(token);
