import { useAuthStore } from "@/store/auth-store";
import axios from "axios";

class Comment {
  private server_api = import.meta.env.VITE_SERVER_ROOT_API;
  private get token() {
    return useAuthStore.getState().token;
  }

  // get comment
  async getComment(taskId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/comment/api/v1/get-comments/${taskId}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
      if (response.status === 404) {
        return response;
      }
      if (response.status === 201) {
        return response.data;
      }
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // create comments
  async createComment(taskId: any, commentBody: any) {
    try {
      const response = await axios.post(
        `${this.server_api}/comment/api/v1/create-comment/${taskId}`,
        { ...commentBody },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
      if (response.status === 404) {
        return response;
      }
      if (response.status === 400) {
        return response;
      }
      if (response.status === 401) {
        return response;
      }
      if (response.status === 422) {
        return response;
      }
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //delete comment
  async deleteComment(taskId: any, commentId: any) {
    try {
      const response = await axios.delete(
        `${this.server_api}/comment/api/v1/delete-comment/${taskId}/${commentId}/`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
      if (response.status === 404) {
        return response;
      }
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
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const comemntApies = new Comment();
