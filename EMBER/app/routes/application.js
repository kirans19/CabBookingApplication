import Route from '@ember/routing/route';
import { routeValidate } from '../utils/util';

export default Route.extend({

  beforeModel() {
  
    const token = localStorage.getItem('token') ;

    // const applicationController = Ember.getOwner(this).lookup('controller:application');
    // const token = applicationController.get('token');

    const applicationController = Ember.getOwner(this).lookup('controller:application');
    const userType = applicationController.get('userType');


    if (!token) {
      this.transitionTo('/login');
    }
    else if (token && userType == 1){
      this.transitionTo('/bookings');
    }
    else if (token && userType == 2){
      this.transitionTo('/trips');
    }
    else if (token && userType == 3){
      this.transitionTo('/history');
    }

    // routeValidate();
  }
  
});
