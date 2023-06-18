import Ember from 'ember';
import { executePromise } from '../utils/util';
import { checkAuthentication } from '../utils/util';

export default Ember.Route.extend({

    beforeModel(){
        Ember.run.bind(this, checkAuthentication , "2")();
    },

    model() {
    
        const applicationController = Ember.getOwner(this).lookup('controller:application');
        const userId = applicationController.get('userId');

        return executePromise(`/drivers/${userId}/trips`, 'GET' , null);

      }


});
