package com.acme;

import java.lang.management.ManagementFactory;

import javax.management.MBeanServer;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.Logs;
import com.pushtechnology.diffusion.api.publisher.ServerShutdownHook;
import com.pushtechnology.diffusion.api.publisher.ServerStartupHook;

/**
 * A Diffusion startup and shutdown hook-pair.
 * <p>
 * Registers and unregisters a set of MBeans respectively  
 *
 * @author martincowie - created Jun 25, 2012
 */
public class BeanLauncher implements ServerStartupHook, ServerShutdownHook 
{
    static final MBeanServer mbs = ManagementFactory.getPlatformMBeanServer(); 

    @Override
    public boolean serverStarting() 
    {
        // Register Diskspace and NIC MBeans
        try {
            Diskspace.registerRoots( mbs );
            NIC.registerNICs( mbs );      
        } catch (APIException ex) {
            Logs.severe( "Cannot register ACME mbeans" ,ex );
        }
        
        return true; // Allow the system to continue launching
    }
    
    @Override
    public void serverStopping() 
    {
        // Unregister the MBeans
        try {
            Diskspace.unregisterRoots( mbs );
            NIC.unregisterNICs( mbs );
        } catch( Exception ex ) {
            Logs.severe( "Cannot unregister ACME mbeans" ,ex );
        }
    }

}
