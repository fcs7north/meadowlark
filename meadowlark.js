const quoteDay = require('./lib/quote-days')
const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

// router
app.get('/', (req, res) => res.render('home'))
app.get('/about', (req, res) => {
	res.render('about', { quote: quoteDay.getQuoteDay() })
})

// custom 404 page
app.use((req, res) => {
	// res.type('text/plain')
	res.status(404)
	res.render('404')
})

// custom 500 page
app.use((err, req, res, next) => {
	console.error(err.message)
	// res.type('text/plain')
	res.status(500)
	res.render('500')
})

app.listen(port, () => console.log(
	`Express started on http://localhost:${port} ` +
	`Press Ctrl-C to terminate.`))