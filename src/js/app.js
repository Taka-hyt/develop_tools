// import $ from './modules/jquery.min';
import $ from 'jquery';

$(function() {
    console.log('コンソールログだよん');
});

$(function() {
    $('.button').on('click', function() {
        $('p').css('color', 'blue');
    });
});
