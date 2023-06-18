import Ember from 'ember';
import { executePromise } from '../utils/util';
import { checkAuthentication } from '../utils/util';

export default Ember.Route.extend({
  location: Ember.inject.service(),

  beforeModel(){
    Ember.run.bind(this, checkAuthentication , "3")();
  },

  model() {

    const driverPromise = executePromise( '/drivers', 'GET' , null);

    const locationPromise = this.get('location').getLocationModel();

    return Ember.RSVP.hash({
      drivers: driverPromise,
      locations: locationPromise
    });
  },


  setupController(controller, model) {
    this._super(controller, model);
    controller.set('model', model.drivers);
    controller.set('locations', model.locations);
    controller.send('toggleActivatedDriverList');
  }
});













    
    
    // new Ember.RSVP.Promise((resolve, reject) => {
    //   Ember.$.ajax({
    //     url: 'http://localhost:8080/CabBookingApplication/v1/drivers',
    //     method: 'GET',
    //     headers: headers,
    //     success(response) {
    //       resolve(response);
    //     },
    //     error(error) {
    //       reject(error);
    //     }
    //   });
    // });