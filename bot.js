require('dotenv').config();

const Discord = require('discord.js');
const codebottle = require('codebottle');

const bot = new Discord.Client();
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.username}!`);
});

bot.on('message', msg => {
	console.log(`RECV: ${msg.author.tag}@${msg.channel.name} ${msg.content}`);

	if (msg.content.startsWith(prefix)) {
		const command = msg.content.split(' ')[0].substring(1).toLowerCase().trim();
		const rest = msg.content.substring(command.length + 2); // 1 for prefix + 1 for trailing space

		switch(command) {
			case 'search':
				console.log(`=> Search: ${rest}`);
				codebottle.search(rest).then(response => {
					const description = response.data[0].description ? response.data[0].description
						: '*No description provided*';
					const embed = new Discord.RichEmbed();
					embed.setTitle(response.data[0].title);
					embed.setColor('#272727');
					embed.setDescription(description);
					embed.setURL(`https://codebottle.io/s/${response.data[0].id}`);
					embed.setAuthor(response.data[0].username);
					msg.channel.send(embed);
				}).catch(e => {
					msg.react('⛔');
				});
				break;
			case 'get':
				console.log(`=> Get: ${rest}`);
				codebottle.get(rest).then(response => {
					const description = response.data.description ? response.data.description
						: '*No description provided*';
					const embed = new Discord.RichEmbed();
					embed.setTitle(response.data.title);
					embed.setColor('#272727');
					embed.setDescription(description);
					embed.setURL(`https://codebottle.io/s/${response.data.id}`);
					embed.setAuthor(response.data.username);
					msg.channel.send(embed);
				}).catch(e => {
					msg.react('⛔');
				});
				break;
			case 'help':
				const embed = new Discord.RichEmbed();
				embed.setTitle('CodeBottle');
				embed.setColor('#272727');
				embed.setDescription(`
This is a bot for https://codebottle.io/

\`!search <keywords>\` Search snippets with keywords
\`!get <id>\` Get a snippet by its ID`);
				msg.channel.send(embed);
				break;
		}
	}
})

bot.login(token);
