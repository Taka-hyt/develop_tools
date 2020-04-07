import $ from 'jquery';
import 'jquery.ripples';

const initRipples = function() {
    // Ripplesがスマホ未対応のためのif文
    if (!navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/)) {
        console.log('スマホ以外の端末だよ');
        $('.js-ripples').ripples({
            dropRadius: 30,
            resolution: 1200,
            perturbance: 0.01,
        });
    }
};

export { initRipples };
