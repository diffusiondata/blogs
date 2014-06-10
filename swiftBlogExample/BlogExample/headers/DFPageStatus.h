//
//  DFPageStatus.h
//  DiffusionTransport
//
//  Created by MARTIN COWIE on 05/01/2012 - Diffusion 5.0.0_01
//  Copyright (c) 2013 Push Technology Ltd. All rights reserved.
//

@class DFTopicMessage;

/**
 * Status of page
 *
 * @author Martin Cowie - created 6 Jan 2012
 * @since 4.1
 */
@interface DFPageStatus : NSObject 

@property(readonly,nonatomic) int currentPage;			/**< Returns the current page number, Note that the first page is numbered 1 */
@property(readonly,nonatomic) int lastPage;				/**< The current highest page number. */
@property(readonly,nonatomic) int totalNumberOfLines;	/**< the total number of lines. */
@property(readonly,nonatomic) BOOL dirty;				/**< Returns whether the page is 'dirty', meaning that has been returned for it is currently out of date and the page needs to be refreshed. */



@end
