//
//  DFBaseConnectionDetails.h
//  DiffusionTransport
//
//  Created by Martin Cowie on 15/04/2011 - Diffusion 5.0.0_01
//  Copyright 2013 Push Technology Ltd. All rights reserved.
//

#import "DFCredentials.h"

/**
 Base set of properties common to both ServerDetails and ConnectionDetails.
 */
@interface DFBaseConnectionProperties : NSObject 

@property(nonatomic,weak) NSNumber *timeout;			/**<  Connection timeout in seconds, if unset defers to the defaults object */
@property(nonatomic,strong) DFCredentials *credentials;	/**<  Optional credentials object, if unset defers to the defaults object */
@property(nonatomic,strong) NSString *topicSet;			/**<  Comma seperated string of topic names and selectors, if unset defers to the defaults object */
@property(nonatomic,strong) DFBaseConnectionProperties *defaults;	/**<  A set of defaults to draw upon when a property is unset */

/**
 Basic initialisation method.
 Sets all contents to nil
 */
-(id)init;

@end
