import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GoogleSignIn } from "./GoogleSignIn";
import { useUserAuth } from "@/context/UserAuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { login } = useUserAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Sign in to SwapnaAakar</DialogTitle>
        </DialogHeader>
        <div className="py-6 flex justify-center">
          <GoogleSignIn 
            onSuccess={(credential) => {
              login(credential);
              onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
