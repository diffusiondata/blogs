package com.pushtechnology.diffusion.demos.publishers.echo;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.data.TopicDataFactory;
import com.pushtechnology.diffusion.api.data.custom.CustomTopicData;
import com.pushtechnology.diffusion.api.message.TopicMessage;
import com.pushtechnology.diffusion.api.publisher.Client;
import com.pushtechnology.diffusion.api.publisher.EventConnection;
import com.pushtechnology.diffusion.api.publisher.Publisher;

/**
 * EchoServer.
 * <P>
 * Simple Echo Server. A message from a client is sent back to the client. A
 * history of the last 10 messages are also kept. The history is broadcast is
 * sent to the client upon subscription.
 * 
 * NB: As topic data is being used, Fetch and Subscribe are handled by the
 * default implementation and do not need to be added here
 * 
 * @author dhudson - created 14 Nov 2011
 * @since 4.0
 */
public final class EchoServer extends Publisher {

    // Name of the Echo Topic
    private static final String TOPIC = "Echo";

    // The stack of messages in handled in topic data
    private CustomTopicData theTopicData;

    /**
     * @see com.pushtechnology.diffusion.api.publisher.Publisher#initialLoad()
     */
    @Override
    protected void initialLoad() throws APIException {

        // Create the topic data for the Echo Server
        theTopicData =
            TopicDataFactory.newCustomData(new MessagesTopicDataHandler());

        // Add the topic with the data
        addTopic(TOPIC,theTopicData);
    }

    /**
     * @see Publisher#messageFromClient(TopicMessage,Client)
     */
    @Override
    protected void messageFromClient(TopicMessage message,Client client) {
        try {
            // Start the update
            theTopicData.startUpdate();

            // Update the messages with the message from the client
            theTopicData.update(message);

            // As this is echo, send a message back to the same client and not
            // broadcast
            client.send(
                theTopicData.generateDeltaMessage(
                    message.getHeaders().toArray(new String[0])));

        }
        catch (APIException ex) {
            logWarning("Unable to process message from client",ex);
        }
        finally {
            // Release the lock on topic data
            theTopicData.endUpdate();
        }
    }
    
    protected void messageFromEventPublisher(
    	    EventConnection eventConnection,
    	    TopicMessage message) {
        try {
            // Start the update
            theTopicData.startUpdate();

            // Update the messages with the message from the client
            theTopicData.update(message);

            // As this is echo, send a message back to the same client and not
            // broadcast
            eventConnection.send(theTopicData.generateDeltaMessage());

        }
        catch (APIException ex) {
            logWarning("Unable to process message from client",ex);
        }
        finally {
            // Release the lock on topic data
            theTopicData.endUpdate();
        }
    }
}
