package com.acme;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import com.pushtechnology.diffusion.api.publisher.Client;
import com.pushtechnology.diffusion.api.publisher.Publisher;
import com.pushtechnology.diffusion.api.publisher.Publishers;

/**
 * ClientStats
 *<P>
 * Employ the Diffusion APIs to query the set of Clients and expose a number of statistics upon an MBean.
 * Using the Diffusion-JMX integration, this bean itself shows up as a set of topics
 *
 * <p>
 * Ensure that your Publishers.xml contains this element
 * <p><pre>
 *  &lt;publisher name="StatsExample">
 *      &lt;class>com.acme.JMXStatsExample&lt;/class>
 *      &lt;property name="top">20&lt;/property>
 *  &lt;/publisher>
 * <pre>
 * @author martincowie - created Apr 2, 2012
 * @since 4.1
 */
public class ClientStats implements ClientStatsMBean 
{
    private int topClientCount = 10;
    
    /**
     * Constructor.
     * <p>
     * Takes a publisher so that it can use its configuration to find a default property for 'top' 
     * @param publisher
     */
    public ClientStats(Publisher publisher) 
    {
        String topStr = publisher.getProperty( "top" );
        if( topStr != null )
        {
            topClientCount = Integer.parseInt( topStr, 10 );
            publisher.logInfo( String.format( "Setting top=%d", topClientCount ) );
        }
    }

    @Override
    public String getClientsByConnectionType() 
    {        
        Map<String,Long> clientsByType = new TreeMap<String,Long>(); 
        
        List<Client> clients = Publishers.getClients();
        for( Client client : clients )
        {
            String type = client.getConnectionType().toString();
            clientsByType.put( type, clientsByType.containsKey( type )
                ? clientsByType.get( type ) +1 
                : 1l 
            );
        }
        
        StringBuilder result = new StringBuilder();
        for( String type : clientsByType.keySet() )
            result.append( String.format( "%s%s: %d", (result.length() > 0 ? "\n" :"" ), type, clientsByType.get( type ) ) );
        
        return result.toString();
    }

    @Override
    public String getTopByAge() 
    {
        List<Client> clients = Publishers.getClients();
        
        Collections.sort( clients, new Comparator<Client>() {
            @Override
            public int compare(Client x,Client y) 
            {
                return (int)( x.getStartTimeMillis() - y.getStartTimeMillis() );
            }            
        });
        
        return pickTop( clients );
    }

    @Override
    public String getTopBySubscriptions() 
    {
       List<Client> clients = Publishers.getClients();
        
        Collections.sort( clients, new Comparator<Client>() {
            @Override
            public int compare(Client x,Client y) 
            {
                return (int)( x.getTopics().size() - y.getTopics().size() );
            }            
        });
        
        return pickTop( clients );
    }

    @Override
    public String getTopByMessagesSent() 
    {
       List<Client> clients = Publishers.getClients();
        
        Collections.sort( clients, new Comparator<Client>() {
            @Override
            public int compare(Client x,Client y) 
            {
                return (int)( x.getNumberOfMessagesSent() - y.getNumberOfMessagesSent() );
            }            
        });
        
        return pickTop( clients );
    }
    
    public String getTopByMessagesReceived()
    {
       List<Client> clients = Publishers.getClients();
        
        Collections.sort( clients, new Comparator<Client>() {
            @Override
            public int compare(Client x,Client y) 
            {
                return (int)( x.getNumberOfMessagesReceived() - y.getNumberOfMessagesReceived() );
            }            
        });
        
        return pickTop( clients );
    }

    public int getTopClientCount() 
    {
        return topClientCount;
    }

    public void setTopClientCount(int topClientCount) 
    {
        this.topClientCount = topClientCount;
    }

    /**
     * 
     * Select and serialize the top <em>n</em> clients of the given list of clients
     * <p>
     * .. where n is the value of the property 'topClientCount'
     *
     */
    private String pickTop(List<Client> clients ) 
    {
        StringBuilder result = new StringBuilder();
        for( int i=0; i< Math.min( topClientCount, clients.size() ); i++ )
            result.append( String.format( "%s%s", ( i > 0 ? "\n" : "" ), clients.get( i ).getClientID() ) );        
        return result.toString();
    }
}
