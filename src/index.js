import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import './assets/boxicons-2.0.7/css/boxicons.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './sass/index.scss'
import store from './slice/store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactNotification />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
