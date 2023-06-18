import Ember from 'ember';


export default Ember.Component.extend({

    applicationController: Ember.computed(function() {
        return Ember.getOwner(this).lookup('controller:application');
    }),
    
    userType: Ember.computed.readOnly('applicationController.userType'),

    init() {
        this._super(...arguments);
        this.toggleUserType();
    },

    isUser : false,
    isAdmin : false ,
    isDriver : false ,
    selectedRoute: null,
    
    paneOption_1 : true ,
    paneOption_2 : false ,
    paneOption_3 : false ,
    paneOption_4 : false ,
    

    toggleUserType : function(){
        
        if(this.get('userType') == '1'){
            this.set('isUser' , true);
        }
        else if(this.get('userType') == '2'){
            this.set('isDriver' , true);
        }
        else if(this.get('userType') == 3){
            this.set('isAdmin' , true);
        }
    },

    actions :{

        logout() {
            localStorage.removeItem('token');
            Ember.getOwner(this).lookup('controller:application').set('token', null);
            Ember.getOwner(this).lookup('controller:application').send(this.get('logoutAction'), 'login');
        },
        selectPaneOption(option) {
            this.setProperties({
                paneOption_1: option === 'paneOption_1',
                paneOption_2: option === 'paneOption_2',
                paneOption_3: option === 'paneOption_3',
                paneOption_4: option === 'paneOption_4',
              });
        }
    }
    
});








    // isAdmin: Ember.computed('userType', function() {
    //     return this.get('userType') === 3;
    //   }),
      
    //   isUser: Ember.computed('userType', function() {
    //     return this.get('userType') === 1;
    //   }),
      
    //   isDriver: Ember.computed('userType', function() {
    //     return this.get('userType') === 2;
    //   }),
