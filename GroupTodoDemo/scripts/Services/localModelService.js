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
 angular.module('todoApp').service('LocalModelService', ['$rootScope', function($rootScope){
	var tasks = [];
	
	this.listTasks = function(){
		return tasks;
	};
	
	this.update = function(id, task){
		var addPoint = -1;
		for(var i = 0; i < tasks.length; i++){
			if(tasks[i].id === id){
				// If the IDs are the same, update the fields contained in the update. Only updated fields will be defined
				var existing = tasks[i];
				if(task.text){
					existing.text = task.text;
				}
				// Done and Completion may be defined as zero so need a more explicit test
				if(task.done !== undefined){
					existing.done = task.done;
				}
				if(task.completion !== undefined){
					existing.completion = task.completion;
				}
				
				tasks[i] = existing;
				$rootScope.$emit('LocalModelChanged');
				return;
			} else if(task.created > tasks[i].created && addPoint === -1){
				addPoint = i;
			}
		}
		
		this.add(task, addPoint);
		
		console.log('Added Task ', task, ' at ', addPoint);
	};
	
	this.add = function(task, index){
		if(index === -1){
			index = tasks.length;
		}
		tasks.splice(index,0,task);
		$rootScope.$emit('LocalModelChanged');
		
	};
	
	this.remove = function(id){
		for(var i = 0; i < tasks.length; i++){
			if(tasks[i].id === id){
				tasks.splice(i, 1);
				$rootScope.$emit('LocalModelChanged');
			}
		}
	};
	
	this.reset = function(){
		tasks = [];
		$rootScope.$emit('LocalModelChanged');
	};
	
}]);