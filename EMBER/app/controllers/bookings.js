import Ember from 'ember';
import { executePromise } from '../utils/util';
import { timeRanges } from '../utils/util';

export default Ember.Controller.extend({

    history : null,
    currDate : null,
    currTime : null,
    bookedTime : null,
    lastBookingTime : null,
    isPickUp : false,
    invalidBookingMessage:null,

    applicationController: Ember.computed(function() {
      return Ember.getOwner(this).lookup('controller:application');
    }),
  
    userId: Ember.computed.readOnly('applicationController.userId'),

    dropDownTimeRanges : Ember.computed('model', 'model.@each' , function(){
      var filteredRanges = Ember.copy(this.get('timeRanges'), true);
      var currTime = this.get('currTime');
      var currTimeValue = this.getTimeValue(currTime);
      this.get('model').forEach((object) => {
       const val =  object.bookedTime.split(' ')[1];
       filteredRanges.removeObject(filteredRanges.findBy('value', val));
      });

      filteredRanges = filteredRanges.filter(timeRange => {
        var timeRangeValue = this.getTimeValue(timeRange.value);
            return timeRangeValue >= currTimeValue;
          
        });

      return filteredRanges;
    }),

    timeRanges : timeRanges ,

    clearErrorMessage: function(property) {
      this.set(property, null);
    },
  
    showErrorMessage: function(property, message) {
      this.set(property, message);
      setTimeout(function() {
        this.clearErrorMessage(property);
      }.bind(this), 1000);
    },
    
    
    getTimeValue : function(time) {
      return Number(time.split(':')[0]);
    },

    addHoursToTime :function(time, hours) {
        const timeParts = time.split(':');
        const hoursToAdd = parseInt(timeParts[0]) + hours;
        timeParts[0] = hoursToAdd.toString().padStart(2, '0');
        return timeParts.join(':');
      },

    actions: {
    
      getBookingTime(timeRange){
        this.set('bookedTime',timeRange.value);
      },

      getCurrTime (){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours()+':00:00.0';

        this.set('currDate',date);
        this.set('currTime',time);

      } ,

      doBooking(){

        var isPickUpRadio = document.getElementsByName('pickup');

        var isPickUpTemp = null;


        for (let i = 0; i < isPickUpRadio.length - 1; i++) {
          if (isPickUpRadio[i].checked) {
              isPickUpTemp = isPickUpRadio[i].value;
          }
        }
    
          const bookedTime = this.currDate+' '+this.bookedTime;
          const isPickup = isPickUpTemp;
          var instance = this;

          const addBooking = {
            isPickup,
            bookedTime
          };

          executePromise(`/users/${this.get('userId')}/bookings`, 'POST' , addBooking)
          .then(response => {
            
          var bookingsModel = instance.get('model')
          bookingsModel.pushObject(response[0]);
          instance.set('model', bookingsModel);

          // this.send('getCurrTime');

   
          })
          .catch(error => {
            this.showErrorMessage('invalidBookingMessage', 'Booking Failed !!');
          });

      } ,

      cancelBooking(booking){
        
        var instance =this; 

        executePromise(`/users/${this.get('userId')}/trips/${booking.tripId}/bookings`, 'DELETE' , null)
        .then(response => {

          instance.get('model').removeObject(booking);
          // var filteredModel = model.filter((item) => item.userId !== this.get('userId') && item.tripId !== booking.tripId);
          // instance.set('model', filteredModel);
          })
          .catch(error => {
                console.log(error);
          });

      },

      getIsPickUp(value){
        this.set('isPickUp',value);
      }

    }
});
















        // const model = this.get('model');
        // if(model.length>0){
        //     const lastElement = model[model.length - 1];
        //     var lastBookingTime = lastElement.bookedTime;
        //  lastBookingTime = lastBookingTime.split(' ')[1];
        //     this.set('lastBookingTime', lastBookingTime);
        // }





    // filteredTimeRanges: Ember.computed('currTime', 'timeRanges', 'lastBookingTime', function() {
    //   var currTime = this.get('currTime');
    //   var lastBookingTime = this.get('lastBookingTime');
    //   var filteredRanges = this.get('timeRanges');
    
    //   var currTimeValue = this.getTimeValue(currTime);
    //   var addedTimeValue = null;

    //   if (lastBookingTime) {
    //     addedTimeValue = this.getTimeValue(this.addHoursToTime(lastBookingTime, 3));
    //     console.log(addedTimeValue);
    //   }
    
    //   filteredRanges = filteredRanges.filter(timeRange => {
    //   var timeRangeValue = this.getTimeValue(timeRange.value);

    //     if (lastBookingTime) {
    //       return timeRangeValue >= currTimeValue && timeRangeValue >= addedTimeValue;
    //     } else {
    //       return timeRangeValue >= currTimeValue;
    //     }
    //   });
    
    //   return filteredRanges;
    // }),
