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
