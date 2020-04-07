// import $ from 'jquery';
import '@babel/polyfill';
import 'intersection-observer';
// import { initCursor } from './Animations/cursor';
import { initTriggerHamburger } from './Modules/hamburger';
// import { initTitleLoadAnim } from './Animations/titleLoadAnim';
// import { initTitleAnim } from './Animations/titleAnim';
// import { initScrollFadeAnim } from './Animations/scrollFade';
// import { initStaggerFadeAnim } from './Animations/staggerFade';
import { initSmoothScroll } from './Modules/smoothScroll';

document.addEventListener('DOMContentLoaded', function() {
    // initCursor();
    initTriggerHamburger();
    // initTitleLoadAnim();
    // initTitleAnim();
    // initScrollFadeAnim();
    // initStaggerFadeAnim();
    initSmoothScroll();
});
