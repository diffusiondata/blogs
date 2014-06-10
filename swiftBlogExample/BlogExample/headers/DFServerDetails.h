//
//  DFServerDetails.h
//  DiffusionTransport
//
//  Created by Martin Cowie on 14/04/2011 - Diffusion 5.0.0_01
//  Copyright 2011 Push Technology. All rights reserved.
//

#import "DFBaseConnectionProperties.h"
@class AsyncSocket, DFClient;

/**
 An object to contain details required to connect to a single instance of Diffusion.
 */
@interface DFServerDetails : DFBaseConnectionProperties 

/**
 Initialise an DFServerDetails object.
 
 URLs given must be of the form dpt://push.acme.com:443. 
 The port number is mandatory as no default port number if assumed.
 
 @param url URL of the required Diffusion server. Only URLs starting "dpt://" or "dpts://" are supported.
 @return an initialiased DFServerDetails object
 @throws DFException if the URL scheme is unsupported or is missing the port number.
 @deprecated in favor of [initWithURL:error:]
 */
-(id)initWithURL:(NSURL*)url __attribute__((deprecated));

/**
 Initialise an DFServerDetails object.
 
 URLs given must be of the form dpt://push.acme.com:443.
 The port number is mandatory as no default port number if assumed.
 
 @param url URL of the required Diffusion server. Only URLs starting "dpt://" or "dpts://" are supported.
 @param error Error object to populate in the possibility that is method call should fail
 @return an initialiased DFServerDetails object, or nil in case of error
 */
-(id)initWithURL:(NSURL*)url error:(NSError*__autoreleasing*)error;


@property(nonatomic,readonly) NSURL *url; /**< The URL describing the location of the Diffusion serer */

@end
