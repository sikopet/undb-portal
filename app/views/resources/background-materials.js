define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope', '$rootScope', '$route', '$browser', '$location', '$window', 'authentication', function ($scope, $rootScope, $route, $browser, $location, $window, authentication) {

		// TODO: Pull this information from Document Meeting REST API (once implemented)

		$scope.documents = [
			{
				description: 	'CBD Technical Series 68: Marine Spatial Planning in the Context of the Convention on Biological Diversity',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/information/mcbem-2014-04-cbd-ts-68-en.pdf',
				type:           'document'
			}, {
				code: 			'UNEP/CBD/MCBEM/2014/4/INF/2',
				description: 	'Using Scientific Information Related to Ecologically or Biologically Significant Marine Areas (EBSAs) to Implement Marine Spatial Planning and Ecosystem Based Management',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/information/mcbem-2014-04-inf-02-en.pdf',
				type:           'document'
			}, {
				code: 			'UNEP/CBD/MCBEM/2014/4/SBSTTA/18/INF/23',
				description: 	'Marine Spatial Planning in Practice—Transitioning from Planning to Implementation',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/information/mcbem-2014-04-sbstta-18-inf-23-en.pdf',
				type:           'document'
			}, {
				description: 	'Antigua and Barbuda—Blue Halo Initiative—1',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-ag-1-en.pdf',
				type:           'document'
			}, {
				description: 	'Antigua and Barbuda—Blue Halo Initiative—2',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-ag-2-en.pdf',
				type:           'document'
			}, {
				description: 	'Antigua and Barbuda—Blue Halo Initiative—3',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-ag-3-en.pdf',
				type:           'document'
			}, {
				description: 	'Antigua and Barbuda—Blue Halo Initiative—4',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-ag-4-en.pdf',
				type:           'document'
			}, {
				description: 	'Australia—Marine Bioregional Plan for the Temperate East Marine Region',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-au-e-en.pdf',
				type:           'document'
			}, {
				description: 	'Australia—Zoning--Lessons from Great Barrier Reef',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-au-great-barrier-reef-en.pdf',
				type:           'document'
			}, {
				description: 	'Australia—Marine Bioregional Plan for the North Marine Region',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-au-n-en.pdf',
				type:           'document'
			}, {
				description: 	'Australia—Marine Bioregional Plan for the North-West Marine Region',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-au-nw-en.pdf',
				type:           'document'
			}, {
				description: 	'Australia—Marine Bioregional Plan for the South-West Marine Region',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-au-sw-en.pdf',
				type:           'document'
			}, {
				description: 	'Belgium—MSP for the North Sea-brochure',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-be-n-sea-en.pdf',
				type:           'document'
			}, {
				description: 	'Belgium—MSP for the North Sea--Royal Decree sumary',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-be-n-sea-royal-decree-en.pdf',
				type:           'document'
			}, {
				description: 	'Colombia—Avances en el Manejo Integrado de Zonas Costeras En el Departamento del Cauca',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-co-1-en.pdf',
				type:           'document'
			}, {
				description: 	'Colombia—Lineamientos y estrategias de manejo integrado para la UAC-D, Caribe Colombiano',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-co-2-en.pdf',
				type:           'document'
			}, {
				description: 	'Colombia—Ordenamiento Ambiental de la Zona Costera del Departamento del Atlántico',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-co-3-en.pdf',
				type:           'document'
			}, {
				description: 	'Colombia—Plan de Manejo Integrado de la Zona Costera para el Complejo de las Bocanas de Guapi e Iscuandé',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-co-4-en.pdf',
				type:           'document'
			}, {
				description: 	'Colombia—UAC-LLAS, Pacifico colombiano - Plan de manejo integrado de la zona costera',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-co-5-en.pdf',
				type:           'document'
			}, {
				description: 	'Conceptos y guía metodológica para el manjeo integrado de zonas costeras en Colombia Manual 1',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-co-manual-1-es.pdf',
				type:           'document'
			}, {
				description: 	'Conceptos y guía metodológica para el manjeo integrado de zonas costeras en Colombia Manual 2',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-co-manual-2-es.pdf',
				type:           'document'
			}, {
				description: 	'Conceptos y guía metodológica para el manjeo integrado de zonas costeras en Colombia Manual 3',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-co-manual-3-es.pdf',
				type:           'document'
			}, {
				description: 	'EU—Balt Sea Plan',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-eu-baltseaplan-en.pdf',
				type:           'document'
			}, {
				description: 	'EU—Transboundary MSP pilot in the Bothnian Sea',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-eu-bothnian-sea-en.pdf',
				type:           'document'
			}, {
				description: 	'EU--Stakeholder consultation on MSP and ICZM',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-eu-consultation-msp-iczm-en.pdf',
				type:           'document'
			}, {
				description: 	'EU—Study on the economic effects of maritime spatial planning',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-eu-economic-effects--en.pdf',
				type:           'document'
			}, {
				description: 	'EU—Legal aspects of maritime spatial planning',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-eu-legal-msp-en.pdf',
				type:           'document'
			}, {
				description: 	'EU—Exploring the potential of MSP in the Mediterranean Sea',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-eu-mediterranean-sea-en.pdf',
				type:           'document'
			}, {
				description: 	'EU—Proposal for a EU MSP Directive',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-eu-msp-directive-en.pdf',
				type:           'document'
			}, {
				description: 	'EU—Preparatory Action on MSP in the North Sea (MASPNOSE)',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-eu-north-sea-en.pdf',
				type:           'document'
			}, {
				description: 	'EU—Transboundary Planning in the European Atlantic',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-eu-transboundary-planning-atlantic-en.pdf',
				type:           'document'
			}, {
				description: 	'Finland--Regional Plan of Kymenlaakso',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-finland-regional-kymenlaakso-en.pdf',
				type:           'document'
			}, {
				description: 	'Finland--Regional Plan of Kymenlaakso -- 1',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-finland-regional-kymenlaakso-1-en.pdf',
				type:           'document'
			}, {
				description: 	'Finland--Regional Plan of Kymenlaakso -- 2',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-finland-regional-kymenlaasko-2-en.pdf',
				type:           'document'
			}, {
				description: 	'GIS for ocean conservation',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-gis-for-ocean-conservation-en.pdf',
				type:           'document'
			}, {
				description: 	'GIS tools for MSP and management',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-gis-tools-for-msp-and-management-en.pdf',
				type:           'document'
			}, {
				description: 	'HELCOM-VASAB MSP Working Group Report',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-helcom-01-en.pdf',
				type:           'document'
			}, {
				description: 	'HELCOM--Regional Baltic MSP Roadmap',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-helcom-02-en.pdf',
				type:           'document'
			}, {
				description: 	'Step-by-Step Approach for Marine Spatial Planning toward Ecosystem-based Management (Intergovernmental Oceanographic Commission Manual and Guides No. 53, ICAM Dossier No. 6)',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-icam-en.pdf',
				type:           'document'
			}, {
				description: 	'Developing an integrated planning framework and decision support methods',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-integrated-planning-decision-support-en.pdf',
				type:           'document'
			}, {
				description: 	'Inventory of GIS-based Decision-Support Tools for MPAs',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-inventory-of-gis-tools-for-mpas-en.pdf',
				type:           'document'
			}, {
				description: 	'LOICZ-Governance Responses to EcosystemChange',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-loicz-en.pdf',
				type:           'document'
			}, {
				description: 	'Mexico--Gulf of California',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-mx-gulf-of-california-en.pdf',
				type:           'document'
			}, {
				description: 	'Netherlands—Policy Document on the North Sea',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-nl-policy-north-sea-en.pdf',
				type:           'document'
			}, {
				description: 	'New Zealand—Hauraki Gulf MSP process',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-nz-hauraki-gulf-msp-en.pdf',
				type:           'document'
			}, {
				description: 	'OSS--A spatial decision support system for optimal zoning of MPAs',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-oss-spatial-decision-zoning-mpas-en.pdf',
				type:           'document'
			}, {
				description: 	'Portugal—National Ocean Strategy 2013-2020 and Mar-Portugal Plan',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-pt-strategy-2013-2020-en.pdf',
				type:           'document'
			}, {
				description: 	'Integrating remote sensing products and GIS tools to support marine spatial management in West Hawai`I',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-remote-sensing--and-gis-west-hawai-en.pdf',
				type:           'document'
			}, {
				description: 	'Using siting algorithms in the design of marine reserve networks',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-siting-algorithms-mar-reserve-nw-en.pdf',
				type:           'document'
			}, {
				description: 	'Spatial Analysis and Resource Characterization Tool',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-spatial-characterization-tool-en.pdf',
				type:           'document'
			}, {
				description: 	'Tools for Coastal-Marine Ecosystem-Based Management',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-tools-for-coastal-en.pdf',
				type:           'document'
			}, {
				description: 	'UNEP-GPA--EBM-markers for assessing progress',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-unep-01-en.pdf',
				type:           'document'
			}, {
				description: 	'UNEP--Taking Steps Toward EBM',
				url: 			'https://www.cbd.int/doc/meetings/mar/mcbem-2014-04/other/mcbem-2014-04-unep-02-en.pdf',
				type:           'document'
			}
		];
	}];
});
