'use strict';

var _swaggerUiExpress = require('swagger-ui-express');

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _yamljs = require('yamljs');

var _yamljs2 = _interopRequireDefault(_yamljs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _socket = require('socket.io');

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

var _format = require('date-fns/format');

var _format2 = _interopRequireDefault(_format);

var _serviceRating = require('./src/routes/serviceRating');

var _serviceRating2 = _interopRequireDefault(_serviceRating);

var _store = require('./src/routes/store');

var _store2 = _interopRequireDefault(_store);

var _category = require('./src/routes/category');

var _category2 = _interopRequireDefault(_category);

var _service = require('./src/routes/service');

var _service2 = _interopRequireDefault(_service);

var _postcomment = require('./src/routes/postcomment');

var _postcomment2 = _interopRequireDefault(_postcomment);

var _post = require('./src/routes/post');

var _post2 = _interopRequireDefault(_post);

var _orderStatus = require('./src/routes/orderStatus');

var _orderStatus2 = _interopRequireDefault(_orderStatus);

var _order = require('./src/routes/order');

var _order2 = _interopRequireDefault(_order);

var _serviceStep = require('./src/routes/serviceStep');

var _serviceStep2 = _interopRequireDefault(_serviceStep);

var _storenotify = require('./src/routes/storenotify');

var _storenotify2 = _interopRequireDefault(_storenotify);

var _user = require('./src/routes/user');

var _user2 = _interopRequireDefault(_user);

var _auth = require('./src/routes/auth');

var _auth2 = _interopRequireDefault(_auth);

var _storeMemberShip = require('./src/routes/storeMemberShip');

var _storeMemberShip2 = _interopRequireDefault(_storeMemberShip);

var _storeRating = require('./src/routes/storeRating');

var _storeRating2 = _interopRequireDefault(_storeRating);

var _userRole = require('./src/routes/userRole');

var _userRole2 = _interopRequireDefault(_userRole);

var _usernotify = require('./src/routes/usernotify');

var _usernotify2 = _interopRequireDefault(_usernotify);

var _staff = require('./src/routes/staff');

var _staff2 = _interopRequireDefault(_staff);

var _activityLog = require('./src/routes/activityLog');

var _activityLog2 = _interopRequireDefault(_activityLog);

var _bill = require('./src/routes/bill');

var _bill2 = _interopRequireDefault(_bill);

var _voucher = require('./src/routes/voucher');

var _voucher2 = _interopRequireDefault(_voucher);

var _controller = require('./src/socket/controller');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function (value) {
              step('next', value);
            },
            function (err) {
              step('throw', err);
            }
          );
        }
      }
      return step('next');
    });
  };
}

var app = (0, _express2.default)();
var swaggerJSDocs = _yamljs2.default.load('./api.yaml');

var server = _http2.default.createServer(app);
_dotenv2.default.config();

var io = new _socket.Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET, POST'],
  },
});

app.use((0, _cors2.default)());
app.use(_express2.default.json());
app.use('/', function (req, res) {
  res.json('Wellcome');
});
app.use('/api', _serviceRating2.default);
app.use('/api', _store2.default);
app.use('/api', _category2.default);
app.use('/api', _postcomment2.default);
app.use('/api', _orderStatus2.default);
app.use(
  '/api-docs',
  _swaggerUiExpress2.default.serve,
  _swaggerUiExpress2.default.setup(swaggerJSDocs)
);
app.use('/api', _service2.default);
app.use('/api', _post2.default);
app.use('/api', _order2.default);
app.use('/api', _serviceStep2.default);
app.use('/api', _storenotify2.default);
app.use('/api', _user2.default);
app.use('/api', _auth2.default);
app.use('/api', _storeMemberShip2.default);
app.use('/api', _storeRating2.default);
app.use('/api', _usernotify2.default);
app.use('/api', _userRole2.default);
app.use('/api', _staff2.default);
app.use('/api', _activityLog2.default);
app.use('/api', _bill2.default);
app.use('/api', _voucher2.default);

var clientId = '';

io.on('connection', function (socket) {
  console.log('Socket connected: ' + socket.id);
  socket.on('set-client-id', function (data) {
    clientId = data;
  });
  socket.on(
    'send-notify',
    (function () {
      var _ref = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee(data) {
          var newNotify;
          return regeneratorRuntime.wrap(
            function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    _context.next = 2;
                    return (0, _controller.createNotify)(data.notifyData);

                  case 2:
                    newNotify = _context.sent;

                    io.emit('receive-new-order', data.storeId);
                    io.emit('receive-notify', newNotify);
                    io.emit('receive-new-notify');

                  case 6:
                  case 'end':
                    return _context.stop();
                }
              }
            },
            _callee,
            undefined
          );
        })
      );

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })()
  );
  socket.on(
    'update-notify-status',
    (function () {
      var _ref2 = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee2(data) {
          return regeneratorRuntime.wrap(
            function _callee2$(_context2) {
              while (1) {
                switch ((_context2.prev = _context2.next)) {
                  case 0:
                    _context2.next = 2;
                    return (0, _controller.updateNotifyStatus)(data);

                  case 2:
                    socket.emit('receive-new-notify');

                  case 3:
                  case 'end':
                    return _context2.stop();
                }
              }
            },
            _callee2,
            undefined
          );
        })
      );

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })()
  );
  socket.on('change-status', function () {
    io.emit('receive-status-change');
  });

  socket.on(
    'send-notify-to-user',
    (function () {
      var _ref3 = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee3(data) {
          var newNotify;
          return regeneratorRuntime.wrap(
            function _callee3$(_context3) {
              while (1) {
                switch ((_context3.prev = _context3.next)) {
                  case 0:
                    _context3.next = 2;
                    return (0, _controller.createUserNotify)(data);

                  case 2:
                    newNotify = _context3.sent;

                    io.emit('receive-user-notify', newNotify);

                  case 4:
                  case 'end':
                    return _context3.stop();
                }
              }
            },
            _callee3,
            undefined
          );
        })
      );

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })()
  );

  socket.on('rated-service', function () {
    io.emit('receive-new-rated');
  });
});

var job = _nodeCron2.default.schedule('* * * * * *', function () {
  io.emit('receive-new-rated');
});

job.start();

_mongoose2.default
  .connect(process.env.MONGODB_URI)
  .then(function () {
    return console.log('Database connected');
  })
  .catch(function () {
    return console.log('Connect database failed');
  });

var PORT = process.env.PORT || 3000;

server.listen(PORT, function () {
  console.log('Server listening on port ' + PORT);
});
