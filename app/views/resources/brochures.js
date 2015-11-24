define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope', '$rootScope', '$route', '$browser', '$location', '$window', 'authentication', function ($scope, $rootScope, $route, $browser, $location, $window, authentication) {

		$scope.documents = [
			{
				name: 			'2012 International Day for Biological Diversity: Marine Biodiversity',
				description: 	'2012 International Day for Biological Diversity: Marine Biodiversity',
				thumbnail: 		'app/images/resources/170-idb-brochure.jpg',
				url: 			'https://www.cbd.int/idb/doc/2012/booklet/idb-2012-booklet-en.pdf',
				type:           'document'
			},
			{
				name: 			'Sustainable Ocean Initiative',
				description: 	'Sustainable Ocean Initiative',
				thumbnail: 		'app/images/resources/170-soi-brochure.jpg',
				url: 			'https://www.cbd.int/marine/doc/soi-brochure-2012-en.pdf',
				type:           'document'
			}, {
				name: 			'Ecologically or Biologically Significant Areas (EBSAs)',
				description: 	'Ecologically or Biologically Significant Areas (EBSAs)',
				thumbnail: 		'app/images/resources/170-ebsa-brochure.jpg',
				url: 			'https://www.cbd.int/marine/doc/ebsa-brochure-2012-en.pdf',
				type:           'document'
			}, {
				name: 			'Scientific Criteria and Guidance for Identifying EBSAs and Designing Representative Networks of Marine Protected Areas in Open Ocean Waters and Deep Sea Habitats',
				description: 	'Scientific Criteria and Guidance for Identifying EBSAs and Designing Representative Networks of Marine Protected Areas in Open Ocean Waters and Deep Sea Habitats',
				thumbnail: 		'app/images/resources/170-azores-scientific.jpg',
				url: 			'https://www.cbd.int/doc/meetings/mar/ebsaws-2014-01/other/ebsaws-2014-01-azores-brochure-en.pdf',
				type:           'document'
			}, {
				name: 			'Global Ocean Biodiversity Initiative',
				description: 	'Global Ocean Biodiversity Initiative',
				thumbnail: 		'app/images/resources/170-gobi.jpg',
				url: 			'https://www.cbd.int/marine/doc/gobi-glossy-brochure-2010-en.pdf',
				type:           'document'
			}, {
				name: 			'Priority Actions to Achieve Aichi Biodiversity Target 10 for Coral Reefs and Closely Associated Ecosystems',
				description: 	'Priority Actions to Achieve Aichi Biodiversity Target 10 for Coral Reefs and Closely Associated Ecosystems',
				thumbnail: 		'app/images/resources/170-priority-action.jpg',
				url: 			'https://www.cbd.int/doc/publications/cbd-aichi-target-10-en.pdf',
				type:           'document'
			}
		];
	}];
});
