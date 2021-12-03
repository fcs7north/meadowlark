const handlers = require('./lib/handlers')
const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000

app.engine('handlebars', engine({
	defaultLayout: 'main',
	helpers: {
		section: function(name, options) {
			if(!this._sections) this._sections = {}
			this._sections[name] = options.fn(this)
			return null
		},
	},
}))
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

// router
app.get('/', handlers.home)

app.get('/about', handlers.about)

app.get('/section-test', handlers.sectionTest)

// custom 404 page
app.use(handlers.notFound)

// custom 500 page
app.use(handlers.serverError)

if (require.main === module) {
	app.listen(port, () => console.log(`Express started on http://localhost:${port}; Press Ctrl-C to terminate.`))
} else {
	module.exports = app
}