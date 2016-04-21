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

import java.util.Collection;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.kohsuke.args4j.Option;
import com.pushtechnology.diffusion.client.session.Session;
import com.pushtechnology.diffusion.client.types.ErrorReport;
import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.callbacks.ErrorReason;
import com.pushtechnology.diffusion.client.features.control.clients.SecurityStoreFeature.UpdateStoreCallback;
import com.pushtechnology.diffusion.client.features.control.clients.SystemAuthenticationControl;

/**
 * Command line utility to change the password of a system authentication
 * principal.
 *
 * @author Philip Aston
 * @since 5.8
 */
public class ChangePassword {

    private static void changePassword(
        Session session,
        String targetPrincipal,
        String expectedPassword,
        String newPassword) {

        final SystemAuthenticationControl control =
            session.feature(SystemAuthenticationControl.class);

        final String script = control.scriptBuilder()
            .verifyPassword(targetPrincipal, expectedPassword)
            .setPassword(targetPrincipal, newPassword)
            .script();

        System.out.printf("About to apply the script: %n%s%n", script);

        final ChangePasswordCallback result = new ChangePasswordCallback();

        control.updateStore(script, result);

        result.waitForResponse();
    }

    private static final class ChangePasswordCallback
        implements UpdateStoreCallback {
        private final CountDownLatch resultLatch = new CountDownLatch(1);

        public void onSuccess() {
            System.out.println("Password change succeeded");
            resultLatch.countDown();
        }

        public void onError(ErrorReason errorReason) {
            System.err.printf("Password change failed with error: %s%n", errorReason);
            resultLatch.countDown();
        }

        public void onRejected(Collection<ErrorReport> errors) {
            System.err.printf("Password change script rejected: %s%n", errors);
            resultLatch.countDown();
        }

        void waitForResponse() {
            try {
                resultLatch.await(10, TimeUnit.SECONDS);
            }
            catch (InterruptedException e) {
                throw new RuntimeException(
                    "Interrupted while awaiting response");
            }
        }
    }

    /**
     * Entry point.
     */
    public static void main(String... args) {

        final Options opts = new Options();

        final CmdLineParser parser = new CmdLineParser(opts);

        try {
            parser.parseArgument(args);
        }
        catch (CmdLineException e) {
            System.err.println(e.getMessage());
            parser.printUsage(System.err);
            return;
        }

        final Session controlSession = Diffusion.sessions()
            .principal(opts.controlPrincipal)
            .password(opts.controlPassword)
            .open(opts.url);

        changePassword(
            controlSession,
            opts.targetPrincipal,
            opts.expectedPassword,
            opts.newPassword);

        controlSession.close();
    }

    /**
     * Command line options, with args4j annotations.
     */
    public static class Options {
        @Option(name = "-u", aliases = { "--url" }, usage = "Server URL.", required = true)
        String url;
        @Option(name = "-a", aliases = { "--admin-principal" }, usage = "Administration principal authorized to change passwords.")
        String controlPrincipal = "admin";
        @Option(name = "-ap", aliases = { "--admin-password" }, usage = "Password for the administration principal.")
        String controlPassword = "password";

        @Option(name = "-t", aliases = { "--target" }, usage = "Principal to change.", required = true)
        String targetPrincipal;
        @Option(name = "-e", aliases = { "--expected-password" }, usage = "Expected password.", required = true)
        String expectedPassword;
        @Option(name = "-n", aliases = { "--new-password" }, usage = "New password.", required = true)
        String newPassword;
    }
}
