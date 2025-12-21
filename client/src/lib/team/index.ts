import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import type { TeamType } from "../types";

class Team {
  private server_api = import.meta.env.VITE_SERVER_ROOT_API;
  private get token() {
    return useAuthStore.getState().token;
  }

  // get all teams
  async getAllTeam() {
    try {
      const response = await axios.get(
        `${this.server_api}/team/api/v1/list-team`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";
      return { ok: false, status, message };
    }
  }

  // get a specific team
  async getATeam(teamId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/team/api/v1/list-team/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";
      return { ok: false, status, message };
    }
  }

  //   create team
  async createTeam(teamBody: any) {
    try {
      const response = await axios.post(
        `${this.server_api}/team/api/v1/create-team`,
        { ...teamBody },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";
      return { ok: false, status, message };
    }
  }

  //   update team
  async updateTeam(teamId: any, teamBody: TeamType) {
    try {
      const response = await axios.put(
        `${this.server_api}/team/api/v1/update-team/${teamId}`,
        { ...teamBody },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";
      return { ok: false, status, message };
    }
  }

  //   delete team
  async deleteTeam(teamId: any) {
    try {
      const response = await axios.delete(
        `${this.server_api}/team/api/v1/delete-team/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";
      return { ok: false, status, message };
    }
  }

  //   add member to a team
  async addMemberToATeam(teamId: any, email: string) {
    try {
      const response = await axios.post(
        `${this.server_api}/team/api/v1/add-member/${teamId}}`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";
      return { ok: false, status, message };
    }
  }

  //   remove member from a team
  async removeMemberFromATeam(teamId: any, memberId: any) {
    try {
      const response = await axios.post(
        `${this.server_api}/team/api/v1/remove-member/${teamId}/${memberId}`,

        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";
      return { ok: false, status, message };
    }
  }

  // get a specific team
  async getAllMembersOfTeam(teamId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/team/api/v1/get-members/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";
      return { ok: false, status, message };
    }
  }
}

export const teamApies = new Team();
