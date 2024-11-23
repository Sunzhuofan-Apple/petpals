let googleMapsPromise = null;

const loadGoogleMapsAPI = () => {
    if (googleMapsPromise) {
        return googleMapsPromise;
    }

    googleMapsPromise = new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve(window.google.maps);
            return;
        }

        const script = document.createElement('script');
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
            reject(new Error('Google Maps API key is not defined'));
            return;
        }

        window.initGoogleMapsAPI = () => {
            if (window.google && window.google.maps) {
                resolve(window.google.maps);
            } else {
                reject(new Error('Google Maps failed to load'));
            }
            delete window.initGoogleMapsAPI;
        };
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsAPI`;
        script.async = true;
        script.defer = true;
        
        script.onerror = () => {
            reject(new Error('Failed to load Google Maps API script'));
            delete window.initGoogleMapsAPI;
        };

        document.head.appendChild(script);
    });

    return googleMapsPromise;
};

export default loadGoogleMapsAPI;