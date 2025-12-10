import { create } from "zustand";

interface AboutMe {
  id: string | null;
  name: string | null;
  email: string | null;

  role: string[] | null;
  teams: string[] | null;
  soloTasks: string[] | null;
  assignedTasks: string[] | null;

  setMyInfo: (data: {
    id: string;
    name: string;
    email: string;
    role: string[];
    teams: string[];
    soloTasks: string[];
    assignedTasks: string[];
  }) => void;

  reset: () => void;
}

export const useAboutMeStore = create<AboutMe>((set) => ({
  id: null,
  name: null,
  email: null,

  role: null,
  teams: null,
  soloTasks: null,
  assignedTasks: null,

  setMyInfo: (data) =>
    set({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      teams: data.teams,
      soloTasks: data.soloTasks,
      assignedTasks: data.assignedTasks,
    }),

  reset: () =>
    set({
      id: null,
      name: null,
      email: null,
      role: null,
      teams: null,
      soloTasks: null,
      assignedTasks: null,
    }),
}));
