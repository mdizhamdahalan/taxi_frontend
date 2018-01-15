angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicSideMenuDelegate, $state, $ionicHistory, InfriengeService, $rootScope, $timeout, $ionicLoading, $location, $interval, AccountService) {
    // Code you want executed every time view is opened
//    $scope.taxiData = taxiData = {};
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));
    $scope.$on('$ionicView.loaded', function () {
//    $timeout(function () {
        ////console.log(taxiData);
        //navIcons = document.getElementsByTagName("button");
        ////console.log(navIcons);
        ////console.log(navIcons[0]);
        ////console.log('dddddd')

        var navIcons = document.getElementsByClassName("ion-navicon");

        $scope.theIntervalCheckAccount = null;
        if (!taxiData) {
            $ionicLoading.hide();
            for (var i = 0; i < navIcons.length; i++) {
                navIcons[i].classList.add("ng-hide");
            }
            $state.go('tab.login');
            return false;
        } else {
            for (var i = 0; i < navIcons.length; i++) {
                navIcons[i].classList.remove("ng-hide");
            }
            $scope.reload = function() {
                // Your refresh code
                $rootScope.$emit('refreshedPressed');
            }

            $scope.theIntervalCheckAccount = $interval(function(){
                AccountService.getTaxiData(taxiData.id);
            }.bind(this), 1000);

            InfriengeService.getAll(taxiData.id).then(function(response) {
                $timeout(function() {
                    //$scope.infrienges_notSeen = response.notSeen;
        	    $scope.infrienges_total = response.total;

                    $ionicLoading.hide();
                }, 1000);
        	});

        }
    });

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


.controller('SellCtrl', function($scope, $state, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading, $cordovaGeolocation, TripsService, ionicTimePicker, ionicDatePicker) {

    $ionicNavBarDelegate.showBackButton(false);
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));


    var options = {
        timeout: 10000,
        enableHighAccuracy: true
    };
    markerArray = [];

    /*    $scope.disableTap = function() {*
            var container = document.getElementsByClassName('pac-container');
            angular.element(container).attr('data-tap-disabled', 'true');
            var backdrop = document.getElementsByClassName('backdrop');
            angular.element(backdrop).attr('data-tap-disabled', 'true');
            angular.element(container).on("click", function() {
            document.getElementById('pac-input').blur();
            });
        }; */
    $scope.disableTap = function() {
        container = document.getElementsByClassName('pac-container');
        for (i = 0; i < container.length; i++) {
            container[i].setAttribute('data-tap-disabled', 'true');
        }
        //console.log('disableTap');
    }

    var timePickerObj = {
        callback: function(val) { //Mandatory
            if (typeof(val) === 'undefined') {
                //console.log('Time not selected');
            } else {
                var selectedTime = new Date(val * 1000);
                var min = selectedTime.getUTCMinutes();
                if (min < 10) min = '0' + min;
                document.getElementById('time_time').value = selectedTime.getUTCHours() + ':' + min;
            }
        },
        inputTime: 50400, //Optional
        format: 12, //Optional
        step: 5, //Optional
        closeLabel: 'Đóng',
        setLabel: 'Đặt' //Optional
    };
    $scope.openTimePicker = function() {
        ionicTimePicker.openTimePicker(timePickerObj);
    }
    var datePickerObj = {
        callback: function(val) { //Mandatory
            var date = new Date(val);
            //console.log(date);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if (month < 10) month = '0' + month;
            if (day < 10) day = '0' + day;
            document.getElementById('time_date').value = date.getFullYear() + '-' + month + '-' + day;
        },
        from: new Date(), //Optional
        to: new Date(2018, 12, 31), //Optional
        inputDate: new Date(), //Optional
        dateFormat: 'yyyy-mm-dd',
        closeLabel: 'Đóng',
        setLabel: 'Đặt', //Optional
        templateType: 'popup' //Optional
    };
    $scope.openDatePicker = function() {
        ionicDatePicker.openDatePicker(datePickerObj);
    };

    $scope.select_seat = function(seat) {
        var sones = document.getElementsByClassName('sone');
        document.getElementById('seat').value = seat;
        $scope.calculatePrice();
        for (i = 0; i < sones.length; i++) {
            sones[i].classList.remove('active');
            if (sones[i].id == 'seat' + seat) {
                sones[i].classList.add('active');
            }
        }
        return false;
    }

    $scope.request = function() {
        from = document.getElementById('start').value;
        to = document.getElementById('end').value;
        name = document.getElementById('name').value;
        phone = document.getElementById('phone').value;
        seat = document.getElementById('seat').value;
        guess_num = document.getElementById('guess_num').value;
        time_date = document.getElementById('time_date').value;
        time_time = document.getElementById('time_time').value;
        time = time_date + ' ' + time_time + ':00';
        is_round = document.getElementById('is_round').value;
        details = document.getElementById('details').value;
        PNR = document.getElementById('PNR').value;
        priceThisTrip = document.getElementById('price').value;

        ////console.log(name+' '+phone+' '+from+' '+to+' '+seat+' '+guess_num+' '+PNR);
        if (name && phone && from && to && seat > 0 && guess_num > 0 && time && time_time && time_date) {
            var frAr = from.split(',');
            var toAr = to.split(',');
            //console.log(from + ' ~~~~~');
            //console.log(frAr);
            var fromDistrict = frAr[frAr.length - 2].trim(); // quận đi
            var toDistrict = toAr[toAr.length - 2].trim(); // quận đến

            formData = {
                'taxiid': taxiData.id,
                'name': name,
                'phone': phone,
                'from': from,
                'to': to,
                'seat': seat,
                'guess_num': guess_num,
                'PNR': PNR,
                'time': time,
                'price': priceThisTrip,
                'is_round': is_round,
                'details': details
            };

            var tripInfo = 'Đi từ: <b>' + from + '</b>.<br/>Đến: <b>' + to + '</b>.<br/>Loại xe: <b>' + seat + ' chỗ</b>.<br/>Quãng đường: <b>' + distance + '</b>.<br/>Giá tiền (tham khảo): <b>' + priceThisTrip + 'k</b>';

            var alertPopup = $ionicPopup.alert({
                title: 'Thông tin giá tiền',
                template: tripInfo,
                scope: $scope,
                buttons: [{
                        text: 'Quay lại',
                        type: 'button-stable'
                    },
                    {
                        text: '<b>Bán chuyến</b>',
                        type: 'button-assertive',
                        onTap: function(e) {
                            return 1;
                        }
                    }
                ]
            });
            alertPopup.then(function(res) {
                //console.log('Tapped!', res);
                if (res == 1) {
                    /*detailsForm = document.getElementById('trip-user-details');
                    detailsForm.classList.add('active');
                    document.getElementById('tripInfo').innerHTML = tripInfo;*/
                    ////console.log(formData);
                    TripsService.add(formData).then(function(data) {
                        //console.log(data);
                        if (data == 1) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Thành công!',
                                template: 'Đề nghị đã được gửi. Chuyến sẽ hiện trong danh sách để mua sau khi được admin duyệt.',
                                scope: $scope,
                                buttons: [{
                                    text: 'Đóng',
                                    type: 'button-assertive',
                                    onTap: function(e) {
                                        return 1;
                                    }
                                }]
                            });
                            alertPopup.then(function(res) {
                                //console.log('Success!', res);
                                if (res == 1) {
                                    /*detailsForm = document.getElementById('trip-user-details');
                                    detailsForm.classList.remove('active');
                                    document.getElementById('tripInfo').innerHTML = '';
                                    $state.go($state.current, {}, {reload: true});*/
                                    //location.reload();
                                    $state.go('tab.trips');
                                }
                            });
                        }
                    })
                }
            });

        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Lỗi!',
                template: 'Bạn phải nhập đầy đủ thông tin để đặt xe!',
                scope: $scope,
                buttons: [{
                    text: 'Đóng',
                    type: 'button-assertive'
                }]
            });
        }
    }

    $scope.calculatePrice = function () {
        from = document.getElementById('start').value;
        to = document.getElementById('end').value;
        seat = document.getElementById('seat').value;
        distance = document.getElementById('box-search-one-distance').innerHTML;
        if (from && to && distance && seat > 0) {
            var frAr = from.split(',');
            var toAr = to.split(',');
            var fromDistrict = frAr[frAr.length - 2].trim(); // quận đi
            var toDistrict = toAr[toAr.length - 2].trim(); // quận đến

            var mult = 10;
            if (seat == 7) mult = 12;
            if (seat == 16) mult = 999;
            var priceThisTrip = parseFloat(distance) * mult;

            if ((fromDistrict == 'Cầu Giấy' || fromDistrict == 'Đống Đa' || fromDistrict == 'Ba Đình' || fromDistrict == 'Hai Bà Trưng' || fromDistrict == 'Nam Từ Liêm' || fromDistrict == 'Bắc Từ Liêm') && toDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5) {
                    priceThisTrip = 190;
                } else if (seat == 7) {
                    priceThisTrip = 300;
                }
            }

            if ((toDistrict == 'Cầu Giấy' || toDistrict == 'Đống Đa' || toDistrict == 'Ba Đình' || toDistrict == 'Hai Bà Trưng' || toDistrict == 'Nam Từ Liêm' || toDistrict == 'Bắc Từ Liêm') && fromDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5) {
                    priceThisTrip = 250;
                } else if (seat == 7) {
                    priceThisTrip = 350;
                }
            }

            if (fromDistrict == 'Gia Lâm' && toDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5)
                    priceThisTrip = 250;
                else if (seat == 7)
                    priceThisTrip = 350;
            }

            if (toDistrict == 'Gia Lâm' && fromDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5)
                    priceThisTrip = 300;
                else
                    priceThisTrip = 370;
            }

            if (fromDistrict == 'Thanh Xuân' && toDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5)
                    priceThisTrip = 230;
                else if (seat == 7)
                    priceThisTrip = 320;
            }

            if (toDistrict == 'Thanh Xuân' && fromDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5)
                    priceThisTrip = 250;
                else if (seat == 7)
                    priceThisTrip = 330;
            }

            if (fromDistrict == 'Long Biên' && toDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5)
                    priceThisTrip = 230;
                else if (seat == 7)
                    priceThisTrip = 320;
            }

            if (toDistrict == 'Long Biên' && fromDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5)
                    priceThisTrip = 260;
                else if (seat == 7)
                    priceThisTrip = 350;
            }

            if (fromDistrict == 'Hà Đông' && toDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5)
                    priceThisTrip = 250;
                else if (seat == 7)
                    priceThisTrip = 350;
            }

            if (toDistrict == 'Hà Đông' && fromDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5)
                    priceThisTrip = 270;
                else if (seat == 7)
                    priceThisTrip = 370;
            }

            if (fromDistrict == 'Thanh Trì' && toDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5)
                    priceThisTrip = 250;
                else if (seat == 7)
                    priceThisTrip = 350;
            }

            if (toDistrict == 'Thanh Trì' && fromDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5)
                    priceThisTrip = 300;
                else if (seat == 7)
                    priceThisTrip = 370;
            }

            if (fromDistrict == 'Hoàng Mai' && toDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5)
                    priceThisTrip = 250;
                else if (seat == 7)
                    priceThisTrip = 350;
            }

            if (toDistrict == 'Hoàng Mai' && fromDistrict == 'Sóc Sơn') {
                if (seat == 4 || seat == 5)
                    priceThisTrip = 280;
                else if (seat == 7)
                    priceThisTrip = 370;
            }
            document.getElementById('price').value = priceThisTrip;
            document.getElementById('box-search-one-price').innerHTML = priceThisTrip;
        }
    }

    $scope.showSteps = function(directionResult, markerArray, stepDisplay, map) {
        // For each step, place a marker, and add the text to the marker's infowindow.
        // Also attach the marker to an array so we can keep track of it and remove it
        // when calculating new routes.
        var myRoute = directionResult.routes[0].legs[0];
        for (var i = 0; i < myRoute.steps.length; i++) {
            var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
            marker.setMap(map);
            marker.setPosition(myRoute.steps[i].start_location);
            $scope.attachInstructionText(stepDisplay, marker, myRoute.steps[i].instructions, map);
        }
    }

    $scope.attachInstructionText = function(stepDisplay, marker, text, map) {
        google.maps.event.addListener(marker, 'click', function() {
            // Open an info window when the marker is clicked on, containing the text
            // of the step.
            stepDisplay.setContent(text);
            stepDisplay.open(map, marker);
        });
    }

    $scope.calculateAndDisplayRoute = function(directionsDisplay, directionsService, stepDisplay, map) {
        //console.log(document.getElementById('start').value);
        //console.log(document.getElementById('end').value);

        // First, remove any existing markers from the map.
        for (var i = 0; i < markerArray.length; i++) {
            markerArray[i].setMap(null);
        }
        markerArray = [];

        // Retrieve the start and end locations and create a DirectionsRequest using
        // {travelMode} directions.
        directionsService.route({
            origin: document.getElementById('start').value,
            destination: document.getElementById('end').value,
            travelMode: document.getElementById('travelMode').value // DRIVING | BICYCLING | TRANSIT | WALKING
        }, function(response, status) {
            // Route the directions and pass the response to a function to create
            // markers for each step.
            if (status === 'OK') {
                document.getElementById('warnings-panel').innerHTML = '<b>' + response.routes[0].warnings + '</b>';
                directionsDisplay.setDirections(response);

                $scope.showSteps(response, stepDisplay, map);

                var distance = response.routes[0].legs[0].distance.text;
                var time = response.routes[0].legs[0].duration.text;
                document.getElementById('box-search-one-distance').innerHTML = distance;
                document.getElementById('box-search-one-time').innerHTML = time;
                document.getElementById('box-search-one-route').visibility = true;
                $scope.calculatePrice();
            } else {
                //console.log('Directions request failed due to ' + status);
            }
        });
    }

    $scope.getDirection = function(map, pos) {
        map.setZoom(13);

        // Instantiate a directions service.
        var directionsService = new google.maps.DirectionsService;
        var geocoder = new google.maps.Geocoder();

        map.setCenter(pos);

        geocoder.geocode({
            'location': pos
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    //	document.getElementById('start').value = results[0].formatted_address;

                    // Create a renderer for directions and bind it to the map.
                    var directionsDisplay = new google.maps.DirectionsRenderer({
                        map: map
                    });
                    // Instantiate an info window to hold step text.
                    var stepDisplay = new google.maps.InfoWindow;

                    $scope.calculateAndDisplayRoute(directionsDisplay, directionsService, stepDisplay, map);
                } else {
                    //console.log('No results found');
                }
            } else {
                //console.log('Geocoder failed due to: ' + status);
            }
        });

    }

    $scope.map_select = function(map, autocomplete, infowindow, type) {
        for (var i = 0; i < markerArray.length; i++) {
            markerArray[i].setMap(null);
        }
        markerArray = [];

        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        var infowindowContent = document.getElementById('infowindow-content-' + type);
        infowindow.setContent(infowindowContent);

        infowindow.close();
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(10);
        }
        //console.log(place);
        if (type == 0) document.getElementById('start').value = place.formatted_address;
        else if (type == 1) document.getElementById('end').value = place.formatted_address;

        index = type;
        var marker_now = new google.maps.Marker({
            label: labels[index++ % labels.length],
            map: map
        });
        marker_now.setPlace({
            placeId: place.place_id,
            location: place.geometry.location
        });

        marker_now.setVisible(true);
        google.maps.event.addListener(marker_now, 'click', function() {
            infowindow.setContent('<div><strong>' + place.name + '</strong><br/>' + place.formatted_address + '<br>' +
                place.place_id + '</div>');
            infowindow.open(map, this);
        });

        if (document.getElementById('start').value != null && document.getElementById('end').value != null)
            $scope.getDirection(map, place.geometry.location);
    }

    $scope.searchBar = function(map) {
        var sidebar = document.getElementById('pac-sidebar');
        var from = document.getElementById('pac-from');
        var to = document.getElementById('pac-to');

        var options = {
            componentRestrictions: {
                country: 'vn'
            }
        };
        //        $scope.map.controls[google.maps.ControlPosition.LEFT].push(sidebar);

        var autocomplete_from = new google.maps.places.Autocomplete(from, options);
        var autocomplete_to = new google.maps.places.Autocomplete(to, options);

        /*autocomplete_from.bindTo('bounds', $scope.map);
        autocomplete_to.bindTo('bounds', $scope.map);
        */
        google.maps.event.addDomListener(from, 'keydown', function(event) {
            //console.log('keydown!')
            /*var pacContainers = document.getElementsByClassName('pac-container');
            if (event.keyCode == 13 && element.offsetWidth > 0 && element.offsetHeight > 0) {
                event.preventDefault();
            }*/
            if (event.keyCode === 13) {
                event.preventDefault();
            }
        });
        google.maps.event.addDomListener(to, 'keydown', function(event) {
            //console.log('keydown!')
            if (event.keyCode === 13) {
                event.preventDefault();
            }
        });
        google.maps.event.trigger(to, 'keydown', function(e) {
            //console.log(e.keyCode);
            if (e.keyCode === 13 && !e.triggered) {
                google.maps.event.trigger(this, 'keydown', {
                    keyCode: 40
                })
                google.maps.event.trigger(this, 'keydown', {
                    keyCode: 13,
                    triggered: true
                })
            }
        });

        var infowindow = new google.maps.InfoWindow();

        //        autocomplete_to.addListener('place_changed', function() {
        google.maps.event.addListener(autocomplete_to, 'place_changed', function() {
            $scope.map_select(map, autocomplete_to, infowindow, 1);
        });
        google.maps.event.addListener(autocomplete_from, 'place_changed', function() {
            $scope.map_select(map, autocomplete_from, infowindow, 0);
        });
    }


    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var latLng = new google.maps.LatLng(21.033, 105.85);
    var mapOptions = {
        zoom: 11,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
        var marker = markerArray[0] = new google.maps.Marker({
            map: $scope.map,
            position: latLng,
            animation: google.maps.Animation.DROP
        });

        /*var infoWindow = new google.maps.InfoWindow({
            content: "Here I am!"
        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
        });*/

        $scope.searchBar($scope.map);

        $scope.theInterval = null;

        $scope.theInterval = $interval(function() {
            var pacContainers = document.getElementsByClassName('pac-container');
            if (pacContainers.length >= 2) {
                $interval.cancel($scope.theInterval);
                $scope.disableTap();
                $ionicLoading.hide();
            }
        }.bind(this), 1000);
        $scope.$on('$destroy', function() {
            $interval.cancel($scope.theInterval)
        });

    });
})
.controller('SellListCtrl', function($scope, $state, TripsService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));

    $scope.$on('$ionicView.loaded', function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        TripsService.getAllSell(taxiData.id).then(function(response) {
            ////console.log(response);
            $scope.trips_today = response.today;
            $scope.trips_others = response.others;
            $scope.all_trips = all_trips = $scope.trips_today.concat($scope.trips_others);

            $timeout(function() {
                for (i = 0; i < all_trips.length; i++) {
                    if (all_trips[i].approve == 0) {
                        document.getElementById("buy_trip_"+all_trips[i].id).innerHTML = "Chưa được duyệt";
                    } else if (all_trips[i].status == 1) { // someone bought this
                        document.getElementById("buy_trip_"+all_trips[i].id).innerHTML = "Đã được mua";
                    } else {
                        document.getElementById("buy_trip_"+all_trips[i].id).innerHTML = "Chưa có người mua";
                    }
                }
            }, 200);

            $ionicLoading.hide();
        });
    });

    $scope.view = function(tripID) {
        $state.go('tab.trips.view', {tripID: tripID});
    }
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
    //$scope.refreshItems();

    $scope.refreshItems = function () {
        if (taxiData) {
   	        $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            InfriengeService.getAll(taxiData.id).then(function(response) {
                $timeout(function() {
                    $scope.infrienges_notSeen = response.notSeen; //Assign data received to $scope.data
	                $scope.infrienges_others = response.others;

                    $ionicLoading.hide();
                }, 1000);
            });
	    }
    }
	 $scope.refreshItems();
    $scope.view = function(iID) {
        $state.go('tab.infrienge.view', {iID: iID});
    }
    //$scope.refreshItems();
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
    $scope.infrienge  = {};
    $scope.iID = $stateParams.iID;

    // Change status
    InfriengeService.changeStatus($scope.iID);//.then(function(response) {
     //       $timeout(function() {
     //           $scope.infrienge = response; //Assign data received to $scope.data

    //            $ionicLoading.hide();
    //        }, 1000);
    //    });

    // Get One
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
                ////console.log(response);
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
/*.controller('BuyViewCtrl', function($scope, $state, $stateParams, TripsService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading) {
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
*/

.controller('TripsCtrl', function($scope, $state, TripsService, $ionicPopup, $interval, $timeout, $ionicNavBarDelegate, $ionicLoading, $location, $rootScope) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.taxiData = taxiData = JSON.parse(window.localStorage.getItem("session_taxi"));

    $scope.loadTimeLeft = function(response) {
        if (taxiData) {
            for (i = 0; i < response.length; i++) {
                ////console.log(response[i]);

                var end_time = new Date(response[i].time);
                var now = new Date();
                var diff_sec = end_time - now;
                var time_left = moment(end_time, "YYYYMMDD H:i:s").startOf('hour').fromNow();

                if (parseInt(response[i].coin) <= 0) {
                    ////console.log(response[i]);
                    ////console.log(document.getElementsByTagName("buy"));
                    ////console.log(document.getElementsByTagName("buy")[j]);
                    ////console.log(j);
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
                    } else if (parseInt(response[i].coin) > parseInt(taxiData.coin)) { // not enough money
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
            //////console.log(num+' ~ '+trips_num);
            if (num != trips_num) $scope.refreshItems();
        })
    }

    $scope.theIntervalCheck = null;

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    	if (taxiData && $location.path() == "/tab/trips") {
            $rootScope.$on('refreshedPressed', function() {
                ////console.log('reload');
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
                ////console.log(response);
                var trips_num = response.total;
                window.localStorage.setItem('trips_num', trips_num);

                $scope.trips_myPriority = response.myPriority;
                $scope.trips_today = response.today;
                $scope.trips_others = response.others;
                $scope.all_trips = $scope.trips_myPriority.concat($scope.trips_today).concat($scope.trips_others);

                $timeout(function() {
                    $scope.loadTimeLeft($scope.all_trips);
                }, 200);

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
            document.getElementById("trip_timev_"+response.id).innerHTML = '<span class="trip-view-time_left passed">Hết hạn</span>';
            //document.getElementById("buyTrip").classList.add('ng-hide');
        } else {
            var diff = this.msToTime(diff_sec);
            document.getElementById("trip_timev_"+response.id).innerHTML = '<span class="trip-view-time_left">'+diff+'</span>';
            //document.getElementById("buyTrip").classList.remove('ng-hide');
        }
    }

    $scope.sellTrip = function (tripID) {
        //console.log('sell this trip');
        TripsService.add({taxiid: taxiData.id, tripID: $scope.tripID}).then(function(data) {
            //console.log(data);
            if (data == 1) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Thành công!',
                    template: 'Đề nghị của bạn đã được gửi thành công! Admin sẽ duyệt trước khi hiển thị lên danh sách chuyến.',
                    scope: $scope,
                    buttons: [{
                        text: 'Đóng',
                        type: 'button-assertive',
                        onTap: function(e) {
                            return 1;
                        }
                    }]
                });
                alertPopup.then(function(res) {
                    if (res == 1) {
                        /*detailsForm = document.getElementById('trip-user-details');
                        detailsForm.classList.remove('active');
                        document.getElementById('tripInfo').innerHTML = '';
                        $state.go($state.current, {}, {reload: true});*/
                        //location.reload();
                        var sellButton = document.getElementById("sellTrip_"+$scope.tripID);
                        sellButton.classList.add("disabled");
                        sellButton.innerHTML = "Đã bán lại";
                    }
                });
            }
        })
    }

    $scope.showInfo = function (response, isBuyCallback = true) {
        var button = document.getElementById("buyTrip_"+response.id);
        button.classList.add("disabled");
        button.innerHTML = "Đã mua";
        document.getElementById("trip_more_"+response.id).classList.remove("ng-hide");
        document.getElementById("trip_pnr_"+response.id).innerHTML = response.PNR;
        document.getElementById("trip_price_"+response.id).innerHTML = response.price;

        var sellButton = document.getElementById("sellTrip_"+response.id);
        if ($scope.isSold(response)) {
            sellButton.classList.remove("ng-hide");
            sellButton.classList.add("disabled");
            sellButton.removeAttribute("ng-click");
            sellButton.innerHTML = "Đã bán lại";
        } else {
            sellButton.classList.remove("ng-hide");
            sellButton.classList.remove("disabled");
        }

        if (isBuyCallback || !response.phone) {
            TripsService.getFullInfo(response.id, taxiData.id).then(function(response_adr) {
                document.getElementById("trip_from_"+response.id).innerHTML = response_adr.addressfrom_full;
                document.getElementById("trip_to_"+response.id).innerHTML = response_adr.addressto_full;
                document.getElementById("trip_phone_"+response.id).innerHTML = response_adr.phone;
                document.getElementById("trip_phone_"+response.id).classList.remove("ng-hide");
            });
        } else {
            document.getElementById("trip_from_"+response.id).innerHTML = response.addressfrom_full;
            document.getElementById("trip_to_"+response.id).innerHTML = response.addressto_full;
            document.getElementById("trip_phone_"+response.id).innerHTML = '<a href="tel:' + response.phone + '">' + response.phone + '</a>';
            document.getElementById("trip_phone_"+response.id).classList.remove("ng-hide");
        }

        document.getElementById("trip_name_"+response.id).innerHTML = response.name;
        document.getElementById("trip_details_"+response.id).innerHTML = response.details;
        var timeEle = document.getElementById("trip_timev_"+response.id);
        timeEle.parentNode.removeChild(timeEle);
        button.removeAttribute("ng-click");
    }

    $scope.theInterval = null;
    $scope.thisTrip = null;

    $scope.checkBuy = function (response) {
        $scope.thisTrip = response;
        var button = document.getElementById("buyTrip_"+response.id);
        var sellButton = document.getElementById("sellTrip_"+response.id);

        if (response.taxi_sell == taxiData.id) {
            $scope.showInfo(response, true);
        } else if (parseInt(response.coin) <= 0) {
            //button.classList.add("disabled");
            button.innerHTML = "Chuyến không có sẵn";
            button.removeAttribute("ng-click");
            sellButton.classList.add("ng-hide");
            document.getElementById("trip_pricebuyv_"+response.id).innerHTML = "";
        } else {
            var pricebuy = parseInt(response.price)-parseInt(response.coin);
            ////console.log(document.getElementById("trip_pricebuyv_"+response.id));
            document.getElementById("trip_pricebuyv_"+response.id).innerHTML = 'Giá mua ngay: <b class="trip-coin-view">'+pricebuy+'k</b>';

            if (parseInt(response.taxiid) == parseInt(taxiData.id)) {
                //console.log(response);
                $scope.showInfo(response, false);
            } else {
                if (parseInt(response.status) == 1) { // taken
                    //button.classList.add("disabled");
                    button.innerHTML = "Chuyến đã được mua";
                    button.removeAttribute("ng-click");
                    sellButton.classList.add("ng-hide");
                } else if (parseInt(response.coin) > parseInt(taxiData.coin)) { // not enough money
                    //button.classList.add("disabled");
                    button.innerHTML = "Bạn không đủ tiền";
                    button.removeAttribute("ng-click");
                    sellButton.classList.add("ng-hide");
                } else {
                    var end_time = new Date(response.time);
                    var now = new Date();
                    var diff_sec = end_time - now;

                    if (diff_sec <= 0) {
                        //button.classList.add("disabled");
                        button.innerHTML = "Hết hạn";
                        button.removeAttribute("ng-click");
                        sellButton.classList.add("ng-hide");
                    } else if (parseInt(response.seat) > parseInt(taxiData.seat)) {
                        //button.classList.add("disabled");
                        button.innerHTML = "Xe bạn không đủ chỗ";
                        button.removeAttribute("ng-click");
                        sellButton.classList.add("ng-hide");
                    } else {
                        //$scope.loadTimeLeft(response);
                        //////console.log('can buy');
                        //var divBtn = document.getElementById("trip_buy_button");
                        //divBtn.innerHTML = '<button ng-click="buy('+response.id+'}})" id="buyTrip" class="button button-assertive ng-hide">Mua chuyến</button>';
                        //button.setAttribute('ng-click', 'buy('+response.id+')');
                        button.classList.remove('disabled');
                        sellButton.classList.add("ng-hide");
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

    $scope.isSold = function (response) {
        return ($scope.trip.taxi_sell != null ? true : false);
    }

    $scope.buy = function(tripID) {
        var pricebuy = parseInt($scope.thisTrip.price)-parseInt($scope.thisTrip.coin);
        var end_time = new Date($scope.thisTrip.time);
        var now = new Date();
        var diff_sec = end_time - now;
        ////console.log($scope.thisTrip);
        ////console.log(parseInt($scope.thisTrip.coin) > 0 && parseInt($scope.thisTrip.status) == 0 && pricebuy <= parseInt(taxiData.coin) && parseInt($scope.thisTrip.seat) <= parseInt(taxiData.seat) && diff_sec > 0);

        //if (parseInt($scope.thisTrip.coin) > 0 && parseInt($scope.thisTrip.status) == 0 && pricebuy <= parseInt(taxiData.coin) && parseInt($scope.thisTrip.seat) <= parseInt(taxiData.seat) && diff_sec > 0 ) {
        if (parseInt($scope.thisTrip.coin) > 0 && parseInt($scope.thisTrip.status) == 0 && parseInt($scope.thisTrip.coin) <= parseInt(taxiData.coin) && parseInt($scope.thisTrip.seat) <= parseInt(taxiData.seat) ) {
            TripsService.buy($scope.tripID, taxiData.id).then(function(response) {
                ////console.log(response);
                if (response == 1) {
                    newCoin = taxiData.coin = taxiData.coin - $scope.trip.coin;
                    window.localStorage.setItem("session_taxi", taxiData);
                    document.getElementsByTagName("coin")[0].innerHTML = newCoin+"k";
                    $scope.showInfo($scope.thisTrip);
                    $interval.cancel($scope.theInterval);
                    var alertPopup = $ionicPopup.show({
                      template: 'Mua chuyến thành công',
                      title: 'Thành công',
                      scope: $scope,
                      buttons: [
                        {
                            text: 'Đóng',
                            type: 'button-assertive'
                        }
                      ]
                    });
                    alertPopup.then(function(res) {
                      ////console.log('Closed!', res);
                    });
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
                      ////console.log('Closed!', res);
                    });
                }
            })
        } else {
            if (parseInt($scope.thisTrip.coin) <= 0) {
                errorInfo = "Chuyến không có sẵn";
            } else if (status == 1) {
                errorInfo = "Chuyến này đã được mua hoặc không tồn tại";
            } else if (parseInt(response[i].coin) > parseInt(taxiData.coin)) {
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
              ////console.log('Closed!', res);
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
    if (taxiData) {
        $state.go('tab.trips');
        return ;
    }

    $ionicSideMenuDelegate.canDragContent(false);
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
            ////console.log(data);
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
                $ionicSideMenuDelegate.canDragContent(true);
                var navIcons = document.getElementsByClassName("ion-navicon");
                for (var i = 0; i < navIcons.length; i++) {
                    navIcons[i].classList.remove("ng-hide");
                }
                //$ionicNavBarDelegate.showBackButton(true);
                taxiData = data;
//		//console.log(taxiData);
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
        ////console.log($scope.data.password);
        ////console.log($scope.data.confirmpassword);
        if ($scope.data.password == $scope.data.confirmpassword) {
            PasswordService.change($scope.data.password, taxiData.id).then(function(data) {
                //////console.log(data);
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
                        ////console.log('Closed!', res);
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
//            //console.log(taxiData);
            $scope.account = taxiData;
            $ionicLoading.hide();
        }, 1000);
    }
});
