import Ember from 'ember';

export default Ember.Controller.extend({

    applicationController: Ember.inject.controller('application'),

    userType: Ember.computed.readOnly('applicationController.userType'),

    // init() {
    //     this._super(...arguments);
    //     this.toggleUserType();
    // },

    isUser : false,
    isAdmin : false ,
    isDriver : false ,

    actions : {
    toggleUserType(){
        
        if(this.get('userType') == '1'){
            this.set('isUser' , true);
        }
        else if(this.get('userType') == '2'){
            this.set('isDriver' , true);
        }
        else if(this.get('userType') == '3'){
            this.set('isAdmin' , true);
        }
    }
}

});
