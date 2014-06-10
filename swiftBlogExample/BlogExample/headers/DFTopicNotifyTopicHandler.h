//
//  DFTopicNotifyTopicHandler.h
//  DiffusionTransport
//
//  Created by Martin Cowie on 23/05/2013 - Diffusion 5.0.0_01
//  Copyright (c) 2013 Push Technology Ltd. All rights reserved.
//

#import "DFTopicListenerDelegate.h"

// Fwd declarations
@class DFTopicNotifyTopicDelegate;
@class DFClient;
@class DFTopicMessage;
@class DFTopicNotifyTopicHandler;

/**
 * A Topic Notify Topic Handler.
 * <P>
 * This is an object which is used to send commands to a 'Topic Notify' Topic.
 * (see TopicNotifyTopicData). The handler simplifies the use of such a
 * Topic and avoids having to format messages to send to the Topic or parse
 * messages received from it.
 * <P>
 * Such a handler is created using
 * [DFClient createTopicNotifyTopicHandlerWithMessage:level:andDelegate:]
 * and all notifications from the Topic will be routed through the supplied
 * delegate.
 * <P>
 * When such a handler is in use then messages received on the Topic will not
 * be delivered via normal listener mechanisms but will be parsed and notified
 * to the DFTopicNotifyTopicDelegate specified.
 * <P>
 * When the handler is created the Notification Level
 * required is specified. This indicates how much detail is required when each
 * Topic addition is notified.
 * <P>
 * After creating the handler you can use it to specify the range of topics
 * that notifications are required for. This is done using the
 * select:forTopicSet: method which may be used to add,
 * replace, remove or clear selections.
 *
 */
@interface DFTopicNotifyTopicHandler : NSObject<DFTopicListenerDelegate> 


/**
 * This can be used to set the notification details required.
 * <P>
 * If this is not called then the default will be DTM_MINIMUM with no deletions or updates
 * notified.
 * <P>
 * This will send a message to the server requesting a change in the
 * notification level and therefore should ideally be called before any call
 * to DFTopicNotifyTopicHandler::select:forTopicSet: otherwise the effect will be
 * delayed.
 *
 * @param addLevel the required notification level for add notifications
 * @param notifyRemoval YES to request notifications of topic removals
 * @param notifyUpdate YES to request notifications of updates to those
 * topic properties that can be changed after the topic as been created.
 * @since 4.6
 */
-(void)setNotification:(DFNotificationLevel)addLevel
			   removal:(BOOL)notifyRemoval
			 andUpdate:(BOOL)notifyUpdate;

-(void)select:(DFSelectionMode)mode forTopicSet:(NSString*)topicSet;

/**
 * This can be used to get the notification level from that initially specified.
 */
@property(readonly,nonatomic) DFNotificationLevel notificationLevel;

/**
 * Indicates whether notifying topic removals.
 */
@property(readonly,nonatomic) BOOL notifiesUpdate;

/**
 * Indicates whether notifying topic property updates.
 */
@property(readonly,nonatomic) BOOL notifiesRemoval;


/**
 * Returns the client connection.
 */
@property(weak,readonly,nonatomic) DFClient *connection;

@end
