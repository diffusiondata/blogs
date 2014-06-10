//
//  DFServiceTopicHandler.h
//  DiffusionTransport
//
//  Created by Martin Cowie on 23/12/2011 - Diffusion 5.0.0_01
//  Copyright (c) 2013 Push Technology Ltd. All rights reserved
//

#import "DFTopicListenerDelegate.h"
#import "DFServiceTopicDelegate.h"

@class DFClient, DFTopicMessage;

/**
 The class for making and handling service calls to topics with service topicdata.
 */
@interface DFServiceTopicHandler : NSObject<DFTopicListenerDelegate> 

@property(nonatomic, readonly) NSString *serviceType; /**< The symbolic 'service' type' string returned from the service upon subscription */
@property(nonatomic, readonly) NSString *topicCategory;
@property(weak, nonatomic, readonly,getter = getTopic) NSString *topic; /**< Topic to which this service is bound */
@property(nonatomic, readonly) DFTopicMessage *serviceData; /**< Returns a message containing any fixed data returned upon subscription */
@property(weak, nonatomic, readonly) DFClient *client; /**< Returns the client connection */


/**
 * Sends a request to the Service.
 * <P>
 * If the request succeeds then a response will be returned on 
 * [DFServiceTopicDelegate serviceResponse:] and
 * if it fails or is timed out at the server then an error will be returned
 * on [DFServiceTopicDelegate serviceError:].
 *
 * @param type The request type. This must be one of the allowed types for the service.
 * 
 * @param message Optional request data. If supplied then the headers and data from the given Message will be sent with the request.
 * 
 * @return unique request identifier
 */
-(NSString*)sendRequest:(DFTopicMessage*)message withRequestType:(NSString*)type;


/**
 * Sends a request to the Service.
 * <P>
 * If the request succeeds then a response will be returned on
 * [DFServiceTopicDelegate serviceResponse:] and
 * if it fails or is timed out at the server then an error will be returned
 * on [DFServiceTopicDelegate serviceError:].
 *
 * @param type The request type. This must be one of the allowed types for the service.
 *
 * @param message Optional request data. If supplied then the headers and data from the given Message will be sent with the request.
 *
 * @param uid request identifier. Use the method 'getRequestUID' for the next suitable UID. UIDs need only be unique in this session.
 *
 * @return the value of argument 'uid'
 */
-(NSString*)sendRequest:(DFTopicMessage*)message withRequestType:(NSString*)type andUID:(NSString*)uid;

/**
 * Get the next unique request ID for use with sendRequest:withRequestType:andUID:
 */
-(NSString*)getNextRequestID;


@end
