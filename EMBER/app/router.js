import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('locations');
  this.route('routes');
  this.route('register');
  this.route('drivers');
  this.route('history');
  this.route('trips');
  this.route('bookings');
});

export default Router;
