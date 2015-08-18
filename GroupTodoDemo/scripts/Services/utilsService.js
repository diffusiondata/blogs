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
angular.module('todoApp').service('UtilsService', function(){
	var taskMeta = new diffusion.metadata.RecordContent();
	
	taskMeta.addRecord('task', 1, {
		id: taskMeta.string(),
		created: taskMeta.integer(),
		text: taskMeta.string(),
		done: taskMeta.integer(0),
		completion: taskMeta.integer(0)
	});

	this.getMeta = function(){
		return taskMeta;
	};
	
	this.task = function(id, created, text, done, completion){
		return {
			id: id, 
			created: created,
			text: text, 
			done: done, 
			completion: completion
		};
	};

	this.getId = (function(){
		var taskIdCount = 0;
		return function(){
			var id = this.sessionId + '-' + taskIdCount++;
			return id;
		};
	})();

	this.toRecord = function(task){
		var builder = taskMeta.builder();
		builder.add('task', {
			id: task.id,
			created: task.created,
			text: task.text,
			done: (task.done ? 1:0),
			completion: task.completion
		});
		return builder.build();
	};

	this.toTask = function(taskRecord){
		return this.task(taskRecord.get('id'), taskRecord.get('created'), taskRecord.get('text'), (taskRecord.get('done') === 1), taskRecord.get('completion'));
	};
	
});