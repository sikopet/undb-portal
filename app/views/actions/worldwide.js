define(['jquery','app', 'angular', 'authentication', '../../directives/map/undb-map'], function($) { 'use strict';

	return ['$scope', '$rootScope', '$route', '$browser', '$location', '$window', 'authentication',
    function ($scope, $rootScope, $route, $browser, $location, $window, authentication) {

			/* MAP */

			// closing the green popup
			$('#map .mapPopup button.closeButton').click(function(){
				$(this).parent('.mapPopup').hide();
			});

			// selecting a UNDB Network
			$('#map .sideSelection ul li').click(function(){
				$('#map .sideSelection ul li.active').removeClass('active');
				$(this).addClass('active');

				var text = $(this).data('text');
				$('.mapPopup').children('p').html(text)
				$('.mapPopup').show();
			});

			/* ////MAP */

    }];
});
