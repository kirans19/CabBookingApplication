import Ember from 'ember';
import { parseJwtToken } from '../utils/util';

export default Ember.Controller.extend({
    
    token: localStorage.getItem('token'),
    
    decodedVal: Ember.computed('token', function() {
    const token = this.get('token');
    return parseJwtToken(token);
    }),

    userId: Ember.computed.alias('decodedVal.userId'),
    userType: Ember.computed.alias('decodedVal.userType'),

    actions: {
        doLogout : function(routeName){
            this.transitionToRoute(routeName);
        }
    }

});
