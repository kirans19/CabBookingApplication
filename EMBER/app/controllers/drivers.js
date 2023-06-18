import Ember from 'ember';
import { executePromise } from '../utils/util';

export default Ember.Controller.extend({

 
    showDeactivatedDrivers : false ,
    showActivatedDrivers : true ,
    showUnApprovedDrivers : false ,
    showUpdateFields : true ,

    selectedDriverId : null ,

    shift:null,
    locationId : null ,
    locationName : null,

    modelLength : null,

    applicationController: Ember.computed(function() {
        return Ember.getOwner(this).lookup('controller:application');
      }),
    
      userId: Ember.computed.readOnly('applicationController.userId'),

    getModelLength(model){

        let filteredModel = model.filter(object => object.canDisplay === true);
        let lengthOfFilteredModel = filteredModel.length;
        this.set('modelLength',lengthOfFilteredModel);

    },
      
    actions : {
        toggleDeactivatedDriverList() {

            this.model.forEach((object) => {
                if(object.canDisplay){
                    Ember.set(object, 'canDisplay', undefined);
                    delete object["canDisplay"];
                }
            });


            this.model.forEach((object) => {
                if(!object.isActive && object.locationId!=0){
                    Ember.set(object, 'canDisplay', true);
                }
            });

            this.set('showDeactivatedDrivers', true);
            this.set('showActivatedDrivers', false);
            this.set('showUnApprovedDrivers', false);

            this.getModelLength(this.model);
             
          },

        toggleActivatedDriverList(){

            this.model.forEach((object) => {
                if(object.canDisplay){
                    Ember.set(object, 'canDisplay', undefined);
                    delete object["canDisplay"];
                }
            });

            this.model.forEach((object) => {
                if(object.isActive && object.locationId!=0){
                    Ember.set(object, 'canDisplay', true);
                }
            });

            this.set('showActivatedDrivers', true);
            this.set('showDeactivatedDrivers', false);
            this.set('showUnApprovedDrivers', false);

            this.getModelLength(this.model);
        },

        toggleApproval(){

            this.model.forEach((object) => {
                if(object.canDisplay){
                    Ember.set(object, 'canDisplay', undefined);
                    delete object["canDisplay"];
                }
            });

            this.model.forEach((object) => {
                if(object.locationId==0){
                    Ember.set(object, 'canDisplay', true);
                }
            });

            this.set('showUnApprovedDrivers', true);
            this.set('showDeactivatedDrivers', false);
            this.set('showActivatedDrivers', false);

            this.getModelLength(this.model);
        },

        toggleUpdateFields(driverId){

            this.model.forEach((object) => {
                if(object.isEditable){
                    Ember.set(object, 'isEditable', undefined);
                    delete object["isEditable"];
                }
            });

            if (driverId) {
                var object = this.model.findBy('driverId', driverId);
                Ember.set(object, 'isEditable', true);
            }
        },

        addDriverLocation(location) {
            this.set('locationId',location.locationId);
            this.set('locationName',location.locationName);

        },

        addDriverShift(shift){
            Ember.set(this,'shift', shift);
        },
    
        updateDriverStatus(driver) {
            let instance = this;
            var methodName = driver.isActive ? 'DELETE' : 'PUT';

            executePromise(`/admin/${this.get('userId')}/approval/${driver.driverId}`, methodName , null)
            .then(response => {
                  let model = instance.model;
                  let updatedDriver = model.find((item) => item.driverId === driver.driverId);
                  Ember.set(updatedDriver, 'isActive', !driver.isActive);
                  Ember.set(updatedDriver, 'canDisplay', !driver.canDisplay);
                  instance.getModelLength(model);
            })
            .catch(error => {
                  console.log(error);
            });
        },

        updateDriverFields(driver){
            
            let instance = this;
            var locationId = this.get('locationId');
            var shift = this.shift;
            var locationName = this.locationName;

            var updateFields = locationId && shift ? { locationId, shift } :
                                !locationId ? { shift } :
                                !shift ? { locationId } : null;

            executePromise(`/admin/${this.get('userId')}/drivers/${driver.driverId}`, 'PUT' , updateFields)
            .then(response => {
                let model = instance.model;
                let updatedDriver = model.find((item) => item.driverId === driver.driverId);
                Ember.set(updatedDriver, 'locationId', locationId);
                Ember.set(updatedDriver, 'locationName', locationName);
                Ember.set(updatedDriver, 'shift', shift);
                instance.getModelLength(model);
              
            })
            .catch(error => {
                  console.log(error);
            });

            this.send('toggleUpdateFields');

        }
    }
});




















            // return new  Ember.RSVP.Promise((resolve, reject) => {
            //     Ember.$.ajax({
            //       url: `http://localhost:8080/CabBookingApplication/v1/admin/10033/approval/${driver.driverId}`,
            //       method: methodName,
            //       headers:this.get('headers'),
            //       success(response) {
            //         let model = instance.get('model');
            //         let updatedDriver = model.find((item) => item.driverId === driver.driverId);
            //         Ember.set(updatedDriver, 'isActive', !driver.isActive);
            //         console.log("Success");
            //         resolve(response);
            //       },
            //       error(error) {
            //         console.log("Fail");
            //         reject(error);
            //       }
            //     });
            //   });



                  // return new Ember.RSVP.Promise((resolve, reject) => {
            //     var instance = this;
            //     Ember.$.ajax({
            //       url: `http://localhost:8080/CabBookingApplication/v1/admin/10033/drivers/${driver.driverId}`,
            //       method: 'PUT',
            //       headers:this.get('headers'),
            //       contentType: 'application/json',
            //       data: JSON.stringify(updateFields),
            //       success:response =>{
            //         let model = instance.model;
            //         let updatedDriver = model.find((item) => item.driverId === driver.driverId);
            //         Ember.set(updatedDriver, 'locationId', locationId);
            //         Ember.set(updatedDriver, 'locationName', locationName);
            //         Ember.set(updatedDriver, 'shift', shift);
            //         this.send('toggleUpdateFields');
            //         resolve(response);
            //       },
            //       error(jqXHR, textStatus, errorThrown) {
            //         reject(errorThrown); 
            //       }
            //     });
            //   });
