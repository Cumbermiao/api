import {APP_ERROR} from './api';
export default {
  [APP_ERROR](state, {status, statusText} = {}) {
    console.warn(status, statusText);
  }
} 