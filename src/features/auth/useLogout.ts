import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "./authStore";

// Every way of logging out goes through here, so none of them forgets a step.
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    logout();
    // Drop everything cached, so the next user on this device never sees this user's profile or orders.
    queryClient.clear();
    navigate("/", { replace: true });
    toast("Signed out");
  };
}
