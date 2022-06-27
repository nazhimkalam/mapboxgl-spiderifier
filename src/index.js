import React from 'react';
import ReactDom from "react-dom";
import App from './App';

const body = document.body;
body.style = "width: 100vw; height: 100vh; margin: 0;";

const rootElement = document.getElementById('root');
rootElement.style = "width: 100%; height: 100%";

ReactDom.render(<App />, rootElement);