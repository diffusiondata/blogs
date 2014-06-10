/*
 * DFCredentials.h
 *
 *  Created by dhudson on 22/05/2009 - Diffusion 5.0.0_01
 *  Copyright (c) 2009 Push Technology Ltd. All rights reserved.
 */

/**
 This class represents the credential details passed to the DFClient class.
 */
@interface DFCredentials : NSObject 

@property(strong,nonatomic) NSString	*username;	/**<<  The username token */
@property(strong,nonatomic) NSString	*password;	/**<<  The password token */

/**
 Initialiase a DFCredentials object.
 @param username	Username for this object
 @param password	Password for this object
 @return An initialised DFCredentials object containing the given crendentials tokens
 @deprecated in favor of [initWithUsername:andPassword:]
 */
-(id) initWithUsernameAndPassword:(NSString *)username password: (NSString *)password __attribute__((deprecated));

/**
 Initialiase a DFCredentials object.
 @param username	Username for this object
 @param password	Password for this object
 @return An initialised DFCredentials object containing the given crendentials tokens
 */
-(id) initWithUsername:(NSString *)username andPassword: (NSString *)password;


@end
