import Ember from 'ember';
import { executePromise } from '../utils/util';

export default Ember.Service.extend({
    getLocationModel() {
      return executePromise( '/locations', 'GET' , null);
    }
});
