const router = require('express').Router()

router.use('/orders', require('./orders'))
router.use('/users', require('./users'))
router.use('/companies', require('./companies'))
router.use('/portfolios', require('./portfolios'))


router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

module.exports = router;
