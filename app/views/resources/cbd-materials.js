define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope', '$rootScope', '$route', '$browser', '$location', '$window', 'authentication', function ($scope, $rootScope, $route, $browser, $location, $window, authentication) {

		$scope.documents = [
			{
				name: 			'SOI Action Plan 2015-2020',
				description: 	'SOI Action Plan 2015-2020',
				thumbnail: 		'app/images/resources/170-actionplan-en.jpg',
				url: 			'https://www.cbd.int/doc/meetings/mar/soiom-2014-02/official/soiom-2014-02-actionplan-en.pdf',
				type:           'document'
			}, {
				name: 			'CBD Technical Series Reports',
				description: 	'CBD Technical Series Reports',
				thumbnail: 		'app/images/resources/170-technical-series_brochure.jpg',
				url: 			'https://www.cbd.int/ts/',
				type:           'document-list'
			}, {
				name: 			'Reports of the CBD Regional EBSA Workshops',
				description: 	'Reports of the CBD Regional EBSA Workshops',
				thumbnail: 		'app/images/resources/170-workshop-reports_brochure.jpg',
				url: 			'https://www.cbd.int/ebsa/resources?tab=workshop-reports',
				type:           'document-list'
			}, {
				name: 			'Report of the Expert Workshop',
				description: 	'Report of the Expert Workshop on Scientific and Technical Guidance on the use of Biogeographic Classification Systems and Identification of Marine Areas beyond national jurisdiction in need of protection',
				thumbnail: 		'app/images/resources/170-pdf.jpg',
				url: 			'https://www.cbd.int/doc/meetings/mar/ewbcsima-01/official/ewbcsima-01-02-en.pdf',
				type:           'document'
			}, {
				name: 			'Report of the Expert Workshop',
				description: 	'Report of the Expert Workshop on Ecological Criteria and Biogeographic Classification Systems for Marine Areas in Need of Protection',
				thumbnail: 		'app/images/resources/170-pdf.jpg',
				url: 			'https://www.cbd.int/doc/meetings/mar/ewsebm-01/official/ewsebm-01-02-en.pdf',
				type:           'document'
			}
		];
	}];
});
