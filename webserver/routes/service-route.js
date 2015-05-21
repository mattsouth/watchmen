var moment = require('moment');
var express = require('express');
var debug = require('debug')('service-route');
var serviceValidator = require('./../../lib/service-validator');

module.exports.getRoutes = function (storage){

    var router = express.Router();

    /**
     * Add service
     */

    router.post('/services', function(req, res){
        var service = req.body;

        var errors = serviceValidator.validate(service);
        if (errors.length) {
            return res.status(400).json({ errors: errors });
        }
        storage.addService(service, function(err, id){
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.status(200).json({ id: id });
        });
    });

    /**
     * Delete service
     */

    router.delete('/services/:id', function(req, res){
        var id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'ID parameter not found' });
        }
        storage.getService(id, function(err, service){
            if (err) {
                return res.status(500).json({ error: err });
            }

            if (!service) {
                return res.status(400).json({ error: 'service not found' });
            }

            storage.deleteService(id, function(err){
                if (err) {
                    return res.status(500).json({ error: err });
                }
                return res.status(200).json({ id: id });
            });
        });
    });


    /**
     * Rest service data
     */

    router.post('/services/:id/reset', function(req, res){
        var id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'ID parameter not found' });
        }
        storage.getService(id, function(err, service){
            if (err) {
                return res.status(500).json({ error: err });
            }

            if (!service) {
                return res.status(400).json({ error: 'service not found' });
            }

            storage.resetService(id, function(err){
                if (err) {
                    return res.status(500).json({ error: err });
                }
                return res.status(200).json({ id: id });
            });
        });
    });

    /**
     * Load service
     */

    router.get('/services/:id', function(req, res){
        if (!req.params.id) {
            return res.status(400).json({ error: 'ID parameter not found' });
        }
        storage.getService(req.params.id, function (err, service){
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err });
            }
            res.json(service);
        });
    });

    /**
     * Load services
     */

    router.get('/services', function(req, res){
        storage.getServices({}, function (err, services){
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err });
            }
            console.log(services)
            res.json(services);
        });
    });

    return router;
};