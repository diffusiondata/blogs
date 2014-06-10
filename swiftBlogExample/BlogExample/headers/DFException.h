/*
 *  DiffusionException.h
 *  Created by dhudson on 22/06/2009 - Diffusion 5.0.0_01
 *  Copyright 2009 Push Technology Ltd. All rights reserved.
 */


/**
 A Diffusion specific exception class.
 */
@interface DFException : NSException

/*
 Initialiase a DFExceptio object
 @param message	String content of the exception
 @return An initialiased DFException object
 */
-(id) initWithMessage: (NSString*) message;

@end
