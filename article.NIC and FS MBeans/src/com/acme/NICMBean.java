package com.acme;


/**
 * JMX interface to a Network Interface Card
 *
 * @author martincowie - created Mar 12, 2012
 */
public interface NICMBean {

    public abstract String getDisplayName();

    public abstract String getHardwareAddress();

    public abstract String getIPAddresses();

    public abstract int getMTU();

    public abstract String getParentName();

    public abstract boolean isLoopBack();

    public abstract boolean isPointToPoint();

    public abstract boolean isUp();

    public abstract boolean isVirtual();

    public abstract boolean isMulticast();

}