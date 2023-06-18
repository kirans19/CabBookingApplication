import Ember from 'ember';
import { inject as service } from '@ember/service';
import { executePromise } from '../utils/util';
import { parseJwtToken } from '../utils/util';

export default Ember.Controller.extend({
  session: service(),

  email       : null,
  password    : null,
  emailError  : null,
  emailNullMessage: null,
  passwordNullMessage :null,
  invalidLoginMessage:null,

  clearErrorMessage: function(property) {
    this.set(property, null);
  },

  showErrorMessage: function(property, message) {
    this.set(property, message);
    setTimeout(function() {
      this.clearErrorMessage(property);
    }.bind(this), 1000);
  },
  
  actions: {
    
    authenticate() {

      const email = this.get('email');
      const password = this.get('password');
    
      if (!email) {
        this.showErrorMessage('emailNullMessage', 'Please fill out the email field');
        return;
      }
    
      if (!password) {
        this.showErrorMessage('passwordNullMessage', 'Please fill out the password field');
        return;
      }
    
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(email)) {
        this.showErrorMessage('emailError', 'Please enter a valid email address');
        this.set('email', null);
        return;
      }

      const credentials = {
        email,
        password
      };
  var instance = this;
  executePromise( '/sign-in', 'POST' , credentials)
  .then(response => {
            const token = response.token;
            // const decodedVal = parseJwtToken(token);

            localStorage.setItem('token', token);

            Ember.getOwner(instance).lookup('controller:application').set('token', token);
            // Ember.getOwner(instance).lookup('controller:application').set('userId', decodedVal.userId);
            // Ember.getOwner(instance).lookup('controller:application').set('userType', decodedVal.userType);
            const userType = Ember.getOwner(instance).lookup('controller:application').get('userType');

            instance.set('email',null);
            instance.set('password',null);

            if(userType == 3){
              instance.transitionToRoute('/history');
            }
            else if(userType == 2){
              instance.transitionToRoute('/trips');
            }
            else if(userType == 1){
              instance.transitionToRoute('/bookings');
            }
           
  })
  .catch(error => {
    this.showErrorMessage('invalidLoginMessage', 'Invalid Login !!');
  });

  }
  }
});














      // return new Ember.RSVP.Promise((resolve, reject) => {
      //   Ember.$.ajax({
      //     url: 'http://localhost:8080/CabBookingApplication/v1/sign-in',
      //     type: 'POST',
      //     contentType: 'application/json',
      //     data: JSON.stringify(credentials),
      //     success: response => {

      //       const userId = response.userId;
      //       const userType = response.userType;
      //       const token = response.token;

      //       localStorage.setItem('token', token);
      //       localStorage.setItem('userId', userId);
      //       localStorage.setItem('userType', userType);
      //       console.log("Sucess");
      //       this.transitionToRoute('/');
      //       resolve(response);
      //     },
      //     error: (error) => {
      //       this.showErrorMessage('invalidLoginMessage', 'Invalid Login !!');
      //       reject(error);
      //     }
      //   });
      // });
