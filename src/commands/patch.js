const chalk = require ("chalk")

function metadata ( patches ) {
	if ( patches.length < 1 ) {
		return Promise.reject (`could not find patch(s)`)
	}
	this.log (
		chalk.underline ( "File Size" ),
		chalk.underline ( "Date".padEnd ( 10, " " ) ),
		chalk.underline ( "Edition".padEnd ( 10, " " ) ),
		chalk.underline ( "Release".padEnd ( 10, " " ) ),
		chalk.underline ( "File Name".padEnd ( 19, " " ) )
	)
	for ( let patch of patches ) {
		let filesize = patch.file_size_auto.split (" ")
		this.log (
			filesize [ 0 ].padStart ( 6, " " ) + " " + filesize [ 1 ].padEnd( 2, " " ),
			patch.info_date.padEnd ( 10, " " ),
			patch.info_edition_short.padEnd ( 10, " " ),
			patch.info_release.padEnd ( 10, " " ),
			chalk.red.bold ( patch.file_name.padEnd ( 19, " " ) )
		)
	}
	return Promise.resolve ()
}

function download ( patches ) {
	if ( patches.length < 1 ) {
		return Promise.reject (`could not find patch(s)`)
	}
	return patches.reduce ( ( chain, patch ) =>
		chain.then (
			() => this.download (
				patch.file_download_link.replace ( /^\/download\//m, "" )
			)
		),
		Promise.resolve ()
	)
	.catch ( error =>
		Promise.reject (
			`${error.response.statusText} (${error.response.status})`
		)
	)
}

function patch ( context ) {
	if ( context.downloadPath && context.edition && context.release && context.patch ) {
		return context.metadata (`patch/${context.edition}/${context.release}/${context.patch}`)
		.then ( download.bind ( context ) )
	}
	else if ( context.downloadPath && context.edition && context.release ) {
		return context.metadata (`patch/${context.edition}/${context.release}`)
		.then ( download.bind ( context ) )
	}
	else if ( context.edition && context.release && context.patch ) {
		return context.metadata (`patch/${context.edition}/${context.release}/${context.patch}`)
		.then ( metadata.bind ( context ) )
	}
	else if ( context.edition && context.release ) {
		return context.metadata (`patch/${context.edition}/${context.release}`)
		.then ( metadata.bind ( context ) )
	}
	else if ( context.edition ) {
		return context.metadata (`patch/${context.edition}`)
		.then ( metadata.bind ( context ) )
	}
	else {
		return context.metadata (`patch`)
		.then ( metadata.bind ( context ) )
	}
}

module.exports = patch
