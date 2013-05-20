package com.acme;

import java.lang.management.ManagementFactory;

import javax.management.MBeanServer;
import javax.management.ObjectName;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.publisher.Publisher;

/**
 * A publisher that does little more than register a couple of MBeans 
 *
 * @author martincowie - created Apr 2, 2012
 * @since 4.1
 */
public class JMXStatsExample extends Publisher 
{
    private MBeanServer mbs;
    private ObjectName topicObjName, clientObjName;
    
    {
        try {
            mbs = ManagementFactory.getPlatformMBeanServer();
            topicObjName = new ObjectName( "com.acme:type=TopicStats" );
            clientObjName = new ObjectName( "com.acme:type=ClientStats" );
        } catch( Exception ex ) {
            throw new RuntimeException( ex );
        }
    }

    /**
     * Signal that this publisher can be stopped
     * @see com.pushtechnology.diffusion.api.publisher.Publisher#isStoppable()
     */
    @Override
    protected boolean isStoppable() 
    {
        return true;
    }

    @Override
    protected void initialLoad() throws APIException 
    {
        
        this.logInfo( "Started publisher " + this.getPublisherName() );
        
        // Register 2 new MBeans
        try {
            mbs.registerMBean( new TopicStats(), topicObjName );
            mbs.registerMBean( new ClientStats( this ), clientObjName );
        } catch( Throwable ex ) {
            throw new APIException( "Cannot register MBeans", ex );
        }
    }
    
    @Override
    protected void publisherStopping() throws APIException 
    {
        // Unregister the MBeans
        try {
            mbs.unregisterMBean( topicObjName );
            mbs.unregisterMBean( clientObjName );
        } catch( Exception ex ) {
            throw new RuntimeException( ex );
        }
        
        super.publisherStopping();
    }

}