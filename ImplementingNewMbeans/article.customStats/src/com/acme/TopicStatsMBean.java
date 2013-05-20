package com.acme;

public interface TopicStatsMBean 
{

    public long getUniqueSubscriptions();
    
    public long getTotalSubscriptions();
    
    public int getTotalTopics();

}