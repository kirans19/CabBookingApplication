"use strict";



define('cab-booking-application/app', ['exports', 'cab-booking-application/resolver', 'ember-load-initializers', 'cab-booking-application/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('cab-booking-application/components/nav-pane', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({

        applicationController: Ember.computed(function () {
            return Ember.getOwner(this).lookup('controller:application');
        }),

        userType: Ember.computed.readOnly('applicationController.userType'),

        init: function init() {
            this._super.apply(this, arguments);
            this.toggleUserType();
        },


        isUser: false,
        isAdmin: false,
        isDriver: false,
        selectedRoute: null,

        paneOption_1: true,
        paneOption_2: false,
        paneOption_3: false,
        paneOption_4: false,

        toggleUserType: function toggleUserType() {

            if (this.get('userType') == '1') {
                this.set('isUser', true);
            } else if (this.get('userType') == '2') {
                this.set('isDriver', true);
            } else if (this.get('userType') == 3) {
                this.set('isAdmin', true);
            }
        },

        actions: {
            logout: function logout() {
                localStorage.removeItem('token');
                Ember.getOwner(this).lookup('controller:application').set('token', null);
                Ember.getOwner(this).lookup('controller:application').send(this.get('logoutAction'), 'login');
            },
            selectPaneOption: function selectPaneOption(option) {
                this.setProperties({
                    paneOption_1: option === 'paneOption_1',
                    paneOption_2: option === 'paneOption_2',
                    paneOption_3: option === 'paneOption_3',
                    paneOption_4: option === 'paneOption_4'
                });
            }
        }

    });
});
define('cab-booking-application/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('cab-booking-application/controllers/application', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({

        token: localStorage.getItem('token'),

        decodedVal: Ember.computed('token', function () {
            var token = this.get('token');
            return (0, _util.parseJwtToken)(token);
        }),

        userId: Ember.computed.alias('decodedVal.userId'),
        userType: Ember.computed.alias('decodedVal.userType'),

        actions: {
            doLogout: function doLogout(routeName) {
                this.transitionToRoute(routeName);
            }
        }

    });
});
define('cab-booking-application/controllers/bookings', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    history: null,
    currDate: null,
    currTime: null,
    bookedTime: null,
    lastBookingTime: null,
    isPickUp: false,
    invalidBookingMessage: null,

    applicationController: Ember.computed(function () {
      return Ember.getOwner(this).lookup('controller:application');
    }),

    userId: Ember.computed.readOnly('applicationController.userId'),

    dropDownTimeRanges: Ember.computed('model', 'model.@each', function () {
      var _this = this;

      var filteredRanges = Ember.copy(this.get('timeRanges'), true);
      var currTime = this.get('currTime');
      var currTimeValue = this.getTimeValue(currTime);
      this.get('model').forEach(function (object) {
        var val = object.bookedTime.split(' ')[1];
        filteredRanges.removeObject(filteredRanges.findBy('value', val));
      });

      filteredRanges = filteredRanges.filter(function (timeRange) {
        var timeRangeValue = _this.getTimeValue(timeRange.value);
        return timeRangeValue >= currTimeValue;
      });

      return filteredRanges;
    }),

    timeRanges: _util.timeRanges,

    clearErrorMessage: function clearErrorMessage(property) {
      this.set(property, null);
    },

    showErrorMessage: function showErrorMessage(property, message) {
      this.set(property, message);
      setTimeout(function () {
        this.clearErrorMessage(property);
      }.bind(this), 1000);
    },

    getTimeValue: function getTimeValue(time) {
      return Number(time.split(':')[0]);
    },

    addHoursToTime: function addHoursToTime(time, hours) {
      var timeParts = time.split(':');
      var hoursToAdd = parseInt(timeParts[0]) + hours;
      timeParts[0] = hoursToAdd.toString().padStart(2, '0');
      return timeParts.join(':');
    },

    actions: {
      getBookingTime: function getBookingTime(timeRange) {
        this.set('bookedTime', timeRange.value);
      },
      getCurrTime: function getCurrTime() {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ':00:00.0';

        this.set('currDate', date);
        this.set('currTime', time);
      },
      doBooking: function doBooking() {
        var _this2 = this;

        var isPickUpRadio = document.getElementsByName('pickup');

        var isPickUpTemp = null;

        for (var i = 0; i < isPickUpRadio.length - 1; i++) {
          if (isPickUpRadio[i].checked) {
            isPickUpTemp = isPickUpRadio[i].value;
          }
        }

        var bookedTime = this.currDate + ' ' + this.bookedTime;
        var isPickup = isPickUpTemp;
        var instance = this;

        var addBooking = {
          isPickup: isPickup,
          bookedTime: bookedTime
        };

        (0, _util.executePromise)('/users/' + this.get('userId') + '/bookings', 'POST', addBooking).then(function (response) {

          var bookingsModel = instance.get('model');
          bookingsModel.pushObject(response[0]);
          instance.set('model', bookingsModel);

          // this.send('getCurrTime');

        }).catch(function (error) {
          _this2.showErrorMessage('invalidBookingMessage', 'Booking Failed !!');
        });
      },
      cancelBooking: function cancelBooking(booking) {

        var instance = this;

        (0, _util.executePromise)('/users/' + this.get('userId') + '/trips/' + booking.tripId + '/bookings', 'DELETE', null).then(function (response) {

          instance.get('model').removeObject(booking);
          // var filteredModel = model.filter((item) => item.userId !== this.get('userId') && item.tripId !== booking.tripId);
          // instance.set('model', filteredModel);
        }).catch(function (error) {
          console.log(error);
        });
      },
      getIsPickUp: function getIsPickUp(value) {
        this.set('isPickUp', value);
      }
    }
  });
});
define('cab-booking-application/controllers/drivers', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({

        showDeactivatedDrivers: false,
        showActivatedDrivers: true,
        showUnApprovedDrivers: false,
        showUpdateFields: true,

        selectedDriverId: null,

        shift: null,
        locationId: null,
        locationName: null,

        modelLength: null,

        applicationController: Ember.computed(function () {
            return Ember.getOwner(this).lookup('controller:application');
        }),

        userId: Ember.computed.readOnly('applicationController.userId'),

        getModelLength: function getModelLength(model) {

            var filteredModel = model.filter(function (object) {
                return object.canDisplay === true;
            });
            var lengthOfFilteredModel = filteredModel.length;
            this.set('modelLength', lengthOfFilteredModel);
        },


        actions: {
            toggleDeactivatedDriverList: function toggleDeactivatedDriverList() {

                this.model.forEach(function (object) {
                    if (object.canDisplay) {
                        Ember.set(object, 'canDisplay', undefined);
                        delete object["canDisplay"];
                    }
                });

                this.model.forEach(function (object) {
                    if (!object.isActive && object.locationId != 0) {
                        Ember.set(object, 'canDisplay', true);
                    }
                });

                this.set('showDeactivatedDrivers', true);
                this.set('showActivatedDrivers', false);
                this.set('showUnApprovedDrivers', false);

                this.getModelLength(this.model);
            },
            toggleActivatedDriverList: function toggleActivatedDriverList() {

                this.model.forEach(function (object) {
                    if (object.canDisplay) {
                        Ember.set(object, 'canDisplay', undefined);
                        delete object["canDisplay"];
                    }
                });

                this.model.forEach(function (object) {
                    if (object.isActive && object.locationId != 0) {
                        Ember.set(object, 'canDisplay', true);
                    }
                });

                this.set('showActivatedDrivers', true);
                this.set('showDeactivatedDrivers', false);
                this.set('showUnApprovedDrivers', false);

                this.getModelLength(this.model);
            },
            toggleApproval: function toggleApproval() {

                this.model.forEach(function (object) {
                    if (object.canDisplay) {
                        Ember.set(object, 'canDisplay', undefined);
                        delete object["canDisplay"];
                    }
                });

                this.model.forEach(function (object) {
                    if (object.locationId == 0) {
                        Ember.set(object, 'canDisplay', true);
                    }
                });

                this.set('showUnApprovedDrivers', true);
                this.set('showDeactivatedDrivers', false);
                this.set('showActivatedDrivers', false);

                this.getModelLength(this.model);
            },
            toggleUpdateFields: function toggleUpdateFields(driverId) {

                this.model.forEach(function (object) {
                    if (object.isEditable) {
                        Ember.set(object, 'isEditable', undefined);
                        delete object["isEditable"];
                    }
                });

                if (driverId) {
                    var object = this.model.findBy('driverId', driverId);
                    Ember.set(object, 'isEditable', true);
                }
            },
            addDriverLocation: function addDriverLocation(location) {
                this.set('locationId', location.locationId);
                this.set('locationName', location.locationName);
            },
            addDriverShift: function addDriverShift(shift) {
                Ember.set(this, 'shift', shift);
            },
            updateDriverStatus: function updateDriverStatus(driver) {
                var instance = this;
                var methodName = driver.isActive ? 'DELETE' : 'PUT';

                (0, _util.executePromise)('/admin/' + this.get('userId') + '/approval/' + driver.driverId, methodName, null).then(function (response) {
                    var model = instance.model;
                    var updatedDriver = model.find(function (item) {
                        return item.driverId === driver.driverId;
                    });
                    Ember.set(updatedDriver, 'isActive', !driver.isActive);
                    Ember.set(updatedDriver, 'canDisplay', !driver.canDisplay);
                    instance.getModelLength(model);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            updateDriverFields: function updateDriverFields(driver) {

                var instance = this;
                var locationId = this.get('locationId');
                var shift = this.shift;
                var locationName = this.locationName;

                var updateFields = locationId && shift ? { locationId: locationId, shift: shift } : !locationId ? { shift: shift } : !shift ? { locationId: locationId } : null;

                (0, _util.executePromise)('/admin/' + this.get('userId') + '/drivers/' + driver.driverId, 'PUT', updateFields).then(function (response) {
                    var model = instance.model;
                    var updatedDriver = model.find(function (item) {
                        return item.driverId === driver.driverId;
                    });
                    Ember.set(updatedDriver, 'locationId', locationId);
                    Ember.set(updatedDriver, 'locationName', locationName);
                    Ember.set(updatedDriver, 'shift', shift);
                    instance.getModelLength(model);
                }).catch(function (error) {
                    console.log(error);
                });

                this.send('toggleUpdateFields');
            }
        }
    });
});
define('cab-booking-application/controllers/history', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({

        applicationController: Ember.inject.controller('application'),

        userType: Ember.computed.readOnly('applicationController.userType'),

        // init() {
        //     this._super(...arguments);
        //     this.toggleUserType();
        // },

        isUser: false,
        isAdmin: false,
        isDriver: false,

        actions: {
            toggleUserType: function toggleUserType() {

                if (this.get('userType') == '1') {
                    this.set('isUser', true);
                } else if (this.get('userType') == '2') {
                    this.set('isDriver', true);
                } else if (this.get('userType') == '3') {
                    this.set('isAdmin', true);
                }
            }
        }

    });
});
define('cab-booking-application/controllers/locations', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    locationName: null,
    isBranch: false,
    showDeactivatedLocations: true,
    showCreateLocations: false,
    locationNullMessage: null,
    nameError: null,
    applicationController: Ember.computed(function () {
      return Ember.getOwner(this).lookup('controller:application');
    }),

    userId: Ember.computed.readOnly('applicationController.userId'),

    clearErrorMessage: function clearErrorMessage(property) {
      this.set(property, null);
    },

    showErrorMessage: function showErrorMessage(property, message) {
      this.set(property, message);
      setTimeout(function () {
        this.clearErrorMessage(property);
      }.bind(this), 1000);
    },

    actions: {
      toggleLocationList: function toggleLocationList() {
        this.set('showDeactivatedLocations', !this.showDeactivatedLocations);
      },
      toggleCreateLocation: function toggleCreateLocation() {
        this.set('showCreateLocations', !this.showCreateLocations);
      },


      createLocation: function createLocation() {
        var instance = this;

        var locationName = this.get('locationName');
        var isBranch = this.get('isBranch');
        var status = true;

        if (!locationName) {
          this.showErrorMessage('locationNullMessage', 'Please fill out the location field');
          return;
        }

        var namePattern = /^[a-zA-Z\s]*$/;
        if (!namePattern.test(locationName)) {
          this.showErrorMessage('nameError', 'Invalid Name');
          this.set('locationName', null);
          return;
        }

        var newLocation = {
          locationName: locationName,
          isBranch: isBranch,
          status: status
        };

        (0, _util.executePromise)('/admin/' + this.get('userId') + '/locations', 'POST', newLocation).then(function (response) {
          var addLocation = Em.Object.create({
            "locationId": response,
            "locationName": locationName,
            "isBranch": isBranch,
            "isActive": status
          });

          var locModel = instance.get('model');
          locModel.pushObject(addLocation);
          instance.set('model', locModel);
          resolve(response);
        }).catch(function (error) {
          console.log(error);
        });
      },

      updateLocation: function updateLocation(location) {
        var instance = this;
        var methodName = location.isActive ? 'DELETE' : 'PUT';

        (0, _util.executePromise)('/admin/' + this.get('userId') + '/locations/' + location.locationId, methodName, null).then(function (response) {
          var model = instance.model;
          var updatedLocation = model.find(function (item) {
            return item.locationId === location.locationId;
          });
          Ember.set(updatedLocation, 'isActive', !location.isActive);
        }).catch(function (error) {
          console.log(error);
        });
      }
    }
  });
});
define('cab-booking-application/controllers/login', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    session: Ember.inject.service(),

    email: null,
    password: null,
    emailError: null,
    emailNullMessage: null,
    passwordNullMessage: null,
    invalidLoginMessage: null,

    clearErrorMessage: function clearErrorMessage(property) {
      this.set(property, null);
    },

    showErrorMessage: function showErrorMessage(property, message) {
      this.set(property, message);
      setTimeout(function () {
        this.clearErrorMessage(property);
      }.bind(this), 1000);
    },

    actions: {
      authenticate: function authenticate() {
        var _this = this;

        var email = this.get('email');
        var password = this.get('password');

        if (!email) {
          this.showErrorMessage('emailNullMessage', 'Please fill out the email field');
          return;
        }

        if (!password) {
          this.showErrorMessage('passwordNullMessage', 'Please fill out the password field');
          return;
        }

        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
          this.showErrorMessage('emailError', 'Please enter a valid email address');
          this.set('email', null);
          return;
        }

        var credentials = {
          email: email,
          password: password
        };
        var instance = this;
        (0, _util.executePromise)('/sign-in', 'POST', credentials).then(function (response) {
          var token = response.token;
          // const decodedVal = parseJwtToken(token);

          localStorage.setItem('token', token);

          Ember.getOwner(instance).lookup('controller:application').set('token', token);
          // Ember.getOwner(instance).lookup('controller:application').set('userId', decodedVal.userId);
          // Ember.getOwner(instance).lookup('controller:application').set('userType', decodedVal.userType);
          var userType = Ember.getOwner(instance).lookup('controller:application').get('userType');

          instance.set('email', null);
          instance.set('password', null);

          if (userType == 3) {
            instance.transitionToRoute('/history');
          } else if (userType == 2) {
            instance.transitionToRoute('/trips');
          } else if (userType == 1) {
            instance.transitionToRoute('/bookings');
          }
        }).catch(function (error) {
          _this.showErrorMessage('invalidLoginMessage', 'Invalid Login !!');
        });
      }
    }
  });
});
define('cab-booking-application/controllers/register', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    email: null,
    password: null,
    name: null,
    phnNum: null,
    userType: null,
    locationId: null,
    branchId: null,

    emailNullMessage: null,
    passwordNullMessage: null,
    nameNullMessage: null,
    phnNumNullMessage: null,
    userTypeNullMessage: null,
    homeNullMessage: null,
    branchNullMessage: null,
    invalidRegisterMessage: null,

    emailError: null,
    nameError: null,
    phnNumError: null,

    showLocationFields: false,
    showTypeFields: true,

    clearErrorMessage: function clearErrorMessage(property) {
      this.set(property, null);
    },

    showErrorMessage: function showErrorMessage(property, message) {
      this.set(property, message);
      setTimeout(function () {
        this.clearErrorMessage(property);
      }.bind(this), 1000);
    },

    actions: {
      getUserType: function getUserType(value) {
        if (value == 1) {
          Ember.set(this, 'showLocationFields', true);
          Ember.set(this, 'showTypeFields', false);
        } else if (value == 2) {
          Ember.set(this, 'showLocationFields', false);
        }
        Ember.set(this, 'userType', value);
      },
      addBranch: function addBranch(branchId) {
        Ember.set(this, 'branchId', branchId);
      },
      addHome: function addHome(locationId) {
        Ember.set(this, 'locationId', locationId);
      },
      register: function register() {
        var _this = this;

        var email = this.get('email');
        var password = this.get('password');
        var name = this.get('name');
        var phnNum = this.get('phnNum');
        var userType = this.get('userType');
        var locationId = null;
        var branchId = null;

        if (userType == 1) {
          locationId = this.get('locationId');
          branchId = this.get('branchId');

          if (!locationId) {
            this.showErrorMessage('homeNullMessage', 'Please fill out the Home Location field');
            return;
          }

          if (!branchId) {
            this.showErrorMessage('branchNullMessage', 'Please fill out the Branch Location field');
            return;
          }
        }

        if (!email) {
          this.showErrorMessage('emailNullMessage', 'Please fill out the email field');
          return;
        }

        if (!password) {
          this.showErrorMessage('passwordNullMessage', 'Please fill out the password field');
          return;
        }

        if (!name) {
          this.showErrorMessage('nameNullMessage', 'Please fill out the name field');
          return;
        }

        if (!phnNum) {
          this.showErrorMessage('phnNumNullMessage', 'Please fill out the mobile number field');
          return;
        }

        if (!userType) {
          this.showErrorMessage('userTypeNullMessage', 'Please select user type');
          return;
        }

        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
          this.showErrorMessage('emailError', 'Please enter a valid email address');
          this.set('email', null);
          return;
        }

        var namePattern = /^[a-zA-Z\s]*$/;
        if (!namePattern.test(name)) {
          this.showErrorMessage('nameError', 'Please enter a valid name');
          this.set('name', null);
          return;
        }

        var phnNumPattern = /^[0-9]{10}$/;
        if (!phnNumPattern.test(phnNum)) {
          this.showErrorMessage('phnNumError', 'Please enter a valid phone number');
          this.set('phnNum', null);
          return;
        }

        var userDetails = {
          email: email,
          password: password,
          name: name,
          phnNum: phnNum,
          userType: userType
        };

        var locationDetails = {
          locationId: locationId,
          branchId: branchId
        };

        var signUpData = null;

        if (userType == 1) {
          signUpData = {
            userDetails: userDetails,
            locationDetails: locationDetails
          };
        } else if (userType == 2) {
          signUpData = {
            userDetails: userDetails
          };
        }

        (0, _util.executePromise)('/sign-up', 'POST', signUpData).then(function (response) {
          _this.transitionToRoute('/login');
        }).catch(function (error) {
          _this.showErrorMessage('invalidRegisterMessage', 'Registration Failed !!');
        });
      }
    }
  });
});
define('cab-booking-application/controllers/routes', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    routeName: null,
    showCreateRoute: false,
    showStopList: false,
    locationList: null,
    routeNullMessage: null,
    nameError: null,

    applicationController: Ember.computed(function () {
      return Ember.getOwner(this).lookup('controller:application');
    }),

    userId: Ember.computed.readOnly('applicationController.userId'),

    clearErrorMessage: function clearErrorMessage(property) {
      this.set(property, null);
    },

    showErrorMessage: function showErrorMessage(property, message) {
      this.set(property, message);
      setTimeout(function () {
        this.clearErrorMessage(property);
      }.bind(this), 1000);
    },

    isLocationSelected: function isLocationSelected(locationId) {
      var selectedLocations = this.get('selectedLocations');
      return selectedLocations.includes(locationId);
    },


    actions: {

      // toggleProperties(properties) {
      //   properties.forEach((property) => {
      //     this.set(property, !this.get(property));
      //   });
      // },


      toggleCreateRoute: function toggleCreateRoute() {
        this.set('showCreateRoute', true);
        this.set('showStopList', false);
      },
      toggleRouteStops: function toggleRouteStops() {
        this.set('showStopList', true);
        this.set('showCreateRoute', false);
      },
      toggleAll: function toggleAll() {
        this.set('showStopList', false);
        this.set('showCreateRoute', false);
      },
      updateSelectedLocations: function updateSelectedLocations(locationId) {
        var selectedLocations = this.get('selectedLocations');

        selectedLocations.pushObject(locationId);
      },
      createRoute: function createRoute() {
        var _this = this;

        var locationCheckBox = document.getElementsByName('locations');

        var checkedLocations = [];

        for (var i = 0; i < locationCheckBox.length - 1; i++) {
          if (locationCheckBox[i].checked) {
            var _currentLocation = locationCheckBox[i].value;
            var _nextLocation = locationCheckBox[i + 1].value;
            checkedLocations.push({ currentLocation: _currentLocation, nextLocation: _nextLocation });
          }
        }

        var lastPair = checkedLocations[checkedLocations.length - 1];
        var branchCheckBox = document.getElementsByName('branches');

        var currentLocation = lastPair.nextLocation;
        var nextLocation = branchCheckBox[0].value;
        var addBranch = { currentLocation: currentLocation, nextLocation: nextLocation };
        checkedLocations.push(addBranch);
        currentLocation = nextLocation;
        nextLocation = nextLocation;
        addBranch = { currentLocation: currentLocation, nextLocation: nextLocation };
        checkedLocations.push(addBranch);

        var location = checkedLocations;

        var instance = this;

        var routeName = this.get('routeName');

        if (!routeName) {
          this.showErrorMessage('routeNullMessage', 'Please fill out the location field');
          return;
        }

        var namePattern = /^[a-zA-Z\s]*$/;
        if (!namePattern.test(routeName)) {
          this.showErrorMessage('nameError', 'Invalid Name');
          this.set('locationName', null);
          return;
        }

        var newRoute = {
          routeName: routeName,
          location: location
        };

        (0, _util.executePromise)('/admin/' + this.get('userId') + '/routes', 'POST', newRoute).then(function (response) {

          var addRoute = Em.Object.create({
            "routeId": response,
            "routeName": _this.routeName
          });

          var routModel = instance.get('model');
          routModel.pushObject(addRoute);
          instance.set('model', routModel);
        }).catch(function (error) {
          console.log(error);
        });
      },
      getStops: function getStops(route) {
        var _this2 = this;

        (0, _util.executePromise)('/routes/' + route.routeId + '/locations', 'GET', null).then(function (response) {
          _this2.set('locationList', response);
          _this2.send('toggleRouteStops');
        }).catch(function (error) {
          console.log(error);
        });
      }
    }
  });
});
define('cab-booking-application/controllers/trips', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({

        currTrip: null,
        isApproved: Ember.computed.equal('trip.status', '1'),
        tripId: null,
        showAllTrips: true,

        actions: {
            getCurrTrip: function getCurrTrip(trip) {
                var _this = this;

                var applicationController = Ember.getOwner(this).lookup('controller:application');
                var driverId = applicationController.get('userId');

                this.set('tripId', trip.tripId);

                (0, _util.executePromise)('/drivers/' + driverId + '/trips/' + trip.tripId, 'GET', null).then(function (response) {
                    _this.set('currTrip', response);
                    _this.send("toggleAllTrips");
                }).catch(function (error) {
                    console.log(error);
                });
            },
            updateTripStatus: function updateTripStatus(userId, status) {

                var updatedVal = {
                    status: status
                };

                var instance = this;

                (0, _util.executePromise)('/drivers/' + userId + '/trips/' + this.tripId, 'PUT', updatedVal).then(function (response) {

                    var model = instance.currTrip;
                    var updatedCurrTrip = model.find(function (item) {
                        return item.userId == userId;
                    });
                    Ember.set(updatedCurrTrip, 'status', status);

                    if (status == 4) {
                        model.removeObject(updatedCurrTrip);
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            toggleAllTrips: function toggleAllTrips() {
                this.set('showAllTrips', !this.showAllTrips);
            }
        }
    });
});
define('cab-booking-application/helpers/app-version', ['exports', 'cab-booking-application/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    var versionOnly = hash.versionOnly || hash.hideSha;
    var shaOnly = hash.shaOnly || hash.hideVersion;

    var match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('cab-booking-application/helpers/equals', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.equals = equals;
  function equals(params) {

    return params[0] == params[1];
  }

  exports.default = Ember.Helper.helper(equals);
});
define('cab-booking-application/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define("cab-booking-application/helpers/shiftlabel", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.shiftlabel = shiftlabel;
  function shiftlabel(params) {
    switch (params[0]) {
      case 0:
        return "Morning";
      case 1:
        return "Noon";
      case 2:
        return "Evening";
      case 3:
        return "Night";

    }
  }

  exports.default = Ember.Helper.helper(shiftlabel);
});
define('cab-booking-application/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define("cab-booking-application/helpers/statuslabel", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.statuslabel = statuslabel;
  function statuslabel(params) {

    switch (params[0]) {

      case 0:

        return "Cancelled";
      case 1:

        return "Booked";
      case 2:

        return "Trip Started";
      case 3:

        return "Dropped";
      case 4:

        return "Absent";

    }
  }

  exports.default = Ember.Helper.helper(statuslabel);
});
define('cab-booking-application/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'cab-booking-application/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('cab-booking-application/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('cab-booking-application/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('cab-booking-application/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('cab-booking-application/initializers/ember-simple-auth', ['exports', 'cab-booking-application/config/environment', 'ember-simple-auth/configuration', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service'], function (exports, _environment, _configuration, _setupSession, _setupSessionService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-simple-auth',
    initialize: function initialize(registry) {
      var config = _environment.default['ember-simple-auth'] || {};
      config.baseURL = _environment.default.baseURL;
      _configuration.default.load(config);

      (0, _setupSession.default)(registry);
      (0, _setupSessionService.default)(registry);
    }
  };
});
define('cab-booking-application/initializers/export-application-global', ['exports', 'cab-booking-application/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('cab-booking-application/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('cab-booking-application/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('cab-booking-application/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("cab-booking-application/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('cab-booking-application/instance-initializers/ember-simple-auth', ['exports', 'ember-simple-auth/instance-initializers/setup-session-restoration'], function (exports, _setupSessionRestoration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-simple-auth',
    initialize: function initialize(instance) {
      (0, _setupSessionRestoration.default)(instance);
    }
  };
});
define('cab-booking-application/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('cab-booking-application/router', ['exports', 'cab-booking-application/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('login');
    this.route('locations');
    this.route('routes');
    this.route('register');
    this.route('drivers');
    this.route('history');
    this.route('trips');
    this.route('bookings');
  });

  exports.default = Router;
});
define('cab-booking-application/routes/application', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {

      var token = localStorage.getItem('token');

      // const applicationController = Ember.getOwner(this).lookup('controller:application');
      // const token = applicationController.get('token');

      var applicationController = Ember.getOwner(this).lookup('controller:application');
      var userType = applicationController.get('userType');

      if (!token) {
        this.transitionTo('/login');
      } else if (token && userType == 1) {
        this.transitionTo('/bookings');
      } else if (token && userType == 2) {
        this.transitionTo('/trips');
      } else if (token && userType == 3) {
        this.transitionTo('/history');
      }

      // routeValidate();
    }
  });
});
define('cab-booking-application/routes/bookings', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            Ember.run.bind(this, _util.checkAuthentication, "1")();
        },
        model: function model() {

            var applicationController = Ember.getOwner(this).lookup('controller:application');
            var userId = applicationController.get('userId');

            return (0, _util.executePromise)('/users/' + userId + '/bookings', 'GET', null);
        },
        setupController: function setupController(controller, model) {
            this._super(controller, model);
            controller.send('getCurrTime');
        }
    });
});
define('cab-booking-application/routes/drivers', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    location: Ember.inject.service(),

    beforeModel: function beforeModel() {
      Ember.run.bind(this, _util.checkAuthentication, "3")();
    },
    model: function model() {

      var driverPromise = (0, _util.executePromise)('/drivers', 'GET', null);

      var locationPromise = this.get('location').getLocationModel();

      return Ember.RSVP.hash({
        drivers: driverPromise,
        locations: locationPromise
      });
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.set('model', model.drivers);
      controller.set('locations', model.locations);
      controller.send('toggleActivatedDriverList');
    }
  });
});
define('cab-booking-application/routes/history', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        model: function model() {

            var applicationController = Ember.getOwner(this).lookup('controller:application');
            var userId = applicationController.get('userId');

            return (0, _util.executePromise)('/history/' + userId, 'GET', null);
        },
        setupController: function setupController(controller, model) {
            this._super(controller, model);

            controller.send('toggleUserType');
        }
    });
});
define('cab-booking-application/routes/locations', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    location: Ember.inject.service(),

    beforeModel: function beforeModel() {

      // const applicationController = Ember.getOwner(this).lookup('controller:application');
      // const token = applicationController.get('token');
      // const userType= applicationController.get('userType');

      //   if (!(token) || userType!=3){
      //     localStorage.removeItem('token');
      //     applicationController.set('token', null);
      //     this.transitionTo('/login');
      //   }

      Ember.run.bind(this, _util.checkAuthentication, "3")();
    },
    model: function model() {
      return this.get('location').getLocationModel();
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.set('model', model);
    }
  });
});
define('cab-booking-application/routes/login', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userType');
        }
    });
});
define('cab-booking-application/routes/register', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        location: Ember.inject.service(),

        model: function model() {
            return this.get('location').getLocationModel();
        }
    });
});
define('cab-booking-application/routes/routes', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    location: Ember.inject.service(),

    beforeModel: function beforeModel() {
      Ember.run.bind(this, _util.checkAuthentication, "3")();
    },
    model: function model() {

      var routePromise = (0, _util.executePromise)('/routes', 'GET', null);
      var locationPromise = this.get('location').getLocationModel();

      return Ember.RSVP.hash({
        routes: routePromise,
        locations: locationPromise
      });
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.set('model', model.routes);
      controller.set('locations', model.locations);
    }
  });
});
define('cab-booking-application/routes/trips', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            Ember.run.bind(this, _util.checkAuthentication, "2")();
        },
        model: function model() {

            var applicationController = Ember.getOwner(this).lookup('controller:application');
            var userId = applicationController.get('userId');

            return (0, _util.executePromise)('/drivers/' + userId + '/trips', 'GET', null);
        }
    });
});
define('cab-booking-application/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('cab-booking-application/services/location', ['exports', 'cab-booking-application/utils/util'], function (exports, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    getLocationModel: function getLocationModel() {
      return (0, _util.executePromise)('/locations', 'GET', null);
    }
  });
});
define('cab-booking-application/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, _session) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _session.default;
});
define('cab-booking-application/session-stores/application', ['exports', 'ember-simple-auth/session-stores/adaptive'], function (exports, _adaptive) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _adaptive.default.extend();
});
define("cab-booking-application/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "dEsvxTbH", "block": "{\"statements\":[[6,[\"if\"],[[28,[\"token\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"cbs-bg\"],[13],[0,\"\\n    \"],[1,[33,[\"nav-pane\"],null,[[\"logoutAction\"],[\"doLogout\"]]],false],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"cbs-main-body\"],[13],[0,\" \\n        \"],[1,[26,[\"outlet\"]],false],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"    \"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[]}],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "cab-booking-application/templates/application.hbs" } });
});
define("cab-booking-application/templates/bookings", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "yVzJ31EK", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"cbs-sub-body\"],[13],[0,\"\\n\\n    \"],[11,\"div\",[]],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-section dFlex\"],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group sec-width dInBlck\"],[13],[0,\"\\n                \"],[11,\"label\",[]],[15,\"class\",\"cbs-mandatory\"],[13],[0,\"Choose Slot\"],[14],[0,\"\\n                \"],[11,\"br\",[]],[13],[14],[0,\"\\n                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-fields\"],[13],[0,\"\\n\\n                        \"],[11,\"select\",[]],[15,\"class\",\"cbs-button mT5\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"dropDownTimeRanges\"]]],null,{\"statements\":[[0,\"                                \"],[11,\"option\",[]],[16,\"value\",[28,[\"timeRange\",\"value\"]],null],[5,[\"action\"],[[28,[null]],\"getBookingTime\",[28,[\"timeRange\"]]]],[13],[1,[28,[\"timeRange\",\"time\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"timeRange\"]},null],[0,\"                        \"],[14],[0,\"\\n                        \"],[11,\"br\",[]],[13],[14],[0,\"\\n                    \"],[14],[0,\"\\n            \"],[14],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group sec-width dInBlck\"],[13],[0,\"\\n                \"],[11,\"label\",[]],[15,\"class\",\"cbs-mandatory\"],[13],[0,\"Select Spot\"],[14],[0,\"\\n                \"],[11,\"br\",[]],[13],[14],[11,\"br\",[]],[13],[14],[0,\"\\n                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-fields\"],[13],[0,\"\\n\"],[0,\"                        \"],[11,\"input\",[]],[15,\"type\",\"radio\"],[15,\"class\",\"custom-radio\"],[15,\"value\",\"true\"],[15,\"name\",\"pickup\"],[13],[14],[0,\"\\n                        \"],[11,\"label\",[]],[13],[0,\"Home\"],[14],[0,\"\\n                        \"],[11,\"input\",[]],[15,\"type\",\"radio\"],[15,\"class\",\"custom-radio\"],[15,\"value\",\"false\"],[15,\"name\",\"pickup\"],[13],[14],[0,\"\\n                        \"],[11,\"label\",[]],[13],[0,\"Office\"],[14],[0,\"\\n\\n                    \"],[14],[0,\"\\n            \"],[14],[0,\"\\n       \\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-section sec-width\"],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group sec-width\"],[13],[0,\"\\n                \"],[11,\"label\",[]],[15,\"class\",\"cbs-mandatory\"],[13],[0,\" \"],[14],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"cbs-fields\"],[13],[0,\"\\n                    \"],[11,\"button\",[]],[15,\"class\",\"cbs-button primary-btn mT5\"],[5,[\"action\"],[[28,[null]],\"doBooking\"]],[13],[0,\"BOOK\"],[14],[0,\"\\n                \"],[14],[0,\"\\n            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"invalidBookingMessage\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"\\n    \"],[11,\"h3\",[]],[13],[0,\"Bookings\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"cbs-scrollable-div mT25 dInBlck\"],[13],[0,\"\\n\\n        \"],[11,\"table\",[]],[15,\"class\",\"content-table\"],[13],[0,\"\\n\\n        \"],[11,\"thead\",[]],[13],[0,\"\\n            \"],[11,\"tr\",[]],[13],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"TRIP ID\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"DRIVER ID\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"DRIVER NAME\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"BOOKED TIME\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"MOBILE NUM\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[14],[0,\"\\n            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"\\n        \"],[11,\"tbody\",[]],[13],[0,\"\\n            \"],[11,\"tr\",[]],[13],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"booking\",\"tripId\"]],false],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"booking\",\"driverId\"]],false],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"booking\",\"name\"]],false],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"booking\",\"bookedTime\"]],false],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"booking\",\"phnNum\"]],false],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"cancelBooking\",[28,[\"booking\"]]]],[13],[0,\"CANCEL\"],[14],[14],[0,\"\\n            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n\\n\"]],\"locals\":[\"booking\"]},null],[0,\"\\n        \"],[14],[0,\"\\n\\n    \"],[14],[0,\"\\n\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[14],[0,\"\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "cab-booking-application/templates/bookings.hbs" } });
});
define("cab-booking-application/templates/components/nav-pane", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "thoRU0YR", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"cbs-nav-bar\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"zoho-logo left\"],[13],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"cbs-title-bar\"],[13],[0,\"\\n            Cabs\\n        \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"cbs-nave-pane\"],[13],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"isAdmin\"]]],null,{\"statements\":[[0,\"        \"],[6,[\"link-to\"],[\"history\"],null,{\"statements\":[[11,\"div\",[]],[16,\"class\",[34,[\"pane-options \",[33,[\"if\"],[[28,[\"paneOption_1\"]],\"active\"],null],\" mT100\"]]],[5,[\"action\"],[[28,[null]],\"selectPaneOption\",\"paneOption_1\"]],[13],[0,\"Report\"],[14]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"link-to\"],[\"drivers\"],null,{\"statements\":[[11,\"div\",[]],[16,\"class\",[34,[\"pane-options \",[33,[\"if\"],[[28,[\"paneOption_2\"]],\"active\"],null]]]],[5,[\"action\"],[[28,[null]],\"selectPaneOption\",\"paneOption_2\"]],[13],[0,\"Drivers\"],[14]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"link-to\"],[\"routes\"],null,{\"statements\":[[11,\"div\",[]],[16,\"class\",[34,[\"pane-options \",[33,[\"if\"],[[28,[\"paneOption_3\"]],\"active\"],null]]]],[5,[\"action\"],[[28,[null]],\"selectPaneOption\",\"paneOption_3\"]],[13],[0,\"Routes \"],[14]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"link-to\"],[\"locations\"],null,{\"statements\":[[11,\"div\",[]],[16,\"class\",[34,[\"pane-options \",[33,[\"if\"],[[28,[\"paneOption_4\"]],\"active\"],null]]]],[5,[\"action\"],[[28,[null]],\"selectPaneOption\",\"paneOption_4\"]],[13],[0,\"Locations\"],[14]],\"locals\":[]},null],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isUser\"]]],null,{\"statements\":[[0,\"        \"],[6,[\"link-to\"],[\"bookings\"],null,{\"statements\":[[11,\"div\",[]],[16,\"class\",[34,[\"pane-options \",[33,[\"if\"],[[28,[\"paneOption_1\"]],\"active\"],null],\" mT100\"]]],[5,[\"action\"],[[28,[null]],\"selectPaneOption\",\"paneOption_1\"]],[13],[0,\"Bookings\"],[14]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"link-to\"],[\"history\"],null,{\"statements\":[[11,\"div\",[]],[16,\"class\",[34,[\"pane-options \",[33,[\"if\"],[[28,[\"paneOption_2\"]],\"active\"],null]]]],[5,[\"action\"],[[28,[null]],\"selectPaneOption\",\"paneOption_2\"]],[13],[0,\"History\"],[14]],\"locals\":[]},null],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"isDriver\"]]],null,{\"statements\":[[0,\"        \"],[6,[\"link-to\"],[\"trips\"],null,{\"statements\":[[11,\"div\",[]],[16,\"class\",[34,[\"pane-options  \",[33,[\"if\"],[[28,[\"paneOption_1\"]],\"active\"],null],\" mT100\"]]],[5,[\"action\"],[[28,[null]],\"selectPaneOption\",\"paneOption_1\"]],[13],[0,\"My Trips\"],[14]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"link-to\"],[\"history\"],null,{\"statements\":[[11,\"div\",[]],[16,\"class\",[34,[\"pane-options \",[33,[\"if\"],[[28,[\"paneOption_2\"]],\"active\"],null]]]],[5,[\"action\"],[[28,[null]],\"selectPaneOption\",\"paneOption_2\"]],[13],[0,\"History\"],[14]],\"locals\":[]},null],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n     \"],[11,\"a\",[]],[13],[11,\"div\",[]],[15,\"class\",\"pane-options\"],[5,[\"action\"],[[28,[null]],\"logout\"]],[13],[0,\"Logout\"],[14],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "cab-booking-application/templates/components/nav-pane.hbs" } });
});
define("cab-booking-application/templates/drivers", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ZLSQuFGO", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"cbs-sub-body\"],[13],[0,\"\\n \\n\\n            \"],[11,\"select\",[]],[15,\"class\",\"cbs-button mLP mLP65\"],[13],[0,\"\\n\\n\"],[0,\"        \"],[11,\"option\",[]],[5,[\"action\"],[[28,[null]],\"toggleActivatedDriverList\"]],[13],[0,\"ACTIVATED DRIVERS\"],[14],[0,\"\\n\"],[0,\"          \"],[11,\"option\",[]],[15,\"class\",\"cbs-button \"],[5,[\"action\"],[[28,[null]],\"toggleDeactivatedDriverList\"]],[13],[0,\"DEACTIVATED DRIVERS\"],[14],[0,\"\\n\"],[0,\"        \"],[11,\"option\",[]],[15,\"class\",\"cbs-button \"],[5,[\"action\"],[[28,[null]],\"toggleApproval\"]],[13],[0,\" APPROVE DRIVERS\"],[14],[0,\"\\n\"],[0,\"  \"],[14],[0,\"\\n    \\n\\n\\n  \\n\"],[0,\"   \\n\"],[6,[\"if\"],[[28,[\"modelLength\"]]],null,{\"statements\":[[11,\"div\",[]],[15,\"class\",\"cbs-scrollable-div dInBlck\"],[13],[0,\"\\n\\n\\n\\n\"],[11,\"table\",[]],[15,\"class\",\"content-table\"],[13],[0,\"\\n    \"],[11,\"thead\",[]],[13],[0,\"\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"DRIVER ID\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"EMAIL\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"NAME\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"LOCATION\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"SHIFT\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"\\n\"],[6,[\"if\"],[[28,[\"driver\",\"canDisplay\"]]],null,{\"statements\":[[0,\"\\n                \"],[11,\"tr\",[]],[13],[0,\"\\n                    \"],[11,\"td\",[]],[13],[1,[28,[\"driver\",\"driverId\"]],false],[14],[0,\"\\n                    \"],[11,\"td\",[]],[13],[1,[28,[\"driver\",\"email\"]],false],[14],[0,\"\\n                    \"],[11,\"td\",[]],[13],[1,[28,[\"driver\",\"name\"]],false],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"showUnApprovedDrivers\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"td\",[]],[13],[0,\"\\n                        \"],[11,\"select\",[]],[15,\"class\",\"cbs-button\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"locations\"]]],null,{\"statements\":[[6,[\"unless\"],[[28,[\"location\",\"isBranch\"]]],null,{\"statements\":[[0,\"                                    \"],[11,\"option\",[]],[16,\"value\",[28,[\"location\",\"locationId\"]],null],[5,[\"action\"],[[28,[null]],\"addDriverLocation\",[28,[\"location\"]]]],[13],[1,[28,[\"location\",\"locationName\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"location\"]},null],[0,\"                        \"],[14],[0,\"\\n                    \"],[14],[0,\"\\n                    \"],[11,\"td\",[]],[13],[0,\"\\n                        \"],[11,\"select\",[]],[15,\"class\",\"cbs-button\"],[13],[0,\"\\n                            \"],[11,\"option\",[]],[5,[\"action\"],[[28,[null]],\"addDriverShift\",\"0\"]],[13],[0,\"Morning\"],[14],[0,\"\\n                            \"],[11,\"option\",[]],[5,[\"action\"],[[28,[null]],\"addDriverShift\",\"1\"]],[13],[0,\"Noon\"],[14],[0,\"\\n                            \"],[11,\"option\",[]],[5,[\"action\"],[[28,[null]],\"addDriverShift\",\"2\"]],[13],[0,\"Evening\"],[14],[0,\"\\n                            \"],[11,\"option\",[]],[5,[\"action\"],[[28,[null]],\"addDriverShift\",\"3\"]],[13],[0,\"Night\"],[14],[0,\"\\n                        \"],[14],[0,\"\\n                    \"],[14],[0,\"\\n                    \"],[11,\"td\",[]],[13],[11,\"button\",[]],[15,\"class\",\"cbs-button primary-btn\"],[5,[\"action\"],[[28,[null]],\"updateDriverFields\",[28,[\"driver\"]]]],[13],[0,\"APPROVE\"],[14],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"showActivatedDrivers\"]]],null,{\"statements\":[[6,[\"if\"],[[28,[\"driver\",\"isEditable\"]]],null,{\"statements\":[[0,\"\\n                                \"],[11,\"td\",[]],[13],[0,\"\\n                                \"],[11,\"select\",[]],[15,\"class\",\"cbs-button\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"locations\"]]],null,{\"statements\":[[6,[\"unless\"],[[28,[\"location\",\"isBranch\"]]],null,{\"statements\":[[0,\"                                        \"],[11,\"option\",[]],[16,\"value\",[28,[\"location\",\"locationId\"]],null],[5,[\"action\"],[[28,[null]],\"addDriverLocation\",[28,[\"location\"]]]],[13],[1,[28,[\"location\",\"locationName\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"location\"]},null],[0,\"                                \"],[14],[0,\"\\n                                \"],[14],[0,\"\\n\\n                                 \"],[11,\"td\",[]],[13],[0,\"\\n                                    \"],[11,\"select\",[]],[15,\"class\",\"cbs-button\"],[13],[0,\"\\n                                    \"],[11,\"option\",[]],[5,[\"action\"],[[28,[null]],\"addDriverShift\",\"0\"]],[13],[0,\"Morning\"],[14],[0,\"\\n                                    \"],[11,\"option\",[]],[5,[\"action\"],[[28,[null]],\"addDriverShift\",\"1\"]],[13],[0,\"Noon\"],[14],[0,\"\\n                                    \"],[11,\"option\",[]],[5,[\"action\"],[[28,[null]],\"addDriverShift\",\"2\"]],[13],[0,\"Evening\"],[14],[0,\"\\n                                    \"],[11,\"option\",[]],[5,[\"action\"],[[28,[null]],\"addDriverShift\",\"3\"]],[13],[0,\"Night\"],[14],[0,\"\\n                                \"],[14],[0,\"\\n                                \"],[14],[0,\"\\n\\n                                \"],[11,\"td\",[]],[13],[0,\" \\n                                 \"],[11,\"button\",[]],[15,\"class\",\"cbs-button primary-btn\"],[5,[\"action\"],[[28,[null]],\"updateDriverFields\",[28,[\"driver\"]]]],[13],[0,\"SUBMIT\"],[14],[0,\"\\n                                \"],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"toggleUpdateFields\"]],[13],[0,\"CANCEL\"],[14],[0,\"\\n                                \"],[14],[0,\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[0,\"\\n                                \"],[11,\"td\",[]],[13],[1,[28,[\"driver\",\"locationName\"]],false],[14],[0,\"\\n                                \"],[11,\"td\",[]],[13],[1,[33,[\"shiftlabel\"],[[28,[\"driver\",\"shift\"]]],null],false],[14],[0,\"\\n                                \\n                                \"],[11,\"td\",[]],[13],[0,\"\\n                               \\n                                \"],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"updateDriverStatus\",[28,[\"driver\"]]]],[13],[0,\"DEACTIVATE\"],[14],[0,\"\\n                                \"],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"toggleUpdateFields\",[28,[\"driver\",\"driverId\"]]]],[13],[0,\"EDIT\"],[14],[0,\"\\n    \\n                                \"],[14],[0,\"\\n\\n                    \\n\"]],\"locals\":[]}],[0,\"                     \\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"showDeactivatedDrivers\"]]],null,{\"statements\":[[0,\"                        \"],[11,\"td\",[]],[13],[1,[28,[\"driver\",\"locationName\"]],false],[14],[0,\"\\n                        \"],[11,\"td\",[]],[13],[1,[33,[\"shiftlabel\"],[[28,[\"driver\",\"shift\"]]],null],false],[14],[0,\"\\n                        \"],[11,\"td\",[]],[13],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"updateDriverStatus\",[28,[\"driver\"]]]],[13],[0,\"ACTIVATE\"],[14],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"                \"],[14],[0,\"\\n\\n\"]],\"locals\":[]},null]],\"locals\":[\"driver\"]},null],[0,\"\\n    \\n\\n\\n\\n\\n\\n\\n\\n\\n    \"],[14],[0,\"\\n\\n   \"],[14],[0,\"\\n\\n   \"],[14],[0,\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"cbs-notify-img\"],[13],[0,\"\\n\\n \"],[11,\"img\",[]],[15,\"src\",\"/CabBookingApplication/assets/ember-builds/assets/images/nodata.png\"],[13],[14],[0,\"  \\n\\n \"],[14],[0,\"\\n\\n\"]],\"locals\":[]}],[0,\"\\n\\n\\n\\n\\n\\n\\n\"],[14],[0,\"\\n\\n\\n\\n\\n\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "cab-booking-application/templates/drivers.hbs" } });
});
define("cab-booking-application/templates/history", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "UUqjKFmy", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"cbs-sub-body third\"],[13],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"isAdmin\"]]],null,{\"statements\":[[0,\"    \"],[11,\"h1\",[]],[13],[0,\" Employees Cab Report\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"model\"]]],null,{\"statements\":[[11,\"div\",[]],[15,\"class\",\"cbs-scrollable-div dInBlck\"],[13],[0,\"\\n\"],[11,\"table\",[]],[15,\"class\",\"content-table\"],[13],[0,\"\\n        \"],[11,\"thead\",[]],[13],[0,\"\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"TRIP ID\"],[14],[0,\"\\n\"],[6,[\"unless\"],[[28,[\"isDriver\"]]],null,{\"statements\":[[0,\"        \"],[11,\"th\",[]],[13],[0,\"DRIVER ID\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"DRIVER NAME\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"unless\"],[[28,[\"isUser\"]]],null,{\"statements\":[[0,\"        \"],[11,\"th\",[]],[13],[0,\"USER ID\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"USER NAME\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[11,\"th\",[]],[13],[0,\"BOOKED TIME\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"OPERATION TIME\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"PICKUP LOCATION\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"DROP LOCATION\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"STATUS\"],[14],[0,\"\\n    \"],[14],[0,\"\\n        \"],[14],[0,\"\\n \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"td\",[]],[13],[1,[28,[\"history\",\"tripId\"]],false],[14],[0,\"\\n\"],[6,[\"unless\"],[[28,[\"isDriver\"]]],null,{\"statements\":[[0,\"        \"],[11,\"td\",[]],[13],[1,[28,[\"history\",\"driverId\"]],false],[14],[0,\"\\n        \"],[11,\"td\",[]],[13],[1,[28,[\"history\",\"drivername\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"unless\"],[[28,[\"isUser\"]]],null,{\"statements\":[[0,\"        \"],[11,\"td\",[]],[13],[1,[28,[\"history\",\"userId\"]],false],[14],[0,\"\\n        \"],[11,\"td\",[]],[13],[1,[28,[\"history\",\"username\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"        \"],[11,\"td\",[]],[13],[1,[28,[\"history\",\"bookedTime\"]],false],[14],[0,\"\\n        \"],[11,\"td\",[]],[13],[1,[28,[\"history\",\"modifiedTime\"]],false],[14],[0,\"\\n        \"],[11,\"td\",[]],[13],[1,[28,[\"history\",\"pickupLocation\"]],false],[14],[0,\"\\n        \"],[11,\"td\",[]],[13],[1,[28,[\"history\",\"dropLocation\"]],false],[14],[0,\"\\n        \"],[11,\"td\",[]],[13],[1,[33,[\"statuslabel\"],[[28,[\"history\",\"status\"]]],null],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"history\"]},null],[0,\" \"],[14],[0,\"\\n  \\n\"],[14],[0,\"\\n\\n\\n\"],[14],[0,\"\\n\\n\\n\"]],\"locals\":[]},{\"statements\":[[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"cbs-notify-img\"],[13],[0,\"\\n\\n \"],[11,\"img\",[]],[15,\"src\",\"/CabBookingApplication/assets/ember-builds/assets/images/nodata.png\"],[13],[14],[0,\"  \\n\\n \"],[14],[0,\"\\n\"]],\"locals\":[]}],[14],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "cab-booking-application/templates/history.hbs" } });
});
define("cab-booking-application/templates/locations", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "qpFGV4Bu", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"cbs-sub-body sec dFlex\"],[13],[0,\"\\n\\n\"],[11,\"div\",[]],[13],[0,\"\\n\\n\\n\"],[11,\"button\",[]],[15,\"class\",\"cbs-button mLP65\"],[5,[\"action\"],[[28,[null]],\"toggleLocationList\"]],[13],[6,[\"if\"],[[28,[\"showDeactivatedLocations\"]]],null,{\"statements\":[[0,\"DEACTIVATED\"]],\"locals\":[]},{\"statements\":[[0,\"ACTIVATED\"]],\"locals\":[]}],[14],[0,\"\\n\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"cbs-scrollable-div\"],[13],[0,\"\\n      \"],[11,\"table\",[]],[15,\"class\",\"content-table\"],[13],[0,\"\\n  \"],[11,\"thead\",[]],[13],[0,\"\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n        \"],[11,\"th\",[]],[13],[0,\"NAME\"],[14],[0,\"\\n        \"],[11,\"th\",[]],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"tbody\",[]],[13],[0,\"\\n      \\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"         \\n\"],[6,[\"if\"],[[28,[\"showDeactivatedLocations\"]]],null,{\"statements\":[[0,\"\\n\"],[6,[\"if\"],[[28,[\"location\",\"isActive\"]]],null,{\"statements\":[[6,[\"unless\"],[[28,[\"location\",\"isBranch\"]]],null,{\"statements\":[[0,\"          \"],[11,\"tr\",[]],[13],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"location\",\"locationName\"]],false],[14],[0,\"\\n            \\n            \"],[11,\"td\",[]],[13],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"updateLocation\",[28,[\"location\"]]]],[13],[0,\"DEACTIVATE\"],[14],[14],[0,\"\\n          \\n          \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]},null],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[6,[\"unless\"],[[28,[\"location\",\"isActive\"]]],null,{\"statements\":[[0,\"          \"],[11,\"tr\",[]],[13],[0,\"\\n          \"],[11,\"td\",[]],[13],[1,[28,[\"location\",\"locationName\"]],false],[14],[0,\"\\n\\n          \"],[11,\"td\",[]],[13],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"updateLocation\",[28,[\"location\"]]]],[13],[0,\"ACTIVATE\"],[14],[14],[0,\"\\n\\n          \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]}],[0,\"   \\n\"]],\"locals\":[\"location\"]},null],[0,\"  \"],[14],[0,\"\\n\\n\\n\"],[14],[0,\"\\n\\n\"],[14],[0,\"\\n\\n\"],[14],[0,\"\\n\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"mL100\"],[13],[0,\"\\n\"],[6,[\"unless\"],[[28,[\"showCreateLocations\"]]],null,{\"statements\":[[0,\"  \"],[11,\"button\",[]],[15,\"class\",\"cbs-button primary-btn\"],[5,[\"action\"],[[28,[null]],\"toggleCreateLocation\"]],[13],[0,\"ADD LOCATION\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[11,\"br\",[]],[13],[14],[11,\"br\",[]],[13],[14],[11,\"br\",[]],[13],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"locationNullMessage\"]]],null,{\"statements\":[[0,\"  \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"locationNullMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"nameError\"]]],null,{\"statements\":[[0,\"             \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"nameError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\" \"],[11,\"br\",[]],[13],[14],[11,\"br\",[]],[13],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"showCreateLocations\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[11,\"div\",[]],[15,\"class\",\"cbs-field-section\"],[13],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[11,\"label\",[]],[15,\"class\",\"cbs-mandatory\"],[13],[0,\"Location Name\"],[14],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[11,\"div\",[]],[15,\"class\",\"cbs-fields\"],[13],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t      \"],[1,[33,[\"input\"],null,[[\"value\",\"class\"],[[28,[\"locationName\"]],\"cbs-text-field\"]]],false],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[14],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[14],[0,\"\\n\\n\\t\\t\\t\\t\\t\"],[14],[0,\"\\n\\t\\t\\t\\t\\t\\n\\n\\t\\t\\t\\t\\t\\t\"],[11,\"button\",[]],[15,\"class\",\"cbs-button primary-btn\"],[5,[\"action\"],[[28,[null]],\"createLocation\"]],[13],[0,\" CREATE \"],[14],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"toggleCreateLocation\"]],[13],[0,\" CANCEL \"],[14],[0,\"\\n\\n\\n\\t\\t\\n\\n\"]],\"locals\":[]},null],[0,\"\\n\\n\"],[14],[0,\"\\n\\n\\n\\n\"],[14],[0,\"\\n\\n\\n\\n \\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "cab-booking-application/templates/locations.hbs" } });
});
define("cab-booking-application/templates/login", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "mnfIppFe", "block": "{\"statements\":[[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"cbs-bg\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"cbs-auth-container\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"cbs-auth-card\"],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"cbs-auth-box\"],[13],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"head\"],[13],[0,\"\\n                    \\n                    \"],[11,\"div\",[]],[15,\"class\",\"zoho-logo\"],[13],[0,\"\\n                    \"],[14],[0,\"\\n                    \"],[11,\"div\",[]],[15,\"class\",\"signin_head\"],[13],[0,\"\\n                        \"],[11,\"span\",[]],[13],[0,\"Sign in\"],[14],[0,\"\\n                        \"],[11,\"div\",[]],[15,\"class\",\"service_name\"],[13],[0,\"to access \"],[11,\"span\",[]],[13],[0,\"ZCabs\"],[14],[14],[0,\"\\n                    \"],[14],[0,\"\\n                \"],[14],[0,\"\\n\\n                \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n                    \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"required\"],[\"text\",[28,[\"email\"]],\"cbs-field-input\",\"true\"]]],false],[0,\"\\n                    \"],[11,\"label\",[]],[15,\"class\",\"cbs-field-label\"],[13],[0,\"Email\"],[14],[0,\"\\n                \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"emailNullMessage\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"emailNullMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"emailError\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"emailError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n                    \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"required\"],[\"password\",[28,[\"password\"]],\"cbs-field-input\",\"true\"]]],false],[0,\"\\n                      \"],[11,\"label\",[]],[15,\"class\",\"cbs-field-label\"],[13],[0,\"Password\"],[14],[0,\"\\n                \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"passwordNullMessage\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"passwordNullMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n                    \"],[11,\"button\",[]],[15,\"class\",\"btn blue\"],[5,[\"action\"],[[28,[null]],\"authenticate\"]],[13],[0,\"LOGIN\"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"invalidLoginMessage\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"invalidLoginMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"                \"],[14],[0,\"\\n               \\n                \"],[11,\"div\",[]],[15,\"class\",\"line\"],[13],[0,\"\\n\\t\\t    \\t\\t\\t\"],[11,\"span\",[]],[15,\"class\",\"line_con\"],[13],[14],[0,\"\\n\\t    \\t\\t\"],[14],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"signup_link\"],[13],[0,\"Don't have a Zoho account?  \"],[6,[\"link-to\"],[\"register\"],null,{\"statements\":[[11,\"a\",[]],[13],[0,\"Sign Up Now\"],[14]],\"locals\":[]},null],[14],[0,\"\\n            \"],[14],[0,\"\\n                      \\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n\"],[14],[0,\"\\n    \\n\\t\\t\\t    \\t\\t\\t\\t\\n\\t\\t\\t\\t\\t\\t\\t\\t\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "cab-booking-application/templates/login.hbs" } });
});
define("cab-booking-application/templates/register", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "JRp7LxNE", "block": "{\"statements\":[[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"cbs-bg\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"cbs-auth-container\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"cbs-auth-card half\"],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"cbs-auth-box\"],[13],[0,\"\\n              \"],[11,\"div\",[]],[15,\"class\",\"head\"],[13],[0,\"\\n                    \\n                    \"],[11,\"div\",[]],[15,\"class\",\"zoho-logo\"],[13],[0,\"\\n                    \"],[14],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"signin_head\"],[13],[0,\"\\n                    \"],[11,\"span\",[]],[13],[0,\"Create New Account\"],[14],[0,\"\\n\\t\\t\\t\\t        \"],[14],[0,\"\\n                \"],[14],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n                    \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"required\"],[\"email\",[28,[\"email\"]],\"cbs-field-input\",\"true\"]]],false],[0,\"\\n                    \"],[11,\"label\",[]],[15,\"class\",\"cbs-field-label\"],[13],[0,\"Email\"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"emailNullMessage\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"emailNullMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[28,[\"emailError\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"emailError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n                    \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"required\"],[\"password\",[28,[\"password\"]],\"cbs-field-input\",\"true\"]]],false],[0,\"\\n                      \"],[11,\"label\",[]],[15,\"class\",\"cbs-field-label\"],[13],[0,\"Password\"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"passwordNullMessage\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"passwordNullMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"                \\n                \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n                    \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"required\"],[\"text\",[28,[\"name\"]],\"cbs-field-input\",\"true\"]]],false],[0,\"\\n                    \"],[11,\"label\",[]],[15,\"class\",\"cbs-field-label\"],[13],[0,\"Name\"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"nameNullMessage\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"nameNullMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[28,[\"nameError\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"nameError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n                    \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"required\"],[\"tel\",[28,[\"phnNum\"]],\"cbs-field-input\",\"true\"]]],false],[0,\"\\n                    \"],[11,\"label\",[]],[15,\"class\",\"cbs-field-label\"],[13],[0,\"Mobile Number\"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"phnNumNullMessage\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"phnNumNullMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[28,[\"phnNumError\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"phnNumError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"showTypeFields\"]]],null,{\"statements\":[[0,\"                \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n                  \"],[11,\"select\",[]],[15,\"class\",\"cbs-field-input\"],[13],[0,\"\\n                    \"],[11,\"option\",[]],[5,[\"action\"],[[28,[null]],\"getUserType\",\"1\"]],[13],[0,\"User\"],[14],[0,\"\\n                    \"],[11,\"option\",[]],[5,[\"action\"],[[28,[null]],\"getUserType\",\"2\"]],[13],[0,\"Driver\"],[14],[0,\"\\n                  \"],[14],[0,\"\\n                    \\n                    \"],[11,\"label\",[]],[15,\"class\",\"cbs-field-label\"],[13],[0,\"User Type\"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[28,[\"userTypeNullMessage\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"userTypeNullMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"showLocationFields\"]]],null,{\"statements\":[[0,\"          \\n                \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group dFlex\"],[13],[0,\"\\n                  \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group half\"],[13],[0,\"\\n                    \"],[11,\"div\",[]],[15,\"class\",\"mR10\"],[13],[0,\"\\n\\n                      \"],[11,\"select\",[]],[15,\"class\",\"cbs-field-input\"],[13],[0,\"\\n\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[6,[\"if\"],[[28,[\"location\",\"isBranch\"]]],null,{\"statements\":[[0,\"                      \"],[11,\"option\",[]],[15,\"class\",\"cbs-field-input\"],[16,\"value\",[28,[\"location\",\"locationId\"]],null],[5,[\"action\"],[[28,[null]],\"addBranch\",[28,[\"location\",\"locationId\"]]]],[13],[1,[28,[\"location\",\"locationName\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"location\"]},null],[0,\"\\n                      \"],[14],[0,\"\\n                      \\n                      \"],[11,\"label\",[]],[15,\"class\",\"cbs-field-label\"],[13],[0,\"Branch\"],[14],[0,\"\\n                    \"],[14],[0,\"\\n                  \"],[14],[0,\"\\n\\n                  \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group half\"],[13],[0,\"\\n                   \"],[11,\"select\",[]],[15,\"class\",\"cbs-field-input\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[6,[\"unless\"],[[28,[\"location\",\"isBranch\"]]],null,{\"statements\":[[0,\"                      \"],[11,\"option\",[]],[15,\"class\",\"cbs-field-input\"],[16,\"value\",[28,[\"location\",\"locationId\"]],null],[5,[\"action\"],[[28,[null]],\"addHome\",[28,[\"location\",\"locationId\"]]]],[13],[1,[28,[\"location\",\"locationName\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"location\"]},null],[0,\"                    \"],[14],[0,\"\\n                    \"],[11,\"label\",[]],[15,\"class\",\"cbs-field-label\"],[13],[0,\"Home\"],[14],[0,\"\\n                  \"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"branchNullMessage\"]]],null,{\"statements\":[[0,\"                        \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"branchNullMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[28,[\"homeNullMessage\"]]],null,{\"statements\":[[0,\"                        \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"homeNullMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[]},null],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n                    \"],[11,\"button\",[]],[15,\"class\",\"btn blue\"],[5,[\"action\"],[[28,[null]],\"register\"]],[13],[0,\"REGISTER\"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"invalidRegisterMessage\"]]],null,{\"statements\":[[0,\"                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"invalidRegisterMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"                \"],[14],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"line\"],[13],[0,\"\\n\\t\\t    \\t\\t\\t  \"],[11,\"span\",[]],[15,\"class\",\"line_con\"],[13],[14],[0,\"\\n\\t    \\t\\t      \"],[14],[0,\"\\n                \"],[11,\"div\",[]],[15,\"class\",\"signup_link\"],[13],[0,\"Already Having an account? \"],[6,[\"link-to\"],[\"login\"],null,{\"statements\":[[11,\"a\",[]],[13],[0,\"Sign In\"],[14]],\"locals\":[]},null],[14],[0,\"\\n            \"],[14],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n\"],[14],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "cab-booking-application/templates/register.hbs" } });
});
define("cab-booking-application/templates/routes", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "X6RfDPAZ", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"cbs-sub-body dFlex\"],[13],[0,\"\\n\\n\"],[11,\"div\",[]],[13],[0,\"\\n         \"],[11,\"button\",[]],[15,\"class\",\"cbs-button primary-btn mLP65\"],[5,[\"action\"],[[28,[null]],\"toggleCreateRoute\"]],[13],[0,\"ADD ROUTE\"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"cbs-scrollable-div\"],[13],[0,\"\\n\\n\\n        \"],[11,\"table\",[]],[15,\"class\",\"content-table\"],[13],[0,\"\\n            \"],[11,\"thead\",[]],[13],[0,\"\\n            \"],[11,\"tr\",[]],[13],[0,\"\\n                \"],[11,\"th\",[]],[13],[0,\"ROUTE NAME\"],[14],[0,\"\\n                 \"],[11,\"th\",[]],[13],[14],[0,\"\\n            \"],[14],[0,\"\\n            \"],[14],[0,\"\\n\\n            \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"            \"],[11,\"tr\",[]],[13],[0,\"\\n                \"],[11,\"td\",[]],[13],[1,[28,[\"route\",\"routeName\"]],false],[14],[0,\"\\n                \"],[11,\"td\",[]],[13],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"getStops\",[28,[\"route\"]]]],[13],[0,\"VIEW STOPS\"],[14],[14],[0,\"\\n            \"],[14],[0,\"\\n\"]],\"locals\":[\"route\"]},null],[0,\"            \"],[14],[0,\"\\n\\n        \"],[14],[0,\"\\n\\n    \"],[14],[0,\"\\n\\n\"],[14],[0,\"\\n\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"mL100\"],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"routeNullMessage\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"routeNullMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"nameError\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"cbs-error-message\"],[13],[1,[26,[\"nameError\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \\n\"],[11,\"br\",[]],[13],[14],[0,\"\\n\"],[11,\"br\",[]],[13],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"showCreateRoute\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-section\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n            \"],[11,\"label\",[]],[15,\"class\",\"cbs-mandatory\"],[13],[0,\"Route Name\"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"cbs-fields\"],[13],[0,\"\\n            \"],[1,[33,[\"input\"],null,[[\"value\",\"class\"],[[28,[\"routeName\"]],\"cbs-text-field\"]]],false],[0,\"\\n        \"],[14],[0,\"\\n\\n        \"],[14],[0,\"\\n            \\n    \"],[14],[0,\"\\n\\n\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-section\"],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n                \"],[11,\"label\",[]],[15,\"class\",\"cbs-mandatory\"],[13],[11,\"b\",[]],[13],[0,\"Select Branch :\"],[14],[14],[0,\"\\n                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-fields overflow\"],[13],[0,\"\\n          \\n\"],[6,[\"each\"],[[28,[\"locations\"]]],null,{\"statements\":[[6,[\"if\"],[[28,[\"location\",\"isBranch\"]]],null,{\"statements\":[[0,\"                            \"],[11,\"ul\",[]],[13],[0,\"\\n                                \"],[11,\"li\",[]],[13],[0,\"   \\n                                \"],[11,\"input\",[]],[15,\"type\",\"checkbox\"],[16,\"value\",[28,[\"location\",\"locationId\"]],null],[15,\"name\",\"branches\"],[13],[14],[0,\"\\n                                \"],[1,[28,[\"location\",\"locationName\"]],false],[0,\"\\n                                \"],[14],[0,\"\\n                            \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"location\"]},null],[0,\"\\n                    \"],[14],[0,\"\\n            \"],[14],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"cbs-field-group\"],[13],[0,\"\\n                \"],[11,\"label\",[]],[15,\"class\",\"cbs-mandatory\"],[13],[11,\"b\",[]],[13],[0,\"Select Locations :\"],[14],[14],[0,\"\\n                    \"],[11,\"div\",[]],[15,\"class\",\"cbs-fields overflow\"],[13],[0,\"\\n          \\n\"],[6,[\"each\"],[[28,[\"locations\"]]],null,{\"statements\":[[6,[\"unless\"],[[28,[\"location\",\"isBranch\"]]],null,{\"statements\":[[0,\"                            \"],[11,\"ul\",[]],[13],[0,\"\\n                                \"],[11,\"li\",[]],[13],[0,\"   \\n                                \"],[11,\"input\",[]],[15,\"type\",\"checkbox\"],[16,\"value\",[28,[\"location\",\"locationId\"]],null],[15,\"name\",\"locations\"],[13],[14],[0,\"\\n                                \"],[1,[28,[\"location\",\"locationName\"]],false],[0,\"\\n                                \"],[14],[0,\"\\n                            \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"location\"]},null],[0,\"\\n                    \"],[14],[0,\"\\n            \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n\\n    \"],[11,\"button\",[]],[15,\"class\",\"cbs-button primary-btn mR20\"],[5,[\"action\"],[[28,[null]],\"createRoute\"]],[13],[0,\" CREATE \"],[14],[0,\"\\n    \"],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"toggleAll\"]],[13],[0,\" CANCEL \"],[14],[0,\"\\n\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"showStopList\"]]],null,{\"statements\":[[0,\"\\n\\n    \"],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"toggleAll\"]],[13],[0,\"CLOSE\"],[14],[0,\"\\n\\n        \"],[11,\"div\",[]],[15,\"class\",\"cbs-scrollable-div\"],[13],[0,\"\\n\\n\\n        \"],[11,\"table\",[]],[15,\"class\",\"content-table\"],[13],[0,\"\\n            \"],[11,\"thead\",[]],[13],[0,\"\\n            \"],[11,\"tr\",[]],[13],[0,\"\\n                \"],[11,\"th\",[]],[13],[0,\"STOPS\"],[14],[0,\"\\n            \"],[14],[0,\"\\n            \"],[14],[0,\"\\n\\n            \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"locationList\"]]],null,{\"statements\":[[0,\"            \"],[11,\"tr\",[]],[13],[0,\"\\n                \"],[11,\"td\",[]],[13],[1,[28,[\"stops\",\"locationName\"]],false],[14],[0,\"\\n            \"],[14],[0,\"\\n\"]],\"locals\":[\"stops\"]},null],[0,\"            \"],[14],[0,\"\\n\\n        \"],[14],[0,\"\\n\\n    \"],[14],[0,\"\\n    \\n\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[14],[0,\"\\n\\n\\n \\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "cab-booking-application/templates/routes.hbs" } });
});
define("cab-booking-application/templates/trips", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "bR+UoGxa", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"cbs-sub-body\"],[13],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"showAllTrips\"]]],null,{\"statements\":[[0,\"\\n\"],[6,[\"if\"],[[28,[\"model\"]]],null,{\"statements\":[[11,\"div\",[]],[15,\"class\",\"cbs-scrollable-div dInBlck\"],[13],[0,\"\\n\\n\"],[11,\"table\",[]],[15,\"class\",\"content-table\"],[13],[0,\"\\n    \"],[11,\"thead\",[]],[13],[0,\"\\n        \"],[11,\"tr\",[]],[13],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"TRIP ID\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"TRIP SLOT\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"STOP\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[14],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"tbody\",[]],[13],[0,\"\\n\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"        \"],[11,\"tr\",[]],[13],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"trip\",\"tripId\"]],false],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"trip\",\"bookedTime\"]],false],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"trip\",\"isPickup\"]]],null,{\"statements\":[[0,\"            \"],[11,\"td\",[]],[13],[0,\"Home\"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"            \"],[11,\"td\",[]],[13],[0,\"Office\"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"            \"],[11,\"td\",[]],[13],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"getCurrTrip\",[28,[\"trip\"]]]],[13],[0,\"VIEW\"],[14],[14],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[\"trip\"]},null],[0,\"    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[11,\"div\",[]],[15,\"class\",\"cbs-notify-img\"],[13],[0,\"\\n\\n \"],[11,\"img\",[]],[15,\"src\",\"/CabBookingApplication/assets/ember-builds/assets/images/nodata.png\"],[13],[14],[0,\"  \\n\\n \"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"     \\n\"]],\"locals\":[]},{\"statements\":[[0,\" \"],[11,\"button\",[]],[15,\"class\",\"cbs-button primary-btn mLP80\"],[5,[\"action\"],[[28,[null]],\"toggleAllTrips\"]],[13],[0,\"BACK\"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"currTrip\"]]],null,{\"statements\":[[11,\"div\",[]],[15,\"class\",\"cbs-scrollable-div dInBlck\"],[13],[0,\"\\n   \\n\"],[11,\"table\",[]],[15,\"class\",\"content-table\"],[13],[0,\"\\n    \"],[11,\"thead\",[]],[13],[0,\"\\n        \"],[11,\"tr\",[]],[13],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"USER ID\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"USER NAME\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"BOOKED TIME\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"PICKUP LOCATION\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"DROP LOCATION\"],[14],[0,\"\\n            \"],[11,\"th\",[]],[13],[0,\"STATUS\"],[14],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"tbody\",[]],[13],[0,\"\\n\\n\"],[6,[\"each\"],[[28,[\"currTrip\"]]],null,{\"statements\":[[0,\"        \"],[11,\"tr\",[]],[13],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"trip\",\"userId\"]],false],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"trip\",\"name\"]],false],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"trip\",\"bookedTime\"]],false],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"trip\",\"pickupLocation\"]],false],[14],[0,\"\\n            \"],[11,\"td\",[]],[13],[1,[28,[\"trip\",\"dropLocation\"]],false],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[33,[\"equals\"],[[28,[\"trip\",\"status\"]],\"1\"],null]],null,{\"statements\":[[0,\"                \"],[11,\"td\",[]],[13],[0,\"\\n                    \"],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"updateTripStatus\",[28,[\"trip\",\"userId\"]],\"2\"]],[13],[0,\"BEGIN\"],[14],[0,\"\\n                    \"],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"updateTripStatus\",[28,[\"trip\",\"userId\"]],\"4\"]],[13],[0,\"ABSENT\"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[33,[\"equals\"],[[28,[\"trip\",\"status\"]],\"2\"],null]],null,{\"statements\":[[0,\"                \"],[11,\"td\",[]],[13],[0,\"\\n                    \"],[11,\"button\",[]],[15,\"class\",\"cbs-button\"],[5,[\"action\"],[[28,[null]],\"updateTripStatus\",[28,[\"trip\",\"userId\"]],\"3\"]],[13],[0,\"DROP\"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"if\"],[[33,[\"equals\"],[[28,[\"trip\",\"status\"]],\"3\"],null]],null,{\"statements\":[[0,\"                \"],[11,\"td\",[]],[13],[0,\"TRIP ENDED\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[\"trip\"]},null],[0,\"    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\\n\"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"cbs-notify-img\"],[13],[0,\"\\n\\n \"],[11,\"img\",[]],[15,\"src\",\"/CabBookingApplication/assets/ember-builds/assets/images/nodata.png\"],[13],[14],[0,\"  \\n\\n \"],[14],[0,\"\\n\\n\"]],\"locals\":[]}],[0,\"\\n\"]],\"locals\":[]}],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "cab-booking-application/templates/trips.hbs" } });
});
define('cab-booking-application/utils/util', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.executePromise = executePromise;
  exports.parseJwtToken = parseJwtToken;
  exports.checkAuthentication = checkAuthentication;
  function executePromise(url, method, data) {

    var headers = { 'Authorization': '' + localStorage.getItem('token') };

    url = 'http://localhost:8080/CabBookingApplication/v1' + url;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax({
        url: url,
        type: method,
        headers: headers,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function success(response) {
          resolve(response);
        },
        error: function error(_error) {
          reject(_error);
        }
      });
    });
  }

  function parseJwtToken(token) {
    try {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      var decoded = atob(base64);
      var decodedObject = JSON.parse(decoded);

      var userId = decodedObject.sub;
      var userType = decodedObject.userType;
      console.log(userId);
      console.log(userType);
      return { userId: userId, userType: userType };
    } catch (error) {
      return null;
    }
  }

  function checkAuthentication(val) {

    var applicationController = Ember.getOwner(this).lookup('controller:application');
    var token = applicationController.get('token');
    var userType = applicationController.get('userType');

    if (!token || userType != val) {
      localStorage.removeItem('token');
      applicationController.set('token', null);

      this.transitionTo('/login');
    }
  }

  var timeRanges = exports.timeRanges = [{ time: '12 AM - 1 AM', value: '00:00:00' }, { time: '1  AM  - 2 AM', value: '01:00:00' }, { time: '2  AM  - 3 AM', value: '02:00:00.0' }, { time: '3  AM  - 4 AM', value: '03:00:00.0' }, { time: '4  AM  - 5 AM', value: '04:00:00.0' }, { time: '5  AM  - 6 AM', value: '05:00:00.0' }, { time: '6  AM  - 7 AM', value: '06:00:00.0' }, { time: '7  AM  - 8 AM', value: '07:00:00.0' }, { time: '8  AM  - 9 AM', value: '08:00:00.0' }, { time: '9  AM  - 10 AM', value: '09:00:00.0' }, { time: '10 AM - 11 AM', value: '10:00:00.0' }, { time: '11 AM - 12 PM', value: '11:00:00.0' }, { time: '12 PM - 1 PM', value: '12:00:00' }, { time: '1  PM  - 2 PM', value: '13:00:00.0' }, { time: '2  PM  - 3 PM', value: '14:00:00.0' }, { time: '3  PM  - 4 PM', value: '15:00:00.0' }, { time: '4  PM  - 5 PM', value: '16:00:00.0' }, { time: '5  PM  - 6 PM', value: '17:00:00.0' }, { time: '6  PM  - 7 PM', value: '18:00:00.0' }, { time: '7  PM  - 8 PM', value: '19:00:00.0' }, { time: '8  PM  - 9 PM', value: '20:00:00.0' }, { time: '9  PM  - 10 PM', value: '21:00:00.0' }, { time: '10 PM - 11 PM', value: '22:00:00.0' }, { time: '11 PM - 12 AM', value: '23:00:00.0' }];
});


define('cab-booking-application/config/environment', ['ember'], function(Ember) {
  var prefix = 'cab-booking-application';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("cab-booking-application/app")["default"].create({"name":"cab-booking-application","version":"0.0.0+132527d5"});
}
//# sourceMappingURL=cab-booking-application.map
