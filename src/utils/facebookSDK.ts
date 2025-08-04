declare global {
    interface Window {
        FB: any;
        fbAsyncInit: () => void;
    }
}

export const initializeFacebookSDK = () => {
    const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || 'your-facebook-app-id-here';
    const apiVersion = 'v19.0'; // You can make this configurable too if needed

    window.fbAsyncInit = function () {
        window.FB.init({
            appId: facebookAppId,
            cookie: true,
            xfbml: true,
            version: apiVersion
        });

        window.FB.AppEvents.logPageView();
    };

    // Load the SDK script if not already loaded
    if (!document.getElementById('facebook-jssdk')) {
        const js = document.createElement('script');
        js.id = 'facebook-jssdk';
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        const fjs = document.getElementsByTagName('script')[0];
        if (fjs && fjs.parentNode) {
            fjs.parentNode.insertBefore(js, fjs);
        }
    }
};
