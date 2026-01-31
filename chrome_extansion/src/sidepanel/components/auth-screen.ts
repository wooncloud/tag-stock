import { getUser, getProfile, signInWithGoogle, signOut } from '../../lib/supabase/auth';
import type { UserProfile } from '../../shared/types';

let onLoginSuccessCallback: (() => Promise<void>) | null = null;

/**
 * Set callback to be called after successful login
 */
export function setOnLoginSuccess(callback: () => Promise<void>): void {
    onLoginSuccessCallback = callback;
}

/**
 * Initialize and render the authentication screen
 */
export function initAuthScreen(): void {
    const authContainer = document.getElementById('authContainer');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('authError');

    if (!authContainer) {
        console.error('authContainer element not found');
        return;
    }

    if (!loginBtn) {
        console.error('loginBtn element not found');
        return;
    }

    if (!errorMessage) {
        console.error('authError element not found');
        return;
    }

    // Handle Google login
    loginBtn.addEventListener('click', async () => {
        try {
            setAuthLoading(true);
            errorMessage.textContent = '';

            await signInWithGoogle();

            // Call success callback to refresh auth state
            if (onLoginSuccessCallback) {
                await onLoginSuccessCallback();
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'Failed to login. Please try again.';
            setAuthLoading(false);
        }
    });
}

/**
 * Check if user is authenticated and return profile
 */
export async function checkAuth(): Promise<UserProfile | null> {
    try {
        const user = await getUser();

        if (!user) {
            return null;
        }

        const profile = await getProfile(user.id);
        return profile;
    } catch (error) {
        console.error('Auth check error:', error);
        return null;
    }
}

/**
 * Show the loading screen
 */
export function showLoadingScreen(): void {
    const loadingContainer = document.getElementById('loadingContainer');
    const authContainer = document.getElementById('authContainer');
    const appContainer = document.getElementById('appContainer');

    if (loadingContainer && authContainer && appContainer) {
        loadingContainer.classList.remove('hidden');
        authContainer.classList.add('hidden');
        appContainer.classList.add('hidden');
    }
}

/**
 * Hide the loading screen
 */
export function hideLoadingScreen(): void {
    const loadingContainer = document.getElementById('loadingContainer');
    if (loadingContainer) {
        loadingContainer.classList.add('hidden');
    }
}

/**
 * Show the authentication screen
 */
export function showAuthScreen(): void {
    const loadingContainer = document.getElementById('loadingContainer');
    const authContainer = document.getElementById('authContainer');
    const appContainer = document.getElementById('appContainer');

    if (loadingContainer && authContainer && appContainer) {
        loadingContainer.classList.add('hidden');
        authContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');

        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) signOutBtn.classList.add('hidden');
    }
}

/**
 * Hide the authentication screen and show the app
 */
export function hideAuthScreen(): void {
    const loadingContainer = document.getElementById('loadingContainer');
    const authContainer = document.getElementById('authContainer');
    const appContainer = document.getElementById('appContainer');

    if (loadingContainer && authContainer && appContainer) {
        loadingContainer.classList.add('hidden');
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');

        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) signOutBtn.classList.remove('hidden');
    }
}

/**
 * Set loading state for auth screen
 */
function setAuthLoading(loading: boolean): void {
    const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
    const loginLoading = document.getElementById('loginLoading');

    if (loginBtn && loginLoading) {
        if (loading) {
            loginBtn.classList.add('hidden');
            loginLoading.classList.remove('hidden');
        } else {
            loginBtn.classList.remove('hidden');
            loginLoading.classList.add('hidden');
        }
    }
}

/**
 * Handle sign out
 */
export async function handleSignOut(): Promise<void> {
    try {
        await signOut();

        // Reset loading state before showing auth screen
        setAuthLoading(false);
        showAuthScreen();

        // Clear any cached data
        const creditDisplay = document.getElementById('creditDisplay');
        if (creditDisplay) {
            creditDisplay.textContent = '--';
        }
    } catch (error) {
        console.error('Sign out error:', error);
        setAuthLoading(false); // Also reset on error
    }
}
