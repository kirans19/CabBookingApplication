import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel(){
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
    }
});
