import { useAuthStore } from "@/store/auth-store";
import axios from "axios";

class Notification {
  private server_api = import.meta.env.VITE_SERVER_ROOT_API;
  private get token() {
    return useAuthStore.getState().token;
  }

  // get all notifications
  async getNotifications() {
    try {
      const response = await axios.get(
        `${this.server_api}/notification/api/v1/get-all-notifications`,
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

  // get all unread notifications
  async getUnreadNotifications() {
    try {
      const response = await axios.get(
        `${this.server_api}/notification/api/v1/get-all-unread-notifications`,
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

  // make a  notification as a read
  async markNotificationAsRead(taskId: any) {
    try {
      const response = await axios.patch(
        `${this.server_api}/notification/api/v1/mark-read-notification/${taskId}`,
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

  // make a  notification as a read
  async markAllNotificationsAsRead() {
    try {
      const response = await axios.patch(
        `${this.server_api}/notification/api/v1/mark-all-read-notification`,
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

  // make a  notification as a read
  async deleteANotification(notificationId: any) {
    try {
      const response = await axios.delete(
        `${this.server_api}/notification/api/v1/delet-notification/${notificationId}`,
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

  // make a  notification as a read
  async deleteAllNotification() {
    try {
      const response = await axios.delete(
        `${this.server_api}/notification/api/v1/delet-notification`,
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

export const notificationApies = new Notification();
