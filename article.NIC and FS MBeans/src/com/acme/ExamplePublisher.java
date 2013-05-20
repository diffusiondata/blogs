package com.acme;

import java.lang.management.ManagementFactory;

import javax.management.MBeanServer;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.publisher.Publisher;

public class ExamplePublisher extends Publisher 
{

    @Override
    protected void initialLoad() throws APIException 
    {
        MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();

        // Register Diskspace and NIC MBeans
        Diskspace.registerRoots(mbs);
        NIC.registerNICs( mbs );
    }

}
