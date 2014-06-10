//
//  DFTopicDefinition.h
//  DiffusionTransport
//
//  Created by Martin Cowie on 23/05/2013 - Diffusion 5.0.0_01
//  Copyright (c) 2013 Push Technology Ltd. All rights reserved.
//

/**
 * This encapsulates all or some of the details of a Topic.
 * <P>
 * A Topic definition comprises:-<BR>
 * 1) A mandatory type that defines the type of Topic Data (if any) associated
 * with the Topic.<BR>
 * 2) A set of properties. Some are generic and some are dependent upon the
 * type. The generic properties are all optional but some type specific ones may
 * be mandatory.<BR>
 * 3) A metadata definition which is mandatory for some types. The type of this
 * metadata is also dependent upon the type.
 * <P>
 * This class performs no validation of the settings. If a definition
 * is used to create a topic and mandatory properties (or metadata) are not
 * present or one or more values are invalid then topic creation would fail.
 * <P>
 * Each property has documented type (e.g. String, Integer, Long etc) and the
 * property value may be set to an object of that type or any other object that
 * can be parsed to that type via its toString method. For example to set an
 * integer property you could specify an Integer (or an int) but you could also
 * specify a String with a numeric Integer representation within it. However,
 * if a non numeric value was assigned to an Integer property then a failure
 * may occur when the property is used.
 *
 * @since 4.6
 */
@interface DFTopicDefinition : NSObject 


@property(readonly,nonatomic) DFTopicDataType type;
@property(readonly,nonatomic) NSString *metadata;
@property(readonly,nonatomic) NSDictionary *properties;

@end
