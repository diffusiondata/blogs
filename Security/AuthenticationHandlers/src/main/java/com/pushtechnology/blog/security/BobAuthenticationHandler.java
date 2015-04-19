package com.pushtechnology.blog.security;

import java.nio.charset.Charset;

import com.pushtechnology.diffusion.client.details.SessionDetails;
import com.pushtechnology.diffusion.client.security.authentication.AuthenticationHandler;
import com.pushtechnology.diffusion.client.types.Credentials;

public class BobAuthenticationHandler implements AuthenticationHandler {

    public void authenticate(
        String principal,
        Credentials credentials,
        SessionDetails sessionDetails,
        Callback callback) {

        final String password =
            new String(credentials.toBytes(), Charset.forName("UTF-8"));

        if ("Bob".equals(principal) && "s3cr3t".equals(password)) {
            callback.allow();
        }
        else {
            callback.abstain();
        }
    }
}
