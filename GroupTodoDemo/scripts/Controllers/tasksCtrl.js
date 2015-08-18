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
 angular.module('todoApp').controller('TasksController', ['$rootScope', '$timeout', '$scope', '$modal', 'ModelService', 'UtilsService', function($rootScope, $timeout, $scope, $modal, Model, utils) {
	var instance = this;
	
	instance.displayErrorAlert = false;
	instance.listName = Model.getListName();
	instance.tasks = Model.listTasks();
	
	
	$rootScope.$on('LocalModelChanged', function(){
		$timeout(function () {
			instance.tasks = Model.listTasks();
			instance.listName = Model.getListName();
		});
	});
	
	$rootScope.$on('Error', function(event, err){
		instance.showError(err.msg);
		console.log('An error occurred: ', err);
	});
	
	$rootScope.$on('Success', function(event, msg){
		instance.showSuccess(msg);
		console.log('Success event raised: ', msg);
	});
	
	
	// Handle UI Events
	instance.onAddButtonClick = function(){
		if($scope.addText && $scope.addText !== ''){
			Model.add(utils.task(utils.getId(), new Date().getTime(), $scope.addText, 0, 0));
			$scope.addText = '';
		}
	};
	
	instance.onDeleteButtonClick = function(task){
		Model.remove(task.id);
	};
	
	instance.openListChangeModal = function(){
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: './templates/changeListModalTemplate.html',
			controller: 'ChangeListModalCtrl',
			size: 'sm'
		});
		
		modalInstance.result.then(Model.changeList);
	};
	
	instance.openEditTaskModal = function(taskIn){
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: './templates/editTaskModalTemplate.html',
			controller: 'EditTaskModalCtrl',
			size: 'md',
			resolve: {
				task: function(){
					return taskIn;
				}
			}
		});
		
		modalInstance.rendered.then(function(){
			$rootScope.$broadcast('rzSliderForceRender');
		});
		
		modalInstance.result.then(Model.updateTask);
	};
	
	instance.openLoginModal = function(taskIn){
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: './templates/loginModalTemplate.html',
			controller: 'LoginModalCtrl',
			size: 'md',
			backdrop: 'static',
			keyboard: false
		});
		
		modalInstance.result.then(Model.connect);
	};
	
	instance.onCheckBoxChange = function(task){
		Model.updateTask(task);
	};
	
	instance.showError = function(errMsg){
		$timeout(function(){
			instance.errorAlertText = errMsg;
			instance.displayErrorAlert = true;
		});
		
		$timeout(function(){
			$scope.$apply(function(){instance.displayErrorAlert = false;});
		}, 5000);
		
	};
	
	instance.showSuccess = function(msg){
		$timeout(function(){
			instance.successAlertText = msg;
			instance.displaySuccessAlert = true;
		});
		$timeout(function(){
			$scope.$apply(function(){
				instance.displaySuccessAlert = false;
			});
		}, 3000);
		
	};
	
	instance.openLoginModal();
	
}]);