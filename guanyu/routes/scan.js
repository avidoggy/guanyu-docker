"use strict";

var extend = require('extend');
var fs = require('fs');

var logger = require('../guanyu/logger');
var route_helper = require('../guanyu/helper/route');
var scanner = require('../guanyu/scanner');

var file_max_size = require('../config').file_max_size;
var router = require('express').Router();
var upload = require('multer')({limits: {fileSize: file_max_size}, dest: '/tmp/'});


function handle_err(res, err) {
  logger.warn(err);
  res.status(err.status || 500).render("error", {
    message: err.message || "Oops, something bad happened.",
    error: err
  });
}



router.get('/', (req, res) => {
  route_helper.do_render(res, 'scan-usage');
});

router.get('/file', (req, res) => {
  route_helper.do_render(res, 'scan-file-usage');
});

router.post('/file', upload.single('file'), (req, res) => {
  scanner.scan_file(
    req.file.path,
    route_helper.collect_options(req)
  ).then(
    (result) => {
      logger.info(result);
      res.send(result);
    }, (err) => {
      handle_err(res, err);
    });
});


router.get('/uri', (req, res) => {
  route_helper.do_render(res, 'scan-uri-usage');
});

router.post('/uri', (req, res) => {
  scanner.scan_uri(
    req.body.uri,
    route_helper.collect_options(req)
  ).then(
    (result) => {
      logger.info(result);
      res.send(result);
    }, (err) => {
      return handle_err(res, err);
    });
});


router.get('/text', (req, res) => {
  route_helper.do_render(res, 'scan-text-usage');
});

router.post('/text', (req, res) => {
  scanner.scan_text(
    req.body.text,
    route_helper.collect_options(req)
  ).then(
    (result) => {
      logger.info(result);
      res.send(result);
    }, (err) => {
      return handle_err(res, err);
    });
});

module.exports = router;
