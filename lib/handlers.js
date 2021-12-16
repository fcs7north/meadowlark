const quoteDay = require('./quote-days')
const { title, description } = require('./jnet-test')
const date = new Date()

exports.home = (req, res) => res.render('home', { date: new Date(), title, description })

exports.about = (req, res) => res.render('about', { quote: quoteDay.getQuoteDay(), layout: 'custom' })

exports.sectionTest = (req, res) => res.render('section-test')

exports.notFound = (req, res) => res.render('404')

// 일반 방식(복잡함)
exports.newsletterSignup = (req, res) => {
	// 현재는 테스트용
	res.render('newsletter-signup', { csrf: 'CSRF token goes here', layout: 'custom', title: '뉴스레터를 구독하세요!' })
}
exports.newsletterSignupProcess = (req, res) => {
	console.log('Form (from querystring): ' + req.query.from)
	console.log('CSRF token (from hidden form field): ' + req.body._csrf)
	console.log('Name (from visible form field): ' + req.body.name)
	console.log('Email (from visible form field): ' + req.body.email)
	res.redirect(303, '/newsletter-signup/thank-you')
}
exports.newsletterSignupThankYou = (req, res) => res.render('newsletter-signup-thank-you', { layout: 'custom' })

// fetch 방식
exports.newsletter = (req, res) => {
	// 현재는 테스트용
	res.render('newsletter-signup', { csrf: 'CSRF token goes here', layout: 'custom', title: '뉴스레터를 구독하세요!' })
}
exports.api = {
	newsletterSignup: (req, res) => {
		console.log('CSRF token (from hidden form field): ' + req.body._csrf)
		console.log('Name (from visible form field): ' + req.body.name)
		console.log('Email (from visible form field): ' + req.body.email)
		res.send({ result: 'success' })
	}
}

// 파일업로드 fetch 용
exports.vacationFetchPhoto = (req, res) => res.render('contest/vacation-fetch-photo', {
	csrf: 'CSRF token goes here',
	year: date.getFullYear(),
	month: date.getMonth() + 1,
	date: date.getDate(),
})
exports.api.vacationPhotoContestProcess = (req, res, fields, files) => {
	console.log('field data: ', fields)
	console.log('files: ', files)
	res.send({
		result: 'success',
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		date: date.getDate()
	})
}

// 파일업로드 용
exports.vacationPhoto = (req, res) => res.render('contest/vacation-photo', {
	csrf: 'CSRF token goes here',
	year: date.getFullYear(),
	month: date.getMonth() + 1,
	date: date.getDate(),
})
exports.vacationPhotoThankYou = (req, res) => res.render('contest/vacation-photo-thank-you')
exports.vacationPhotoContestProcess = (req, res, fields, files) => {
	console.log('field data: ', fields)
	console.log('files: ', files)
	res.redirect(303, '/vacation-photo-thank-you')
}
/*
	익스프레스는 매개변수가 4개 있어야 오류 핸들러를 인식하므로
	next 매개변수는 사용하지 않더라도 생략할 수 없습니다.
	그러므로 다음 행에 한해 ES린트의 no-unused-vars 규칙을 비활성화합니다.
*/
// eslint-disable-next-line no-unused-vars
exports.serverError = (err, req, res, next) => res.render('500')
