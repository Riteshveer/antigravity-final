import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Extend Window interface to recognize the google object provided by the GIS script
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleSignInProps {
  onSuccess?: (credential: string) => void;
  onError?: () => void;
}

export const GoogleSignIn = ({ onSuccess, onError }: GoogleSignInProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Debugging: Log the current origin so the user knows exactly which URL to whitelist in GCP
    console.log("Current Origin for Google Sign-In:", window.location.origin);

    const initializeGoogleSignIn = () => {
      if (!window.google?.accounts?.id) {
        return false;
      }

      try {
        // Initialize GIS for popup mode (no redirect flow)
        window.google.accounts.id.initialize({
          client_id: "129457944697-h9r4rpaq4hbfl2kt697iuej9su46qmdu.apps.googleusercontent.com",
          callback: (response: any) => {
            if (response.credential) {
              toast.success("Google Sign-In successful!");
              if (onSuccess) onSuccess(response.credential);
            } else {
              if (onError) onError();
            }
          },
        });

        // Render the Google Sign-In button
        if (containerRef.current) {
          window.google.accounts.id.renderButton(containerRef.current, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
          });
        }
        
        setIsReady(true);
        return true;
      } catch (err) {
        console.error("Failed to initialize Google Sign-In", err);
        return false;
      }
    };

    // Since the GIS script loads async, window.google might not be immediately available.
    // We check periodically.
    let checkAttempts = 0;
    const interval = setInterval(() => {
      if (initializeGoogleSignIn() || checkAttempts > 20) {
        clearInterval(interval);
      }
      checkAttempts++;
    }, 100);

    return () => clearInterval(interval);
  }, [onSuccess, onError]);

  return (
    <div className="w-full flex justify-center">
      <div ref={containerRef} id="googleSignInDiv"></div>
      {!isReady && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading Google Sign-In...
        </div>
      )}
    </div>
  );
};
