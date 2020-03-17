// import $ from 'jquery';
import '@babel/polyfill';
import 'intersection-observer';
import { initTriggerHamburger } from './modules/hamburger';

document.addEventListener('DOMContentLoaded', () => {
    initTriggerHamburger();
});
