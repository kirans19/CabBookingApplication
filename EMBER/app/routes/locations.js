import Ember from 'ember';
import Route from '@ember/routing/route';
import { checkAuthentication } from '../utils/util';


export default Route.extend({
  location: Ember.inject.service(),

    beforeModel() {
        
      // const applicationController = Ember.getOwner(this).lookup('controller:application');
      // const token = applicationController.get('token');
      // const userType= applicationController.get('userType');
      
      //   if (!(token) || userType!=3){
      //     localStorage.removeItem('token');
      //     applicationController.set('token', null);
      //     this.transitionTo('/login');
      //   }
     
      Ember.run.bind(this, checkAuthentication , "3")();
      },

    model() {
        return this.get('location').getLocationModel();
      },

    setupController(controller, model) {
        this._super(controller, model);
        controller.set('model', model);
      }
  });



