/** 
 * \file DFCommon.h
 * \brief Common constants, macros and enumerations
 *
 *  Created by mcowie on 15/10/2010 - Diffusion 5.0.0_01
 *  Copyright (c) 2009 Push Technology Ltd. All rights reserved.
 *
 */

/** Logging macro
  * <p>
  * Prints filename, function-name and line number, then the arguments, providing DEBUG is defined.
  * @param fmt printf-style format string
  */
#ifdef DEBUG
#	define DLog(fmt, ...) NSLog((@"%s [Line %d] " fmt), __PRETTY_FUNCTION__, __LINE__, ##__VA_ARGS__)
#else
#	define DLog(fmt, ...)
#endif

#define DF_PRIVATE(x) x
#define DF_PRIVATE_FILE /* nothing */

#define K 1024

#define DIFFUSION_MESSAGE_TYPE_INITIAL_TOPIC_LOAD	20
#define DIFFUSION_MESSAGE_TYPE_DELTA				21
#define DIFFUSION_MESSAGE_TYPE_SUBSCRIBE			22
#define DIFFUSION_MESSAGE_TYPE_UNSUBSCRIBE			23
#define DIFFUSION_MESSAGE_TYPE_SERVER_PING			24
#define DIFFUSION_MESSAGE_TYPE_CLIENT_PING			25
#define DIFUFSION_MESSAGE_TYPE_SEND_CREDS			26
#define DIFFUSION_MESSAGE_TYPE_REJECTED_CREDS		27
#define DIFFUSION_MESSAGE_TYPE_CLIENT_ABORT			28
#define DIFFUSION_MESSAGE_TYPE_LOST_CONNECTION		29
#define DIFFUSION_MESSAGE_TYPE_ITL_REQ_ACK			30
#define DIFFUSION_MESSAGE_TYPE_DELTA_REQ_ACK		31
#define DIFFUSION_MESSAGE_TYPE_ACK_RESPONSE			32
#define DIFFUSION_MESSAGE_TYPE_FETCH				33
#define DIFFUSION_MESSAGE_TYPE_FETCH_RESPONSE		34
#define DIFFUSION_MESSAGE_TYPE_TOPIC_STATUS_NOTIFICATION	35

// Service/command messages - v4 feature
#define DIFFUSION_MESSAGE_TYPE_COMMAND					36
#define DIFFUSION_MESSAGE_TYPE_COMMAND_TOPIC_LOAD		40
#define DIFFUSION_MESSAGE_TYPE_COMMAND_NOTIFICATION		41

// Fragemented messages - v4 feature
#define FLAG_FRAGMENTED 0x40
#define DIFFUSION_MESSAGE_TYPE_INITIAL_TOPIC_LOAD_FRAGMENT ( DIFFUSION_MESSAGE_TYPE_INITIAL_TOPIC_LOAD | FLAG_FRAGMENTED )
#define DIFFUSION_MESSAGE_TYPE_DELTA_FRAGMENT			( DIFFUSION_MESSAGE_TYPE_DELTA | FLAG_FRAGMENTED )
#define DIFFUSION_MESSAGE_TYPE_FETCH_RESPONSE_FRAGMENT	( DIFFUSION_MESSAGE_TYPE_FETCH_RESPONSE | FLAG_FRAGMENTED )
#define DIFFUSION_MESSAGE_TYPE_FRAGMENT_SET_CANCEL		0x30

#define DIFFUSION_MESSAGE_ENCODING_NONE_ENCODING		0
#define DIFFUSION_MESSAGE_ENCODING_ENCRYPTED_ENCODING	17
#define DIFFUSION_MESSAGE_ENCODING_COMPRESSED_ENCODING	18
#define DIFFUSION_MESSAGE_ENCODING_BASE64_ENCODING		19

#define DIFFUSION_MESSAGE_ENCODING_ENCRYPTED_REQUESTED	1
#define DIFFUSION_MESSAGE_ENCODING_COMPRESSED_REQUESTED	2
#define DIFFUSION_MESSAGE_ENCODING_BASE64_REQUESTED		3

#define MD "\x00"
#define MD_CHAR 0

#define RD "\x01"
#define RD_CHAR 1

#define FD "\x02"
#define FD_CHAR 2



/**
 * The protocols currently supported
 */
#define DPT @"dpt"
#define DPTS @"dpts"

@interface NSMutableData (DFCommon)

@end

@interface NSArray (DFCommon) 

@end

/**
 * Specifies the mode when selecting topic ranges for notification
 * @since 4.6
 */
typedef enum {
	DSM_ADD, /**< This indicates that the specified set of topic names and/or selectors should be added to any existing selection */
	DSM_REPLACE, /**< This indicates that the specified set of topic names and/or selectors should replace any current selections */
	DSM_REMOVE, /**< Specifies that the specified set of topic names and/or selectors should be removed from the current set of selections. Only string values that exactly match previously set selectors will be removed */
	DSM_CLEAR /**< Specifies that all current selections should be removed */
} DFSelectionMode;


/**
 * Specifies the level of notification that the client wishes to receive.
 * @since 4.6
 */
typedef enum {
	DNL_MINIMUM, /**< The minimum level of notification that can be received which will simply notify the topic name and its type */
	DNL_PROPERTIES, /**< This level of notification is the same as DNL_MINIMUM plus all properties of the Topic. See DFTopicProperty and DFTopicDefinition. */
	DNL_METADATA, /**< This level of notification is the same as DNL_MINIMUM plus any metadata associated with the Topic. */
	DNL_FULL, /**< The level of notification provides all details of the Topic and would be the level needed in order to replicate the Topic. This is equivalent to DNL_MINIMUM plus DNL_PROPERTIES plus DNL_METADATA. */
	DNL_NONE /**< This special setting may be used to indicate that add notifications are not required */
} DFNotificationLevel;


/**
 * Defines the type of an instance of TopicData
 * @since 4.6
 */
typedef enum {
	DTDT_ERROR_ENUM = -1, /** Error parsing the TopicData type */
	DTDT_NONE = 0, /**< No Topic Data. This special type is used to represent a Topic that has no Topic Data. */
	DTDT_SINGLE_VALUE, /**< Single Value Format. Publishing Topic Data of type SingleValueTopicData. */
	DTDT_RECORD, /**< Diffusion Record Format. Publishing Topic Data of type RecordTopicData.*/
	DTDT_PROTOCOL_BUFFER, /**< Protocol Buffers (from Google). Publishing Data of type PBTopicData. */
	DTDT_CUSTOM, /**< Custom. Publishing Topic Data of type CustomTopicData. */
	DTDT_SLAVE, /**< Slave Topic Data. Publishing Topic Data of type SlaveTopicData */
	DTDT_SERVICE, /**< Service Topic Data. Functional Command Topic Data of type ServiceTopicData */
	DTDT_PAGED_STRING, /**< Paged String Value Topic Data. Functional Command Topic Data of type PagedStringTopicData */
	DTDT_PAGED_RECORD, /**< Paged Record Topic Data. Functional Command Topic Data of type PagedRecordTopicData */
	DTDT_TOPIC_NOTIFY, /**< Topic Notify Topic Data. Functional Command Topic Data of type TopicNotifyTopicData */
	DTDT_ROUTING, /**< Routing Topic Data. Functional Topic Data of type RoutingTopicData */
	DTDT_CHILD_LIST, /**< Child Topics List. Functional Topic Data of type ChildListTopicData. */
	DTDT_REMOTE_CONTROL, /**< Remote Control Topic Data. Functional Topic Data of type RemoteControlTopicDataEdge */
	DTDT_REMOTE_SERVICE, /**< Remote Service Topic Data. Functional Topic Data of type RemoteServiceTopicData in an Edge role. */
	DTDT_REMOTE_CONTROL_RELAY, /**< Remote Control Topic Data in the relay tier. Functional Topic Data of type RemoteControlTopicDataRelay */
	DTDT_REMOTE_SERVICE_RELAY /**< Remote Service Topic Data in the relay tier. Functional Topic Data of type RemoteServiceTopicData in a relay role. */
} DFTopicDataType;




/**
 * Specifies Topic Property keys that may be used in the DFTopicDefinition properties field.
 *
 * @since 4.6
 */
typedef enum {
	DTP_ALIASING, /**< Specifies whether the Topic should use Topic Aliasing.
     * This is an optional Boolean property and if not specified then the
     * aliasing requirement will be taken from the Publisher. */
	
	DTP_ATTACHMENT, /**< This property defines the topic attachment.
				 * This is an optional Object to be attached to the topic. */

	DTP_ATTACHMENT_CLASS,/**< This property defines the a Topic attachment class.
					  * This is an optional String property specifying a full class name.
					  * If specified then the no arguments constructor of the class will be used
					  * to create an instance of the class and attach it to the topic.
					  * This property would be ignored if DTP_ATTACHMENT is specified. */
	DTP_CUSTOM_HANDLER, /**<  Specifies a Custom Topic Handler.
					 * <P>
					 * This is used with Topics of type DTP_CUSTOM but would
					 * be ignored for all other types.
					 * <P>
					 * It is an Object property where the object must be of type
					 * CustomTopicDataHandler. */
	DTP_CUSTOM_HANDLER_CLASS, /**< Specifies a Custom Topic Handler.
						   * <P>
						   * This is used with Topics of type DTP_CUSTOM but would
						   * be ignored for all other types.
						   * <P>
						   * This is a String property specifying a loadable class of type
						   * CustomTopicDataHandler which must have a no arguments constructor
						   * which will be used to create an instance of the handler when the Topic is
						   * created.
						   * <P>
						   * This is ignored if DTP_CUSTOM_HANDLER is specified.
						   * <P>
						   * To create a Topic of type CUSTOM either this
						   * property or CUSTOM_HANDLER must be supplied. */

	DTP_DATA_INITIALISER, /**< Specifies a Topic Data Initialiser.
						 * <P>
						 * This is used with Topics of type PublishingTopicData but would
						 * be ignored for all other types.
						 * <P>
						 * This is an Object property of type TopicDataInitialiser.
						 * <P>
						 * This is ignored if DTP_DATA_INITIALISER is specified. */

	DTP_DATA_INITIALISER_CLASS, /**< Specifies a Topic Data Initialiser class.
							 * <P>
							 * This is used with Topics of type PublishingTopicData but would
							 * be ignored for all other types.
							 * <P>
							 * This is a String property specifying a loadable class of type
							 * TopicDataInitialiser which must have a no arguments constructor
							 * which will be used to create an instance of the handler when the Topic is
							 * created.
							 * <P>
							 * This is ignored if DTP_DATA_INITIALISER is specified. */
	DTP_DELTA_ACK_REQUIRED, /**< Specifies that delta messages require acknowledgment.
						 * <P>
						 * This is an optional Boolean property that only applies to Topics that
						 * have data of type PublishingTopicData. */
	DTP_DELTA_ENCODING, /**<  Delta Encoding.
					 * <P>
					 * This is an optional Byte value. The value must be one of the
					 * DFEncoding values.
					 */
	DTP_DELTA_FRAGMENT_LIFECYCLE, /**< Load Fragment Lifecycle.
							   * <P>
							   * This is an optional String property. It is specified as a String in the
							   * FragmentedMessageLifecycle format. */

	DTP_DELTA_FRAGMENT_SIZE, /**< Delta fragment size.
						  * <P>
						  * This is an optional Integer property. */
	DTP_DELTA_MESSAGE_CAPACITY, /**< Specifies the default delta message capacity.
							 * <P>
							 * This is an optional Integer property. */
	DTP_DOMAIN_TOPIC_NAME,	/**< Domain Topic Name.
						 * <P>
						 * This indicates that the Topic is a subdomain of the specified Topic
						 * which is a Remote Control Service Topic DTP_REMOTE_SERVICE.
						 * <P>
						 * This is not a supported property when creating a Topic but will be
						 * returned in any DFTopicDefinition returned from such a Topic.
						 */
	DTP_FETCH_HANDLER,	/**< Specifies a Fetch Handler.
					 * <P>
					 * This is an optional Object property where the object must be of type
					 * TopicFetchHandler.
					 * <P>
					 * If specified then the fetch handler will be attached to the topic on
					 * creation. */

	DTP_FETCH_HANDLER_CLASS, /**< Specifies a Fetch Handler.
						  * <P>
						  * This is an optional String property specifying the class name of a
						  * loadable class of type TopicFetchHandler.
						  * <P>
						  * If specified then the class must have a no arguments constructor which
						  * will be used to create and associate the handler object when the topic is
						  * created.
						  * <P>
						  * This is ignored if DTP_FETCH_HANDLER is specified. */
	DTP_INTROSPECTION_MASK, /**< Introspection mask.
						 * <P>
						 * This is optional Byte property. */
	DTP_LOAD_ACK_REQUIRED,	/**< Specifies that load messages require acknowledgment.
						 * <P>
						 * This is an optional Boolean property that only applies to Topics that
						 * have data of type PublishingTopicData. */

	DTP_LOAD_ENCODING, /**< Load Encoding.
					* <P>
					* This is an optional Byte property. The value must be one of the DFEncoding values. */

	DTP_LOAD_FRAGMENT_LIFECYCLE, /**< Load Fragment Lifecycle.
							  * <P>
							  * This is an optional String property. It is specified as a String in the
							  * FragmentedMessageLifecycle.stringValue() format. */

	DTP_LOAD_FRAGMENT_SIZE, /**< Specifies Load fragment size.
						 * <P>
						 * This is an optional Integer property.*/

	DTP_LOAD_HEADERS, /**< Specifies headers to be associated with load messages.
				   * <P>
				   * This is an optional String property that only applies to Topics that have
				   * data of type PublishingTopicData. */

	DTP_LOAD_MESSAGE_CAPACITY, /**< Specifies the default load message capacity.
							* <P>
							* This is an optional Integer property. */

	DTP_LOCKABLE, /**< Indicates whether the topic is lockable.
			   * <P>
			   * This is an optional Boolean property.
			   * <P>
			   * This only applies to a Topic of type TopicDataType.NONE and if
			   * not specified then 'YES' would be assumed. */

	DTP_LOCK_TIMEOUT, /**< Lock timeout.
				   * <P>
				   * This is an optional Long property.*/
	
	DTP_NOTIFY_ALL_TOPICS, /**< Specifies whether a Topic Notify Topic notifies all Topics or only
						* those owned by the same Publisher as the notifier.
						* <P>
						* This is an optional Boolean property which applies only to Topics of type
						* DTP_TOPIC_NOTIFY}. */

	DTP_NOTIFY_METADATA_CACHING, /**< Specifies whether a Topic Notify Topic supports metadata caching.
							  * <P>
							  * This is an Optional boolean property which applies only to Topics of type
							  * DTP_TOPIC_NOTIFY */

	DTP_PAGED_COMPARATOR,	/**< Specifies a Paged Topic Comparator.
						 * <P>
						 * This may optionally be used with Topics of type DTP_PAGED_RECORD or DTP_PAGED_STRING but would
						 * be ignored for all other types.
						 * <P>
						 * It is an Object property where the object must be of type
						 * Comparator with a generic type of either Record or
						 * String depending on Topic Data type.
						 * <P>
						 * If a comparator is specified then the Topic Data will be ordered using
						 * the comparator. */

	
	DTP_PAGED_COMPARATOR_CLASS, /**< Specifies a Paged Topic Comparator class.
							 * <P>
							 * This may optionally be used with Topics of type
							 * DTP_PAGED_RECORD or DTP_PAGED_STRING but would
							 * be ignored for all other types.
							 * <P>
							 * This is a String property specifying a loadable class of type
							 * Comparator which must have a no arguments constructor
							 * which will be used to create an instance of the handler when the Topic is
							 * created. The comparator should have a generic type of either
							 * Record or String depending on Topic Data type.
							 * <P>
							 * This is ignored if DTP_PAGED_COMPARATOR is specified.
							 * <P>
							 * If a comparator is specified then the Topic Data will be ordered using
							 * the comparator. */

	DTP_PAGED_DUPLICATES_POLICY, /**< Specifies Paged Topic Data Duplicates Policy.
							  * <P>
							  * This is an optional property that only has meaning for Topics that have
							  * data of type DTP_PAGED_RECORD or DTP_PAGED_STRING. It is ignored for all other types.
							  * <P>
							  * It is a String property that may be one of the update mode code values
							  * as obtained from Duplicates.getCode().
							  * <P>
							  * If not specified then Duplicates.NOT_ALLOWED is assumed. */

	DTP_PB_CLASS, /**< Specifies a Protocol Buffer proto class name.
			   * <P>
			   * This is a String property that that is mandatory for Topics that have
			   * data of type DTDT_PROTOCOL_BUFFER. It is ignored for all
			   * other types. */

	DTP_PB_DELETION_VALUE,	/**< Specifies the Protocol Buffers Topic Data Deletion Value.
						 * <P>
						 * This is an optional property that only has meaning for Topics that have
						 * data of type DTDT_PROTOCOL_BUFFER. It is ignored for all
						 * other types.
						 * <P>
						 * It is a String property that specifies a value used to represent field
						 * deletions.
						 * <P>
						 * If not specified then PBTopicData.DEFAULT_DELETION_VALUE is assumed. */

	DTP_PB_NAME,	/**< Specifies a Protocol Buffers Message name.
				 * <P>
				 * This is a String property that is mandatory for Topics that have
				 * data of type DTDT_PROTOCOL_BUFFER. It is ignored for all
				 * other types. */

	DTP_PB_UPDATE_MODE,	/**< Specifies the Protocol Buffers Topic Data Update Mode.
					 * <P>
					 * This is an optional property that only has meaning for Topics that have
					 * data of type DTDT_PROTOCOL_BUFFER. It is ignored for all
					 * other types.
					 * <P>
					 * It is a String property that may be one of the update mode code values
					 * as obtained from UpdateMode.getCode().
					 * <P>
					 * If not specified then UpdateMode.PARTIAL is assumed.
					 * <P>
					 * See PBTopicData.setUpdateMode(UpdateMode) for more details. */

	DTP_RECORD_EMPTY_FIELD_VALUE, /**< Specifies a value to use to represent empty fields.
							   * <P>
							   * This is an optional String property for use with Topics of type
							   * DTDT_RECORD and would be ignored for all other types.
							   * <P>
							   * See RecordTopicData.setEmptyFieldValue(String) for details. */

	DTP_REFERENCE,	/**< This specifies the Topic reference.
				 * <P>
				 * This is an optional String property. */

	DTP_ROUTING_HANDLER,	/**< Specifies a Routing Topic Subscription Handler.
						 * <P>
						 * This is an Object property used with Topics of type
						 * DTDT_ROUTING and would be ignored for all other types.
						 * The object specified must be of type
						 * RoutingTopicDataSubscriptionHandler.
						 * <P>
						 * To create a Topic of type opicDataType.ROUTING either this
						 * property or DTP_ROUTING_HANDLER must be supplied. */

	DTP_ROUTING_HANDLER_CLASS, /**< Specifies a Routing Topic Subscription Handler.
							* <P>
							* This is a String property used with Topics of type
							* DTDT_ROUTING and would be ignored for all other types.
							* It specifies a loadable class of type
							* RoutingTopicDataSubscriptionHandler which must have a no
							* arguments constructor which that be used to create an instance of the
							* handler to attach to the Topic.
							* <P>
							* This will be ignored if DTP_ROUTING_HANDLER is specified.
							* <P>
							* To create a Topic of type DTDT_ROUTING either this
							* property or DTP_ROUTING_HANDLER must be supplied. */

	DTP_SERVICE_HANDLER,	/**< Specifies a Service handler.
						 * <P>
						 * This is an Object property which only applies to Topics of type
						 * DTDT_SERVICE and would be ignored for all other types.
						 * The object specified must be of type ServiceHandler.
						 * <P>
						 * To create a Topic of type DTDT_SERVICE either this
						 * property or DTP_SERVICE_HANDLER must be supplied. */

	DTP_SERVICE_HANDLER_CLASS,	/**< Specifies a Service handler.
							 * <P>
							 * This is a String property which only applies to Topics of type
							 * DTDT_SERVICE and would be ignored for all other types.
							 * It specifies a loadable class of type ServiceHandler which must
							 * have a no arguments constructor which will be used to create an instance
							 * of the handler to attach to the Topic.
							 * <P>
							 * This is ignored is DTP_SERVICE_HANDLER is specified.
							 * <P>
							 * To create a Topic of type TopicDataType.SERVICE either this
							 * property or DTP_SERVICE_HANDLER must be supplied. */

	DTP_SERVICE_HEADERS,	/**< Specifies service header options.
						 * <P>
						 * This is an optional String property that only applies for Topics of type
						 * DTDT_SERVICE and would be ignored for all other types. */

	DTP_SERVICE_TARGET_TOPIC,	/**< Specifies a service target topic name.
							 * <P>
							 * This is an optional String property that only applies to Topics of type
							 * DTDT_SERVICE and would be ignored for all other types. */

	DTP_SERVICE_TIMEOUT,	/**< Specifies a service request timeout.
						 * <P>
						 * This is an optional Long property only applies for Topics of type 
						 * DTDT_SERVICE and would be ignored for all other types. */

	DTP_SERVICE_TYPE,	/**< Specifies Service Type.
					 * <P>
					 * This is a mandatory String property for Topics of type
					 * DTDT_SERVICE and is ignored for all other types. */

	DTP_SLAVE_MASTER_TOPIC,	/**< Specifies the master Topic name for a Slave Topic.
						 * <P>
						 * This is a mandatory String property for topics of type
						 * DTDT_SLAVE and will be ignored for all other types. */

	DTP_SUBSCRIPTION_HANDLER, /**< Specifies a Subscription Handler.
						   * <P>
						   * This is an optional String property specifying the full name of a
						   * loadable class of type TopicSubscriptionHandler.
						   * <P>
						   * If specified then the class must have a no arguments constructor which
						   * will be used to create and associate the handler object when the topic is
						   * created.
						   * <P>
						   * This is ignored if DTP_SUBSCRIPTION_HANDLER is specified. */

	DTP_SUBSCRIPTION_HANDLER_CLASS, /**< Specifies a Subscription Handler.
								 * <P>
								 * This is an optional String property specifying the full name of a
								 * loadable class of type TopicSubscriptionHandler.
								 * <P>
								 * If specified then the class must have a no arguments constructor which
								 * will be used to create and associate the handler object when the topic is
								 * created.
								 * <P>
								 * This is ignored if DTP_SUBSCRIPTION_HANDLER is specified. */

	DTP_TIDY_ON_UNSUBSCRIBE /**< Tidy on Unsubscribe.
						 * <P>
						 * This is optional Boolean property. */

} DFTopicProperty;



/**
 * Error domain key used when populating NSError objects
 */
#define DIFFUSION_ERROR_DOMAIN @"Diffusion"

/**
 * Diffusion version string constant
 */
extern const char *transportVersion;
