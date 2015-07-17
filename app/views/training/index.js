define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope', '$rootScope', '$route', '$browser', '$location', '$window', 'authentication', function ($scope, $rootScope, $route, $browser, $location, $window, authentication) {

		$scope.documents = [
			{
				name: 			'Training Manual for the Description of Ecologically and Biologically Significant Areas (EBSAs) in Open-ocean Waters and Deep-sea Habitats',
				description: 	'Training Manual for the Description of Ecologically and Biologically Significant Areas (EBSAs) in Open-ocean Waters and Deep-sea Habitats',
				thumbnail: 		'app/images/training/download-pdf.jpg',
				url: 			'https://www.cbd.int/doc/meetings/sbstta/sbstta-16/information/sbstta-16-inf-09-en.pdf',
				type:           'document'
			}, {
				name: 			'Training manual on Integrating Traditional Knowledge in the Application of the EBSA criteria',
				description: 	'Training manual on Integrating Traditional Knowledge in the Application of the EBSA criteria',
				thumbnail: 		'app/images/training/download-pdf.jpg',
				type:           'forthcoming'
			}, {
				name: 			'CBD Protected Areas E-Learning Modules',
				description: 	'CBD Protected Areas E-Learning Modules',
				thumbnail: 		'app/images/training/e-learning-modules.jpg',
				url: 			'https://www.cbd.int/protected/e-learning/',
				type:           'website'
			}, {
				name: 			'FAO Ecosystem Approach to Fisheries (EAF) Toolbox',
				description: 	'FAO Ecosystem Approach to Fisheries (EAF) Toolbox',
				thumbnail: 		'app/images/training/170-fao-fisheries.jpg',
				url: 			'http://www.fao.org/fishery/eaf-net/topic/166272/en',
				type:           'website'
			}
		];
	}];
});
