'use strict';

angular.module('fireUser', ['firebase','ui.router'])
.constant('FireUserDefault', {
  redirectPath:'/',
  dataLocation:'data',
  userData:'user',
  routing: false,
  routeAccess: 'private',
  routeRedirect: 'login'
})
.service('FireUserValues',['FireUserDefault','FireUserConfig',function (FireUserDefault,FireUserConfig) {

  if(!FireUserConfig.url) throw "No config Url. Please Add your URL.";
  FireUserConfig = angular.extend(FireUserDefault,FireUserConfig);

  return FireUserConfig;
}])
.run(['$rootScope', '$location', '$fireUser', '$state','FireUserValues','waitForAuth', 
function($rootScope, $location, $fireUser, $state, FireUserValues,waitForAuth) {
  if(FireUserValues.routing){

    var checked;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if(checked!=toState.name){

        event.preventDefault();

        waitForAuth.then(function() {
           if(toState[FireUserValues.routeAccess] && !$rootScope[FireUserValues.dataLocation].userInfo){

              $state.go(FireUserValues.routeRedirect)

          }else{
            checked = toState.name;
            $state.go(toState.name,toParams)
          };  
        });        

      } else {

        // clear the flag and don't prevent the default if the state change 
        // was just triggered by this watch
        checked = false;
      }
    })
  }; 
}])
.service('$fireUser', ['$firebaseSimpleLogin', '$firebase', '$rootScope', 'FireUserValues','$log','waitForAuth',
  function ($firebaseSimpleLogin, $firebase, $rootScope, FireUserValues, $log,waitforAuth) {

    // create data scope 
    $rootScope[FireUserValues.dataLocation] = {};
    $rootScope[FireUserValues.dataLocation].userLoggedIn = false;

    // Possible events broadcasted by this service
    this.USER_CREATED_EVENT = 'fireuser:user_created';
    this.LOGIN_EVENT = 'fireuser:login';
    this.LOGIN_ERROR_EVENT = 'fireuser:login_error';
    this.LOGOUT_EVENT = 'fireuser:logout';
    this.USER_DATA_CHANGED_EVENT = 'fireuser:data_changed';
    this.USER_DATA_LOADED_EVENT = 'fireuser:data_loaded';
    this.USER_CREATION_ERROR_EVENT = 'fireuser:user_creation_error';


    // kickoff the authentication call (fires events $firebaseAuth:* events)

    var auth = $firebaseSimpleLogin(new Firebase(FireUserValues.url), {'path': FireUserValues.redirectPath});
    var self = this;
    var unbind = null;    
    var _angularFireRef = null;
  
    $rootScope.$on('$firebaseSimpleLogin:logout', function() {
      $rootScope[FireUserValues.dataLocation].userLoggedIn = false;

      $rootScope.$broadcast(self.LOGOUT_EVENT);
    });

    $rootScope.$on('$firebaseSimpleLogin:error', function(error) {
      $rootScope.$broadcast(self.LOGIN_ERROR_EVENT,error);
      $log.info('There was an error during authentication.', error);
    });

    $rootScope.$on('$firebaseSimpleLogin:login', function(evt, user) {

      var FirebaseUrl = new Firebase(FireUserValues.url + FireUserValues.dataLocation + '/' + user.id);

      var _angularFireRef = $firebase(FirebaseUrl).$asObject();



      var userDataLocation = FireUserValues.dataLocation+'.'+FireUserValues.userData;

      _angularFireRef.$bindTo($rootScope, userDataLocation).then(function(unb) {
        unbind = unb;
      });

      $rootScope[FireUserValues.dataLocation].userInfo = user;
      $rootScope[FireUserValues.dataLocation].userLoggedIn = true;

      _angularFireRef.$loaded().then(function(data) {

        $rootScope.$broadcast(self.USER_DATA_LOADED_EVENT, data);
      });

      _angularFireRef.$watch(function(data) {
        $rootScope.$broadcast(self.USER_DATA_CHANGED_EVENT, data);
      });

      $rootScope.$broadcast(self.LOGIN_EVENT, user);
    });

    this.createUser = function createUser(user){
      var createUser  = auth.$createUser(user.email, user.password,false);
      createUser.then(function (user) {
          $rootScope.$broadcast(self.USER_CREATED_EVENT,user);
          $log.info('User created - User Id: ' + user.id + ', Email: ' + user.email);

      });
      return createUser;
    };

    this.login = function(type,user) {
      if(type === 'password'){
        auth.$login('password',{
          email: user.email,
          password: user.password
        }).then(function(user) {
           console.log('Logged in as: ', user.uid);
      }, function(error) {
           console.error('Login failed: ', error);
        });
      } else {
        auth.$login(type);
      }
    };

    this.logout = function() {
      $rootScope[FireUserValues.dataLocation].userLoggedIn = false;
      unbind();
      auth.$logout();

    };

    this.changepassword = function (email, oldPassword, newPassword,callback) {
      auth.changePassword(email, oldPassword, newPassword, callback);
    };

    this.sendPasswordResetEmail =function ( email, callback ) {
      auth.sendPasswordResetEmail(email,callback);
    };

    return this;

  }
])
.service('waitForAuth', function($rootScope, $q, $timeout) {
    function fn(err) {
      if($rootScope.auth) {
        $rootScope.auth.error = err instanceof Error? err.toString() : null;
      }

      for(var i=0; i < subs.length; i++) { subs[i](); }

      $timeout(function() {
        // force $scope.$apply to be re-run after login resolves
        def.resolve();
      });
    }
 
    var def = $q.defer(), subs = [];
    subs.push($rootScope.$on('$firebaseSimpleLogin:login', fn));
    subs.push($rootScope.$on('$firebaseSimpleLogin:logout', fn));
    subs.push($rootScope.$on('$firebaseSimpleLogin:error', fn));
    return def.promise;

  })
.controller('fireuserloginCtrl',['$scope','$fireUser',function ($scope, $fireUser) {
    $scope.login = function(type) {
      $fireUser.login(type);
    };
  }])
.directive('fulogin', ['FireUserValues', function(FireUserValues) {
    return {
      scope:{
        type:'@'
      },
      replace: true,
      template: '<i ng-click="login(type)"></i>',
      controller:'fireuserloginCtrl',
      link: function ($scope,element,attr,ctrl) {
          element.addClass('fa fa-'+attr.type);
      },
      restrict: 'AE'
    };
  }])
.controller('fireuserlogoutCtrl',['$scope','$fireUser',function ($scope, $fireUser) {
  $scope.logout = $fireUser.logout;
  }])
.directive('fulogout', [function() {
    return {
      scope:{
        type:'@'
      },
      replace: true,
      template: '<button ng-click="logout()">Выйти</button>',
      controller:'fireuserlogoutCtrl',
      restrict: 'AE'
    };
  }])
.controller('fireuserloginformCtrl',['$scope', '$fireUser', function ($scope, $fireUser) {
    $scope.login = function () {
      $fireUser.login('password',{ 'email': $scope.email, 'password': $scope.password });
    };

    }])
.directive('fuloginform', ['$compile', 'FireUserValues', function ($compile,FireUserValues) {
  return {
    scope:{
        mtd:'='
    },
    restrict:'AE',
    controller:'fireuserloginformCtrl',
    link:function ($scope,element,attr,ctrl) {
      element.html(
        '<form id="loginForm" name="loginForm" ng-submit="login()">'+

            '<input class="form-control" placeholder="e-mail" type="email" name="email" ng-model="email" required/>'+

            '<input class="form-control" placeholder="пароль" type="password" name="password" ng-model="password" required/>'+

          '<button id="submitBtn" class="auth-button" type="submit">&raquo;</button>'+
          '<button class="auth-button" ng-click="mtd.logging=false">&times;</button>'+
        '</form>'
      );
      $compile(element.contents())($scope);
    }
  };
}])
.controller('fireusersignupformCtrl',['$scope', '$fireUser', function ($scope, $fireUser) {

      $scope.used=$scope.mtd.getPersonalUsed();

        $scope.genders=[
            {
                title:'M',
                gender:'male'
            },
            {
                title:'Ж',
                gender:'female'
            }
        ];

      $scope.mtd.userGender='male';

      $scope.createUser = function () {
        $fireUser.createUser({ email: $scope.email, password: $scope.password });
      };

}])
.directive('fusignupform', ['$compile', 'FireUserValues', function ($compile,FireUserValues) {
  return {
    scope:{
        mtd:'='
    },
    restrict:'AE',
    controller:'fireusersignupformCtrl',
    template:'<label ng-if="!mtd.userLetters" class="choose-color">Выберите <span ng-if="!mtd.showLetters">цвет</span><span ng-if="mtd.showLetters">буквы</span>: </label>' +
        '<div letter-grid used="used" mtd="mtd" result="mtd.userLetters" class="letter-grid"></div>'+
        '<form name="signupForm" ng-submit="createUser()">' +
    '<input class="form-control" placeholder="Представься" type="name" name="name" ng-model="mtd.userName" required/>' +
        '<select class="form-control" ng-model="mtd.userGender" name="пол" required ng-options="gender.gender as gender.title for gender in genders"></select>'+
    '<input class="form-control" placeholder="e-mail" type="email" name="email" ng-model="email" required/>'+
    '<input class="form-control" type="password" placeholder="пароль" name="password" ng-model="password" required/>'+
    '  <button ng-if="mtd.userName && mtd.userLetters && email && password" type="submit" class="auth-button" value="creatUser">&raquo;</button>'+
    '  <span class="error" ng-show="error">{{error}}</span>' +
    '<button class="auth-button" ng-click="mtd.creating=false">&times;</button>' +
    '</form>'

  };
}])
