package com.acme;

public abstract class ExampleUtil {
    
    public static String urlEncode( String input, String reservedChars ) 
    {
        StringBuilder result = new StringBuilder();

        for( int i=0; i< input.length(); i++ )
        {
            char chr = input.charAt( i );
            if( reservedChars.indexOf( chr ) != -1 )
                result.append( URLEncode( chr ) );
            else
                result.append( chr );
        }
        return result.toString();
    }

    private static String URLEncode(char chr) 
    {
        return String.format( "%c%02X", '%', (int)chr );
    }

    /**
     * Render a mac-address to the format '58:B0:35:FD:AB:5E'
     * <b>NB</b>: This does not assert the length of the MAC to be 6 bytes
     * @param mac
     * @return
     */
    public static String macToString( byte[] mac )
    {
        if( mac == null )
            return "";
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < mac.length; i++)
            result.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? ":" : ""));

        return result.toString();
    }

}
