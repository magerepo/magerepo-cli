const axios = require ("axios")
const chalk = require ("chalk")
const fs = require ("fs")
const path = require ("path")
const strip = require ("strip-ansi")
const targz = require ("targz")
const shell = require ("shelljs")
const { load } = require ("./account")

const VERSION = "2.0.0"
const API_BASE_URL = "https://api.magerepo.com"

class Context {

	constructor () {
		// Commands
		this.command = false
		this.version = false
		this.help = false
		// Filters
		this.edition = false
		this.release = false
		this.patch = false
		// Options
		this.quiet = false
		this.unicode = false
		this.clean = false
		this.downloadPath = false
		this.extractPath = false
	}

	getVersion () {
		return `v${VERSION}`
	}

	log () {
		if ( this.quiet ) return
		if ( !this.unicode ) {
			console.log ( ...arguments )
		}
		else {
			let stripped = Object.values ( arguments ).map ( i => strip ( i ) )
			console.log ( ...stripped )
		}
	}

	error () {
		if ( this.quiet ) return
		if ( !this.unicode ) {
			console.error ( `${chalk.red ("Error")}:`, ...arguments )
		}
		else {
			let stripped = Object.values ( arguments ).map ( i => strip ( i ) )
			console.error ( "Error:", ...stripped )
		}
	}

	write () {
		if ( this.quiet ) return
		if ( !this.unicode ) {
			process.stdout.write ( ...arguments )
		}
		else {
			let stripped = Object.values ( arguments ).map ( i => strip ( i ) )
			process.stdout.write ( ...stripped )
		}
	}

	set ( params ) {
		for ( let param in params ) {
			this [ param ] = params [ param ]
		}
		return this
	}

	mkdir ( destination ) {
		try {
			shell.mkdir ( "-p", destination )
		}
		catch ( error ) {
			throw "permission issue with download path"
		}
	}

	metadata ( endpoint ) {
		let account = load ()
		return axios ({
			url: `${API_BASE_URL}/metadata/${endpoint}`,
			method: "GET",
			auth: account
		})
		.then ( response =>
			response.status === 200 ?
			Promise.resolve ( response.data ) :
			Promise.reject ("not found")
		)
		.catch ( error => {
			throw `could not complete request (${error.code})`
		})
	}

	download ( endpoint ) {
		let that = this
		let account = load ()
		return axios ({
			url: `${API_BASE_URL}/download/${endpoint}`,
			method: "GET",
			responseType: "stream",
			auth: account
		})
		.then ( response =>
			response.status === 200 ?
			Promise.resolve ( response ) :
			Promise.reject ("not found")
		)
		.then ( response => {
			this.mkdir ( that.downloadPath )
			let contentDisposition = response.headers ["content-disposition"]
			let filename = contentDisposition.match (/filename="(.+)"/) [ 1 ]
			let filepath = path.join ( that.downloadPath, filename )
			let writeStream = fs.createWriteStream ( filepath )
			response.data.pipe ( writeStream )
			return new Promise ( ( resolve, reject ) => {
				let total = parseInt ( response.headers ["content-length"], 10 )
				let current = 0
				let progressTotal = 25
				let progressFilled = 0
				let percent = 0
				response.data.on ( "data", chunk => {
					current += chunk.length
					percent = Math.round ( current * 100 / total )
					progressFilled = Math.floor ( progressTotal * current / total )
					this.write (`\r${chalk.green ("[download]")} `)
					this.write (`${`${percent}%`.padEnd ( 4, " " )} `)
					this.write ( chalk.magenta ( "▓".repeat ( progressFilled ) ) )
					this.write ( chalk.white ( "░".repeat ( progressTotal - progressFilled ) ) )
					this.write ( chalk.reset (` ${filename}`) )
				})
				response.data.on ( "end", () => {
					this.write (`\r${chalk.green ("[download]")} 100% `)
					this.write ( chalk.magenta ( "▓".repeat ( progressFilled ) ) )
					this.write ( chalk.reset (` ${filename}`) )
					this.write ("\n")
					resolve ()
				})
				response.data.on ( "error", () => {
					this.write (`\r${chalk.green ("[download]")} ---- `)
					this.write ( chalk.magenta ( "▓".repeat ( progressFilled ) ) )
					this.write ( chalk.reset (` ${filename}`) )
					this.write ("\n")
					reject ()
				})
			})
		})
	}

	extract ( archive ) {
		let filename = path.basename ( archive )
		let total = 25
		let counter = 0
		let count = () => {
			this.write (`\r${chalk.green ("[extract] ")} ---- `)
			this.write ( chalk.white ( "░".repeat ( counter % ( total - 2 ) ) ) )
			this.write ( chalk.magenta ( "▓".repeat ( 3 ) ) )
			this.write ( chalk.white ( "░".repeat ( total - 3 - ( counter % ( total - 2 ) ) ) ) )
			this.write (` ${filename}`)
			counter = counter + 1
			timeout = setTimeout ( count, 100 )
		}
		let timeout = setTimeout ( count, 100 )
		return new Promise ( ( resolve, reject ) => {
			targz.decompress (
				{ src: archive, dest: this.extractPath },
				error => {
					if ( error ) {
						clearTimeout ( timeout )
						this.write (`\r${chalk.green ("[extract] ")} ---- `)
						this.write ( chalk.magenta ( "▓".repeat ( total ) ) )
						this.write (` ${filename}`)
						this.write ("\n")
						reject ()
					}
					else {
						clearTimeout ( timeout )
						this.write (`\r${chalk.green ("[extract] ")} 100% `)
						this.write ( chalk.magenta ( "▓".repeat ( total ) ) )
						this.write (` ${filename}`)
						this.write ("\n")
						resolve ()
					}
				}
			)
		})
	}

	cleanup ( filepath ) {
		let filename = path.basename ( filepath )
		let total = 25
		return new Promise ( ( resolve, reject ) => {
			this.write (`\r${chalk.green ("[clean]   ")}   0% `)
			this.write ( chalk.white ( "░".repeat ( total ) ) )
			this.write (` ${filename}`)
			fs.unlink ( filepath, error => {
				if ( error ) return reject ()
				this.write (`\r${chalk.green ("[clean]   ")} 100% `)
				this.write ( chalk.magenta ( "▓".repeat ( total ) ) )
				this.write (` ${filename}\n`)
				resolve ()
			})
		})
	}

}

module.exports = Context
