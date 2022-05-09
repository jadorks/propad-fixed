import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ArbiCrypt from './App';
// import ArbDB from './utils/firebase';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<ArbiCrypt />, document.getElementById('root'));

serviceWorker.unregister();
