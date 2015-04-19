package com.pushtechnology.blog.security;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.session.SessionException;

public class TestClient {

    public static void main(String... args) {

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
                "Usage: java com.pushtechnology.blog.security url principal password%n");
            return;
        }

        try {
            Diffusion.sessions()
                .principal(principal)
                .password(password)
                .open(url);

            System.out.printf(
                "Principal '%s' was authenticated by the server.%n", principal);
        }
        catch (SessionException e) {
            System.out.printf(
                "Principal '%s' was rejected by the server.%n", principal);
            e.printStackTrace();
        }
    }
}
