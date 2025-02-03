import React from "react";
import Message from "./message";

const MessageContainer = () => {
  return (
    <div className="flex-1 flex h-full flex-col w-full max-w-5xl overflow-y-auto p-5 gap-2">
      <Message message="Hello" role="user" />
      <Message message="Hello" role="assistant" />
    </div>
  );
};

export default MessageContainer;
