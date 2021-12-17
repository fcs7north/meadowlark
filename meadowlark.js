const handlers = require('./lib/handlers')
const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')
const cookieParser = require('cookie-parser') // 쿠키 미들웨어
const expressSession = require('express-session') // 세션 미들웨어
const credentials = require('./credentials')
const flashMiddleware = require('./lib/middleware/flash')

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
app.use(cookieParser(credentials.cookieSecret))
app.use(expressSession({
	resave: false,
	saveUninitialized: false,
	secret: credentials.cookieSecret
}))
app.use(flashMiddleware)

// router
app.get('/', handlers.home)
app.get('/about', handlers.about)
app.get('/section-test', handlers.sectionTest)
app.get('/vacation-photo', handlers.vacationPhoto)
app.get('/vacation-photo-thank-you', handlers.vacationPhotoThankYou)
app.get('/vacation-fetch-photo', handlers.vacationFetchPhoto)

// router for session
app.get('/session-newsletter-signup', handlers.newsletterSignupForSession)
app.get('/session-newsletter-archive', handlers.newsArchiveForSession)

// router for flash message test
app.get('/flash-message-test-home', handlers.flashMessageTestHome)
app.get('/flash-message-test-result', handlers.flashMessageTestResult)
app.get('/flash-message-test-result-view', handlers.flashMessageTestResultView)

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