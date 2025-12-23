import { create } from "zustand";
import { teamApies } from "@/lib/team";
import type {
  TaskType,
  TeamMembersType,
  TeamTaskType,
  TeamType,
} from "@/lib/types";
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
  teamMembers: TeamMembersType[];

  teamsLoading: boolean;
  teamLoading: boolean;
  tasksLoading: boolean;
  membersLoading: boolean;

  getTeams: () => Promise<void>;
  getATeam: (teamId: TeamType["_id"]) => Promise<void>;
  getAllTasks: (teamId: TeamType["_id"]) => Promise<void>;
  getAllMembersOfTeam: (teamId: TeamType["_id"]) => Promise<void>;

  addTeam: (team: Team) => void;
  addTeamTask: (task: TaskType) => void;
  addTeamMember: (member: TeamMembersType) => void;
  reset: () => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  teamTasks: [],
  teamMembers: [],
  teamDetail: null,

  teamsLoading: false,
  teamLoading: false,
  tasksLoading: false,
  membersLoading: false,

  getTeams: async () => {
    set({ teamsLoading: true });
    const response = await teamApies.getAllTeam();
    if (response?.ok) {
      set({ teams: response.data.teams });
    }
    set({ teamsLoading: false });
  },

  getAllTasks: async (teamId) => {
    set({ tasksLoading: true });
    const response = await tasksApies.getAllTaskOfTheTeam(teamId);
    if (response?.ok) {
      set({ teamTasks: response.data.data });
    }
    set({ tasksLoading: false });
  },

  getATeam: async (teamId) => {
    set({ teamLoading: true });
    const response = await teamApies.getATeam(teamId);
    if (response?.ok) {
      set({ teamDetail: response.data.team });
    }
    set({ teamLoading: false });
  },

  getAllMembersOfTeam: async (teamId) => {
    set({ membersLoading: true });
    const response = await teamApies.getAllMembersOfTeam(teamId);
    if (response?.ok) {
      set({ teamMembers: response.data.members });
    }
    set({ membersLoading: false });
  },

  addTeam: (team) =>
    set((state) => ({
      teams: [...state.teams, team],
    })),

  addTeamTask: (task) =>
    set((state) => ({
      teamTasks: [...state.teamTasks, task],
    })),

  addTeamMember: (member) =>
    set((state) => ({
      teamMembers: [...state.teamMembers, member],
    })),

  reset: () =>
    set({
      teams: [],
      teamTasks: [],
      teamDetail: null,
    }),
}));
