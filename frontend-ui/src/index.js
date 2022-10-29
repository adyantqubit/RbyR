import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'

import App from './App';
import { store } from './Redux-manage/app/store'
import './index.css';
import {BrowserRouter} from 'react-router-dom'
import Context from './context';


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  
    <BrowserRouter>
    <Provider store={store}>
      <Context>
      <App />
      </Context>
    </Provider>
    </BrowserRouter>
  
);


