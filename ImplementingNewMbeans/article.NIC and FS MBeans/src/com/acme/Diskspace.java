package com.acme;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.HashSet;
import java.util.Set;

import javax.management.InstanceAlreadyExistsException;
import javax.management.MBeanRegistrationException;
import javax.management.MBeanServer;
import javax.management.MalformedObjectNameException;
import javax.management.NotCompliantMBeanException;
import javax.management.ObjectInstance;
import javax.management.ObjectName;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.IOUtils;
import com.pushtechnology.diffusion.api.Logs;

/**
 * A bonus JMX MXBean that exposes the set of file-system roots, and reports on
 * their total, free and available space.
 * 
 * @author martincowie
 * 
 */
public class Diskspace implements DiskspaceMBean
{
    /**
     * Characters common to file paths not allowed in ObjectNames.
     */
    private static final String PATH_CHARACTERS = "/\\:";
    private static final String MBEAN_ROOT = "com.acme.diskspace";
    private final File theRoot;
    private final ObjectName objectName;

    /**
     * Constructor.
     * 
     * @param root
     */
    public Diskspace(final File root)
    {
        try {
            theRoot = root;
            objectName = new ObjectName( String.format( "%s:root=%s", MBEAN_ROOT, ExampleUtil.urlEncode(theRoot.getAbsolutePath(), PATH_CHARACTERS) ) );
        } catch( MalformedObjectNameException ex ) {
            throw new RuntimeException( ex );
        }
    }

    public String getAbsolutePath()
    {
        return theRoot.getAbsolutePath();
    }

    public long getTotalSpace()
    {
        return theRoot.getTotalSpace();
    }

    public long getFreeSpace()
    {
        return theRoot.getFreeSpace();
    }

    public long getUsableSpace()
    {
        return theRoot.getUsableSpace();
    }

    public ObjectName getObjectName() 
    {
        return objectName;
    }

    /**
     * Create an MBean for each filesystem root present on this host
     * 
     * @param mbs
     * @throws MalformedObjectNameException
     * @throws InstanceAlreadyExistsException
     * @throws MBeanRegistrationException
     * @throws NotCompliantMBeanException
     * @throws NullPointerException
     */
    public static void registerRoots(final MBeanServer mbs) throws APIException
    {
        File roots[] = File.listRoots();
        HashSet<File> rootSet = new HashSet<File>();
        for (File root:roots)
        {
            registerRoot(root, mbs);
            rootSet.add(root);
        }

        // Extra - if this looks like a Linux box, or something with a usable /etc/mtab file, go read that ...
        File mtabFile = new File("/etc/mtab");
        if (mtabFile.exists()&&mtabFile.canRead()) {
            processMtabFile(mtabFile,mbs,rootSet);
        }
    }

    public static void unregisterRoots( final MBeanServer mbs ) throws APIException
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

    /**
     * Consume & process the /etc/mtab file to expose mounted file-systems as
     * MBeans Many Linux distributions employ the file /etc/mtab to record and
     * track file-systems mounted.
     * 
     * @param mtabFile
     * @param mbs
     * @param rootSet
     * @throws APIException
     */
    private static void processMtabFile(final File mtabFile,final MBeanServer mbs, final HashSet<File> rootSet) throws APIException
    {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(mtabFile));
            String line;
            while (null!=(line = reader.readLine()))
            {
                String fields[] = line.split(" ");
                File mountPoint = new File(fields[1]);

                // Exclude already monitored file-systems, and mount-points that
                // don't exist and that aren't directories
                if (!rootSet.contains(mountPoint)&&mountPoint.exists()&& mountPoint.isDirectory()) {
                    registerRoot(mountPoint, mbs);
                }
            }
        } catch (Exception ex) {
            throw new APIException( String.format("Cannot read \"%s\"",mtabFile),ex);
        } finally {
            IOUtils.close( reader );
        }
    }

    /**
     * registerRoot
     * <P>
     * Register with JMX
     * 
     * @param root
     * @throws APIException
     */
    private static void registerRoot( final File root, final MBeanServer mbs ) throws APIException
    {
        Diskspace mbean = new Diskspace(root);
        try {
            mbs.registerMBean( mbean, mbean.getObjectName() );
        } catch ( Exception ex ) {
            throw new Error( String.format( "Cannot registry MBean at \"%s\"", mbean.getObjectName() ), ex );
        }
    }

}
