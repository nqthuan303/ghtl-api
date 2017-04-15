'use strict';

let client = require('./controllers/client');
let district = require('./controllers/district');
let order = require('./controllers/order');
let orderLog = require('./controllers/orderLog');
let orderStatus = require('./controllers/orderStatus');
let user = require('./controllers/user');
let ward = require('./controllers/ward');

var auth = require('./services/auth');

module.exports = (app) => {

    app.post('/api/client/add', auth.isAuthenticated, client.add);
    app.delete('/api/client/delete/:id', auth.isAuthenticated, client.delete);
    app.get('/api/client/findOne', auth.isAuthenticated, client.findOne);
    app.get('/api/client/getCount', auth.isAuthenticated, client.getCount);
    app.get('/api/client/list', auth.isAuthenticated, client.list);
    app.get('/api/client/listForSelect', auth.isAuthenticated, client.listForSelect);
    app.put('/api/client/update/:id', auth.isAuthenticated, client.update);

    app.post('/api/user/add', auth.isAuthenticated, user.add);
    app.delete('/api/user/delete/:id', auth.isAuthenticated, user.delete);
    app.get('/api/user/findOne', auth.isAuthenticated, user.findOne);
    app.get('/api/user/getCount', auth.isAuthenticated, user.getCount);
    app.get('/api/user/list', auth.isAuthenticated, user.list);
    app.get('/api/user/listForSelect', user.listForSelect);
    app.post('/api/user/login', user.login);
    app.put('/api/user/update/:id', auth.isAuthenticated, user.update);

    app.get('/api/district/listForSelect', district.listForSelect);
    app.get('/api/ward/listForSelect', ward.listForSelect);

    app.post('/api/order/add', auth.isAuthenticated, order.add);
    app.delete('/api/order/delete/:id', auth.isAuthenticated, order.delete);
    app.get('/api/order/findOne', auth.isAuthenticated, order.findOne);
    app.get('/api/order/getCount', auth.isAuthenticated, order.getCount);
    app.get('/api/order/list', auth.isAuthenticated, order.list);
    app.put('/api/order/update/:id', auth.isAuthenticated, order.update);
    app.put('/api/order/updateStatus/:id', auth.isAuthenticated, order.updateStatus);

    app.post('/api/orderlog/add', auth.isAuthenticated, orderLog.add);
    app.get('/api/orderStatus/listForSelect', orderStatus.listForSelect);
    
};