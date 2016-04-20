package com.pushtechnology.blog.security;

import static java.util.EnumSet.allOf;

import java.io.IOException;
import java.nio.charset.Charset;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.details.SessionDetails;
import com.pushtechnology.diffusion.client.features.RegisteredHandler;
import com.pushtechnology.diffusion.client.features.control.clients.AuthenticationControl;
import com.pushtechnology.diffusion.client.features.control.clients.AuthenticationControl.ControlAuthenticationHandler;
import com.pushtechnology.diffusion.client.session.Session;
import com.pushtechnology.diffusion.client.types.Credentials;

public class AliceAuthenticationHandler implements ControlAuthenticationHandler {

    public void authenticate(
        String principal,
        Credentials credentials,
        SessionDetails sessionDetails,
        Callback callback) {

        final String password =
            new String(credentials.toBytes(), Charset.forName("UTF-8"));

        if ("Alice".equals(principal) && "0penup".equals(password)) {
            callback.allow();
        }
        else {
            callback.abstain();
        }
    }

    public void onActive(RegisteredHandler registeredHandler) {
        System.out.printf("%s registered.%n", getClass().getSimpleName());
    }

    public void onClose() {
        System.out.printf("%s closed.%n", getClass().getSimpleName());
    }

    public static void main(String... args) throws IOException {
        final String url;
        final String principal;
        final String password;

        try {
            url = args[0];
            principal = args[1];
            password = args[2];
        }
        catch (ArrayIndexOutOfBoundsException e) {
            System.err.printf(
                "Usage: java com.pushtechnology.blog.security.AliceAuthenticationHandler url principal password%n");
            return;
        }

        final Session session = Diffusion.sessions()
            .principal(principal)
            .password(password)
            .open(url);

        final AuthenticationControl authenticationControl = session.feature(AuthenticationControl.class);
        authenticationControl.setAuthenticationHandler(
            "after-system-handler",
            allOf(SessionDetails.DetailType.class),
            new AliceAuthenticationHandler());

        System.out.printf(
            "Connected to Diffusion at %s%n" +
            "Control authentication handler registered%n" +
            "Press any key to exit.%n", url);

        System.in.read();
    }
}
