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
angular.module('todoApp').service('ModelService', ['LocalModelService', 'RemoteModelService', '$rootScope', function(LocalModel, RemoteModel, $rootScope){
	
	this.connect = function(options){
		RemoteModel.connect(options);
	};
	
	this.updateTask = function(task){
		RemoteModel.updateTask(task);
	};
	
	this.listTasks = function(){
		return LocalModel.listTasks();
	};
	
	this.add = function(task){
		RemoteModel.add(task);
	};
	
	this.changeList = function(newList){
		console.log('Changing list to ' + newList);
		if(newList && newList !== ''){
			RemoteModel.changeList(newList);
		}
	};
	
	this.remove = function(id){
		RemoteModel.remove(id);
	};
	
	this.getListName = function(){
		return RemoteModel.getListName();
	};
}]);