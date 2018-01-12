// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'chart.js', 'starter.controllers', 'starter.services', 'ngCordova', 'ionic-timepicker', 'ionic-datepicker'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}

		if (window.ga) {
			window.ga.startTrackerWithId('UA-82430654-1');
			window.ga.trackView('Start application')
		}

		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}

	});
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	// setup an abstract state for the tabs directive
	.state('tab', {
		url: '/tab',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
/*		onEnter: function($state, Auth) {
				console.log(Auth);
				if(!Auth.isLoggedIn()) {
					 $state.go('tab.login');
				}
		}
 */
 })

	// Each tab has its own nav history stack:

	.state('tab.login', {
			url: '/login',
			views: {
					'menuContent': {
							templateUrl: 'templates/login.html',
							controller: 'LoginCtrl'
					}
			}
	})

    .state('tab.logout', {
    		url: '/logout',
    		views: {
    				'menuContent': {
//    						templateUrl: 'templates/logout.html',
    						controller: 'LogoutCtrl'
    				}
    		}
	})

	.state('tab.chats', {
		url: '/chats',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-chats.html',
				controller: 'ChatsCtrl'
			}
		}
	})


	.state('tab.trips', {
		url: '/trips',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-trips.html',
				controller: 'TripsCtrl'
			}
		}
	})
	.state('tab.trips.view', {
		url: '/:tripID',
		views: {
			// here is the issue, instead of this
			// 'tab-posts':{
			// we have to use this
			'menuContent@tab':{
				templateUrl: 'templates/tripView.html',
				controller: 'TripsViewCtrl'
			}
		}
	})


	.state('tab.buy', {
		url: '/buy',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-buy.html',
				controller: 'BuyCtrl'
			}
		}
	})
	.state('tab.buy.view', {
		url: '/:buyID',
		views: {
			'menuContent': {
				templateUrl: 'templates/buyView.html',
				controller: 'BuyViewCtrl'
			}
		}
	})

	.state('tab.sell', {
		url: '/sell',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-sell.html',
				controller: 'SellCtrl'
			}
		}
	})
	.state('tab.sellList', {
		url: '/sellList',
		views: {
			'menuContent': {
				templateUrl: 'templates/sellList.html',
				controller: 'SellListCtrl'
			}
		}
	})
	.state('tab.sell.view', {
		url: ':/sellID',
		views: {
			'menuContent': {
				templateUrl: 'templates/sellView.html',
				controller: 'SellViewCtrl'
			}
		}
	})

	.state('tab.history', {
		url: '/history',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-history.html',
				controller: 'HistoryCtrl'
			}
		}
	})
	.state('tab.history.view', {
		url: '/:hID',
		views: {
			'menuContent@tab': {
				templateUrl: 'templates/historyView.html',
				controller: 'HistoryViewCtrl'
			}
		}
	})


	.state('tab.infrienge', {
		url: '/infrienge',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-infrienge.html',
				controller: 'InfriengeCtrl'
			}
		}
	})
	.state('tab.infrienge.view', {
		url: '/:iID',
		views: {
			'menuContent@tab': {
				templateUrl: 'templates/infriengeView.html',
				controller: 'InfriengeViewCtrl'
			}
		}
	})

	.state('tab.info', {
		url: '/info',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-info.html',
			}
		}
	})

	.state('tab.rules', {
                url: '/rules',
                views: {
                        'menuContent': {
                                templateUrl: 'templates/tab-rules.html',
                        }
                }
        })


	.state('tab.password', {
		url: '/password',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-password.html',
				controller: 'PasswordCtrl'
			}
		}
	})

	.state('tab.account', {
		url: '/account',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-account.html',
				controller: 'AccountCtrl'
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/trips');
	$ionicConfigProvider.tabs.position('bottom'); // other values: top

});
