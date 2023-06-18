import Ember from 'ember';
import { executePromise } from '../utils/util';

export default Ember.Controller.extend({

    
    locationName: null , 
    isBranch: false,
    showDeactivatedLocations: true,
    showCreateLocations : false,
    locationNullMessage : null ,
    nameError : null ,
    applicationController: Ember.computed(function() {
      return Ember.getOwner(this).lookup('controller:application');
    }),
  
    userId: Ember.computed.readOnly('applicationController.userId'),

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

        toggleLocationList() {
            this.set('showDeactivatedLocations', !this.showDeactivatedLocations);
            
        },
        toggleCreateLocation(){
          this.set('showCreateLocations', !this.showCreateLocations);
        },

        createLocation : function() {
            var instance = this;

            const locationName = this.get('locationName');
            const isBranch = this.get('isBranch');
            const status = true;

            if (!locationName) {
              this.showErrorMessage('locationNullMessage', 'Please fill out the location field');
              return;
            }

            const namePattern = /^[a-zA-Z\s]*$/;
            if (!namePattern.test(locationName)) {
              this.showErrorMessage('nameError', 'Invalid Name');
              this.set('locationName', null);
              return;
            }

            const newLocation = {
              locationName,
              isBranch,
              status
            };

            executePromise( `/admin/${this.get('userId')}/locations`, 'POST' , newLocation)
            .then(response => {
              const addLocation = Em.Object.create({
                          "locationId" : response,
                          "locationName" : locationName,
                          "isBranch" : isBranch,
                          "isActive" : status
                          });
                          
              var locModel = instance.get('model')
              locModel.pushObject(addLocation);
              instance.set('model', locModel);
              resolve(response);

            })
            .catch(error => {
              console.log(error);
            });
        },

        updateLocation(location) {
            let instance = this;
            var methodName = location.isActive ? 'DELETE' : 'PUT';

            executePromise(`/admin/${this.get('userId')}/locations/${location.locationId}`, methodName , null)
            .then(response => {
                  let model = instance.model;
                  let updatedLocation = model.find((item) => item.locationId === location.locationId);
                  Ember.set(updatedLocation, 'isActive', !location.isActive);
            })
            .catch(error => {
                  console.log(error);
            });
        }
    }
});














            // return new Ember.RSVP.Promise((resolve,reject)=>{
            //     Ember.$.ajax({
            //         url: 'http://localhost:8080/CabBookingApplication/v1/admin/10033/locations',
            //         method: 'POST',
            //         headers:headers,
            //         data: JSON.stringify(newLocation),
            //     success(response){
            //         console.log("Success");

            //         const addLocation = Em.Object.create({
            //           "locationId" : response,
            //           "locationName" : locationName,
            //           "isBranch" : isBranch,
            //           "isActive" : status
            //           });
                      
            //         var locModel = instance.get('model')
            //         locModel.pushObject(addLocation);
            //         console.log(locModel);
            //         instance.set('model', locModel);
            //         resolve(response);
            //     },
            //     error(error){
            //         console.log("Fail");
            //         reject(error);
            //     }
            //     });
            // });





                        
            // return new  Ember.RSVP.Promise((resolve, reject) => {
            //     Ember.$.ajax({
            //       url: `http://localhost:8080/CabBookingApplication/v1/admin/10033/locations/${location.locationId}`,
            //       method: methodName,
            //       headers:headers,
            //       success(response) {
            //         let model = instance.model;
            //         let updatedLocation = model.find((item) => item.locationId === location.locationId);
            //         Ember.set(updatedLocation, 'isActive', !location.isActive);
            //         console.log("Success");
            //         resolve(response);
            //       },
            //       error(error) {
            //         console.log("Fail");
            //         reject(error);
            //       }
            //     });
            //   });

