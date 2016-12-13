/**
 * Created by Soumya on 10/29/16.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt-nodejs");


module.exports = function(app,models) {

    var buyerModel = models.buyerModel;

    app.post("/api/loginBuyer", passport.authenticate('wam'), loginBuyer);
    app.post('/api/logoutBuyer', logoutBuyer);
    app.post('/api/registerBuyer', registerBuyer);
    app.get('/api/loggedInBuyer', loggedInBuyer);


    app.post("/api/buyer", createBuyer);
    app.get("/api/buyer", findBuyer);
    app.get("/api/buyer/:buyerId", findBuyerById);
    app.get("/api/buyer?username=username", findBuyerByBuyername);
    app.get("/api/buyer?username=username&password=password", findBuyerByCredentials);
    app.put("/api/buyer/:buyerId", updateBuyer);
    app.delete("/api/buyer/:buyerId", deleteBuyer);
    app.get("/api/seller/:varietyname",findSellerByName);
    app.post("/api/cart/",addtocart);
    app.get("/api/cartdetails",findCartDetails);

    passport.use('wam', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, localStrategy));
    passport.serializeUser(serializeBuyer);
    passport.deserializeUser(deserializeBuyer);


    function localStrategy(username, password, done) {

        console.log("Logging buyer info in strategy: " + username);

        buyerModel
            .findBuyerByBuyername(username)
            .then(
                function(buyer) {

                    if(buyer && bcrypt.compareSync(password, buyer.password))  {
                        console.log("Logging buyer info in strategy: " + buyer.username);
                        done(null, buyer);
                    } else {
                        console.log("Logging buyer info in else strategy: " + buyer.username);
                        done(null, false);
                    }
                },
                function(err) {
                    if (err) {
                        console.log("Logging something wrong");
                        done(err);
                    }
                }
            );
    }

    function serializeBuyer(buyer, done) {
        done(null, buyer);
    }

    function deserializeBuyer(buyer, done) {
        buyerModel
            .findBuyerById(buyer._id)
            .then(
                function(buyer){
                    done(null, buyer);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function loggedInBuyer(req, res) {
        if(req.user){
            console.log("user");
            res.json(req.user);}
        else
        {
            res.send('0');
        }

    }




    function logoutBuyer(req, res) {
        console.log("inside buyers.service.server");
        req.logOut();
        res.send(200);
    }

    function loginBuyer(req, res) {
        var buyer = req.user;

        console.log("Logging buyer info in login: " + buyer);
        res.json(buyer);
    }

    function registerBuyer(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        var role = req.body.role;

        buyerModel
            .findBuyerByBuyername(username)
            .then(
                function(buyer) {
                    if(buyer) {
                        res.status(400).send("Username already in use");
                        return;
                    } else {
                        req.body.password = bcrypt.hashSync(req.body.password);
                        return buyerModel
                            .createBuyer(req.body);
                    }
                },
                function(err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function(buyer) {
                    if(buyer) {
                        req.login(buyer, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(buyer);
                            }
                        })
                    }
                },
                function(err) {
                    res.status(400).send(err);
                }
            )
    }



    function deleteBuyer(req, res) {
        var buyerId = req.params.buyerId;
        buyerModel
            .deleteBuyer(buyerId)
            .then(
                function (stats) {
                    res.send(stats);
                },
                function (error) {
                    res.statusCode(404).send(error);
                }
            );
    }

    function updateBuyer(req, res) {
        var buyerId = req.params.buyerId;
        var buyer = req.body ;

        buyerModel
            .updateBuyer(buyerId, buyer)
            .then(
                function (stats) {
                    res.send(stats);
                },
                function (error) {
                    res.send(error);
                }
            );
    }


    function addtocart(req, res) {
        var buyerId = req.user;

        var cart = req.body ;

        buyerModel
            .updateCart(buyerId, cart)
            .then(
                function (stats) {
                    res.send(stats);
                },
                function (error) {
                    res.send(error);
                }
            );
    }
    function findSellerByName(req,res){

        var varietyname = req.params.varietyname;
        console.log("variety name: service.server.js ******");
        console.log(varietyname);

        buyerModel
            .findSellerByName(varietyname)
            .then(
                function (buyer) {
                    console.log("BUYERRRRR");
                    console.log(buyer);
                    res.json(buyer);


                },
                function (error) {
                    res.statusCode(404).send(null);
                }
            )

    }
    function createBuyer(req, res) {
        var buyer = req.body;
        buyerModel
            .createBuyer(buyer)
            .then(
                function (buyer) {
                    res.send(buyer);
                },
                function(error) {
                    console.log(error);
                }
            );
    }

    function findBuyerById(req, res) {
        var buyerId = req.params.buyerId;

        buyerModel
            .findBuyerById(buyerId)
            .then(
                function (buyer) {
                    res.json(buyer);

                },
                function (error) {
                    res.statusCode(404).send(null);
                }
            )
    }

    function findBuyer(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];
        if(username && password) {
            findBuyerByCredentials(username, password, res);
        } else if(username) {
            findBuyerByBuyername(username, res);
        } else {
            res.send(buyers);
        }
    }

    function findBuyerByCredentials(username, password, res) {
        buyerModel
            .findBuyerByCredentials(username,password)
            .then(
                function (buyer) {
                    res.json(buyer);
                },
                function () {
                    res.statusCode(404).send(null);
                }
            );
    }

    function findBuyerByBuyername(username, res) {
        buyerModel
            .findBuyerByBuyername(username)
            .then(
                function (buyer) {
                    res.json(buyer);
                },
                function () {
                    res.statusCode(404).send(null);
                }
            );
    }

    function findCartDetails(req,res){
        var buyerId = req.user;
        buyerModel
            .findCartDetails(buyerId)
            .then(
                function (buyer) {
                    res.json(buyer);
                },
                function () {
                    res.statusCode(404).send(null);
                }
            );

    }

};