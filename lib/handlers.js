const quoteDay = require('./quote-days')
const { title, description } = require('./jnet-test')
const { redirect } = require('express/lib/response')
const date = new Date()
const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
'(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')
// 가상 가입 인터페이스
class NewsletterSignup {
	constructor({ name, email }) {
		this.name = name
		this.email = email
	}
	async save() {
		// 원래라면 데이터 베이스에 저장하는 코드가 들어감
		// 오류 없으므로 성공 반환
	}
}

exports.home = (req, res) => {
	res.cookie('monster', 'nom nom')
	res.cookie('signed_monter', 'nom nom', {
		signed: true,
		path: '/about',
		secure: true,
	})
	res.render('home', { date: new Date(), title, description })
}

exports.about = (req, res) => res.render('about', { quote: quoteDay.getQuoteDay() })

exports.sectionTest = (req, res) => {
	res.clearCookie('monster').clearCookie('signed_monter')
	res.render('section-test')
}

exports.notFound = (req, res) => res.render('404')

// 세션용 뉴스레터 구독
exports.newsletterSignupForSession = (req, res) => {
	res.render('session/newsletter-signup', { csrf: 'CSRF token goes here', title: '뉴스레터를 구독하세요!' })
}
// 뉴스레터 구독 후 화면
exports.newsArchiveForSession = (req, res) => res.render('session/newsletter-archive')

// 일반 방식(복잡함)
exports.newsletterSignup = (req, res) => {
	// 현재는 테스트용
	res.render('newsletter-signup', { csrf: 'CSRF token goes here', title: '뉴스레터를 구독하세요!' })
}
// exports.newsletterSignupProcess = (req, res) => {
// 	console.log('Form (from querystring): ' + req.query.from)
// 	console.log('CSRF token (from hidden form field): ' + req.body._csrf)
// 	console.log('Name (from visible form field): ' + req.body.name)
// 	console.log('Email (from visible form field): ' + req.body.email)
// 	res.redirect(303, '/newsletter-signup/thank-you')
// }
exports.newsletterSignupProcess = (req, res) => {
	const name = req.body.name || ''
	const email = req.body.email || ''

	// 입력 유효성 검사
	if(!VALID_EMAIL_REGEX.test(email)) {
		req.session.flash = {
			type: 'danger',
			intro: 'Validation error!',
			message: 'The email address you entered was not valid.',
		}
		return res.redirect(303, '/session-newsletter-signup')
	}

	new NewsletterSignup({ name, email }).save()
		.then(() => {
			req.session.flash = {
				type: 'success',
				intro: 'Thank you!',
				message: 'You have now been signed up for the newsletter.',
			}
			return res.redirect(303, '/session-newsletter-archive')
		})
		.catch(err => {
			req.session.flash = {
				type: 'danger',
				intro: 'Database error!',
				message: `There was a database error; please try again later. ${err}`,
			}
			return res.redirect(303, '/session-newsletter-archive')
		})
}

exports.newsletterSignupThankYou = (req, res) => res.render('newsletter-signup-thank-you')

// fetch 방식
exports.newsletter = (req, res) => {
	// 현재는 테스트용
	res.render('newsletter-signup', { csrf: 'CSRF token goes here', title: '뉴스레터를 구독하세요!' })
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

// 플래시 메세지 테스트용 (세션 사용)
exports.flashMessageTestHome = (req, res) => res.render('flash-test/home')
exports.flashMessageTestResult = (req, res) => {
	res.session.flash = {
		type: 'dark',
		intro: '플래시 메세지를 위한 테스트',
		message: `세션에 저장해 두면 작동합니다! <strong>여러가지 용도로 사용 가능할 듯 하네요.</strong>`,
	}
	return res.redirect(303, '/flash-message-test-result-view')
}
exports.flashMessageTestResultView = (req, res) => res.render('flash-test/result')

/*
	익스프레스는 매개변수가 4개 있어야 오류 핸들러를 인식하므로
	next 매개변수는 사용하지 않더라도 생략할 수 없습니다.
	그러므로 다음 행에 한해 ES린트의 no-unused-vars 규칙을 비활성화합니다.
*/
// eslint-disable-next-line no-unused-vars
exports.serverError = (err, req, res, next) => res.render('500')
