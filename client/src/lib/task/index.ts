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
  async updateTask(taskId: string, taskBody: TaskType) {
    try {
      const response = await axios.put(
        `${this.server_api}/task/api/v1/update-task/${taskId}`,
        { ...taskBody },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      console.log(response);

      return { ok: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";
      return { ok: false, status, message };
    }
  }
  // delete task
  async deleteTask(taskId: string) {
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

      if (response.status === 200) {
        return response;
      }
      if (response.status === 404) {
        return { message: "tasks not available to delete" };
      }
      if (response.status === 400) {
        return { message: "body not provided" };
      }
    } catch (error) {
      console.log(error);
    }
  }
  // search task
  async seacrhTask(taskTitle: any, description: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/search-task/searchby?title=${taskTitle}?description=${description}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 404) {
        return { message: "No any task found" };
      }

      if (response.status === 402) {
        return { message: "Please provide title or description to search" };
      }
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  // get solo task stats
  async getTaskStats() {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/task-stats`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 404) {
        return { message: "No any task found" };
      }

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  // get recent task
  async getRecentTask() {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/task-recents`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 404) {
        return { message: "No any task found" };
      }

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  // get task activity
  async getTaskActivity(taskId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/task-activity/${taskId}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 402) {
        return { message: "params not provided" };
      }
      if (response.status === 404) {
        return { message: "No any task found" };
      }

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  // get task activity
  async getSpecificTask(taskId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/get-specific-task/${taskId}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 404) {
        return { message: "No any task found" };
      }

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  // filter by status
  async filterTask(status: any, priority: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/filter-task/filterby?status=${status}?priority=${priority}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 404) {
        return {
          message:
            "No any task found based on your filter, try to remove some filters",
        };
      }

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //  ----------- team -----------------//

  // create task
  async createTeamTask(teamId: any, taskBody: TaskType) {
    try {
      const response = await axios.post(
        `${this.server_api}/task/create-task-of-team/${teamId}`,
        { ...taskBody },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 200) {
        return response.data;
      }
      if (response.status === 422) {
        return { message: "incorrect input" };
      }
      if (response.status === 400) {
        return { message: "team not found" };
      }
    } catch (error) {
      console.log(error);
    }
  }
  // update task
  async updateTeamTask(teamId: any, taskId: any) {
    try {
      const response = await axios.put(
        `${this.server_api}/task/update-task-of-team/${teamId}/${taskId}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 200) {
        return response.data;
      }
      if (response.status === 400) {
        return { message: "team not found" };
      }
      if (response.status === 403) {
        return { message: "task not found in the team" };
      }
      if (response.status === 422) {
        return { message: "incorrect input" };
      }
    } catch (error) {
      console.log(error);
    }
  }
  // get all tasks of the team
  async getAllTaskOfTheTeam(teamId: any) {
    try {
      const respnse = await axios.get(
        `${this.server_api}/task/api/v1/get-all-task-of-team/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      if (respnse.status === 200) {
        return respnse.data;
      }
      if (respnse.status === 401) {
        return { msg: "tuo're not member of the team" };
      }
      if (respnse.status === 403) {
        return { msg: "no tasks availabel to dispay in the team" };
      }
      if (respnse.status === 404) {
        return { msg: "team not found" };
      }
    } catch (error) {
      console.log(error);
    }
  }
  // get all tasks of the team
  async getASpecificTaskOfTheTeam(teamId: any, taskId: any) {
    try {
      const respnse = await axios.get(
        `${this.server_api}/task/api/v1/get-specific-task-of-team/${teamId}/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      if (respnse.status === 200) {
        return respnse.data;
      }
      if (respnse.status === 401) {
        return { msg: "tuo're not member of the team" };
      }
      if (respnse.status === 403) {
        return { msg: "task not availabel in the team" };
      }
      if (respnse.status === 404) {
        return { msg: "team not found" };
      }
    } catch (error) {
      console.log(error);
    }
  }
  // delete task
  async deleteATaskOFTeam(teamId: any, taskId: any) {
    try {
      const response = await axios.delete(
        `${this.server_api}/task/api/v1/delete-task-of-team/${teamId}/${taskId}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 200) {
        return response;
      }
      if (response.status === 404) {
        return { message: "team not found" };
      }
      if (response.status === 403) {
        return { message: "task not found in the team" };
      }
      if (response.status === 402) {
        return { message: "params not provided" };
      }
    } catch (error) {
      console.log(error);
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

      if (response.status === 200) {
        return response;
      }
      if (response.status === 404) {
        return { message: "tasks not available to delete" };
      }
      if (response.status === 400) {
        return { message: "body not provided" };
      }
    } catch (error) {
      console.log(error);
    }
  }
  // get team task stats
  async getTeamTaskStats(teamId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/task-stats?teamId=${teamId}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 404) {
        return { message: "No any task found" };
      }

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  // get recent task
  async getTeamRecentTask(teamId: any) {
    try {
      const response = await axios.get(
        `${this.server_api}/task/api/v1/task-recents?teamId=${teamId}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 404) {
        return { message: "No any task found" };
      }

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  // assign a task to the user
  async assignATaskToTheMember(teamId: any, taskId: any, memberId: any) {
    try {
      const response = await axios.post(
        `${this.server_api}/task/api/v1/assign-task/${teamId}/${taskId}/${memberId}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 400) {
        return { message: "task not found" };
      }
      if (response.status === 401) {
        return { message: "team not found" };
      }
      if (response.status === 402) {
        return { message: "task not found in the team" };
      }
      if (response.status === 403) {
        return { message: "task already assigned to a member" };
      }
      if (response.status === 404) {
        return { message: "member not exist in a team" };
      }
      if (response.status === 409) {
        return { message: "task already completed" };
      }
      if (response.status === 200) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  }
  // assign a task to the user
  async unAssignATaskToTheMember(teamId: any, taskId: any, memberId: any) {
    try {
      const response = await axios.delete(
        `${this.server_api}/task/api/v1/unassign-task/${teamId}/${taskId}/${memberId}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status === 400) {
        return { message: "task not found" };
      }
      if (response.status === 401) {
        return { message: "team not found" };
      }
      if (response.status === 402) {
        return { message: "task not found in the team" };
      }
      if (response.status === 403) {
        return { message: "task not Assigned to anyone !!" };
      }
      if (response.status === 404) {
        return { message: "member not exist in a team" };
      }
      if (response.status === 409) {
        return { message: "task already completed" };
      }
      if (response.status === 200) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const tasksApies = new Task();
