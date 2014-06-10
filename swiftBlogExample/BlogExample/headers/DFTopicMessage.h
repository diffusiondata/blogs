/* 
 * TopicMessage.h
 *
 *  Created by dhudson on 22/05/2009 - Diffusion 5.0.0_01
 *  Copyright (c) 2013 Push Technology Ltd. All rights reserved.
 *
 */

/**
 The class for data messages that are created for a specific topic.
 */
@interface DFTopicMessage: NSObject

@property(nonatomic, strong) NSArray *userHeaders;	/**< The user headers found on this message, as an array of NSString objects */
@property(weak, nonatomic,readonly) NSArray *records;		/**<  Tokenises the message payload by &lt;RD&gt;, and returns the result as an array of NSString objects */
@property(nonatomic, strong) NSString *topic;	/**< The topic of the message */
@property(weak, nonatomic, readonly) NSData *asBytes;	/**< the message content */
@property(weak, nonatomic, readonly) NSString *asString;	/**< the message content as a UTF8 string */
@property(nonatomic,readonly) long numberOfRecords; /**< the number of records held in this message */

@property(weak, nonatomic, readonly) NSString *ackID;	/**< the Ack ID for this message, nil if not set */
@property(nonatomic, assign) int ackTimeout;	/**< The timeout in seconds */

/**
 An encoding method to use for this message. 
 Valid encoding values currently limited to DIFFUSION_MESSAGE_ENCODING_NONE_ENCODING, DIFFUSION_MESSAGE_ENCODING_ENCRYPTED_ENCODING or DIFFUSION_MESSAGE_ENCODING_COMPRESSED_ENCODING
 */
@property(nonatomic, assign) int encoding;

@property(nonatomic,readonly) BOOL needsAcknowledge DEPRECATED_ATTRIBUTE; /**< @deprecated in favor of isAckPending. */
@property(nonatomic,readonly) BOOL isAckPending;	/**< YES if this iOS client implementation needs to acknowledge receipt, and has not yet. */
@property(nonatomic,readonly) BOOL isAckRequired;	/**< YES, if the server needs to acknowledge receipt, once this message is transmitted */
@property(nonatomic,readonly) BOOL isInitialLoad;	/**< YES if the message is an initialTopicLoad message */
@property(nonatomic,readonly) BOOL isDelta;			/**< YES if the message is a delta message */
@property(nonatomic,readonly) BOOL isAckMessage;	/**< YES if this message requires acknowlegement from the client */
@property(nonatomic,readonly) BOOL isServiceLoad;	/**< YES if this message is a service-topic-load */
@property(nonatomic,readonly) BOOL isPagedLoad;	/**< YES if a load message on a 'paged' Topic */
@property(nonatomic,readonly) BOOL isTopicNotifyLoad; /**< YES if a load message on a 'topic notify' Topic */
/**
 Initialiase a TopicMessage object
 @param topic	Topic for this message
 @param message	Content of the message
 @return A newly initialiased object ready for sending
 */
-(id)initWithTopic:(NSString *)topic andData:(NSData *)message;

/**
 Initialiase a TopicMessage object
 @param topic	Topic for this message
 @param message	String content of the message
 @return A newly initialiased object ready for sending
 */
-(id)initWithTopic:(NSString *)topic andString:(NSString *)message;


/* writable only within this package */



/**
 * getAckRequired
 * @return YES if an Ack is required from the server once this message is transmitted.
 * @deprecated in favor of property isAckRequired
 */
-(BOOL)getAckRequired __attribute__((deprecated));

/**
 * Set the server-acknowledgement timeout, once this message is transmitted.
 * @param timeout in seconds
 * @return a newly generated AckID
 */
-(NSString *)setAckRequired:(int) timeout;

/**
 * @return the number of records held in this message
 * @deprecated in favor of property numberOfRecords
 */
-(long)getNumberOfRecords __attribute__((deprecated));

/**
 Fetch the given record as an NSArray of NSData*
 @param index
 @return An NSArray* holding the fields
 */
-(NSArray *)getFields:(int)index;

@end
