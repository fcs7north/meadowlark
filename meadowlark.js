const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000
const quoteOfTheDays = [
	"나는 위대하고 고귀한 임무를 완수하기를 열망한다. 하지만 나의 주된 임무이자 기쁨은 작은 임무라도 위대하고 고귀한 임무인 듯 완수해나가는 것이다.",
	"손에 총을 든 사람이 용기라는 생각을 하기 보다, 네가 진정한 용기가 무엇인지 보길 바랬다. 시작도 하기 전에 자신이 불리하다는 것을 알지만, 그래도 시작하고 무슨 일이 있어도 끝까지 완수하는 것이 바로 용기다.",
	"정직하게 백만장자가 된 사람은 없다.",
	"겁쟁이는 사랑을 드러낼 능력이 없다. 사랑은 용기있는 자의 특권이다.",
	"모든 성공은 더 어려운 문제로 가는 입장권을 사는 것일 뿐이다.",
]

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

// router
app.get('/', (req, res) => res.render('home'))
app.get('/about', (req, res) => {
	const randomQuote = quoteOfTheDays[Math.floor(Math.random() * quoteOfTheDays.length)]
	res.render('about', { quote: randomQuote })
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