package com.acme;


/**
 * DiskspaceMBean
 *<P>
 * Diskspace Management Bean.
 *
 * @author mcowie - created 24 Oct 2011
 */
public interface DiskspaceMBean 
{
	/**
	 * getAbsolutePath
	 * <P>
	 * Get absolute path
	 *
	 * @return the absolute path
	 */
	public String getAbsolutePath();
	
	/**
	 * getTotalSpace
	 * <P>
	 * Get total space
	 *
	 * @return the total space
	 */
	public long getTotalSpace();

	/**
	 * getFreeSpace
	 * <P>
	 * Get free space
	 *
	 * @return the free space
	 */
	public long getFreeSpace();

	/**
	 * getUsableSpace
	 * <P>
	 * Get usable space
	 *
	 * @return the usable space
	 */
	public long getUsableSpace();
}
