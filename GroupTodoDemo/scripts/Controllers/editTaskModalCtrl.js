/*
 * Copyright 2015 Push Technology
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
 
'use strict';
 angular.module('todoApp').controller('EditTaskModalCtrl', ['$scope', '$modalInstance', 'task', function($scope, $modalInstance, task){
	$scope.task = angular.copy(task);
	
	$scope.toPercentage = function(value)
	{
		return value + '%';
	};
	
	$scope.ok = function(){
		if($scope.task.completion === 100){
			$scope.task.done = true;
		} else{
			$scope.task.done = false;
		}
		$modalInstance.close($scope.task);
	};
	
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
}]);