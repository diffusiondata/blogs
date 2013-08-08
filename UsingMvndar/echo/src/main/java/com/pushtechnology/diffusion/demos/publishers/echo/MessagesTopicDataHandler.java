/* 
 * @author dhudson - 
 * Created 14 Nov 2011 : 09:32:27
 */

package com.pushtechnology.diffusion.demos.publishers.echo;

import java.util.ArrayList;
import java.util.List;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.data.custom.SimpleCustomTopicDataHandler;
import com.pushtechnology.diffusion.api.message.TopicMessage;

/**
 * MessagesTopicDataHandler
 * <P>
 * Custom topic data handler for the messages
 * 
 * @author dhudson - created 14 Nov 2011
 * @since 4.0
 */
public class MessagesTopicDataHandler extends SimpleCustomTopicDataHandler {

    // Only Keep 10 messages in the stack
    private static final int MESSAGES_SIZE = 10;

    // The list of messages
    private List<String> theMessages;

    /**
     * Constructor.
     */
    MessagesTopicDataHandler() {
        theMessages = new ArrayList<String>(MESSAGES_SIZE);

        // Lets add the first message
        theMessages.add("Welcome to the Echo Server");
    }

    /**
     * @see com.pushtechnology.diffusion.api.data.custom.CustomTopicDataHandler#populateTopicLoad(com.pushtechnology.diffusion.api.message.TopicMessage)
     */
    public void populateTopicLoad(TopicMessage topicLoad)
    throws APIException {
        // Loop through the stack and create a variable record length message
        // depending on the number of messages in the stack
        for (String echoMessage:theMessages) {
            topicLoad.putRecord(echoMessage);
        }
    }

    /**
     * @see com.pushtechnology.diffusion.api.data.custom.AbstractCustomTopicDataHandler#update(com.pushtechnology.diffusion.api.message.TopicMessage)
     */
    public boolean update(TopicMessage message) throws APIException {

        if (theMessages.size()==MESSAGES_SIZE) {
            theMessages.remove(0);
        }

        theMessages.add(message.asString());

        return true;
    }

    /**
     * @see com.pushtechnology.diffusion.api.data.custom.CustomTopicDataHandler#populateDelta(com.pushtechnology.diffusion.api.message.TopicMessage)
     */
    public void populateDelta(TopicMessage delta) throws APIException {
        // Get the last message
        delta.putRecord(theMessages.get(theMessages.size()-1));
    }

    /**
     * @see com.pushtechnology.diffusion.api.data.custom.CustomTopicDataHandler#asString()
     */
    public String asString() {
        return theMessages.toString();
    }
}
