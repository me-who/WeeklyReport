var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 用户信息
router.get('/addUser', function(req, res, next) {
  userDao.add(req, res, next);
});

router.get('/queryById', function(req, res, next) {
  userDao.queryById(req, res, next);
});

router.get('/deleteUser', function(req, res, next) {
  userDao.deleteUser(req, res, next);
});

router.get('/deletePro', function(req, res, next) {
  userDao.deletePro(req, res, next);
});

router.get('/queryAll', function(req, res, next) {
  userDao.queryAll(req, res, next);
});

// 周报填写
router.get('/insertReport', function (req, res, next) {
  userDao.insertReport(req, res, next);
});

router.get('/queryRepByName', function (req, res, next) {
  userDao.queryRepByName(req, res, next);
});

router.get('/queryRepAll', function (req, res, next) {
  userDao.queryRepAll(req, res, next);
});

router.get('/queryRangeRepAll', function (req, res, next) {
  userDao.queryRangeRepAll(req, res, next);
});

router.get('/queryRangeRep', function (req, res, next) {
  userDao.queryRangeRep(req, res, next);
});

router.get('/updatePass', function (req, res, next) {
  userDao.updatePass(req, res, next);
});

router.get('/queryProAll', function (req, res, next) {
  userDao.queryProAll(req, res, next);
});

router.get('/queryRepByWeek', function (req, res, next) {
  userDao.queryRepByWeek(req, res, next);
});

router.get('/queryRepByRange', function (req, res, next) {
  userDao.queryRepByRange(req, res, next);
});

router.get('/queryWeekRep', function (req, res, next) {
  userDao.queryWeekRep(req, res, next);
});

router.get('/insertPro', function (req, res, next) {
  userDao.insertPro(req, res, next);
});

router.get('/updateRep', function (req, res, next) {
  userDao.updateRep(req, res, next);
});

router.get('/exportRep', function (req, res, next) {
  userDao.exportRep(req, res, next);
});

router.get('/getPrevious', function (req, res, next) {
  userDao.getPrevious(req, res, next);
});


module.exports = router;
