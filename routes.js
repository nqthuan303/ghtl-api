'use strict';

let client = require('./controllers/client');
let district = require('./controllers/district');
let order = require('./controllers/order');
let orderLog = require('./controllers/orderLog');
let orderStatus = require('./controllers/orderStatus');
let user = require('./controllers/user');
let post = require('./controllers/post');
let ward = require('./controllers/ward');
let pickup = require('./controllers/pickup');
let delivery = require('./controllers/delivery');

var auth = require('./services/auth');
var file = require('./controllers/file');

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images');
    },
    filename: function (req, file, cb) {
        var originalname = file.originalname;
        var index = 0;
        for (var i = 0; i < originalname.length; i++) {
            if (originalname[i] === ".") index = i;
        }
        let fileType = originalname.substr(index);
        cb(null, Date.now() + fileType);
    }
});

var upload = multer({
    storage: storage
});

module.exports = (app) => {

    app.post('/api/client/add', auth.isAuthenticated, client.add);
    app.delete('/api/client/delete/:id', auth.isAuthenticated, client.delete);
    app.get('/api/client/findOne/:id', auth.isAuthenticated, client.findOne);
    app.get('/api/client/getCount', auth.isAuthenticated, client.getCount);
    app.get('/api/client/list', auth.isAuthenticated, client.list);
    app.get('/api/client/listForSelect', auth.isAuthenticated, client.listForSelect);
    app.put('/api/client/update/:id', auth.isAuthenticated, client.update);
    app.get('/api/client/orders-each-client', auth.isAuthenticated, client.ordersEachClient);

    app.post('/api/user/add', auth.isAuthenticated, user.add);
    app.delete('/api/user/delete/:id', auth.isAuthenticated, user.delete);
    app.get('/api/user/findOne', auth.isAuthenticated, user.findOne);
    app.get('/api/user/getCount', auth.isAuthenticated, user.getCount);
    app.get('/api/user/list', auth.isAuthenticated, user.list);
    app.get('/api/user/getShipper', auth.isAuthenticated, user.getShipper);
    app.get('/api/user/listForSelect', user.listForSelect);
    app.post('/api/user/login', user.login);
    app.put('/api/user/update/:id', auth.isAuthenticated, user.update);

    app.get('/api/district/listForSelect', district.listForSelect);
    app.get('/api/ward/listForSelect', ward.listForSelect);

    app.post('/api/order/add', auth.isAuthenticated, order.add);
    app.delete('/api/order/delete/:id', auth.isAuthenticated, order.delete);
    app.get('/api/order/findOne', auth.isAuthenticated, order.findOne);
    app.get('/api/order/getCount', auth.isAuthenticated, order.getCount);
    app.get('/api/order/getCountStorage', auth.isAuthenticated, order.getCountStorage);
    app.get('/api/order/list', auth.isAuthenticated, order.list);
    app.get('/api/order/listStorage', auth.isAuthenticated, order.listStorage);
    app.put('/api/order/update/:id', auth.isAuthenticated, order.update);
    app.put('/api/order/updateStatus/:id', auth.isAuthenticated, order.updateStatus);
    app.post('/api/order/setStatus', auth.isAuthenticated, order.setStatus);
    app.get('/api/order/count-order-in-district', auth.isAuthenticated, order.countOrderInDistrict);
    app.get('/api/order/count-order-in-status', auth.isAuthenticated, order.countOrderInStatus);
    app.get('/api/order/order-each-district-and-status', auth.isAuthenticated, order.orderEachDistrictAndStatus);
    
    app.post('/api/orderlog/add', auth.isAuthenticated, orderLog.add);
    app.get('/api/orderStatus/listForSelect', orderStatus.listForSelect);

    app.post('/api/file/upload', upload.single('file'), file.upload);
    app.get('/api/file/list', auth.isAuthenticated, file.list);

    app.post('/api/post/add', auth.isAuthenticated, post.add);
    app.delete('/api/post/delete/:id', auth.isAuthenticated, post.delete);
    app.get('/api/post/findOne', auth.isAuthenticated, post.findOne);
    app.get('/api/post/getCount', auth.isAuthenticated, post.getCount);
    app.get('/api/post/list', auth.isAuthenticated, post.list);
    app.put('/api/post/update/:id', auth.isAuthenticated, post.update);

    app.post('/api/pickup/add', auth.isAuthenticated, pickup.add);
    app.get('/api/pickup/list', auth.isAuthenticated, pickup.list);
    app.post('/api/pickup/delete/:id', auth.isAuthenticated, pickup.delete);
    app.get('/api/pickup/findByShipper/:shipperId', auth.isAuthenticated, pickup.findByShipper);

    app.post('/api/delivery/list', auth.isAuthenticated, delivery.list);
};