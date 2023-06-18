import Ember from 'ember';
import { executePromise } from '../utils/util';
import { checkAuthentication } from '../utils/util';

export default Ember.Route.extend({
  location: Ember.inject.service(),

    beforeModel() {
      Ember.run.bind(this, checkAuthentication , "3")();
    },
      
    model() {

      const routePromise =  executePromise( '/routes', 'GET' ,  null);
      const locationPromise = this.get('location').getLocationModel();

      return Ember.RSVP.hash({
        routes: routePromise,
        locations: locationPromise
      });
    },
  
    setupController(controller, model) {
      this._super(controller, model);
      controller.set('model', model.routes);
      controller.set('locations', model.locations);
    }
});


