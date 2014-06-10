/*
 *  DFClientDelegate.h
 *
 *  Created by Darren Hudson on 24/05/2009 - Diffusion 5.0.0_01
 *  Copyright (c) 2009 Push Technology Ltd. All rights reserved.
 *
 *  This is the protocol definition for the DFClient delegate
 */
#import "DFPingMessage.h"
#import "DFTopicMessage.h"
#import "DFServerDetails.h"

/**
 Protocol implemented by classes wishing to receive notification from Diffusion.
 Notification primarily of new messages and the state of the connection to the server.
 */
@protocol DFClientDelegate

/**
 * This method will be called when the DFClient trys to connect, if the connection is made then isConnected will be YES
 * @param isConnected
 */
- (void) onConnection:(BOOL) isConnected;

/**
 * This method will be called when the DFClient has lost connection to the Diffusion Server
 */
- (void) onLostConnection;

/**
 * This method will be called when the Diffusion Server has terminated the connection (barred)
 */
- (void) onAbort;

/**
 * This method will be called when a message has been received from the Diffusion Server.
 * This method will be called as well as any TopicListeners that might match the topic.
 */
- (void) onMessage:(DFTopicMessage *) message;

/**
 * This method will be called on receipt of the ping request
 * @see DFClient
 * @param message PingMessage
 */
- (void) onPing:(DFPingMessage *) message;

/**
 * This method will be called after a send credentials message, and the server rejected the credentials
 * @see DFClient
 */
- (void) onServerRejectedConnection;

/**
 * This method will be called if the server didn't respond to an Ack Message in time
 * @see TopicMessage
 */
- (void) onMessageNotAcknowledged:(DFTopicMessage *) message;

/**
 The list of DFServerDetails object has been exhausted, and no connection can be placed.
 Once this method is called the set of DFServerDetails is reset and further connections can be placed. In most simple scenarios where
 there is only one DFServerDetails object in the DFConnectionDetails object it should suffice to call method [client connect] here.
 @param client DFClient that has exhausted its set of DFServerDetails object from the DFClientDetails object.
 */
-(void)onConnectionSequenceExhausted:(DFClient*)client;

@optional

/**
 Conveys news from the Diffusion server that the named topic no longer exists
 */
-(void)onTopicRemoved:(NSString*) topicName;

/**
 The given DFServerDetails object has been selected for connection.
 @param details Details object that has been chosen.
 @param client DFClient that has chosen this DFServerDetails
 */
-(void)onConnectionDetailsAcquired:(DFServerDetails*)details forClient:(DFClient*)client;


@end
