package com.acme;

public interface ClientStatsMBean 
{

    public String getClientsByConnectionType();
    
    public String getTopByAge();
    
    public String getTopBySubscriptions();
    
    public String getTopByMessagesSent();
    
    public String getTopByMessagesReceived();
    
    public int getTopClientCount();

    public void setTopClientCount(int topClientCount); 
    
}
