import axios from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Cookies from "js-cookie";
import { ErrorToast } from "./components/ui/toaster";

// Proxy configuration - similar to Vite setup
// export const baseUrl = "https://api-dev.resvor.com";
export const baseUrl = "https://api-staging.resvor.com";


async function getDeviceFingerprint() {
    if (typeof window === "undefined") {
        return "server-device";
    }
    try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        console.log(result.visitorId); // Unique device ID
        return result.visitorId;
    } catch (e) {
        console.log("Fingerprint failed", e);
        return "unknown-device";
    }
}

const instance = axios.create({
    baseURL: baseUrl,
    // withCredentials: true, // Enable automatic HTTP-only cookie handling
    headers: {
        Accept: "application/json",
    },
    timeout: 200000,
});

instance.interceptors.request.use(async (request) => {
    // Internet check
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && !navigator.onLine) {
        console.log("Network Error");
        return Promise.reject({
            code: "NO_INTERNET",
            message: "No internet connection",
        });
    }

    // request.withCredentials = true;

    let token = "";
    if (typeof window !== "undefined") {
        token = Cookies.get("token") || Cookies.get("authorization") || "";
    }
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }

    let fingerprint = "unknown-device";

    if (typeof window !== "undefined") {
        // Prevent hanging
        try {
            fingerprint = await Promise.race([
                getDeviceFingerprint(),

                new Promise<string>((resolve) =>
                    setTimeout(() => resolve("unknown-device"), 3000),
                ),
            ]);
        } catch (e) {
            console.log("Fingerprint failed");
        }
    }

    const isFormData = request.data instanceof FormData;

    if (request.headers) {
        if (!isFormData && !request.headers["Content-Type"]) {
            request.headers["Content-Type"] = "application/json";
        }
        request.headers["devicemodel"] = fingerprint;
        request.headers["deviceuniqueid"] = fingerprint;
    }

    return request;
});

instance.interceptors.response.use(
    (response) => {
        console.log("✅ Response received:", response.config.url, {
            status: response.status,
            headers: response.headers,
            data: response.data,
        });

        const token =
            response.data?.token ||
            response.data?.data?.token ||
            response.data?.accessToken ||
            response.data?.data?.accessToken ||
            response.data?.authorization ||
            response.data?.data?.authorization;

        if (token && typeof window !== "undefined") {
            Cookies.set("token", token, { expires: 7, path: "/" });
            Cookies.set("authorization", token, { expires: 7, path: "/" });
        }

        if (response.config.url?.endsWith("/auth/logout") && typeof window !== "undefined") {
            Cookies.remove("token", { path: "/" });
            Cookies.remove("authorization", { path: "/" });
            Cookies.remove("sessionType", { path: "/" });
            Cookies.remove("onboardingStep", { path: "/" });
            Cookies.remove("user", { path: "/" });
        }

        return response;
    },
    (error) => {
        console.error("❌ Request error:", error.config?.url, {
            status: error.response?.status,
            message: error.message,
        });

        if (error.response?.data) {
            const data = error.response.data;
            if (Array.isArray(data.error)) {
                const messages = data.error.map((err: any) => err.message).filter(Boolean);
                if (messages.length > 0) {
                    data.message = messages.join(", ");
                }
            } else if (
                data.error &&
                typeof data.error === "object" &&
                data.error.message
            ) {
                data.message = data.error.message;
            } else if (data.error && typeof data.error === "string") {
                data.message = data.error;
            }
        }

        const isAuthRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/auth/login");

        if (error.code === "ECONNABORTED") {
            ErrorToast("Your internet connection is slow. Please try again.");
        }

        if (error?.response?.status === 401 && !isAuthRoute) {
            let hasCookie = false;
            if (typeof window !== "undefined") {
                hasCookie = !!(Cookies.get("token") || Cookies.get("authorization"));
                Cookies.remove("token", { path: "/" });
                Cookies.remove("authorization", { path: "/" });
                Cookies.remove("sessionType", { path: "/" });
                Cookies.remove("onboardingStep", { path: "/" });
                Cookies.remove("user", { path: "/" });
            }

            if (hasCookie) {
                ErrorToast("Session expired. Please log in again.");
            }
        }

        return Promise.reject(error);
    },
);

export default instance;
