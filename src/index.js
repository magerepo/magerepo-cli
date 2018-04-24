const chalk = require ("chalk")
const commands = require ("./commands")
const parse = require ("./parse")

parse ( process.argv.slice ( 2 ) )
	.then ( context => {
		if ( context.help ) {
			commands.help ( context )
			return Promise.resolve ()
		}
		else if ( context.version ) {
			context.log ( context.getVersion () )
			return Promise.resolve ()
		}
		else if ( context.command === "auth" ) {
			commands.auth ( context )
			return Promise.resolve ()
		}
		else if ( context.command === "unauth" ) {
			commands.unauth ( context )
			return Promise.resolve ()
		}
		else {
			return commands
				[ context.command ] ( context )
				.catch ( error => {
					throw { context, error }
				})
		}
	})
	.catch ( payload => {
		const { context, error } = payload
		context.error ( error || "unknown command, use -h for help" )
	})
