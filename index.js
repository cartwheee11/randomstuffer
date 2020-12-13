const Discord = require('discord.js');
const Morphy = require('phpmorphy');
const fs = require('fs');
const req = require('request')
const cheerio = require('cheerio');
const config = require("./config.json");

let client = new Discord.Client();
client.login(config.BOT_TOKEN);

let PREFIX = '-rand'
client.on('message', function(message) {
	let content = message.content;
	if(!content.startsWith(PREFIX)) return;

	let command = content.replace(PREFIX, '').trim();
	
	if (command == '') {
		req('http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru', function(err, res, body) {
			let string = JSON.parse(body).quoteText;

			const mor = new Morphy('ru', {
			  nojo: true,
			  storage: Morphy.STORAGE_MEM,
			  predict_by_suffix: true,
			  predict_by_db: true,
			  graminfo_as_text: true,
			  use_ancodes_cache: false,
			  resolve_ancodes: Morphy.RESOLVE_ANCODES_AS_TEXT,
			});

			let names = [
				'Максим',
				'Валера',
				'Ваня',
				'Никита',
				'Крыса',
				'Админ'
			];

			let cases = ['ИМ', 'ДТ', 'ТВ', 'ВН', 'ПР'];
			let fams = ['ЕД', 'МН', 'НО'];

			string = string.replace(/[\,\.\?\-\_\—\!]/gm, '');
			let arr = string.split(' ');
			let result = '';

			// console.log(mor.getAllFormsWithGramInfo('валера'));

			arr.forEach(word => {
				let isNoun = mor.getPartOfSpeech(word) == 'С';
				
				if(isNoun) {
					let rand = Math.floor(Math.random() * names.length);
					let name = names[rand];
					
					let provider = mor.getGrammemsProvider();
					provider.excludeGroups('С', ['род', 'залог', 'одушевленность', 'безличный глагол', 'сравнительная форма', 'превосходная степень', 'переходность', 'вид', 'краткость', 'повелительная форман']);
					let formedName = mor.castFormByPattern(name, word, provider, true);
					formedName = formedName[ formedName.length - 1 ];
					
					result += formedName ? formedName.toLowerCase() + ' ' : word + ' ';
				} else {
					result += word + ' ';
				}
			});

			message.reply(result);
		});

		
	}


});


















