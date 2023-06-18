import Ember from 'ember';
import { executePromise } from '../utils/util';


export default Ember.Route.extend({

    model(){

        const applicationController = Ember.getOwner(this).lookup('controller:application');
        const userId = applicationController.get('userId');

        return executePromise( `/history/${userId}`, 'GET' , null);
    },
    setupController(controller, model) {
        this._super(controller, model);

        controller.send('toggleUserType');
      }
});










        
        // return new Ember.RSVP.Promise((resolve, reject) => {
        //     Ember.$.ajax({
        //       url: 'http://localhost:8080/CabBookingApplication/v1/history/10033',
        //       method: 'GET',
        //       headers:headers,
        //       success(response) {
        //         resolve(response);
        //       },
        //       error(error) {
        //         reject(error);
        //       }
        //     });
        //   });