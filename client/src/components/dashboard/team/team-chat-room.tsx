"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";

export function TaskChatRoom() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const { taskId } = useParams();
  const wss = "ws://localhost:3001";

  useEffect(() => {
    const raw = localStorage.getItem("token");
    if (!raw || !taskId) return;

    const parsed = JSON.parse(raw);
    const jwtToken = parsed.state.token;

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
          message: input,
        },
      })
    );

    setInput("");
  };

  return (
    <div className="flex flex-col h-full border border-primary/15 p-5 rounded-2xl">
      <h2 className="font-semibold mb-2">taskTitle</h2>

      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div key={msg._id} className="text-sm">
            <b>{msg.userId}</b>: {msg.message}
          </div>
        ))}
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
