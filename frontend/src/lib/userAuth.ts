const TOKEN_KEY = "liklet_user_token";
const EVENT_NAME = "liklet:user-auth";

function notifyAuthChange() {
  try {
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch {
    // ignore
  }
}

export function getUserToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setUserToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    notifyAuthChange();
  } catch {
    // ignore
  }
}

export function clearUserToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    notifyAuthChange();
  } catch {
    // ignore
  }
}

export const USER_AUTH_EVENT = EVENT_NAME;
