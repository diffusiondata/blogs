//
//  DFServiceTopicDelegate.h
//  DiffusionTransport
//
//  Created by Martin Cowie on 23/12/2011 - Diffusion 5.0.0_01
//  Copyright (c) 2013 Push Technology Ltd. All rights reserved.
//

#import "DFServiceTopicResponse.h"
#import "DFServiceTopicError.h"

/**
 * Listener for responses from a Service Topic.
 *<P>
 * A Service Topic is one that provides request/response capability
 * (see ServiceTopicData). When a Client subscribes to a Service Topic
 * then a Topic Load Message will be received by the Client that indicates
 * that it is a TopicMessage#isServiceLoad() Service Load Message.
 * In response to such a Message the Client application should create a
 * ServiceTopicHandler using the Client connection 
 * ExternalClientConnection#createServiceTopicHandler(TopicMessage, ServiceTopicListener) method
 * and declaring a listener of this type to receive all responses and
 * notifications from the Topic.
 *
 * @author pwalsh - created 1 Dec 2011
 * @since 4.1
 */
@protocol DFServiceTopicDelegate <NSObject>

/**
 * Notifies a response from a service request.
 * <P>
 * This will return a response from a previous call of 
 * ServiceTopicHandler#request(String, TopicMessage).
 *
 * @param responseDetails encapsulates all details of the response.
 */
-(void)serviceResponse:(DFServiceTopicResponse*)responseDetails;

/**
 * Notifies an error on a service request.
 * <P>
 * This would indicate that a previous call to 
 * ServiceTopicHandler#request(String, TopicMessage) has failed
 * for some reason at the server.
 *
 * @param errorDetails encapsulates details of the error
 */
-(void)serviceError:(DFServiceTopicError*)errorDetails;

@end
