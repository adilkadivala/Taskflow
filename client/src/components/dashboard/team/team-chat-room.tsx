"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { useCommentStore } from "@/store/comment";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TaskChatRoom() {
  const { commentLoading, comments, getComments } = useCommentStore();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const { taskId } = useParams();
  const wss = "ws://localhost:3001";

  const raw = localStorage.getItem("token");
  const parsed = raw ? JSON.parse(raw) : null;
  const jwtToken = parsed?.state?.token;

  const decoded: any = jwtToken ? jwtDecode(jwtToken) : null;
  const currentUserId = decoded?.id;

  useEffect(() => {
    if (taskId) getComments(taskId);
  }, [taskId]);

  useEffect(() => {
    if (comments?.length) {
      setMessages(comments);
    }
  }, [comments]);

  useEffect(() => {
    if (!raw || !taskId) return;

    const ws = new WebSocket(`${wss}?token=${jwtToken}`);

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { taskId },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "receive-message") {
        setMessages((prev) => [...prev, data.payload]);
      }
    };

    ws.onerror = (e) => {
      console.error("WS error", e);
    };

    ws.onclose = () => {
      console.log("WS disconnected");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [taskId]);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return;

    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: {
          taskId,
          userId: currentUserId,
          message: input,
        },
      })
    );

    setInput("");
  };

  if (commentLoading) {
    return <p>comments are loading....</p>;
  }

  return (
    <div className="flex flex-col h-screen border border-primary/15 p-5 rounded-2xl">
      <h2 className="font-semibold mb-2">taskTitle</h2>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden space-y-2 py-3 h-screen">
        {messages.map((msg) => {
          const isMe = msg.userId?._id === currentUserId;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <Avatar>
                  <AvatarFallback>{msg.userId?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`px-3 py-2 rounded-xl max-w-[70%] text-sm
          ${
            isMe
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <Button onClick={sendMessage}>
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
