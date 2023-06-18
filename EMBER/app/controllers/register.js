import Ember from 'ember';
import { executePromise } from '../utils/util';
export default Ember.Controller.extend({

  email: null,
  password: null,
  name: null,
  phnNum: null,
  userType: null,
  locationId: null,
  branchId: null,

  emailNullMessage : null,
  passwordNullMessage : null,
  nameNullMessage : null,
  phnNumNullMessage : null,
  userTypeNullMessage: null,
  homeNullMessage: null,
  branchNullMessage: null,
  invalidRegisterMessage: null,

  emailError : null,
  nameError:null,
  phnNumError:null,

  showLocationFields:false,
  showTypeFields:true,

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

    getUserType(value) {
        if (value == 1) {
          Ember.set(this,'showLocationFields', true);
          Ember.set(this,'showTypeFields', false);
        }
        else if(value == 2){
          Ember.set(this,'showLocationFields', false);
        }
        Ember.set(this , 'userType',value);
      },

      addBranch(branchId) {
        Ember.set(this,'branchId', branchId);
      },
  
      addHome(locationId) {
        Ember.set(this,'locationId', locationId);
      },

    register() {

      const email = this.get('email');
      const password = this.get('password');
      const name = this.get('name');
      const phnNum = this.get('phnNum');
      const userType = this.get('userType');
      let locationId = null;
      let branchId = null;

    if(userType == 1){
        locationId = this.get('locationId');
        branchId = this.get('branchId');

        if (!locationId) {
          this.showErrorMessage('homeNullMessage', 'Please fill out the Home Location field');
          return;
        }
  
        if (!branchId) {
          this.showErrorMessage('branchNullMessage', 'Please fill out the Branch Location field');
          return;
        }

      }

      if (!email) {
        this.showErrorMessage('emailNullMessage', 'Please fill out the email field');
        return;
      }

      if (!password) {
        this.showErrorMessage('passwordNullMessage', 'Please fill out the password field');
        return;
      }

      if (!name) {
        this.showErrorMessage('nameNullMessage', 'Please fill out the name field');
        return;
      }

      if (!phnNum) {
        this.showErrorMessage('phnNumNullMessage', 'Please fill out the mobile number field');
        return;
      }

      if (!userType) {
        this.showErrorMessage('userTypeNullMessage', 'Please select user type');
        return;
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(email)) {
        this.showErrorMessage('emailError', 'Please enter a valid email address');
        this.set('email', null);
        return;
      }

      const namePattern = /^[a-zA-Z\s]*$/;
      if (!namePattern.test(name)) {
        this.showErrorMessage('nameError', 'Please enter a valid name');
        this.set('name', null);
        return;
      }

      const phnNumPattern = /^[0-9]{10}$/;
      if (!phnNumPattern.test(phnNum)) {
        this.showErrorMessage('phnNumError', 'Please enter a valid phone number');
        this.set('phnNum', null);
        return;
      }

      const userDetails = {
        email,
        password,
        name,
        phnNum,
        userType
      };

      const locationDetails = {
        locationId,
        branchId
      };

      let signUpData = null;
 
      if(userType == 1){
        signUpData= {
          userDetails,
          locationDetails
        };
      }
      else if(userType == 2){
        signUpData= {
          userDetails
        };
      }

      executePromise( '/sign-up', 'POST' , signUpData)
      .then(response => {
        this.transitionToRoute('/login');
      })
      .catch(error => {
        this.showErrorMessage('invalidRegisterMessage', 'Registration Failed !!');
      });
    }
  }
});











   
      // return new Ember.RSVP.Promise((resolve, reject) => {
      //   Ember.$.ajax({
      //     url: 'http://localhost:8080/CabBookingApplication/v1/sign-up',
      //     method: 'POST',
      //     contentType: 'application/json',
      //     data: JSON.stringify(signUpData),
      //     success:response =>{
      //       this.transitionToRoute('/login');
      //       resolve(response);
      //     },
      //     error(jqXHR, textStatus, errorThrown) {
      //       this.showErrorMessage('invalidRegisterMessage', 'Registration Failed !!');
      //       reject(errorThrown); 
      //     }
      //   });
      // });
