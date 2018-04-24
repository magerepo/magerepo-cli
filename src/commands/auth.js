const chalk = require ("chalk")
const readline = require ("readline")
const strip = require ("strip-ansi")
const { save } = require ("../account")

function auth ( context ) {
	let usernamePrompt = `${chalk.green ("Username")}: `
	let passwordPrompt = `${chalk.green ("Password")}: `
	if ( context.quiet ) {
		usernamePrompt = ""
		passwordPrompt = ""
	}
	else if ( context.unicode ) {
		usernamePrompt = strip ( usernamePrompt )
		passwordPrompt = strip ( passwordPrompt )
	}
	const rl = readline.createInterface ({
		input: process.stdin,
		output: process.stdout
	})
	rl.question ( usernamePrompt, username => {
		rl.question ( passwordPrompt, password => {
			save ( username, password )
			context.log ("credentials saved to ~/.magerepo")
			rl.close ()
		})
	})
}

module.exports = auth
