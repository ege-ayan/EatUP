import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/generated/prisma";

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: UserRole;
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "eatup-user-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
