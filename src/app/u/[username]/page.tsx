"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function page() {
  const params = useParams();
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const username = params.username;

  const handleSendMessage = async () => {
    try {
      console.log(username);
      const response = await axios.post(`/api/send-message`, {
        username,
        content,
      });
      if (response) {
        toast({
          title: "Sent Successfully",
          variant: "default",
        });
      }
    } catch (error) {
      let axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError);
      toast({ title: "Error", description: axiosError.response?.data.message });
    }
  };
  return (
    <div className="text-center space-y-2">
      <h1 className="my-12 text-4xl font-semibold">Public Profile Link</h1>
      <div className="max-w-4xl mx-auto space-y-4">
        <p>Send Anonymous Link to @{params.username}</p>
        <Textarea
          value={content}
          placeholder="type message"
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </div>
      <Button onClick={handleSendMessage} size={"lg"}>
        Send
      </Button>
    </div>
  );
}
