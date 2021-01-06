import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/styles/index.css';
import './assets/styles/reset.css';

/**
 * Função protótipo que recebe uma lista de strings e retorna um booleano se 'this' possuir qualquer uma delas. e.g:
 * "abc".includesOneOf(["a", "c"]) === true
 * @param {string[]} arrayOfStrings - Lista de strings para comparação com 'this'
 * @returns {boolean}               - True caso 'this' possuir qualquer string da lista
 */
// eslint-disable-next-line no-extend-native
String.prototype.includesOneOf = function(arrayOfStrings) {
  if(!Array.isArray(arrayOfStrings)) {
    throw new Error('includesOneOf only accepts an array')
  }
  return arrayOfStrings.some(str => this.includes(str))
}

ReactDOM.render(<App />, document.getElementById('root'));