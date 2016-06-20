define(['app','authentication', '../directives/map/undb-map'], function() { 'use strict';

	return ['$scope','$location',
    function ($scope, $location) {

		$scope.actionRegister = function () {
			$location.url('/actions/submit');
		};


		$scope.carouselData=  {
					items :[{
						title : "2015 is the Time for Global Action",
						description : "2015 presents a historic and unprecedented opportunity to bring the countries and citizens of the world together to decide and embark on new paths to improve the lives of people everywhere",
						imageUrl : "app/images/carousel/slider-1.jpg",
						targetUrl: "http://www.cbd.int"
					},
					{
						title : "2015 is the Time for Global Action",
						description : "2015 presents a historic and unprecedented opportunity to bring the countries and citizens of the world together to decide and embark on new paths to improve the lives of people everywhere",
						imageUrl : "http://lorempixel.com/865/467/nature/two/",
						targetUrl: "http://www.cbd.int"
					},
					{
						title : "Title 3",
						description : "Description 3 Description 3 Description 3 Description 3 Description 3",
						imageUrl : "http://lorempixel.com/865/467/nature/three/",
						targetUrl: "http://www.cbd.int"
					},
					{
						title : "Title 4",
						description : "Description 4",
						imageUrl : "http://lorempixel.com/865/467/nature/four/",
						targetUrl: "http://www.cbd.int"
					},
					{
						title : "Title 5",
						description : "Description 5",
						imageUrl : "http://lorempixel.com/865/467/nature/five/",
						targetUrl: "http://www.cbd.int"
					},
					{
						title : "Title 6",
						description : "Description 6",
						imageUrl : "http://lorempixel.com/865/467/nature/six/",
						targetUrl: "http://www.cbd.int"
					}]
				};
    }];
});
