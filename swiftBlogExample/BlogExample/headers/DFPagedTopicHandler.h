//
//  DFPagedTopicHandler.h
//  DiffusionTransport
//
//  Created by Martin Cowie on 05/01/2012 - Diffusion 5.0.0_01
//  Copyright (c) 2013 Push Technology Ltd. All rights reserved.
//

#import "DFTopicListenerDelegate.h"
#import "DFPagedTopicDelegate.h"

/**
 * Paging Options
 *
 * @author Martin Cowie - 6 Jan 2012
 * @since 4.1
 */
typedef enum {
	REFRESH,	/**< Refresh the current page */
	NEXT,		/**< Move to next page. If no next page then this has the same effect as REFRESH */
	PRIOR,		/**< Move to prior page. If no prior page then this has the same effect as REFRESH. */
	FIRST,		/**< Move to first page. */
	LAST		/**< Move to last page. */
} DFPageOption;

@class DFClient;

/**
 * A Paged Topic Handler.
 * <P>
 * This is an object which is used to send commands to a 'paged' Topic.
 * (see PagedTopicData). The handler simplifies the use of such a
 * Topic and avoids having to format messages to send to the Topic or parse
 * messages received from it.
 * <P>
 * Such a handler is created using 
 * [DFClient createPagedTopicHandlerWithMessage:andDelegate]
 * and all notifications from the Topic will be routed through the supplied
 * listener.
 * <P>
 * When such a handler is in use then messages received on the Topic will not
 * be delivered to the DFClientListener delegate declared to the DFClient object.
 *
 * @author Martin Cowie - created 6 Jan 2012
 * @since 4.1
 */
@interface DFPagedTopicHandler : NSObject<DFTopicListenerDelegate> 

@property(weak, readonly,nonatomic) DFClient* connection;	/**< Get the connection (the client object that created the handler). */
@property(readonly,nonatomic) NSString *topicName;	/**< Get the topic-name associated with this handler. */


/**
 * Open the Topic.
 * <P>
 * This is used to request the initial page and then receive updates.
 * Updates will be received until [close] is called or the Topic is
 * unsubscribed.
 * <P>
 * If the Topic is already open then this may be called again to resubmit
 * with a different number of lines if required.
 * 
 * @param linesPerPage the number of lines required per page. This must be a
 * positive value.
 * 
 * @param page specifies the first page to be sent. This can be an
 * absolute page number (from 1 to n) or -1 to indicate the current last
 * page. The resulting page will be received on the
 * [DFPagedTopicDelegate pageWithLines:status:handler:]
 * method of the associated listener.
 * 
 * @throws DFException if linesPerPage is not positive
 */
-(void)openLinesPerPage:(int)linesPerPage onPage:(int)page;

/**
 * Requests a page, relative to the current page.
 * <P>
 * The resulting page will be received on the
 * [DFPagedTopicDelegate pageWithLines:status:handler:]
 * method of the associated delegate.
 * 
 * @param pageOption specifies the page option required.
 * 
 * @throws DFException if the Topic is not open or the request fails.
 */
-(void)page:(DFPageOption)pageOption;

/**
 * Requests a page by absolute page number.
 *
 * @param pageNumber the page number or -1 to indicate the last page.
 * 
 * @throws DFException if the Topic is not open or the request fails.
 */
-(void)pageNumber:(int)pageNumber;

/**
 * Close the Topic.
 * <P>
 * The Topic will remain subscribed but no more notifications will be
 * received and no requests can be sent.
 * 
 * @throws DFException if unable to send close request
 */
-(void)close;

@end
