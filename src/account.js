const path = require ("path")
const fs = require ("fs")

const HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
const CONFIG_PATH = path.join ( HOME, ".magerepo" )

function load () {
	let credentials = {
		username: "",
		password: ""
	}
	try {
		if ( fs.existsSync ( CONFIG_PATH ) ) {
			let data = fs.readFileSync ( CONFIG_PATH ).toString ()
			credentials = JSON.parse ( data )
		}
	}
	catch ( error ) {}
	finally {
		return credentials
	}
}

function save ( username, password ) {
	let data = JSON.stringify ({ username, password })
	fs.writeFileSync ( CONFIG_PATH, data )
}

function remove () {
	if ( fs.existsSync ( CONFIG_PATH ) ) {
		fs.unlinkSync ( CONFIG_PATH )
		return true
	}
	return false
}

module.exports = {
	load,
	save,
	remove
}
