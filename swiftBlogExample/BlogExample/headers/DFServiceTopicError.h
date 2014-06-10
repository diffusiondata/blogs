//
//  DFServiceTopicError.h
//  DiffusionTransport
//
//  Created by Martin Cowie on 23/12/2011 - Diffusion 5.0.0_01
//  Copyright (c) 2013 Push Technology Ltd. All rights reserved.
//

@class DFTopicHandler;
@class DFServiceTopicHandler;

#define ERROR_RESPONSE_TYPE @"!ERR"

typedef enum {
	SRV, /**<  A problem has occurred whilst executing the service at the server */
	DUP, /**< Duplicate request identifier */
	TIM, /**< Request timed out */
	INV, /**< Request invalid */
	USR, /**< Error reported by user written service handler */
	UNKNOWN /**< Unknown error type */
} DFServiceErrorType;

/**
 * Encapsulates the details of a Service Topic error
 */
@interface DFServiceTopicError : NSObject 



@property(weak, nonatomic,readonly) DFServiceTopicHandler *handler; /**< Returns the handler that notified the error */
@property(nonatomic,readonly) NSString *requestID;	/**< Returns the request identifier of the failed service request */
@property(nonatomic,readonly) NSString *errorMessage;	/**< Returns the error message */
@property(nonatomic,readonly) NSString *exceptionMessage;	/**< an exception message or null if no exception message is available */
@property(nonatomic,readonly) NSString *additionalDetails;	/**< additional details if any are available , otherwise null */
@property(nonatomic,readonly) DFServiceErrorType errorType;	/**< the error type */

@end

