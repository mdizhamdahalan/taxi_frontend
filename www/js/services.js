angular.module('starter.services', [])

.factory('PasswordService', function($q, $http) {
    return {
        change: function (pw, taxiid) {
            return $http.post(MAIN_URL+"/changePassword.php", {
                    taxiid: taxiid,
                    password: pw
                }).then(function(response) {
                    return response.data;
                });
        }
    }
})

.factory('LoginService', function($q, $http) {
    return {
        loginUser: function(name, pw) {
            return $http.post(MAIN_URL+"/login.php", {
                    username: name,
                    password: pw
                }).then(function(response) {
                    //console.log(response);
                    window.localStorage.setItem("session_taxi", JSON.stringify(response.data));
                    return response.data;
                });
        }
    }
})

.factory('AccountService', function($http) {
    return {
        getTaxiData: function(taxiid) {
            return $http.post(MAIN_URL+"/getTaxiData.php", {id: taxiid}).then(function(response) {
                //console.log(response);
                if (response.data != -1) {
                    window.localStorage.setItem("session_taxi", JSON.stringify(response.data));
                }
                return response.data;
            });
      }
    }
})

.factory('TripsService', function($http) {
  // Might use a resource here that returns a JSON array
  var trips = [];

  return {
    remove: function(trip) {
      trips.splice(trips.indexOf(trip), 1);
    },
    getAll: function(taxiid) {
      return $http.post(MAIN_URL+"/trip_all.php", {taxiid: taxiid})
                .then(function(response) {
//				console.log(response);
        			trips = response.data;
        			return trips;
        		});
    },
    countAll: function (taxiid) {
      return $http.post(MAIN_URL+"/trip_count_all.php", {taxiid: taxiid})
                .then(function(response) {
        			trips_num = response.data;
        			return trips_num;
        		});
    },
    getOne: function(tripID, taxiid) {
        return $http.post(MAIN_URL+"/trip_one.php", {id: tripID, taxiid: taxiid})
                  .then(function(response) {
          			trip = response.data;
          			return trip;
          		});
    },
    getFullInfo: function(tripID, taxiid) {
        return $http.post(MAIN_URL+"/trip_one_address.php", {id: tripID, taxiid: taxiid})
                  .then(function(response) {
          			return response.data;
          		});
    },
    buy: function(tripID, taxiid) {
        return $http.post(MAIN_URL+"/trip_buy.php", {id: tripID, taxiid: taxiid})
                  .then(function(response) {
          			return response.data;
          		});
    },
    getAllBuy: function (taxiid) {
        return $http.post(MAIN_URL+"/trip_all_buy.php", {taxiid: taxiid})
                  .then(function(response) {
          			trips = response.data;
          			return trips;
          		});
    }
  };
})


.factory('HistoryService', function($http) {
  var histories = [];

  return {
    getAll: function(taxiID) {
      return $http.post(MAIN_URL+"/paycoin_all.php", {taxiid: taxiID})
                .then(function(response) {
        			histories = response.data;
//                    console.log(histories);
        			return histories;
        		});
    },
    getOne: function(hID) {
        return $http.post(MAIN_URL+"/paycoin_one.php", {id: hID})
                  .then(function(response) {
          			history = response.data;
          			return history;
          		});
    }
  };
})


.factory('InfriengeService', function($http) {
  var infrienges = [];

  return {
    getAll: function(taxiID) {
      return $http.post(MAIN_URL+"/infrienge_all.php", {taxiid: taxiID})
                .then(function(response) {
        			infrienges = response.data;
//                    console.log(infrienges);
        			return infrienges;
        		});
    },


    changeStatus: function(iID) {
        return $http.post(MAIN_URL+"/infrienge_changeStatus.php", {id: iID})
               // .then(function(response) {
               //                 return response;
               // });
    },

    getOne: function(iID) {
        return $http.post(MAIN_URL+"/infrienge_one.php", {id: iID})
                .then(function(response) {
				console.log(response);
          			infrienge = response.data;
          			return infrienge;
                });
    }
  };
})
