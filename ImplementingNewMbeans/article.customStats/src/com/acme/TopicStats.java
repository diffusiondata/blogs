package com.acme;

import java.util.Set;

import com.pushtechnology.diffusion.api.publisher.Publishers;
import com.pushtechnology.diffusion.api.topic.Topic;

/**
 * TopicStats 
 *<P>
 * Employ the Diffusion APIs to query the set of Topics, and expose a number of statistics upon an MBean.
 * Using the Diffusion-JMX integration, this bean itself shows up as a set of topics 
 *
 * @author martincowie - created Apr 2, 2012
 * @since 4.1
 */
public class TopicStats implements TopicStatsMBean {

    @Override
    /**
     * Find all topics that have at least one subscription
     */
    public long getUniqueSubscriptions() 
    {
        long result = 0;
        Set<Topic> topics = Publishers.getTopicTree().getAllTopics();
        for( Topic topic : topics )
            if( topic.hasSubscribers() )
                result++;
        
        return result;
    }

    @Override
    public long getTotalSubscriptions() 
    {
        long result = 0;
        Set<Topic> topics = Publishers.getTopicTree().getAllTopics();
        for( Topic topic : topics )
            result += topic.getCurrentNumberOfSubscribers();

        return result;
    }

    @Override
    public int getTotalTopics() 
    {
        return Publishers.getTopicTree().getAllTopics().size();        
    }

}
