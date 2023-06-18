import Ember from 'ember';
import { getOwner } from '@ember/application';

export function executePromise(url, method,data) {

  const headers = { 'Authorization': `${localStorage.getItem('token')}`};


  url = 'http://localhost:8080/CabBookingApplication/v1'+url;
  return new Ember.RSVP.Promise((resolve, reject) => {
    Ember.$.ajax({
      url : url,
      type : method,
      headers : headers,
      contentType: 'application/json',
      data : JSON.stringify(data),
      success(response) {
        resolve(response);
      },
      error(error) {
        reject(error);
      }
    });
  });
}

export function parseJwtToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const decoded = atob(base64);
        const decodedObject = JSON.parse(decoded);
    
        const userId = decodedObject.sub;
        const userType = decodedObject.userType;
        console.log(userId);
        console.log(userType);
        return { userId : userId , userType : userType };

      } catch (error) {
        return null;
      }
}


export function checkAuthentication(val) {

  const applicationController = Ember.getOwner(this).lookup('controller:application');
  const token = applicationController.get('token');
  const userType = applicationController.get('userType');

  if (!token || userType != val) {
    localStorage.removeItem('token');
    applicationController.set('token', null);

    this.transitionTo('/login');
  }
}


export const timeRanges =[
  { time: '12 AM - 1 AM'   , value: '00:00:00' },
  { time: '1  AM  - 2 AM'  , value: '01:00:00' },
  { time: '2  AM  - 3 AM'  , value: '02:00:00.0' },
  { time: '3  AM  - 4 AM'  , value: '03:00:00.0' },
  { time: '4  AM  - 5 AM'  , value: '04:00:00.0' },
  { time: '5  AM  - 6 AM'  , value: '05:00:00.0' },
  { time: '6  AM  - 7 AM'  , value: '06:00:00.0' },
  { time: '7  AM  - 8 AM'  , value: '07:00:00.0' },
  { time: '8  AM  - 9 AM'  , value: '08:00:00.0' },
  { time: '9  AM  - 10 AM' , value: '09:00:00.0' },
  { time: '10 AM - 11 AM'  , value: '10:00:00.0' },
  { time: '11 AM - 12 PM'  , value: '11:00:00.0' },
  { time: '12 PM - 1 PM'   , value: '12:00:00' },
  { time: '1  PM  - 2 PM'  , value: '13:00:00.0' },
  { time: '2  PM  - 3 PM'  , value: '14:00:00.0' },
  { time: '3  PM  - 4 PM'  , value: '15:00:00.0' },
  { time: '4  PM  - 5 PM'  , value: '16:00:00.0' },
  { time: '5  PM  - 6 PM'  , value: '17:00:00.0' },
  { time: '6  PM  - 7 PM'  , value: '18:00:00.0' },
  { time: '7  PM  - 8 PM'  , value: '19:00:00.0' },
  { time: '8  PM  - 9 PM'  , value: '20:00:00.0' },
  { time: '9  PM  - 10 PM' , value: '21:00:00.0' },
  { time: '10 PM - 11 PM'  , value: '22:00:00.0' },
  { time: '11 PM - 12 AM'  , value: '23:00:00.0' }
];