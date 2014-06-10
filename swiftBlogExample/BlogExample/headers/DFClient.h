// DFClient.h
// Created by dhudson on 22/05/2009 - Diffusion 5.0.0_01
// Copyright (c) 2009 Push Technology Ltd. All rights reserved.

@class AsyncSocket, ByteBuffer;

#import "DFConnectionDetails.h"
#import "DFClientDelegate.h"
#import "DFPingMessage.h"
#import "DFTopicMessage.h"
#import "DFTopicListenerDelegate.h"
#import "DFCredentials.h"
#import "DFServiceTopicHandler.h"
#import "DFPagedTopicHandler.h"
#import "DFPagedTopicDelegate.h"
#import "DFTopicNotifyTopicDelegate.h"
#import "DFTopicNotifyTopicHandler.h"

/**
 *  The main access to the Diffusion Client.
 *  An example would be to create a ConnectionDetails object and then call the connect method
 *  A DiffusionDelegate must be set on the ConnectionDetails object to receive any messages
 */

@interface DFClient : NSObject 

@property(nonatomic,readonly) BOOL					isConnected;	/**< YES if the client is connected to a Diffusion Server */
@property(nonatomic,readonly) BOOL					isReconnected;	/**< YES if the client is reconnected to a Diffusion Server */
@property(nonatomic,assign) BOOL					isDebugging;	/**< YES if the client should output debug diagnostics while interacting with Diffusion */
@property(nonatomic,readonly) NSString				*clientID;		/**< After the client has connected to Diffusion this contains the unique Client ID */
@property(nonatomic,strong) DFConnectionDetails		*connectionDetails; /**< The DFConnectionDetails object that this client will use to connect to Diffusion */
@property(nonatomic,readonly) int serverProtocolVersion, clientProtocolVersion; /**< the protocol version for this client */
@property(nonatomic,weak) NSObject<DFClientDelegate>	*delegate;	/**< Delegate object to notify when interacting with Diffusion */
@property(nonatomic,readonly) NSTimeInterval lastInteraction; /**< Returns the time (in seconds since the epoch) of the last interaction (send or receive) with the server. Can be 0 if no interaction */

/**
 Close the connection
 */
-(void) close;

/**
 Connect to Diffusion using the pre supplied ConnectionDetails
 */
-(void) connect;

/**
 Reconnect to Diffusion and attempt to reestablish use of the previous session (if there is one)
 */
-(void)reconnect;

/**
 * sends a ping to the connected Diffusion Server, this will result in a onPing(PingMessage) to be sent to the DFClientDelegate
 * @return the timestamp string used
 */
-(NSString *) ping;

/**
 * send a message to the Diffusion Server for the given topic
 * @param topic the message topic
 * @param message the message
 */
-(void) send:(NSString *) topic message: (NSString *) message;

/**
 * send a TopicMessage to Diffusion
 * @param aTopicMessage the TopicMessage to send
 */
-(void) sendTopicMessage:(DFTopicMessage *) aTopicMessage;


/**
 * @param topicSet the topicSet to subscribe to
 */
-(void) subscribe:(NSString *) topicSet;

/**
 * @param topicSet the topicSet to unsubscribe to
 */
-(void) unsubscribe:(NSString *) topicSet;

/**
 * @param credentials send credentials to the server
 */
-(void) sendCredentials:(DFCredentials *) credentials;

/**
 * @param delegate add a DFTopicListenerDelegate, if the delegate topic matches the message topic, then onMessage function is called. Idiomatic of Objective C this delegate is not retained.
 */
-(void) addTopicListener:(__weak NSObject<DFTopicListenerDelegate>*) delegate;


/**
 * @param delegate remove a DFTopicListenerDelegate
 */
-(void) removeTopicListener:(NSObject<DFTopicListenerDelegate>*) delegate;

/**
 * Remove all topic listeners
 */
-(void) removeAllTopicListeners;

/**
 * Get a read-only copy of the set of DFTopicListenerDelegate objects
 */
-(NSArray*)topicListeners;


/**
 * Issue a fetch request to the Diffusion server, for the given set of comma delimeted topic-names
 * @param topicSet Name of the topic to fetch
 * @throws DFException if the connected server implements less than protocol level 3
 * @deprecated in favor of [fetch:error:]
 */
-(void)fetch:(NSString *)topicSet __attribute__((deprecated));

/**
 * Issue a fetch request to the Diffusion server, for the given set of comma delimeted topic-names
 * @param topicSet Name of the topic to fetch
 * @param error set if the connected server implements less than protocol level 3
 * @returns NO if the call failed
 */
-(BOOL)fetch:(NSString *)topicSet error:(NSError*__autoreleasing *)error;

/**
 * Issue a fetch request to the Diffusion server, for the given set of comma delimeted topic-names.
 * @param topicSet Name of the topic to fetch
 * @param headers NSArray of NSString that will be relayed back from the server to aid request correlation
 * @throws DFException if the connected server implements less than protocol level 3
 * @deprecated in favor of [fetch:withCorrelation:error:]
 */
-(void)fetch:(NSString *)topicSet withCorrelation:(NSArray*)headers __attribute__((deprecated));;

/**
 * Issue a fetch request to the Diffusion server, for the given set of comma delimeted topic-names.
 * @param topicSet Name of the topic to fetch
 * @param headers NSArray of NSString that will be relayed back from the server to aid request correlation
 * @param error set if the connected server implements less than protocol level 3;
 * @returns NO if the call failed
 */
-(BOOL)fetch:(NSString *)topicSet withCorrelation:(NSArray*)headers error:(NSError*__autoreleasing*)error;

/**
 * Send a message acknowledgement back to the server.  This will be required if autoAck is set to NO
 * @param message message to acknowledge
 */
-(void) acknowledge:(DFTopicMessage *) message;

/**
 * Create a new DFServiceTopicHandler
 * @since 4.1
 * @param message a service-topic-load message
 * @param delegate an object that implements the DFServiceTopicDelegate protocol. Idiomatic of Objective C, this object is not retained.
 * @return a newly created DFServiceTopicHandler or nil in case of error
 *
 * @throws DFException if the connected server implements less than protocol level 4
 * @deprecated in favor of [createServiceTopicHandlerWithMessage:andDelegate:error]
 */
-(DFServiceTopicHandler*)createServiceTopicHandlerWithMessage:(DFTopicMessage*)message
												  andDelegate:(__weak NSObject<DFServiceTopicDelegate>*)delegate;

/**
 * Create a new DFServiceTopicHandler
 * @param message a service-topic-load message
 * @param delegate an object that implements the DFServiceTopicDelegate protocol. Idiomatic of Objective C, this object is not retained.
 * @param error populated in cases of error
 * @return a newly created DFServiceTopicHandler or nil in case of error
 *
 * @since 4.6
 */
-(DFServiceTopicHandler*)createServiceTopicHandlerWithMessage:(DFTopicMessage*)message
												  andDelegate:(__weak NSObject<DFServiceTopicDelegate>*)delegate
														error:(NSError*__autoreleasing*)error;

/**
 * Creates a handler object for a 'paged' Topic.
 *
 * @since 4.1
 * @param message the load message received from the Topic.
 * @param delegate an object that is to receive all notifications from the topic. Idiomatic of Objective C, this object is not retained.
 * @return the handler which may be used to send requests to the Topic.
 * 
 * @throws DFException if the connected server implements less than protocol level 4
 * @deprecated in favor of [createPagedTopicHandlerWithMessage:andDelegate:]
 */
-(DFPagedTopicHandler*)createPagedTopicHandlerWithMessage:(DFTopicMessage*)message
											  andDelegate:(__weak NSObject<DFPagedTopicDelegate>*)delegate __attribute__((deprecated));

/**
 * Creates a handler object for a 'paged' Topic.
 *
 * @param message the load message received from the Topic.
 * @param delegate an object that is to receive all notifications from the topic. Idiomatic of Objective C, this object is not retained.
 * @param error populated in cases of error
 *
 * @return the handler which may be used to send requests to the Topic, or nil in case of error
 *
 * @since 4.6
 */
-(DFPagedTopicHandler*)createPagedTopicHandlerWithMessage:(DFTopicMessage*)message
											  andDelegate:(__weak NSObject<DFPagedTopicDelegate>*)delegate
													error:(NSError*__autoreleasing*)error;

/**
 * Creates a handler object for a 'Topic Notify' Topic.
 *
 * @param message the load message received from the Topic.
 * @param delegate an object that is to receive all notifications from the Topic. Idiomatic of Objective C, this object is not retained.

 * @return the handler which may be used to send requests to the Topic.
 * @throws DFException if unable to create the handler.
 * @since 4.5
 * @deprecated in favor of [createTopicNotifyTopicHandlerWithMessage:andDelegate:error:]
 */
-(DFTopicNotifyTopicHandler*)createTopicNotifyTopicHandlerWithMessage:(DFTopicMessage*)message
														  andDelegate:(__weak NSObject<DFTopicNotifyTopicDelegate>*)delegate __attribute__((deprecated));;

/**
 * Creates a handler object for a 'Topic Notify' Topic.
 *
 * @param message the load message received from the Topic.
 * @param delegate an object that is to receive all notifications from the Topic. Idiomatic of Objective C, this object is not retained.
 * @param error populated in cases of error
 * @return the handler which may be used to send requests to the Topic, or nil in case of error.
 *
 * @since 4.6
 */
-(DFTopicNotifyTopicHandler*)createTopicNotifyTopicHandlerWithMessage:(DFTopicMessage*)message
														  andDelegate:(__weak NSObject<DFTopicNotifyTopicDelegate>*)delegate
																error:(NSError*__autoreleasing*)error;


/**
 * Dictionary of optional values used when establishing SSL/DPTS connections.
 * Make the iOS device overlook self signed certificates with this, for example...
 * [[DFClient sslOptions] setObject:[NSNumber numberWithBool:YES] forKey:(NSString*)kCFStreamSSLAllowsAnyRoot];
 */
+(NSMutableDictionary*)sslOptions;

@end

// ===================================
//	Documentation for the front page
// ===================================


/*! \mainpage Diffusion client library for iOS devices
 
 \section Introduction
 
 This documentation covers the Diffusion client library for iOS devices, which is supplied as a static library with header files.
 
 \subsection SDKs Supported SDKs
 
 This version of the Diffusion client library for iOS devices supports between iOS v5.1.1 and v7.1 inclusively.
 
 \subsection CPUs Supported CPUs
 
 ARM CPUs armv7, armv7s and arm64, Intel CPUs i386 and x86_64.
 
 \subsection Changes in v5.0

 This version of the Diffusion client library for iOS devices employs Automatic Reference Counting and will reuse topic-aliases when sending messages to the Diffusion server.
 
 */
