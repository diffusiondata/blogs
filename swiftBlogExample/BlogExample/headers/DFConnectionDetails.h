/*
 * ConnectionDetails.h
 *
 *  Created by dhudson on 22/05/2009 - Diffusion 5.0.0_01
 *  Copyright (c) 2009 Push Technology Ltd. All rights reserved.
 *
 *  This class represents the connection details passed to the DFClient class
 */

#import "DFConnectionDetails.h"
#import "DFClientDelegate.h"
#import "DFCredentials.h"
#import "DFServerDetails.h"
#import "DFBaseConnectionProperties.h"

/**
 A collection of DFServerDetails objects, with some default values.
 */
@interface DFConnectionDetails :  NSObject 

@property(nonatomic,readonly) DFBaseConnectionProperties *defaults; /**< The set of defaults to use when a DFServerDetails object in serverDetails lacks a setting */
@property(nonatomic,readonly) NSArray *serverDetails; /**< The pool of DFServerDetails objects  */

@property(nonatomic,assign) BOOL isAutoAck; /**< YES if auto acknowledge is switched on. If this is set to NO, it is down to the implementation to ack message from the server */
@property(nonatomic,assign) BOOL isAutoFailover;	/**< Once a connection to Diffusion is place, should it fail, if there is a pool of DFServerDetail objects to pick from, then the next DFServerDetail object is chosen and a connection placed to it */
@property(nonatomic,assign) BOOL isLoadBalance;	/**< If YES, the list of of DFServerDetail objects is shuffled prior to use */
@property(nonatomic,assign) BOOL isCascade;		/**< When the Diffusion client attempts to place a connection, should the attempt fail, then the next server-details object in the list is chosen. It is similar to isAutoFailover except this logic is apply prior to a connection */

@property(nonatomic,readonly) DFServerDetails *currentServerDetails; /**< Server details object currently in use */

/**
 Initialiase the DFConnectionDetails object.
 @param server		A single DFServerDetails object, detailing the location of the Diffusion server
 @param topicSet	A default list of topic-names, as a comma seperated list, may be nil.
 @param credentials	A default set of credentials to use, may be nil.
 */
-(id)initWithServer:(DFServerDetails*)server topics: (NSString*)topicSet andCredentials:(DFCredentials*)credentials;

/**
 Initialiase the DFConnectionDetails object.
 @param servers		An NSArray of DFServerDetails object, detailing the location of the Diffusion server
 @param topicSet	A default list of topic-names, as a comma seperated list, may be nil.
 @param credentials	A default set of credentials to use, may be nil.
 */
-(id)initWithServers:(NSArray*)servers topics: (NSString*)topicSet andCredentials:(DFCredentials*)credentials;

/**
 Reset the next-server-index to zero
 */
-(void)reset;

/**
 Get next serverDetails object from the list
 */
-(DFServerDetails*)getNextServerDetails;


@end

