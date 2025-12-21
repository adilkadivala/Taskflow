import axios from "axios";
import type { TaskType } from "../types";
import { useAuthStore } from "@/store/auth-store";

class Task {
  private server_api = import.meta.env.VITE_SERVER_ROOT_API;
  private get token() {
    return useAuthStore.getState().token;
  }

  // get task
  async getAllTask() {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/get-all-task`,
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
  // create task
  async createTask(taskBody: TaskType) {
    try {
      const response = await axios.post(
        `${this.server_api}/task/api/v1/create-task`,
        { ...taskBody },
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
  // update task
  async updateTask(taskId: TaskType["_id"], taskBody: TaskType) {
    try {
      const response = await axios.put(
        `${this.server_api}/task/api/v1/update-task/${taskId}`,
        { ...taskBody },
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
  // delete task
  async deleteTask(taskId: TaskType["_id"]) {
    try {
      const response = await axios.delete(
        `${this.server_api}/task/api/v1/delete-task/${taskId}`,
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
  // delete all task
  async deleteAllTask(taskIds: any) {
    try {
      const response = await axios.delete(
        `${this.server_api}/task/api/v1/delete-all-tasks`,
        {
          data: taskIds,
          headers: { Authorization: `Bearer ${this.token}` },
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
  // search task
  async searchTask(title?: any, description?: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/search-task/searchby`,
        {
          params: {
            title,
            description,
          },
          headers: { Authorization: `Bearer ${this.token}` },
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
  // get solo task stats
  async getTaskStats() {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/task-stats`,
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
  // get recent task
  async getRecentTask() {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/task-recents`,
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
  // get task activity
  async getTaskActivity(taskId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/task-activity/${taskId}`,
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
  // get task activity
  async getSpecificTask(taskId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/get-specific-task/${taskId}`,
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
  // filter by status
  async filterTask(status: any, priority: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/filter-task/filterby`,
        {
          params: { status, priority },
          headers: { Authorization: `Bearer ${this.token}` },
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

  //  ----------- team -----------------//

  // create task
  async createTeamTask(teamId: any, taskBody: TaskType) {
    try {
      const response = await axios.post(
        `${this.server_api}/task/api/v1/create-task-of-team/${teamId}`,
        { ...taskBody },
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
  // update task
  async updateTeamTask(teamId: any, taskId: any) {
    try {
      const response = await axios.put(
        `${this.server_api}/task/update-task-of-team/${teamId}/${taskId}`,
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
  // get all tasks of the team
  async getAllTaskOfTheTeam(teamId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/get-all-task-of-team/${teamId}`,
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
  // get all tasks of the team
  async getASpecificTaskOfTheTeam(teamId: any, taskId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/get-specific-task-of-team/${teamId}/${taskId}`,
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
  // delete task
  async deleteATaskOFTeam(teamId: any, taskId: any) {
    try {
      const response = await axios.delete(
        `${this.server_api}/task/api/v1/delete-task-of-team/${teamId}/${taskId}`,
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
  // delete all task
  async deleteAllTaskOfTeam(teamId: any, taskIds: any) {
    try {
      const response = await axios.delete(
        `${this.server_api}/task/api/v1/delete-all-task-of-team/${teamId}`,
        {
          data: taskIds,
          headers: { Authorization: `Bearer ${this.token}` },
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
  // get team task stats
  async getTeamTaskStats(teamId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/task-stats?teamId=${teamId}`,
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
  // get recent task
  async getTeamRecentTask(teamId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/task-recents?teamId=${teamId}`,
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
  // assign a task to the user
  async assignATaskToTheMember(teamId: any, taskId: any, memberId: any) {
    try {
      const response = await axios.post(
        `${this.server_api}/task/api/v1/assign-task/${teamId}/${taskId}/${memberId}`,
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
  // assign a task to the user
  async unAssignATaskToTheMember(teamId: any, taskId: any, memberId: any) {
    try {
      const response = await axios.delete(
        `${this.server_api}/task/api/v1/unassign-task/${teamId}/${taskId}/${memberId}`,
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

export const tasksApies = new Task();
