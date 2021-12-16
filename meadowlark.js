const handlers = require('./lib/handlers')
const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')

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

// middleware
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// router
app.get('/', handlers.home)
app.get('/about', handlers.about)
app.get('/section-test', handlers.sectionTest)
app.get('/vacation-photo', handlers.vacationPhoto)
app.get('/vacation-photo-thank-you', handlers.vacationPhotoThankYou)
app.get('/vacation-fetch-photo', handlers.vacationFetchPhoto)

// form
app.get('/newsletter-signup', handlers.newsletterSignup)
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)
app.post('/contest/vacation-photo/:year/:month', (req, res) => {
	const form = new multiparty.Form()
	form.parse(req, (err, fields, files) => {
		if(err) return res.status(500).send({ error: err.message })
		handlers.vacationPhotoContestProcess(req, res, fields, files)
	})
})

// fetch
app.get('/newsletter', handlers.newsletter)
app.post('/api/newsletter-signup', handlers.api.newsletterSignup)
app.post('/api/vacation-fetch-photo', handlers.api.vacationPhotoContestProcess)

// custom 404 page
app.use(handlers.notFound)

// custom 500 page
app.use(handlers.serverError)

if (require.main === module) {
	app.listen(port, () => console.log(`Express started on http://localhost:${port}; Press Ctrl-C to terminate.`))
} else {
	module.exports = app
}