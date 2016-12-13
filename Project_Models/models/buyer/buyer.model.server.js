module.exports = function () {

    var mongoose = require("mongoose");
    var BuyerSchema = require("./buyer.schema.server");

    var Buyer = mongoose.model('Buyer', BuyerSchema);

    var api = {
        createBuyer: createBuyer,
        findBuyerById: findBuyerById,
        findBuyerByBuyername: findBuyerByBuyername,
        findBuyerByCredentials: findBuyerByCredentials,
        updateBuyer: updateBuyer,
        deleteBuyer: deleteBuyer,
        updateCart:updateCart,
        findSellerByName:findSellerByName,
        findCartDetails:findCartDetails
    };
    return api;

    function createBuyer(buyer) {
        return Buyer.create(buyer);
    }



    function findBuyerById(buyerId) {
        return Buyer.findById(buyerId);
    }

    function findBuyerByBuyername(username) {



        return Buyer.findOne({username: username });
    }

    function findSellerByName(varietyname) {

        //Buyer.findOne({},function(err,docs){console.log(docs)});

        return Buyer.find({varietyname: varietyname });
    }

    function findBuyerByCredentials(username, password) {
        return Buyer.findOne({username: username, password: password});
    }

    function updateBuyer(buyerId, buyer) {
        delete buyer._id;
        console.log("buyer cart");
        return Buyer
            .update(
                {_id: buyerId},
                {$set: buyer}
            );
    }

    function updateCart(buyerId, cart) {

        console.log("buyer cart");
        return Buyer
            .update(
                {_id: buyerId},
                {$push: {cart: cart}}
            );
    }

    function findCartDetails(buyerId)
    {


        return Buyer.findById(buyerId).select('cart -_id');

    }


    function deleteBuyer(buyerId) {
        return Buyer.remove({_id: buyerId});
    }

};