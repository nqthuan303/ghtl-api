'use strict';

let client = require('./controllers/client');
let district = require('./controllers/district');
let order = require('./controllers/order');
let user = require('./controllers/user');
let post = require('./controllers/post');
let ward = require('./controllers/ward');
let pickup = require('./controllers/pickup');
let delivery = require('./controllers/delivery');
let price = require('./controllers/price');
let refund = require('./controllers/refund');
let history = require('./controllers/history');
let payment = require('./controllers/payment');
let role = require('./controllers/role');

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
    app.post('/api/client/update/:id', auth.isAuthenticated, client.update);
    app.get('/api/client/orders-each-client', auth.isAuthenticated, client.ordersEachClient);
    app.get('/api/client/order-info/:clientId', auth.isAuthenticated, client.orderInfo);
    app.get('/api/client/client-for-payment', auth.isAuthenticated, client.clientForPayment);
    app.get('/api/client/find-one-payment/:id', auth.isAuthenticated, client.findOnePayment);
    app.post('/api/client/login', client.login);
    app.get('/api/client/find-shop', auth.isAuthenticated, client.findShop);

    app.post('/api/user/add', auth.isAuthenticated, user.add);
    app.delete('/api/user/delete/:id', auth.isAuthenticated, user.delete);
    app.get('/api/user/findOne/:id', auth.isAuthenticated, user.findOne);
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
    app.post('/api/order/cancel', auth.isAuthenticated, order.cancel);
    app.get('/api/order/findOne', auth.isAuthenticated, order.findOne);
    app.get('/api/order/getCount', auth.isAuthenticated, order.getCount);
    app.get('/api/order/getCountStorage', auth.isAuthenticated, order.getCountStorage);
    app.get('/api/order/list', auth.isAuthenticated, order.list);
    app.get('/api/order/listStorage', auth.isAuthenticated, order.listStorage);
    app.put('/api/order/update/:id', auth.isAuthenticated, order.update);
    app.post('/api/order/update-status', auth.isAuthenticated, order.updateStatus);
    app.post('/api/order/saveOrder', auth.isAuthenticated, order.saveOrder);
    app.get('/api/order/count-order-in-district', auth.isAuthenticated, order.countOrderInDistrict);
    app.get('/api/order/count-order-in-status', auth.isAuthenticated, order.countOrderInStatus);
    app.get('/api/order/count-order-in-all-status', auth.isAuthenticated, order.countOrderInAllStatus);
    app.get('/api/order/order-for-delivery', auth.isAuthenticated, order.orderForDelivery);
    app.get('/api/order/order-for-refund', auth.isAuthenticated, order.orderForRefund);
    app.put('/api/order/changeMulti', auth.isAuthenticated, order.changeMulti);

    app.post('/api/file/upload', upload.single('file'), file.upload);
    app.get('/api/file/list', auth.isAuthenticated, file.list);

    app.post('/api/post/add', auth.isAuthenticated, post.add);
    app.delete('/api/post/delete/:id', auth.isAuthenticated, post.delete);
    app.get('/api/post/findOne', auth.isAuthenticated, post.findOne);
    app.get('/api/post/getCount', auth.isAuthenticated, post.getCount);
    app.get('/api/post/list', auth.isAuthenticated, post.list);
    app.put('/api/post/update/:id', auth.isAuthenticated, post.update);

    app.post('/api/pickup/add', auth.isAuthenticated, pickup.add);
    app.post('/api/pickup/save', auth.isAuthenticated, pickup.save);
    app.get('/api/pickup/list', auth.isAuthenticated, pickup.list);
    app.get('/api/pickup/:id', auth.isAuthenticated, pickup.findOne);
    app.post('/api/pickup/delete/:id', auth.isAuthenticated, pickup.delete);
    app.get('/api/pickup/findByShipper/:shipperId', auth.isAuthenticated, pickup.findByShipper);

    app.get('/api/delivery/list', auth.isAuthenticated, delivery.list);
    app.post('/api/delivery/add', auth.isAuthenticated, delivery.add);
    app.get('/api/delivery/findOne/:id', auth.isAuthenticated, delivery.findOne);
    app.put('/api/delivery/update/:id', auth.isAuthenticated, delivery.update);
    app.delete('/api/delivery/delete/:id', auth.isAuthenticated, delivery.delete);
    app.put('/api/delivery/change-status-doing/:id', auth.isAuthenticated, delivery.changeStatusDoing);
    app.put('/api/delivery/delivery-completed/:id', auth.isAuthenticated, delivery.deliveryCompleted);
    app.put('/api/delivery/delivery-done/:id', auth.isAuthenticated, delivery.deliveryDone);

    app.post('/api/price/add', auth.isAuthenticated, price.add);
    app.delete('/api/price/delete/:id', auth.isAuthenticated, price.delete);
    app.get('/api/price/list/:shopId', auth.isAuthenticated, price.list);
    app.post('/api/price/update/:id', auth.isAuthenticated, price.update);

    app.get('/api/refund/list', auth.isAuthenticated, refund.list);
    app.post('/api/refund/add', auth.isAuthenticated, refund.add);
    app.get('/api/refund/findOne/:id', auth.isAuthenticated, refund.findOne);
    app.put('/api/refund/update/:id', auth.isAuthenticated, refund.update);
    app.delete('/api/refund/delete/:id', auth.isAuthenticated, refund.delete);
    app.put('/api/refund/changeStatusRefund/:id', auth.isAuthenticated, refund.changeStatusRefund);
    app.put('/api/refund/completeRefund/:id', auth.isAuthenticated, refund.completeRefund);

    app.get('/api/history/list-for-type', auth.isAuthenticated, history.listForType);

    app.get('/api/payment/list', auth.isAuthenticated, payment.list);
    app.post('/api/payment/add', auth.isAuthenticated, payment.add);
    app.get('/api/payment/findOne/:id', auth.isAuthenticated, payment.findOne);
    app.put('/api/payment/update/:id', auth.isAuthenticated, payment.update);
    app.delete('/api/payment/delete/:id', auth.isAuthenticated, payment.delete);
    app.put('/api/payment/payment-done/:id', auth.isAuthenticated, payment.paymentDone);
    app.put('/api/payment/payment-cancel/:id', auth.isAuthenticated, payment.paymentCancel);
    app.get('/api/role/list', auth.isAuthenticated, role.list);
};