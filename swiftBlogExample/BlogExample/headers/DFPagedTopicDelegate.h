//
//  DFPagedTopicDelegate.h
//  DiffusionTransport
//
//  Created by Martin Cowie on 05/01/2012 - Diffusion 5.0.0_01
//  Copyright (c) 2013 Push Technology Ltd. All rights reserved.
//

@class DFPagedTopicHandler, DFPageStatus;

/**
 * Delegate for events from a Paged Topic
 *
 * @author Martin Cowie - created 6 Jan 2012
 * @since 4.1
 */
@protocol DFPagedTopicDelegate <NSObject>

/**
 * Notifies receipt of a page from the server.
 * <P>
 * This may be received in response to 
 * [DFPagedTopicHandler openLinesPerPage:linesPerPage] or 
 * [DFPagedTopicHandler page] requests.
 * 
 * @param handler the handler
 * 
 * @param status the current status of the Topic.
 * 
 * @param lines the lines of data on the page. Contains either NSString or NSArray objects for string or record based topics, respectively.
 */
-(void)pageWithLines:(NSArray*)lines status:(DFPageStatus*)status handler:(DFPagedTopicHandler*)handler;

/**
 * Notifies lines added to the end of the current page.
 * <P>
 * @param handler the handler
 * 
 * @param status the current status of the Topic.
 * 
 * @param lines the lines of data to be added to the end of the current
 * page. There may be less than or equal to the number of lines required to
 * fill the page and the status would indicate whether there is now more
 * following the current page. 
 */
-(void)addedLines:(NSArray*)lines status:(DFPageStatus*)status handler:(DFPagedTopicHandler*)handler;



/**
 * Notifies a status change.
 * <P>
 * This will happen if lines have been added or removed which affect the
 * pagination (e.g. the current page number of the total number of pages
 * has changed). If lines have been added or removed on or before the
 * current page then the status will indicate that the page is 'dirty',
 * meaning that what is currently displayed is out of date and should be
 * refreshed (using [DFPagedTopicHandler page]) .
 * <P>
 * @param handler the handler
 * @param status the current status in relation to the current page.
 */
-(void)statusChanged:(DFPageStatus*)status handler:(DFPagedTopicHandler*)handler;

@optional
/**
 * Notifies an update to the data of a line on the current page.
 * <P>
 * @param handler the handler
 *
 * @param index the relative index of the line within the current page
 * (where the index of the first line is 0).
 *
 * @param lines an NSArray containing a single line of data
 * which may be used to replace the current line.
 * @deprecated in favor of [updatedLines:status:index:handler:]
 */
-(void)updatedLines:(NSArray*)lines index:(int)index handler:(DFPagedTopicHandler*)handler __attribute__((deprecated));

/**
 * Notifies an update to the data of a line on the current page.
 * <P>
 * @param handler the handler
 *
 * @param status the current status of the Topic
 *
 * @param index the relative index of the line within the current page
 * (where the index of the first line is 0).
 *
 * @param lines an NSArray containing a single line of data
 * which may be used to replace the current line.
 */
-(void)updatedLines:(NSArray*)lines status:(DFPageStatus*)status index:(int)index handler:(DFPagedTopicHandler*)handler;

@end
