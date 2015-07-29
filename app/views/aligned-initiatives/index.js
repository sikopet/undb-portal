define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope', function ($scope) {

		// enable scrollspy

		$('body').scrollspy({ target: 'nav' });

    	// $('nav a').click(function (e) { });

		// affix sidebar

		setTimeout(function () {

			var $sideBar = $('.bs-docs-sidebar');

			$sideBar.affix({
				offset: {
					top: function () {
						var offsetTop      = $sideBar.offset().top;
						var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10);
						var navOuterHeight = $('.bs-docs-nav').height();

						return (this.top = offsetTop - navOuterHeight - sideBarMargin);
					},
					bottom: function () {
						return (this.bottom = $('footer').outerHeight(true));
					}
				}
			})
		}, 100);

	}];
});
