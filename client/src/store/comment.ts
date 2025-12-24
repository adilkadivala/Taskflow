import { commentApies } from "@/lib/comment";
import type { CommentType, TaskType } from "@/lib/types";
import { create } from "zustand";



interface CommentStore {
  comments: CommentType[];
  commentLoading: boolean;

  getComments: (teamId: TaskType["_id"]) => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  commentLoading: false,
  getComments: async (taskId) => {
    set({ commentLoading: true });
    const response = await commentApies.getComment(taskId);
    if (response.ok) {
      set({ comments: response.data.comments, commentLoading: false });
    } else {
      set({ commentLoading: false });
    }
  },
}));
