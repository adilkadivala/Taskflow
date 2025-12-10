import { create } from "zustand";
import { teamApies } from "@/lib/team";

interface Team {
  _id: string;
  name: string;
  description: string;
  members: { _id: string; name: string; email: string }[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  tasks: string[];
}

interface TeamStore {
  teams: Team[];
  loading: boolean;

  getTeams: () => Promise<void>;
  addTeam: (task: Team) => void;
  reset: () => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  loading: false,

  getTeams: async () => {
    set({ loading: true });
    const response = await teamApies.getAllTeam();
    if (response?.ok === true) {
      set({ teams: response.data.teams, loading: false });
    } else {
      set({ loading: false });
    }
  },

  addTeam: (team) =>
    set((state) => ({
      teams: [...state.teams, team],
    })),

  reset: () => set({ teams: [] }),
}));
