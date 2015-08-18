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
angular.module('todoApp').service('RemoteModelService', ['LocalModelService', 'UtilsService', '$rootScope', function(LocalModel, utils, $rootScope){
	var connectedSession;
	var currentSubscription;
	var listName = 'demoList';
	var tasksTopicPath = 'TodoDemo/' + listName + '/Tasks/';
	
	this.getListName = function(){
		return listName;
	};
	
	this.add = function(task){
		if(connectedSession && connectedSession.isConnected()){
			connectedSession.topics.add(tasksTopicPath + task.id, utils.getMeta(), utils.toRecord(task));
		} else {
			sendError({msg:'Session not connected'});
		}
	};
	
	this.remove = function(id){
		console.log('Removing from Reappt: ' + tasksTopicPath + id);
		
		if(connectedSession.isConnected()){
			connectedSession.topics.remove(tasksTopicPath + id).then(
				function(res){
					console.log('Removed task ' + tasksTopicPath + id + ' successfully. ', res);
				},
				function(err){
					sendError({msg: 'Unable to remove task', error:err});
				});
		} else {
			sendError({msg: 'Unable to remove task, not connected to Reappt'});
		}
	};
	
	this.updateTask = function(task){
		console.log('Updating to Reappt: ', task);
		if(connectedSession.isConnected()){
			connectedSession.topics.update(tasksTopicPath + task.id, utils.toRecord(task)).then(
				function(res){
					console.log('Updated task with id ' + task.id + ' successfully. ', res);
				},
				function(err){
					sendError({msg: 'Unable to update task', error:err});
				});
		} else {
			sendError({msg:'Unable to update task, not connected to Reappt'});
		}
	};
	
	this.connect = function(options){
		console.log('Attempting to connect with options: ', options);
		diffusion.connect(options).then(onConnect,
			function(err){
				sendError({msg: 'Unable to connect to Reappt', error:err});
			}
		);
	};
	
	this.changeList = function(newList){
		if(newList !== listName && connectedSession){
			connectedSession.unsubscribe('?'+tasksTopicPath+'/');
			currentSubscription.off({
				subscribe: onSubscribe,
				unsubscribe: onUnsubscribe,
				update: onUpdate
			});
			
			LocalModel.reset();
			currentSubscription = undefined;
			
			listName = newList;
			tasksTopicPath = 'TodoDemo/' + listName + '/Tasks/';
			
			currentSubscription = connectedSession.subscribe('?'+tasksTopicPath+'/');
			currentSubscription.on({
				subscribe: onSubscribe,
				unsubscribe: onUnsubscribe,
				update: onUpdate
			});
		}
	};
	
	
	
	// Reappt Callbacks
	var onConnect = function(session){
		sendSuccess('Connected to ' + session.options.host + ' with principal ' + session.options.principal);
		connectedSession = session;
		connectedSession.on({
			disconnect: function(){
				sendError({msg: 'You have been disconnected from server'});
			},
			error: function(err){
				sendError({msg: 'There has been a session error', error:err});
			},
			reconnect: function(){
				sendSuccess({msg:'The session was reconnected'});
			},
			close: function(reason){
				sendError({msg: 'The session has been closed', reason: reason});
			}
		});
		utils.sessionId = connectedSession.sessionID;
		currentSubscription = connectedSession.subscribe('?'+tasksTopicPath+'/');
		currentSubscription.on({
			subscribe: onSubscribe,
			unsubscribe: onUnsubscribe,
			update: onUpdate
		});
	};
	
	var sendError = function(err){
		$rootScope.$emit('Error', err);
	};
	
	var sendSuccess = function(msg){
		$rootScope.$emit('Success', msg);
	};
	
	var onSubscribe = function(details, topic){
		console.log('Subscribed to ', topic, ': ', details);
	};
	
	var onUnsubscribe = function(reason, topic){
		console.log('Unsubscribe event: ', reason, topic);
		var tokens = topic.split('/');
		var id = tokens[tokens.length - 1];
		// Check it actually is an ID and not an unsub event from somewhere higher up the topic tree
		if(tasksTopicPath.split('/').indexOf(id) === -1){
			console.log('Removing task ', id);
			LocalModel.remove(id);
		}
	};
	
	var onUpdate = function(value, topic){
		console.log('Update Received: ', value, topic);
		var task = utils.toTask(utils.getMeta().parse(value).get('task'));
		// Updates will not contain the id field as it is constant, so get the ID from the topic
		var tokens = topic.split('/');
		var id = tokens[tokens.length-1];
		
		LocalModel.update(id, task);
	};
}]);