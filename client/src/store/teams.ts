import { create } from "zustand";
import { teamApies } from "@/lib/team";
import type { TaskType, TeamTaskType, TeamType } from "@/lib/types";
import { tasksApies } from "@/lib/task";

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
  tasks: {
    _id: string;
    title: string;
    descrption: string;
    priority: string;
    status: string;
    dueDate: string;
    assignedTo: {
      name: string;
      email: string;
    };
  }[];
}

interface TeamStore {
  teams: Team[];
  teamDetail: Team | null;
  teamTasks: TeamTaskType[];
  loading: boolean;

  getTeams: () => Promise<void>;
  getAllTasks: (teamId: TeamType["_id"]) => Promise<void>;
  getATeam: (teamId: TeamType["_id"]) => Promise<void>;
  addTeam: (team: Team) => void;

  addTeamTask: (task: TaskType) => void;
  reset: () => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  teamTasks: [],
  teamDetail: null,
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

  getAllTasks: async (teamId: TeamType["_id"]) => {
    set({ loading: true });
    const response = await tasksApies.getAllTaskOfTheTeam(teamId);
    console.log(response);
    if (response?.ok === true) {
      set({ teamTasks: response.data.data, loading: false });
    } else {
      set({ loading: false });
    }
  },

  getATeam: async (teamId: TeamType["_id"]) => {
    set({ loading: true });
    const response = await teamApies.getATeam(teamId);
    if (response?.ok === true) {
      set({ teamDetail: response.data.team, loading: false });
    } else {
      set({ loading: false });
    }
  },

  addTeam: (team) =>
    set((state) => ({
      teams: [...state.teams, team],
    })),

  addTeamTask: (task) =>
    set((state) => ({
      teamTasks: [...state.teamTasks, task],
    })),

  reset: () =>
    set({
      teams: [],
      teamTasks: [],
      teamDetail: null,
    }),
}));
