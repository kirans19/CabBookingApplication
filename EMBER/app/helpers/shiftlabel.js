import Ember from 'ember';

export function shiftlabel(params) {
  switch (params[0]) {
    case 0:
      return "Morning";
    case 1:
      return "Noon";
    case 2:
      return "Evening";
    case 3:
      return "Night";
      
  }
}

export default Ember.Helper.helper(shiftlabel);
