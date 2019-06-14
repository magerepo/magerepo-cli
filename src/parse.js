const Context = require ("./context")
const minimist = require ("minimist")
const path = require ("path")

function parse ( data ) {
	// Parse arguments
	let error = false
	let context = new Context ()
	let args = minimist ( data, {
		string: [
			"download",
			"extract",
			"edition",
			"release",
			"patch"
		],
		boolean: [
			"help",
			"version",
			"quiet",
			"unicode",
			"clean"
		],
		alias: {
			h: "help",
			v: "version",
			q: "quiet",
			u: "unicode",
			c: "clean",
			d: "download",
			x: "extract",
			e: "edition",
			r: "release",
			p: "patch"
		},
		"--": false,
		stopEarly: false,
		unknown: val => {
			if ( ![ "release", "patch", "auth", "unauth" ].includes ( val ) ) {
				error = `unknown fragment '${val}'`
			}
		}
	})
	// Check if there was an error parsing
	if ( error ) return Promise.reject ({ error, context })
	// Check for errors
	let hasEdition = args.edition !== undefined && args.edition
	let hasRelease = args.release !== undefined && args.release
	let hasPatch = args.patch !== undefined && args.patch
	let hasDownload = args.download !== undefined
	let hasExtract = args.extract !== undefined && args.extract
	let hasClean = args.clean !== undefined && args.clean
	// Resolve paths
	if ( hasDownload && args.download === "" ) {
		args.download = path.resolve (".")
	}
	else if ( hasDownload ) {
		args.download = path.resolve ( args.download )
	}
	if ( hasExtract && args.extract !== "" ) {
		args.extract = path.resolve ( args.extract )
	}
	else if ( args.extract === "" ) {
		args.extract = args.download
	}
	// Transform arguments
	if ( hasRelease && args.release === "latest" ) {
		args.release = "x"
	}
	// Save context
	context.set ({
		command: args._ [ 0 ],
		version: args.version || false,
		help: args.help || false,
		edition: args.edition && {
			ce: "community",
			ee: "enterprise"
		} [ args.edition ] || false,
		release: args.release || false,
		patch: args.patch || false,
		quiet: args.quiet || false,
		unicode: args.unicode || false,
		clean: args.clean || false,
		downloadPath: args.download || false,
		extractPath: args.extract || false
	})
	// Semantic errors based on parsed command
	if ( context.command === "release" ) {
		if ( hasEdition && ![ "ce", "ee" ].includes ( args.edition ) ) {
			return Promise.reject ({
				error: "option 'edition' requires value to be one of [ ce, ee ]",
				context
			})
		}
		if ( hasRelease && args.release === "" ) {
			return Promise.reject ({
				error: "option 'release' requires value",
				context
			})
		}
		if ( !hasEdition && hasRelease ) {
			return Promise.reject ({
				error: "edition must be specified if release is specified",
				context
			})
		}
		if ( !hasEdition && !hasRelease && hasDownload ) {
			return Promise.reject ({
				error: "must specify edition and release",
				context
			})
		}
		if ( hasPatch ) {
			return Promise.reject ({
				error: "-p option can only be used with patch command",
				context
			})
		}
	}
	else if ( context.command === "patch" ) {
		if ( hasEdition && ![ "ce", "ee" ].includes ( args.edition ) ) {
			return Promise.reject ({
				error: "option 'edition' requires value to be one of [ ce, ee ]",
				context
			})
		}
		if ( hasRelease && args.release === "" ) {
			return Promise.reject ({
				error: "option 'release' requires value",
				context
			})
		}
		if ( hasPatch && args.patch === "" ) {
			return Promise.reject ({
				error: "option 'patch' requires value",
				context
			})
		}
		if ( !hasEdition && hasRelease ) {
			return Promise.reject ({
				error: "edition must be specified if release is specified",
				context
			})
		}
		if ( !hasEdition && hasPatch ) {
			return Promise.reject ({
				error: "edition must be specified if patch is specified",
				context
			})
		}
		if ( !hasRelease && hasPatch ) {
			return Promise.reject ({
				error: "release must be specified if patch is specified",
				context
			})
		}
		if ( hasEdition && !hasRelease && hasDownload ) {
			return Promise.reject ({
				error: "to download specify release and optionally patch name",
				context
			})
		}
		if ( hasExtract ) {
			return Promise.reject ({
				error: "-x option can only be used with the release command",
				context
			})
		}
		if ( hasClean ) {
			return Promise.reject ({
				error: "-c option can only be used with the release command",
				context
			})
		}
	}
	else if ( [ "auth", "unauth" ].includes ( context.command ) ) {
		if ( hasPatch ) {
			return Promise.reject ({
				error: "-p option can only be used with the patch command",
				context
			})
		}
		if ( hasEdition ) {
			return Promise.reject ({
				error: "-e option can only be used with the release or patch command",
				context
			})
		}
		if ( hasRelease ) {
			return Promise.reject ({
				error: "-r option can only be used with the release or patch command",
				context
			})
		}
		if ( hasDownload ) {
			return Promise.reject ({
				error: "-d option can only be used with the release or patch command",
				context
			})
		}
		if ( hasExtract ) {
			return Promise.reject ({
				error: "-x option can only be used with the release command",
				context
			})
		}
		if ( hasClean ) {
			return Promise.reject ({
				error: "-c option can only be used with the release command",
				context
			})
		}
	}
	else if ( !args.help && !args.version ) {
		return Promise.reject ({
			error: "specify command, use -h for help",
			context
		})
	}
	// Save to context
	return Promise.resolve ( context )
}

module.exports = parse
