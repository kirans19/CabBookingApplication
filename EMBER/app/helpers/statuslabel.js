import Ember from 'ember';

export function statuslabel(params) {

  switch (params[0]) {
   
    case 0:

      return "Cancelled";
    case 1:

      return "Booked";
    case 2:

      return "Trip Started";
    case 3:

      return "Dropped";
    case 4:

      return "Absent";
      
  }
}

export default Ember.Helper.helper(statuslabel);
