define(['app','authentication', '../directives/map/undb-map'], function() { 'use strict';

	return ['$scope', function ($scope) {

		$scope.carouselData=  {
					items :[
						{
											title : "Living in harmony with nature",
											description : " The goal of the United Nations Decade on Biodiversity is to support the implementation of the Strategic Plan for Biodiversity and to promote its overall vision of living in harmony with nature.",
											imageUrl : "app/img/undb-slider-welcome.png",
											targetUrl: "https://www.cbd.int/undb-new/about/undb"
										},
											{
											title : "Meetings of the Convention on Biological Diversity and its Protocols",
											description : "The highest governing body of the CBD brings together government representatives to review and promote the implementation of the Convention. ",
											imageUrl : "app/img/undb-slider-cop13.png",
											targetUrl: "https://www.cbd.int/cop2016/"
										},{
						title : "High-level Political Forum on Sustainable Development",
						description : 'UN chief launches first report to track Sustainable Development Goals.',
						imageUrl : "app/images/carousel/slider-1.jpg",
						targetUrl: "http://www.un.org/apps/news/story.asp?NewsID=54503#.V5J72PmANBc"
					},
					{
						title : " Sustainable Development Goals",
						description : "Transforming our world: the 2030 Agenda for Sustainable Development.",
						imageUrl : "app/img/undb-slider-sdg.png",
						targetUrl: "https://sustainabledevelopment.un.org/sdgs"
					},
					{
						title : "Participate!",
						description : " Follow the United Nations Decade on Biodiversity on social media, or get involved in other ways.",
						imageUrl : "app/img/undb-slider-socialmedia.png",
						targetUrl: "https://www.cbd.int/undb-new/actions/participate"
					},
					{
						title : "Strategic Plan for Biodiversity 2011–2020 and the Aichi Biodiversity Targets",
						description : "The vision: By 2050, biodiversity is valued, conserved, restored and wisely used, maintaining ecosystem services, sustaining a healthy planet and delivering benefits essential for all people.",
						imageUrl : "app/img/undb-slider-aichi.png",
						targetUrl: "https://www.cbd.int/sp"
					},
]
				};
    }];
});
