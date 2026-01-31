import { createClient } from './client';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '../../shared/types';

/**
 * Get the current user
 */
export async function getUser(): Promise<User | null> {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        // Session missing is expected when not logged in, don't log as error
        if (error.message.includes('session_missing') || error.message.includes('Auth session missing')) {
            console.log('No active session (user not logged in)');
        } else {
            console.error('Error getting user:', error);
        }
        return null;
    }

    return user;
}

/**
 * Get user profile from database
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
    const supabase = createClient();

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (!profile || error) {
        // Attempt to create profile if missing
        const user = await getUser();
        if (!user) return null;

        const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            // @ts-expect-error - Supabase schema types not configured
            .upsert({
                id: userId,
                email: user.email || '',
                plan: 'free',
                credits_subscription: 10,
                credits_purchased: 0,
            })
            .select()
            .single();

        if (!insertError && newProfile) {
            return newProfile as UserProfile;
        }

        // Return default if insert fails
        return {
            id: userId,
            email: user.email || '',
            plan: 'free',
            credits_subscription: 0,
            credits_purchased: 0,
        };
    }

    return profile as UserProfile;
}

/**
 * Sign in with Google OAuth
 * Uses chrome.identity API for proper Chrome Extension OAuth handling
 */
export async function signInWithGoogle(): Promise<void> {
    const supabase = createClient();

    // Get the redirect URL from Chrome
    const redirectUrl = chrome.identity.getRedirectURL();
    console.log('Chrome Identity Redirect URL:', redirectUrl);

    // Get OAuth URL from Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: true,
        },
    });

    if (error) {
        console.error('Error getting OAuth URL:', error);
        throw error;
    }

    if (!data?.url) {
        throw new Error('No OAuth URL returned');
    }

    console.log('Launching OAuth with URL:', data.url);

    // Launch OAuth flow using Chrome Identity API
    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow(
            {
                url: data.url,
                interactive: true,
            },
            (responseUrl) => {
                // Check for errors
                if (chrome.runtime.lastError) {
                    console.error('Chrome identity error:', chrome.runtime.lastError);
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                if (!responseUrl) {
                    reject(new Error('No response URL received'));
                    return;
                }

                console.log('OAuth Response URL:', responseUrl);

                // Extract tokens from URL
                try {
                    const url = new URL(responseUrl);
                    const hashParams = new URLSearchParams(url.hash.substring(1));
                    const accessToken = hashParams.get('access_token');
                    const refreshToken = hashParams.get('refresh_token');
                    const errorParam = hashParams.get('error');

                    if (errorParam) {
                        reject(new Error(errorParam));
                        return;
                    }

                    if (!accessToken || !refreshToken) {
                        reject(new Error('No access token received'));
                        return;
                    }

                    console.log('Tokens extracted, setting session...');

                    // Set session in Supabase
                    supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    }).then(() => {
                        console.log('Session set successfully');
                        resolve();
                    }).catch((err) => {
                        console.error('Error setting session:', err);
                        reject(err);
                    });
                } catch (err) {
                    console.error('Error parsing OAuth response:', err);
                    reject(err);
                }
            }
        );
    });
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

/**
 * Get total credits available
 */
export function getTotalCredits(profile: UserProfile): number {
    return profile.credits_subscription + profile.credits_purchased;
}

/**
 * Check if user has sufficient credits
 */
export function hasSufficientCredits(profile: UserProfile, required: number = 1): boolean {
    return getTotalCredits(profile) >= required;
}
