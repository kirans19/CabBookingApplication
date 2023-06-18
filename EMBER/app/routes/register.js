import Ember from 'ember';

export default Ember.Route.extend({
    location: Ember.inject.service(),

    model() {
        return this.get('location').getLocationModel();
    },
  
});
