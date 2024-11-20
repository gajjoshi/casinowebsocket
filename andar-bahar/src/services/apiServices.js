import apiEventEmitter from '../events/apiEventEmitter';

export const triggerApiCall = async () => {
  try {
    await fetch('http://127.0.0.1:8000/myapp/api/reset_collections/'); // Replace with your actual API call logic
    apiEventEmitter.emit('apiCalled'); // Notify listeners that the API was called
  } catch (error) {
    console.error('Error calling API:', error);
  }
};
