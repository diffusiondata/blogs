//
//  DFServiceTopicResponse.h
//  DiffusionTransport
//
//  Created by Martin Cowie on 23/12/2011 - Diffusion 5.0.0_01
//  Copyright (c) 2013 Push Technology Ltd. All rights reserved.
//

@class DFServiceTopicHandler, DFTopicMessage;


/**
 * Encapsulates a response from a service request.
 * <P>
 * This encapsulates the details of a response from a call to [DFServiceTopicHandler sendRequest:withRequestType:]
 */

@interface DFServiceTopicResponse : NSObject 


@property(weak, nonatomic,readonly) DFServiceTopicHandler *handler; /**< Parent handler object */
@property(nonatomic,readonly) NSString *responseType; /**< This identifies the type of response and is as defined by the service itself */
@property(nonatomic,readonly) NSString *requestID; /**< This returns the original identifier that was passed with the request */
@property(nonatomic,readonly) DFTopicMessage *responseMessage; /**< Return details of the response in the form of a Message containing headers and/or data returned from the server */

@end
