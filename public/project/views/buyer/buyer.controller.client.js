/**
 * Created by Soumya on 10/16/16.
 */
(function(){
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("SellerProfileController", SellerProfileController)
        .controller("ProfileController", ProfileController);


    /*function LoginController($location, BuyerService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            BuyerService.findBuyerByCredentials(username,password)
                .then(function (response) {
                    var buyer = response.data;

                    if(buyer){

                        $location.url("/buyer/"+buyer._id);
                    } else {
                        vm.error = "Buyer not found";
                    }
                });

        }

        vm.register = function() {
            $location.url("/register");
        }
    }*/

    function LoginController($location, BuyerService) {
        var vm = this;

        vm.loginBuyer = loginBuyer;

        function loginBuyer (username,password) {
            if(username === "" || username == null){
                vm.error = "Please provide a Username"
            } else if (password === "" || password == null){
                vm.error = "Please provide a Password"
            } else {
                BuyerService
                    .loginBuyer(username,password)
                    .then(function (response) {
                            var buyer = response.data;

                            //console.log(buyer);

                            if(buyer && buyer.role=='BUYER'){
                                $location.url("/buyer/"+buyer._id);
                            } else if(buyer && buyer.role=='SELLER') {
                                $location.url("/seller/" + buyer._id);
                            }
                            else{
                                vm.error = "User not found";
                            }
                        },
                        function (error) {
                            vm.error = error;//"User not found !!"
                        });
            }
        }

        vm.registerBuyer = function() {
            $location.url("/registerBuyer");
        }
    }



    function RegisterController($location,BuyerService) {
        var vm = this;

        vm.registerBuyer = registerBuyer;

        function registerBuyer (username, password, password2, role) {

            if(username == null || password == null || password2 == null || role == null ||
                username == "" || password == "" || password2 == "" || role == "" ){
                vm.error = "Username, Password and role must be entered";

            } else if(password !== password2) {
                vm.error = "Password must match";

            } else {
                BuyerService.findBuyerByBuyername(username)
                    .then(function (response) {
                        var prevBuyer = response.data;
                        if(prevBuyer){
                            vm.error = "Username already Exists";


                        } else {
                            BuyerService
                                .registerBuyer(username,password, role)
                                .then(
                                    function (response) {
                                        var buyer = response.data;
                                        if(buyer && buyer.role=='BUYER'){
                                            $location.url("/buyer/"+buyer._id);
                                        } else if(buyer && buyer.role=='SELLER') {
                                            $location.url("/seller/" + buyer._id);
                                        }
                                        else{
                                            vm.error = "User not found";
                                        }}

                                );
                        }
                    });
            }
        }
    }





    function ProfileController($routeParams, BuyerService,$location) {



        var vm = this;
        vm.updateBuyer=updateBuyer;
        vm.deleteBuyer=deleteBuyer;
        vm.logoutBuyer=logoutBuyer;

        vm.buyerId = $routeParams['uid'];


        function init() {
            BuyerService
                .findBuyerById(vm.buyerId )
                .then(function (response) {
                    vm.buyer = response.data;
                });
        }
        init();


        function logoutBuyer() {
            console.log("inside clinet logout");
            BuyerService
                .logoutBuyer()
                .then(
                    function(response) {
                        $location.url("/loginBuyer");
                    },
                    function() {
                        $location.url("/loginBuyer");
                    }
                );

        }

        function deleteBuyer() {
            BuyerService
                .deleteBuyer(vm.buyerId )
                .then(
                    function(response){
                        $location.url("/loginBuyer");
                    },
                    function(error) {
                        vm.error = "Unable to remove buyer"
                    }
                );
        }

        function updateBuyer(updatedBuyer) {
            vm.error = null;
            vm.success = null;
            if(updatedBuyer.username === "" || updatedBuyer.username == null){
                vm.error = "All details must be entered";
            } else {
                BuyerService
                    .updateBuyer(vm.buyerId , vm.buyer)
                    .then(
                        function (response) {
                            vm.success = "Updated successfully";
                            $location.url("/home");
                        },
                        function (error) {
                            vm.error = "Unable to update buyer"
                        }
                    );
            }
        }


    }





    function SellerProfileController($routeParams, BuyerService,$location) {



        var vm = this;
        vm.updateBuyer=updateBuyer;
        vm.deleteBuyer=deleteBuyer;
        vm.logoutBuyer=logoutBuyer;

        vm.buyerId = $routeParams['uid'];


        function init() {
            console.log("init");
            BuyerService
                .findBuyerById(vm.buyerId )
                .then(function (response) {
                    vm.buyer = response.data;
                });
        }
        init();


        function logoutBuyer() {
            BuyerService
                .logoutBuyer()
                .then(
                    function(response) {
                        $location.url("/loginBuyer");
                    },
                    function() {
                        $location.url("/loginBuyer");
                    }
                );

        }

        function deleteBuyer() {
            BuyerService
                .deleteBuyer(vm.buyerId )
                .then(
                    function(response){
                        $location.url("/loginBuyer");
                    },
                    function(error) {
                        vm.error = "Unable to remove buyer"
                    }
                );
        }

        function updateBuyer(updatedBuyer) {
            vm.error = null;
            vm.success = null;
            if(updatedBuyer.username === "" || updatedBuyer.username == null){
                vm.error = "All details must be entered";
            } else {
                BuyerService
                    .updateBuyer(vm.buyerId , vm.buyer)
                    .then(
                        function (response) {
                            vm.success = "Updated successfully";

                        },
                        function (error) {
                            vm.error = "Unable to update buyer"
                        }
                    );
            }
        }


    }
})();
