/*******************************************************************************
 * Copyright (C) 2016 Push Technology Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/

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
                "Usage: java com.pushtechnology.blog.security.TestClient url principal password%n");
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
