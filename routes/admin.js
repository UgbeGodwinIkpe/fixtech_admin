const express = require('express')
const router = express.Router()
const login = require('../controller/admin')
const logout = require('../controller/admin')
const list = require('../controller/admin')
const userdetails = require('../controller/admin')
const editreferral = require('../controller/admin')
const referrals = require('../controller/admin')
const commission = require('../controller/admin')
const notify = require('../controller/admin')
const notifyall = require('../controller/admin')
const home = require('../controller/admin')
const pending = require('../controller/admin')

router.post('/login', login)
router.get('/logout', logout)
router.post('/list', list)
router.post('/userdetails', userdetails)
router.post('/referrals', referrals)
router.post('/editreferral', editreferral)
router.post('/commission', commission)
router.post('/notify', notify)
router.post('/notifyall', notifyall)
router.get('/home', home)
router.post('/pending', pending)

module.exports = router