const chalk = require ("chalk")
const path = require ("path")

function metadata ( releases ) {
	if ( releases.length < 1 ) {
		return Promise.reject (`could not find release(s)`)
	}
	this.log (
		chalk.underline ( "File Size" ),
		chalk.underline ( "Date".padEnd ( 10, " " ) ),
		chalk.underline ( "File Name".padEnd ( 19, " " ) )
	)
	for ( let release of releases ) {
		let filesize = release.file_size_auto.split (" ")
		this.log (
			filesize [ 0 ].padStart ( 6, " " ) + " " + filesize [ 1 ].padEnd( 2, " " ),
			release.info_date.padEnd ( 10, " " ),
			chalk.red.bold ( release.file_name.padEnd ( 19, " " ) )
		)
	}
	return Promise.resolve ()
}

function download ( releases ) {
	if ( releases.length < 1 ) {
		return Promise.reject (`could not find release(s)`)
	}
	let release = releases.splice ( -1 ) [ 0 ]
	let link = release.file_download_link.replace ( /^\/download\//m, "" )
	let filepath = path.join ( this.downloadPath, release.file_name )
	return this.download ( link )
	.then ( () => this.extractPath && this.extract ( filepath ) )
	.then ( () => this.extractPath && this.clean && this.cleanup ( filepath ) )
	.catch ( error =>
		Promise.reject (
			`${error.response.statusText} (${error.response.status})`
		)
	)
}

function release ( context ) {
	if ( context.downloadPath && context.edition && context.release ) {
		return context.metadata (`release/${context.edition}/${context.release}`)
		.then ( download.bind ( context ) )
	}
	else if ( context.edition && context.release ) {
		return context.metadata (`release/${context.edition}/${context.release}`)
		.then ( metadata.bind ( context ) )
	}
	else if ( context.edition ) {
		return context.metadata (`release/${context.edition}`)
		.then ( metadata.bind ( context ) )
	}
	else {
		return context.metadata (`release`)
		.then ( metadata.bind ( context ) )
	}
}

module.exports = release
