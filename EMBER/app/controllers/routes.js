import Ember from 'ember';
import { executePromise } from '../utils/util';

export default Ember.Controller.extend({

    routeName : null ,
    showCreateRoute : false ,
    showStopList : false , 
    locationList : null ,
    routeNullMessage : null ,
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
    


    isLocationSelected(locationId) {
        let selectedLocations = this.get('selectedLocations');
        return selectedLocations.includes(locationId);
      },
   
    actions: {

      // toggleProperties(properties) {
      //   properties.forEach((property) => {
      //     this.set(property, !this.get(property));
      //   });
      // },


        toggleCreateRoute(){
            this.set('showCreateRoute',true);
            this.set('showStopList',false);
        },

        toggleRouteStops(){
          this.set('showStopList',true);
          this.set('showCreateRoute',false);
        },

        toggleAll(){
          this.set('showStopList',false);
          this.set('showCreateRoute',false);
        },
      
        updateSelectedLocations(locationId) {
            let selectedLocations = this.get('selectedLocations');
      
              selectedLocations.pushObject(locationId);
          
      
          },
      

        createRoute() {

            var locationCheckBox = document.getElementsByName('locations');
      

            var checkedLocations = [];

            for (let i = 0; i < locationCheckBox.length - 1; i++) {
              if (locationCheckBox[i].checked) {
                const currentLocation = locationCheckBox[i].value;
                const nextLocation = locationCheckBox[i + 1].value;
                checkedLocations.push({ currentLocation, nextLocation });  
              }
            }

            var lastPair = checkedLocations[checkedLocations.length - 1];
            var branchCheckBox = document.getElementsByName('branches');

            var currentLocation = lastPair.nextLocation;
            var nextLocation = branchCheckBox[0].value;
            var addBranch = { currentLocation , nextLocation  };
            checkedLocations.push(addBranch);
            currentLocation = nextLocation;
            nextLocation = nextLocation ;
            addBranch = { currentLocation , nextLocation  };
            checkedLocations.push(addBranch);
            

            var location = checkedLocations ;
            
            var instance = this;

            const routeName = this.get('routeName');

            if (!routeName) {
              this.showErrorMessage('routeNullMessage', 'Please fill out the location field');
              return;
            }

            const namePattern = /^[a-zA-Z\s]*$/;
            if (!namePattern.test(routeName)) {
              this.showErrorMessage('nameError', 'Invalid Name');
              this.set('locationName', null);
              return;
            }

            const newRoute = {
              routeName,
              location
            };

            executePromise( `/admin/${this.get('userId')}/routes`, 'POST' , newRoute)
            .then(response => {
   
              const addRoute = Em.Object.create({
                          "routeId" : response,
                          "routeName" : this.routeName
                          });
                          
              var routModel = instance.get('model')
              routModel.pushObject(addRoute);
              instance.set('model', routModel);

            })
            .catch(error => {
              console.log(error);
            });
        },

        getStops(route){

          executePromise( `/routes/${route.routeId}/locations`, 'GET' , null)
          .then(response => {
            this.set('locationList',response);
            this.send('toggleRouteStops');
          })
          .catch(error => {
            console.log(error);
          });

        }
    }
}
);
