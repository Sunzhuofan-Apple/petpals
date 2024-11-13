import { useEffect, useState } from "react";

const useProtectedRedirect = (redirectPath) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
    const handleRedirect = (nextPage, additionalParams = {}) => {
        let backendRedirectUrl = `http://localhost:8000/api/${nextPage}`;
        console.log(backendRedirectUrl);

        if (Object.keys(additionalParams).length > 0) {
            const queryParams = new URLSearchParams(additionalParams).toString();
            backendRedirectUrl += `?${queryParams}`;
        }
        
        window.location.href = backendRedirectUrl;
    };

    (async () => {
        await handleRedirect(redirectPath);
        setShouldRender(true);
      })();
    }, [redirectPath]);
  
    return shouldRender;
};

export default useProtectedRedirect;