/*
 *  DFTopicListenerDelegate.h
 *
 *  Created by Darren Hudson on 24/05/2009 - Diffusion 5.0.0_01
 *  Copyright (c) 2013 Push Technology Ltd. All rights reserved.
 *
 */

#import "DFTopicMessage.h"

/**
 Protocol for receiving messages from a particular topic.
 */
@protocol DFTopicListenerDelegate

/**
 * This method is called if the TopicMessage matches the message received from Diffusion
 *
 * @param message
 * @return YES if the message is 'consumed' and should not be relayed to subsequent DFTopicListenerDelegate, nor the default listener.
 */
- (BOOL) onMessage:(DFTopicMessage *) message;

/**
 * getTopic.
 * <p>
 * <b>NB</b>: From v5.0 this method is only called when this delegate is added to the DFClient, whereas it used to be called each time a message was recieved.
 * @return the topic-name for which this delegate is invoked.
 */
- (NSString *) getTopic;

@end
