export default function handleTwelveDataError(props: any){
    const response = props.response
    if(response.errorCode == 400){
        props.setDisplayError({
            display: true, 
            title: "API says 'Nope!'", 
            bodyText: "The backend API returned a 400. Looks like it didn’t understand our message.", 
            warning: false, 
            buttonText: "Try Again"
        })
    }
    else if (response.errorCode === 401) {
    props.setDisplayError({
        display: true,
        title: "Unauthorized",
        bodyText: "The API key waved us off. Either it’s invalid or it forgot its password. Time to double-check!",
        warning: false,
        buttonText: "Check Key"
        });
    } 
    else if (response.errorCode === 403) {
        props.setDisplayError({
            display: true,
            title: "Forbidden",
            bodyText: "Our API key tried to sneak in but got blocked. Upgrade required or access denied!",
            warning: false,
            buttonText: "Upgrade Plan"
        });
    } 
    else if (response.errorCode === 404) {
        props.setDisplayError({
            display: true,
            title: "Not Found",
            bodyText: "The requested data is hiding somewhere in cyberspace… maybe loosen the parameters a bit?",
            warning: false,
            buttonText: "Retry"
        });
    } 
    else if (response.errorCode === 414) {
        props.setDisplayError({
            display: true,
            title: "Too Long!",
            bodyText: "Your input array is a bit too ambitious. Shorten it and try again.",
            warning: false,
            buttonText: "Trim Input"
        });
    } 
    else if (response.errorCode === 429) {
        props.setDisplayError({
            display: true,
            title: "Slow down!",
            bodyText: "The API request limit has been hit (either per minute or per day). Try again in a bit or come back tomorrow!",
            warning: false,
            buttonText: "Wait & Retry"
        });
    } 
    else if (response.errorCode === 500) {
        props.setDisplayError({
            display: true,
            title: "Server Oops",
            bodyText: "The backend had an internal hiccup. Try again in a moment.",
            warning: false,
            buttonText: "Retry"
        });
    } 
    else {
        props.setDisplayError({
            display: true,
            title: "Unknown API Error 🤯",
            bodyText: `The API returned an unexpected error code: ${response.ErrorCode}`,
            warning: false,
            buttonText: "Try Again"
        });
    }
}