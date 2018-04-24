const chalk = require ("chalk")
const readline = require ("readline")
const strip = require ("strip-ansi")
const { remove } = require ("../account")

function unauth ( context ) {
	if ( remove () ) {
		context.log ("credentials removed from ~/.magerepo")
	}
	else {
		context.log ("credentials do not exist in ~/.magerepo")
	}
}

module.exports = unauth
