module.exports = (req, res, next) => {
	// 플래시 메시지가 있다면, 컨텍스트에 전달 후 내용 비움
	res.locals.flash = req.session.flash
	delete req.session.flash
	next()
}