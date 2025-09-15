// In src/hooks/useAuth.js

// This is a "named export"
export const useAuth = () => {
    // Get the user data from the browser's local storage
    const user = JSON.parse(localStorage.getItem('user'));

    // If a user object exists, it means they are logged in
    if (user) {
        return true;
    } else {
        return false;
    }
};