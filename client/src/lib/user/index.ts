import { useAuthStore } from "@/store/auth-store";
import axios from "axios";

class User {
  private server_api = import.meta.env.VITE_SERVER_ROOT_API;

  private get token() {
    return useAuthStore.getState().token;
  }

  // about me
  async aboutMe() {
    try {
      const response = await axios.get(
        `${this.server_api}/about_user/api/v1/about-me`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";
      return { ok: false, status, message };
    }
  }
  // about a team memeber (only admin)
  async aboutATeamMember(teamId: any, userId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/about_user/api/v1/about-user/${teamId}/${userId}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
      if (response.status === 404) {
        return response;
      }
      if (response.status === 401) {
        return response;
      }
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //   assigned me
  async tasksAssignedMe() {
    try {
      const response = await axios.get(
        `${this.server_api}/about_user/api/v1/assigned-me`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 201) {
        return response;
      }
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //   handle user role
  async handleUserRole(teamId: any, memberId: any) {
    try {
      const response = await axios.put(
        `${this.server_api}/about_user/api/v1/handle-role/${teamId}/${memberId}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 400) {
        return response;
      }
      if (response.status === 401) {
        return response;
      }
      if (response.status === 402) {
        return response;
      }
      if (response.status === 403) {
        return response;
      }
      if (response.status === 404) {
        return response;
      }
      if (response.status === 405) {
        return response;
      }
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const aboutUserApies = new User();
