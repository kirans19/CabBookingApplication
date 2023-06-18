import Ember from 'ember';
import { executePromise } from '../utils/util';
import { checkAuthentication } from '../utils/util';

export default Ember.Route.extend({

    beforeModel(){
        Ember.run.bind(this, checkAuthentication , "1")();
    },

    model(){

        const applicationController = Ember.getOwner(this).lookup('controller:application');
        const userId = applicationController.get('userId');

        return executePromise(`/users/${userId}/bookings`, 'GET' , null);
    },

    setupController(controller, model) {
        this._super(controller, model);
        controller.send('getCurrTime');
      }
});
