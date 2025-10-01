import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: "STUDENT" | "OWNER";
}

export interface Booking {
  id: string;
  offeringId: string;
  offeringName: string;
  organizationName: string;
  quantity: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  pickupTime?: string;
  totalPrice: number;
  createdAt: string;
}

interface UserStore {
  // User state
  user: User | null;
  isAuthenticated: boolean;

  // Bookings
  currentBookings: Booking[];
  pastBookings: Booking[];

  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => void;
  setBookings: (currentBookings: Booking[], pastBookings: Booking[]) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      currentBookings: [],
      pastBookings: [],

      // Actions
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
          currentBookings: [],
          pastBookings: [],
        });
      },

      addBooking: (booking) => {
        set((state) => ({
          currentBookings: [booking, ...state.currentBookings],
        }));
      },

      updateBookingStatus: (bookingId, status) => {
        set((state) => {
          const currentBookings = state.currentBookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status } : booking
          );

          const pastBookings = state.pastBookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status } : booking
          );

          // Move completed/cancelled bookings to past
          if (status === "COMPLETED" || status === "CANCELLED") {
            const bookingToMove = currentBookings.find(
              (b) => b.id === bookingId
            );
            if (bookingToMove) {
              return {
                currentBookings: currentBookings.filter(
                  (b) => b.id !== bookingId
                ),
                pastBookings: [bookingToMove, ...pastBookings],
              };
            }
          }

          return {
            currentBookings,
            pastBookings,
          };
        });
      },

      setBookings: (currentBookings, pastBookings) => {
        set({ currentBookings, pastBookings });
      },
    }),
    {
      name: "eatup-user-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentBookings: state.currentBookings,
        pastBookings: state.pastBookings,
      }),
    }
  )
);
