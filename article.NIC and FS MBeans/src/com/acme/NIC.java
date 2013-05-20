package com.acme;


import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;
import java.util.Set;

import javax.management.MBeanServer;
import javax.management.ObjectInstance;
import javax.management.ObjectName;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.Logs;

/**
 * 
 * JMX implementation of an interface to a Network Interface Card
 * <P>
 * As of yet, this is a read-only
 * @author martincowie - created Mar 12, 2012
 */
public class NIC implements NICMBean {
    
    private static final Object MBEAN_ROOT = "com.acme.nic";
    private final NetworkInterface nic;
    private final ObjectName objectName;

    public NIC( NetworkInterface nic ) 
    {
        this.nic = nic;
        try {
            this.objectName = new ObjectName( String.format( "%s:name=%s", MBEAN_ROOT, nic.getDisplayName() ) );
        } catch ( Exception ex ) {
            throw new RuntimeException( ex );
        }
    }

    public static void registerNICs( MBeanServer mbs ) throws APIException 
    {
        try {
            Enumeration<NetworkInterface> nics = NetworkInterface.getNetworkInterfaces();
            while( nics.hasMoreElements() )
            {
                NIC nic = new NIC( nics.nextElement() );
                mbs.registerMBean( nic, nic.getObjectName() );
            }
        } catch ( Exception ex) {
            throw new APIException( "Cannot register NIC mbeans" ,ex );
        }
    }
    
    public static void unregisterNICs( MBeanServer mbs ) throws APIException 
    {
        try {
            Set<ObjectInstance> mbeans = mbs.queryMBeans( new ObjectName( String.format( "%s:*", MBEAN_ROOT ) ) , null );            
            for( ObjectInstance mbean : mbeans )
                mbs.unregisterMBean( mbean.getObjectName() );            
            Logs.info( String.format( "Unregistered %d mbeans under \"%s\"", mbeans.size(), MBEAN_ROOT ) );
        } catch ( Exception ex ) {
            throw new APIException( "Cannot unregister MBEans",ex );
        }
    }

    private ObjectName getObjectName() 
    {
        return objectName;
    }

    //==== MBean obligations =====
 
    @Override
    public String getDisplayName()
    {
        return nic.getDisplayName();
    }
    
    @Override
    public String getHardwareAddress()
    {
        try {
            return ExampleUtil.macToString( nic.getHardwareAddress() );
        } catch (SocketException ex) {
            Logs.severe( ex.getLocalizedMessage(), ex );
            return null;
        }
    }

    @Override
    public String getIPAddresses()
    {
        StringBuilder result = new StringBuilder();
        Enumeration<InetAddress> addresses = nic.getInetAddresses();
        while( addresses.hasMoreElements() )
        {
            InetAddress address = addresses.nextElement();
            if( result.length() > 0 ) result.append( ", " );
            result.append( address.getHostAddress() );
        }
        return result.toString();
    }

    @Override
    public int getMTU()
    {
        try {
            return nic.getMTU();
        } catch (SocketException ex) {
            Logs.severe( ex.getLocalizedMessage(), ex );
            return -1;
        }
    }

    @Override
    public String getParentName()
    {
        NetworkInterface parentNIC = nic.getParent();
        return parentNIC == null ? null : parentNIC.getDisplayName();
    }

    @Override
    public boolean isLoopBack()
    {
        try {
            return nic.isLoopback();
        } catch (SocketException ex ) {
            Logs.severe( ex.getLocalizedMessage(), ex );
            return false;
        }
    }

    @Override
    public boolean isPointToPoint()
    {
        try {
            return nic.isPointToPoint();
        } catch (SocketException ex ) {
            Logs.severe( ex.getLocalizedMessage(), ex );
            return false;
        }
    }

    @Override
    public boolean isUp()
    {
        try {
            return nic.isUp();
        } catch (SocketException ex ) {
            Logs.severe( ex.getLocalizedMessage(), ex );
            return false;
        }
    }

    @Override
    public boolean isVirtual()
    {
        return nic.isVirtual();
    }

    @Override
    public boolean isMulticast()
    {
        try {
            return nic.supportsMulticast();
        } catch (SocketException ex) {
            Logs.severe( ex.getLocalizedMessage(), ex );
            return false;
        }
    }
    

}
