//
//  DFTopicNotifyTopicDelegate.h
//  DiffusionTransport
//
//  Created by Martin Cowie on 23/05/2013 - Diffusion 5.0.0_01
//  Copyright (c) 2013 Push Technology Ltd. All rights reserved.
//
//

@class DFTopicDefinition;

/**
 * Listener for notifications from a Topic Notify Topic.
 * <P>
 * Such a delegate is declared when a DFTopicNotifyTopicHandler is
 * created using [DFClient createTopicNotifyTopicHandlerWithMessage:level:andDelegate:]
 *
 * @since 4.6
 */
@protocol DFTopicNotifyTopicDelegate


/**
 * Notifies the addition of a Topic at the server.
 * <P>
 * Only topics that match with selections made to the server (via the
 * [DFTopicNotifyTopicHandler select:] method) will be notified.
 *
 * @param topicName the name of the new topic.
 *
 * @param definition the definition of the topic. The level of detail
 * available within this definition will depend upon the DFNotificationLevel
 * specified when creating the handler. It will at least contain the
 * Topic type but may also contain all of the Topic properties (depending
 * upon level) and/or the Topic metadata (depending upon level and type).
 * @since 4.6
 */
-(void)topicAdded:(NSString*)topicName
   withDefinition:(DFTopicDefinition*)definition;

/**
 * Notifies the removal of a Topic at the server
 *
 * @param topicName the name of the Topic removed
 * @since 4.6
 */
-(void)topicRemoved:(NSString*)topicName;

/**
 * Notifies a change to one or more of the non static properties of a
 * Topic.
 *
 * @param topicName the name of the Topic
 * @param properties a map of the changed properties
 * @since 4.6
 */
-(void)topicUpdated:(NSString*)topicName withProperties:(NSDictionary*)properties;

@end
