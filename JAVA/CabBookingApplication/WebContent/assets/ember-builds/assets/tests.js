'use strict';

define('cab-booking-application/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/nav-pane.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/nav-pane.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/application.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/bookings.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/bookings.js should pass ESLint\n\n113:18 - \'error\' is defined but never used. (no-unused-vars)\n124:15 - \'response\' is defined but never used. (no-unused-vars)\n131:17 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/drivers.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/drivers.js should pass ESLint\n\n133:19 - \'response\' is defined but never used. (no-unused-vars)\n141:19 - Unexpected console statement. (no-console)\n157:19 - \'response\' is defined but never used. (no-unused-vars)\n167:19 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/history.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/history.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/locations.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/locations.js should pass ESLint\n\n67:35 - \'Em\' is not defined. (no-undef)\n77:15 - \'resolve\' is not defined. (no-undef)\n81:15 - Unexpected console statement. (no-console)\n90:19 - \'response\' is defined but never used. (no-unused-vars)\n96:19 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/login.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/login.js should pass ESLint\n\n4:10 - \'parseJwtToken\' is defined but never used. (no-unused-vars)\n82:10 - \'error\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('controllers/register.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/register.js should pass ESLint\n\n161:13 - \'response\' is defined but never used. (no-unused-vars)\n164:14 - \'error\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('controllers/routes.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/routes.js should pass ESLint\n\n93:28 - \'nextLocation\' is assigned to itself. (no-self-assign)\n124:32 - \'Em\' is not defined. (no-undef)\n135:15 - Unexpected console statement. (no-console)\n147:13 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/trips.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/trips.js should pass ESLint\n\n28:19 - Unexpected console statement. (no-console)\n41:19 - \'response\' is defined but never used. (no-unused-vars)\n53:19 - Unexpected console statement. (no-console)');
  });

  QUnit.test('helpers/equals.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/equals.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/shiftlabel.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/shiftlabel.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/statuslabel.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/statuslabel.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/application.js should pass ESLint\n\n2:10 - \'routeValidate\' is defined but never used. (no-unused-vars)\n13:35 - \'Ember\' is not defined. (no-undef)');
  });

  QUnit.test('routes/bookings.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/bookings.js should pass ESLint\n\n');
  });

  QUnit.test('routes/drivers.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/drivers.js should pass ESLint\n\n');
  });

  QUnit.test('routes/history.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/history.js should pass ESLint\n\n');
  });

  QUnit.test('routes/locations.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/locations.js should pass ESLint\n\n');
  });

  QUnit.test('routes/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/login.js should pass ESLint\n\n');
  });

  QUnit.test('routes/register.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/register.js should pass ESLint\n\n');
  });

  QUnit.test('routes/routes.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/routes.js should pass ESLint\n\n');
  });

  QUnit.test('routes/trips.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/trips.js should pass ESLint\n\n');
  });

  QUnit.test('services/location.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/location.js should pass ESLint\n\n');
  });

  QUnit.test('utils/util.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'utils/util.js should pass ESLint\n\n2:10 - \'getOwner\' is defined but never used. (no-unused-vars)\n36:9 - Unexpected console statement. (no-console)\n37:9 - Unexpected console statement. (no-console)');
  });
});
define('cab-booking-application/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('cab-booking-application/tests/helpers/ember-simple-auth', ['exports', 'ember-simple-auth/authenticators/test'], function (exports, _test) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.authenticateSession = authenticateSession;
  exports.currentSession = currentSession;
  exports.invalidateSession = invalidateSession;


  var TEST_CONTAINER_KEY = 'authenticator:test';

  function ensureAuthenticator(app, container) {
    var authenticator = container.lookup(TEST_CONTAINER_KEY);
    if (!authenticator) {
      app.register(TEST_CONTAINER_KEY, _test.default);
    }
  }

  function authenticateSession(app, sessionData) {
    var container = app.__container__;

    var session = container.lookup('service:session');
    ensureAuthenticator(app, container);
    session.authenticate(TEST_CONTAINER_KEY, sessionData);
    return wait();
  };

  function currentSession(app) {
    return app.__container__.lookup('service:session');
  };

  function invalidateSession(app) {
    var session = app.__container__.lookup('service:session');
    if (session.get('isAuthenticated')) {
      session.invalidate();
    }
    return wait();
  };
});
define('cab-booking-application/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'cab-booking-application/tests/helpers/start-app', 'cab-booking-application/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };

  var resolve = Ember.RSVP.resolve;
});
define('cab-booking-application/tests/helpers/resolver', ['exports', 'cab-booking-application/resolver', 'cab-booking-application/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('cab-booking-application/tests/helpers/start-app', ['exports', 'cab-booking-application/app', 'cab-booking-application/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('cab-booking-application/tests/integration/components/location-dropdown-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('location-dropdown', 'Integration | Component | location dropdown', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "ig5FWro2",
      "block": "{\"statements\":[[1,[26,[\"location-dropdown\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "1Ionrp+e",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"location-dropdown\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('cab-booking-application/tests/integration/components/nav-pane-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('nav-pane', 'Integration | Component | nav pane', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "WSALcLT5",
      "block": "{\"statements\":[[1,[26,[\"nav-pane\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "scYOCpV3",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"nav-pane\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('cab-booking-application/tests/integration/helpers/is-equals-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('is-equals', 'helper:is-equals', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "Bm1gYQZS",
      "block": "{\"statements\":[[1,[33,[\"is-equals\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('cab-booking-application/tests/integration/helpers/shiftlabel-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('shiftlabel', 'helper:shiftlabel', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "n6enWpGF",
      "block": "{\"statements\":[[1,[33,[\"shiftlabel\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('cab-booking-application/tests/integration/helpers/statuslabel-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('statuslabel', 'helper:statuslabel', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "gPRR0U4O",
      "block": "{\"statements\":[[1,[33,[\"statuslabel\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('cab-booking-application/tests/test-helper', ['cab-booking-application/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});
define('cab-booking-application/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/location-dropdown-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/location-dropdown-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/nav-pane-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/nav-pane-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/is-equals-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/is-equals-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/shiftlabel-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/shiftlabel-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/statuslabel-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/statuslabel-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/boookings-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/boookings-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/drivers-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/drivers-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/history-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/history-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/locations-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/locations-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/login-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/nav-pane-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/nav-pane-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/register-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/register-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/routes-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/routes-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/trips-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/trips-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/bookings-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/bookings-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/drivers-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/drivers-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/history-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/history-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/locations-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/locations-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/login-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/register-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/register-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/routes-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/routes-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/signin-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/signin-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/trips-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/trips-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/location-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/location-test.js should pass ESLint\n\n');
  });
});
define('cab-booking-application/tests/unit/controllers/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:application', 'Unit | Controller | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('cab-booking-application/tests/unit/controllers/boookings-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:boookings', 'Unit | Controller | boookings', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('cab-booking-application/tests/unit/controllers/drivers-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:drivers', 'Unit | Controller | drivers', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('cab-booking-application/tests/unit/controllers/history-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:history', 'Unit | Controller | history', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('cab-booking-application/tests/unit/controllers/locations-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:locations', 'Unit | Controller | locations', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('cab-booking-application/tests/unit/controllers/login-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:login', 'Unit | Controller | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('cab-booking-application/tests/unit/controllers/nav-pane-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:nav-pane', 'Unit | Controller | nav pane', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('cab-booking-application/tests/unit/controllers/register-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:register', 'Unit | Controller | register', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('cab-booking-application/tests/unit/controllers/routes-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:routes', 'Unit | Controller | routes', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('cab-booking-application/tests/unit/controllers/trips-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:trips', 'Unit | Controller | trips', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('cab-booking-application/tests/unit/routes/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cab-booking-application/tests/unit/routes/bookings-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:bookings', 'Unit | Route | bookings', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cab-booking-application/tests/unit/routes/drivers-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:drivers', 'Unit | Route | drivers', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cab-booking-application/tests/unit/routes/history-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:history', 'Unit | Route | history', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cab-booking-application/tests/unit/routes/locations-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:locations', 'Unit | Route | locations', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cab-booking-application/tests/unit/routes/login-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:login', 'Unit | Route | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cab-booking-application/tests/unit/routes/register-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:register', 'Unit | Route | register', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cab-booking-application/tests/unit/routes/routes-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:routes', 'Unit | Route | routes', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cab-booking-application/tests/unit/routes/signin-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:signin', 'Unit | Route | signin', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cab-booking-application/tests/unit/routes/trips-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:trips', 'Unit | Route | trips', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('cab-booking-application/tests/unit/services/location-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:location', 'Unit | Service | location', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
require('cab-booking-application/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
