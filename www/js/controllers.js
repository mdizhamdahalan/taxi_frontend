angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicSideMenuDelegate, $state, $ionicHistory, $rootScope, $timeout, $ionicLoading, $location, $interval, AccountService) {
    // Code you want executed every time view is opened
//    $scope.taxiData = taxiData = {};
//    $scope.$on('$ionicView.enter', function () {
//    $timeout(function () {
        $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));
//        //console.log(taxiData);
        navIcons = document.getElementsByTagName("button");
        //console.log(navIcons);
        //console.log(navIcons[0]);
        //console.log('dddddd')

        $scope.theIntervalCheckAccount = null;
        if (!taxiData) {
            $ionicLoading.hide();
            navIcons = document.getElementsByClassName("ion-navicon");
            for (i = 0; i < navIcons.length; i++) navIcons[i].classList.add("ng-hide");
            $state.go('tab.login');
            return false;
        } else {
            for (i = 0; i < navIcons.length; i++) navIcons[i].classList.remove("ng-hide");
            $scope.reload = function() {
                // Your refresh code
                $rootScope.$emit('refreshedPressed');
            }

            $scope.theIntervalCheckAccount = $interval(function(){
                AccountService.getTaxiData(taxiData.id);
            }.bind(this), 1000);

        }

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if ($location.path() == "/tab/trips") {
                cls = document.getElementsByClassName("reloadbutton");
                for (i = 0; i < cls.length; i++) cls[i].classList.remove("ng-hide");
            } else {
                cls = document.getElementsByClassName("reloadbutton");
                for (i = 0; i < cls.length; i++) cls[i].classList.add("ng-hide");
            }
        });

//    }, 1000);

/*    $scope.toggleLeftSideMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
*/
})


.controller('HistoryCtrl', function($scope, $state, HistoryService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    HistoryService.getAll(taxiData.id).then(function(response) {
        $timeout(function() {
            $scope.histories = response; //Assign data received to $scope.data
            $ionicLoading.hide();
        }, 1000);
    });
    $scope.view = function(hID) {
        $state.go('tab.history.view', {hID: hID});
    }
})
.controller('HistoryViewCtrl', function($scope, $state, $stateParams, HistoryService, $ionicPopup, $interval, $ionicNavBarDelegate, $ionicLoading, $timeout) {
    $ionicNavBarDelegate.showBackButton(true);
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    HistoryService.getOne($scope.hID).then(function(response) {
        $timeout(function() {
            $scope.history = response; //Assign data received to $scope.data
            $ionicLoading.hide();
        }, 1000);
    });
})


.controller('InfriengeCtrl', function($scope, $state, InfriengeService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    InfriengeService.getAll(taxiData.id).then(function(response) {
        $timeout(function() {
            $scope.infrienges = response; //Assign data received to $scope.data
            $ionicLoading.hide();
        }, 1000);
    });

    $scope.view = function(iID) {
        $state.go('tab.infrienge.view', {iID: iID});
    }
})
.controller('InfriengeViewCtrl', function($scope, $state, $stateParams, InfriengeService, $ionicPopup, $interval, $ionicNavBarDelegate, $ionicLoading, $timeout) {
    $ionicNavBarDelegate.showBackButton(true);
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    InfriengeService.getOne($scope.iID).then(function(response) {
        $timeout(function() {
            $scope.infrienge = response; //Assign data received to $scope.data
            $ionicLoading.hide();
        }, 1000);
    });
})

.controller('BuyCtrl', function($scope, $state, TripsService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading, $location) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));

    $scope.refreshItems = function () {
        if (taxiData) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            TripsService.getAllBuy(taxiData.id).then(function(response) {
                //console.log(response);
                $scope.trips_today = response.today;
                $scope.trips_others = response.others;

                $ionicLoading.hide();
            });
        }
    }

    $scope.view = function(tripID) {
        $state.go('tab.trips.view', {tripID: tripID});
    }

    // initialize
    $scope.refreshItems();
})
.controller('BuyViewCtrl', function($scope, $state, $stateParams, TripsService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(true);
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.tripID = $stateParams.tripID;
    $scope.trip = {};

    TripsService.getOne($scope.tripID, taxiData.id).then(function(response) {
        $timeout(function() {
            $scope.trip = response;
            $ionicLoading.hide();
        }, 1000);
    })
})

.controller('TripsCtrl', function($scope, $state, TripsService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading, $location, $rootScope) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));

    $scope.loadTimeLeft = function(response) {
        if (taxiData) {
            for (i = 0; i < response.length; i++) {
                //console.log(response[i]);

                var end_time = new Date(response[i].time);
                var now = new Date();
                var diff_sec = end_time - now;
                var time_left = moment(end_time, "YYYYMMDD H:i:s").startOf('hour').fromNow();

                if (parseInt(response[i].coin) <= 0) {
                    //console.log(response[i]);
                    //console.log(document.getElementsByTagName("buy"));
                    //console.log(document.getElementsByTagName("buy")[j]);
                    //console.log(j);
                    document.getElementById("buy_trip_"+response[i].id).innerHTML = "Chưa có giá";
                    document.getElementById("pricebuy_trip_"+response[i].id).innerHTML = "";
                } else {
                    var pricebuy = parseInt(response[i].price)-parseInt(response[i].coin);
                    document.getElementById("pricebuy_trip_"+response[i].id).innerHTML = pricebuy+'<span class="small">k</span>';

                    if (parseInt(response[i].taxiid) == parseInt(taxiData.id)) {
                        document.getElementById("buy_trip_"+response[i].id).classList.add("my");
                        document.getElementById("buy_trip_"+response[i].id).innerHTML = "Đã mua";
                    } else if (parseInt(response[i].status) == 1) {
                        document.getElementById("buy_trip_"+response[i].id).innerHTML = "Đã được mua";
                    } else if (pricebuy > parseInt(taxiData.coin)) { // not enough money
                        document.getElementById("buy_trip_"+response[i].id).innerHTML = "Bạn không đủ tiền";
                    } else if (diff_sec <= 0) {
                        document.getElementById("buy_trip_"+response[i].id).innerHTML = "Hết hạn";
                    } else if (parseInt(response[i].seat) > parseInt(taxiData.seat)) {
                        document.getElementById("buy_trip_"+response[i].id).innerHTML = "Xe bạn không đủ chỗ";
                    } else {
                        document.getElementById("time_trip_"+response[i].id).classList.remove('ng-hide');
                        document.getElementById("time_trip_"+response[i].id).innerHTML = '<span class="time_left">'+time_left+'</span>';
                    }
                }

            }
        }
    }

    $scope.check = function () {
        TripsService.countAll(taxiData.id).then(function(num) {
            var trips_num = window.localStorage.getItem('trips_num');
            ////console.log(num+' ~ '+trips_num);
            if (num != trips_num) $scope.refreshItems();
        })
    }

    $scope.theIntervalCheck = null;

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    	if (taxiData && $location.path() == "/tab/trips") {
            $rootScope.$on('refreshedPressed', function() {
                //console.log('reload');
                $scope.refreshItems();
            });
            $scope.theIntervalCheck = $interval(function(){
                $scope.check();
            }.bind(this), 1000);
            $scope.$on('$destroy', function () {
                $interval.cancel($scope.theIntervalCheck)
            });

            $scope.refreshItems();
        }
    });

    $scope.refreshItems = function () {
        if (taxiData) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            TripsService.getAll(taxiData.id).then(function(response) {
                //console.log(response);
                var trips_num = response.total;
                window.localStorage.setItem('trips_num', trips_num);

                $scope.trips_myPriority = response.myPriority;
                $scope.trips_today = response.today;
                $scope.trips_others = response.others;
                $scope.all_trips = $scope.trips_myPriority.concat($scope.trips_today).concat($scope.trips_others);

                $timeout(function() {
                    $scope.loadTimeLeft($scope.all_trips);
                }, 100);

                $ionicLoading.hide();
            });
        }
    }

    $scope.view = function(tripID) {
        $state.go('tab.trips.view', {tripID: tripID});
    }


    // initialize
    $scope.refreshItems();
})
.controller('TripsViewCtrl', function($scope, $state, $stateParams, TripsService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(true);
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));

    $scope.tripID = $stateParams.tripID;
    $scope.trip = {};

    $scope.msToTime = function (s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
        var days = Math.floor(hrs/24);
        var hrs = hrs%24;

        if (days > 0) return days+'d '+hrs+'h '+mins+'m '+secs+'s ';
        else return hrs+'h '+mins+'m '+secs+'s ';
    }

    $scope.loadTimeLeft = function(response) {
        var end_time = new Date(response.time);
        var now = new Date();
        var diff_sec = end_time - now;

        if (diff_sec <= 0) {
            document.getElementById("timev")[0].innerHTML = '<span class="trip-view-time_left passed">Hết hạn</span>';
            //document.getElementById("buyTrip").classList.add('ng-hide');
        } else {
            var diff = this.msToTime(diff_sec);
            document.getElementById("trip_timev_"+response.id).innerHTML = '<span class="trip-view-time_left">'+diff+'</span>';
            //document.getElementById("buyTrip").classList.remove('ng-hide');
        }
    }

    $scope.showInfo = function (response, isBuyCallback = true) {
        var button = document.getElementById("buyTrip");
        //button.classList.add("disabled");
        button.innerHTML = "Đã mua";
        document.getElementsByTagName("more")[0].classList.remove("ng-hide");
        document.getElementsByTagName("pnr")[0].innerHTML = response.PNR;
        document.getElementsByTagName("price")[0].innerHTML = response.price;

        if (isBuyCallback) {
            TripsService.getFullInfo(response.id, taxiData.id).then(function(response_adr) {
                document.getElementsByTagName("from")[0].innerHTML = response_adr.addressfrom_full;
                document.getElementsByTagName("to")[0].innerHTML = response_adr.addressto_full;
                document.getElementsByTagName("phone")[0].innerHTML = response_adr.phone;
                document.getElementsByTagName("phone")[0].classList.remove("ng-hide");
            });
        } else {
            document.getElementsByTagName("from")[0].innerHTML = response.addressfrom_full;
            document.getElementsByTagName("to")[0].innerHTML = response.addressto_full;
            document.getElementsByTagName("phone")[0].innerHTML = response.phone;
            document.getElementsByTagName("phone")[0].classList.remove("ng-hide");
        }

        document.getElementsByTagName("name")[0].innerHTML = response.name;
        document.getElementsByTagName("detailss")[0].innerHTML = response.details;
        var timeEle = document.getElementsByTagName("timev")[0];
        timeEle.parentNode.removeChild(timeEle);
        button.removeAttribute("ng-click");
    }

    $scope.theInterval = null;
    $scope.thisTrip = null;

    $scope.checkBuy = function (response) {
        $scope.thisTrip = response;
        var button = document.getElementById("buyTrip_"+response.id);

        if (parseInt(response.coin) <= 0) {
            //button.classList.add("disabled");
            button.innerHTML = "Chuyến không có sẵn";
            button.removeAttribute("ng-click");
            document.getElementById("trip_pricebuyv_"+response.id).innerHTML = "";
        } else {
            var pricebuy = parseInt(response.price)-parseInt(response.coin);
            console.log(document.getElementById("trip_pricebuyv_"+response.id));
            document.getElementById("trip_pricebuyv_"+response.id).innerHTML = 'Giá mua ngay: <b class="trip-coin-view">'+pricebuy+'k</b>';

            if (response.taxiid == taxiData.id) {
                $scope.showInfo(response, false);
            } else {
                if (parseInt(response.status) == 1) { // taken
                    //button.classList.add("disabled");
                    button.innerHTML = "Chuyến đã được mua";
                    button.removeAttribute("ng-click");
                } else if (pricebuy > parseInt(taxiData.coin)) { // not enough money
                    //button.classList.add("disabled");
                    button.innerHTML = "Bạn không đủ tiền";
                    button.removeAttribute("ng-click");
                } else {
                    var end_time = new Date(response.time);
                    var now = new Date();
                    var diff_sec = end_time - now;

                    if (diff_sec <= 0) {
                        //button.classList.add("disabled");
                        button.innerHTML = "Hết hạn";
                        button.removeAttribute("ng-click");
                    } else if (parseInt(response.seat) > parseInt(taxiData.seat)) {
                        //button.classList.add("disabled");
                        button.innerHTML = "Xe bạn không đủ chỗ";
                        button.removeAttribute("ng-click");
                    } else {
                        //$scope.loadTimeLeft(response);
                        ////console.log('can buy');
                        //var divBtn = document.getElementById("trip_buy_button");
                        //divBtn.innerHTML = '<button ng-click="buy('+response.id+'}})" id="buyTrip" class="button button-assertive ng-hide">Mua chuyến</button>';
                        //button.setAttribute('ng-click', 'buy('+response.id+')');
                        button.classList.remove('disabled');
                        $scope.theInterval = $interval(function(){
                            $scope.loadTimeLeft(response);
                        }.bind(this), 1000);
                        $scope.$on('$destroy', function () {
                            $interval.cancel($scope.theInterval)
                        });
                    }
                }

            }

        }
        button.classList.remove("ng-hide");
    }

    $scope.buy = function(tripID) {
        var pricebuy = parseInt($scope.thisTrip.price)-parseInt($scope.thisTrip.coin);
        var end_time = new Date($scope.thisTrip.time);
        var now = new Date();
        var diff_sec = end_time - now;
        //console.log($scope.thisTrip);
        //console.log(parseInt($scope.thisTrip.coin) > 0 && parseInt($scope.thisTrip.status) == 0 && pricebuy <= parseInt(taxiData.coin) && parseInt($scope.thisTrip.seat) <= parseInt(taxiData.seat) && diff_sec > 0);

        //if (parseInt($scope.thisTrip.coin) > 0 && parseInt($scope.thisTrip.status) == 0 && pricebuy <= parseInt(taxiData.coin) && parseInt($scope.thisTrip.seat) <= parseInt(taxiData.seat) && diff_sec > 0 ) {
        if (parseInt($scope.thisTrip.coin) > 0 && parseInt($scope.thisTrip.status) == 0 && pricebuy <= parseInt(taxiData.coin) && parseInt($scope.thisTrip.seat) <= parseInt(taxiData.seat) ) {
            TripsService.buy($scope.tripID, taxiData.id).then(function(response) {
                //console.log(response);
                if (response == 1) {
                    newCoin = taxiData.coin = taxiData.coin - $scope.trip.coin;
                    window.localStorage.setItem("session_taxi", taxiData);
                    document.getElementsByTagName("coin")[0].innerHTML = newCoin+"k";
                    $scope.showInfo($scope.trip);
                    $interval.cancel($scope.theInterval);
                } else {
                    if (response == -1) {
                        errorInfo = "Bạn không đủ tiền để mua chuyến này";
                    } else if (response == -2) {
                        errorInfo = "Lỗi không tìm thấy chuyến. Bạn vui lòng thử tải lại trang...";
                    } else if (response == -3) {
                        errorInfo = "Chuyến này đã được mua hoặc không tồn tại";
                    }
                    var alertPopup = $ionicPopup.show({
                      template: errorInfo,
                      title: 'Lỗi',
                      scope: $scope,
                      buttons: [
                        {
                            text: 'Đóng',
                            type: 'button-assertive'
                        }
                      ]
                    });
                    alertPopup.then(function(res) {
                      //console.log('Closed!', res);
                    });
                }
            })
        } else {
            if (parseInt($scope.thisTrip.coin) <= 0) {
                errorInfo = "Chuyến không có sẵn";
            } else if (status == 1) {
                errorInfo = "Chuyến này đã được mua hoặc không tồn tại";
            } else if (pricebuy > parseInt(taxiData.coin)) {
                errorInfo = "Bạn không đủ tiền để mua chuyến này";
            } else if (parseInt($scope.thisTrip.seat) > parseInt(taxiData.seat)) {
                errorInfo = "Xe bạn không đủ chỗ";
            } else if (diff_sec <= 0) {
                errorInfo = "Chuyến đã hết hạn";
            }
            var alertPopup = $ionicPopup.show({
              template: errorInfo,
              title: 'Lỗi',
              scope: $scope,
              buttons: [
                {
                    text: 'Đóng',
                    type: 'button-assertive'
                }
              ]
            });
            alertPopup.then(function(res) {
              //console.log('Closed!', res);
            });
        }
    }


    $scope.loadItem = function () {
        if (taxiData) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            TripsService.getOne($scope.tripID, taxiData.id).then(function(response) {
                $scope.trip = response;

                $timeout(function() {
                    $scope.checkBuy($scope.trip);
                }, 100);

                $ionicLoading.hide();
            });
        }
    }

    $scope.loadItem();
})


.controller('LogoutCtrl', function($scope, $ionicPopup, $state) {
    window.localStorage.removeItem("session_taxi");
    taxiData = null;
    navIcons = document.getElementsByClassName("ion-navicon");
    for (i = 0; i < navIcons.length; i++) navIcons[i].classList.add("ng-hide");
    $state.go('tab.login');
})

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $ionicSideMenuDelegate, $ionicNavBarDelegate, $ionicHistory, $rootScope) {
    $ionicNavBarDelegate.showBackButton(false);

    $scope.data = {};

    $scope.login = function() {
/*        var alertPopup = $ionicPopup.alert({
            title: 'Clicked!',
            template: 'hiu~',
            scope: $scope,
            buttons: [{
                  text: 'Đóng',
                  type: 'button-assertive'
            }]
        });
        $http.post(MAIN_URL+"/login.php", {
                username: name,
                password: pw
            }).success(function(response) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Success',
                    template: 'Success'
                });
            }).error(function(response) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Lỗi',
                    template: 'Lỗi~'
                });
            });
*/
        LoginService.loginUser($scope.data.username, $scope.data.password).then(function(data) {
            //console.log(data);
            if (data == -1) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Lỗi!',
                    template: 'Tên đăng nhập hoặc mật khẩu không đúng!',
                    scope: $scope,
                    buttons: [{
                          text: 'Đóng',
                          type: 'button-assertive'
                    }]
                });
            } else if (data == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Lỗi!',
                    template: 'Tên đăng nhập hoặc mật khẩu không đúng!',
                    scope: $scope,
                    buttons: [{
                          text: 'Đóng',
                          type: 'button-assertive'
                    }]
                });
            } else {
                taxiData = data;

                document.getElementsByTagName("info")[0].innerHTML = taxiData.name;
                document.getElementsByTagName("coin")[0].innerHTML = taxiData.coin+"k";

                navIcons = document.getElementsByClassName("ion-navicon");
                for (i = 0; i < navIcons.length; i++) navIcons[i].classList.remove("ng-hide");

                $state.go('tab.trips');
            }
        })
    }
})

.controller('PasswordCtrl', function($scope, $state, $stateParams, $ionicPopup, $timeout, $ionicNavBarDelegate, $ionicLoading, PasswordService) {
    $scope.data = {};
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));
    $scope.changePassword = function() {
        //console.log($scope.data.password);
        //console.log($scope.data.confirmpassword);
        if ($scope.data.password == $scope.data.confirmpassword) {
            PasswordService.change($scope.data.password, taxiData.id).then(function(data) {
                ////console.log(data);
                if (data == 0) { // system error
                    var alertPopup = $ionicPopup.alert({
                        title: 'Lỗi!',
                        template: 'Lỗi hệ thống!',
                        scope: $scope,
                        buttons: [{
                              text: 'Đóng',
                              type: 'button-assertive'
                        }]
                    });
                } else if (data == -1) { // missing fields
                    var alertPopup = $ionicPopup.alert({
                        title: 'Lỗi!',
                        template: 'Xác nhận mật khẩu không trùng khớp!',
                        scope: $scope,
                        buttons: [{
                              text: 'Đóng',
                              type: 'button-assertive'
                        }]
                    });
                } else {
                    newPassword = data.newPassword;
                    var successAlertPopup = $ionicPopup.alert({
                        title: 'Thành công!',
                        template: 'Mật khẩu đổi thành công!',
                        scope: $scope,
                        buttons: [{
                              text: 'Đóng',
                              type: 'button-assertive'
                        }]
                    });
                    successAlertPopup.then(function(res) {
                        //console.log('Closed!', res);
                        $state.go('tab.trips');
                    });
                }
            })
        } else { // password confirmed mismatched
            var alertPopup = $ionicPopup.alert({
                title: 'Lỗi!',
                template: 'Xác nhận mật khẩu không trùng khớp!',
                scope: $scope,
                buttons: [{
                      text: 'Đóng',
                      type: 'button-assertive'
                }]
            });
        }
    }
})

.controller('AccountCtrl', function($scope, $state, $stateParams, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));

    if (taxiData) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $timeout(function() {
            //console.log(taxiData);
            $scope.account = taxiData;
            $ionicLoading.hide();
        }, 1000);
    }
});
