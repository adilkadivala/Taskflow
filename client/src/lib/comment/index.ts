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
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";
      return { ok: false, status, message };
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
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";
      return { ok: false, status, message };
    }
  }

  //delete comment
  async deleteComment(taskId: any, commentId: any) {
    try {
      const response = await axios.delete(
        `${this.server_api}/comment/api/v1/delete-comment/${taskId}/${commentId}/`,
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
}

export const comemntApies = new Comment();
