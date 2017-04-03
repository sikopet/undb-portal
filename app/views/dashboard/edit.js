define(['app', 'lodash',
'directives/forms/edit-organization',
'directives/forms/edit-undb-actor',
'directives/forms/edit-event',
], function(app, _) { 'use strict';

	return ['$scope','$routeParams','user', function ($scope,$routeParams,user) {


        var _ctrl = this;
				_ctrl.user =user;
				_ctrl.schema = _.camelCase($routeParams.schema);
				_ctrl.identifier = $routeParams.id;

				$scope.$root.page={};
				$scope.$root.page.title = "Edit:";

    }];
});
