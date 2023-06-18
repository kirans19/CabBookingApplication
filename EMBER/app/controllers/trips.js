import Ember from 'ember';
import { executePromise } from '../utils/util';

export default Ember.Controller.extend({

    currTrip : null ,
    isApproved: Ember.computed.equal('trip.status', '1'),
    tripId : null , 
    showAllTrips : true , 


    actions : {

        getCurrTrip(trip) {

            const applicationController = Ember.getOwner(this).lookup('controller:application');
            const driverId = applicationController.get('userId');

            this.set('tripId', trip.tripId );


            executePromise(`/drivers/${driverId}/trips/${trip.tripId}`, 'GET' , null)
            .then(response => {
                  this.set('currTrip',response);
                  this.send("toggleAllTrips");
            })
            .catch(error => {
                  console.log(error);
            });
            
        } ,
        updateTripStatus(userId , status){

            const updatedVal = {
                status
            };

            var instance = this;

            executePromise(`/drivers/${userId}/trips/${this.tripId}`, 'PUT' , updatedVal )
            .then(response => {

                let model = instance.currTrip;
                let updatedCurrTrip = model.find((item) => item.userId == userId );
                Ember.set(updatedCurrTrip, 'status' , status );

                if(status == 4){
                    model.removeObject(updatedCurrTrip);
                }
                    
            })
            .catch(error => {
                  console.log(error);
            });

        } ,
        toggleAllTrips(){
            this.set('showAllTrips' , !this.showAllTrips);
        }

    }
});
