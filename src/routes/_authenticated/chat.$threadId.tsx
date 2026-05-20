import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, ShieldAlert } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { loadMessages } from "@/lib/chat.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ChatThread,
});

function ChatThread() {
  const { threadId } = useParams({ from: "/_authenticated/chat/$threadId" });
  const load = useServerFn(loadMessages);
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    let cancelled = false;
    setInitialMessages(null);
    (async () => {
      try {
        const rows = await load({ data: { threadId } });
        if (!cancelled) setInitialMessages(rows);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load messages");
        if (!cancelled) setInitialMessages([]);
      }
    })();
    return () => { cancelled = true; };
  }, [threadId, load]);

  if (initialMessages === null) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading conversation…
      </div>
    );
  }

  return (
    <ChatInner
      key={threadId}
      threadId={threadId}
      initialMessages={initialMessages}
      text={text}
      setText={setText}
      inputRef={inputRef}
    />
  );
}

function ChatInner({
  threadId,
  initialMessages,
  text,
  setText,
  inputRef,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  text: string;
  setText: (v: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const transport = new DefaultChatTransport({
    api: "/api/chat",
    prepareSendMessagesRequest: async ({ messages, id }) => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      return {
        body: { messages, threadId: id },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };
    },
  });

  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => toast.error(e.message),
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId, status, inputRef]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || status === "submitted" || status === "streaming") return;
    const value = text;
    setText("");
    await sendMessage({ text: value });
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="border-b border-border bg-background/80 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          AI Chatbot
        </div>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldAlert className="h-3 w-3" />
          AI may make mistakes. Don't share confidential info.
        </p>
      </div>

      <Conversation className="flex-1">
        <ConversationContent className="mx-auto max-w-3xl">
          {messages.length === 0 && (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold">How can I help today?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask about writing, planning, research, or anything work-related.
              </p>
            </div>
          )}

          {messages.map((m) => {
            const textOut = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            return (
              <Message key={m.id} from={m.role}>
                <MessageContent>
                  {m.role === "assistant" ? (
                    <MessageResponse>{textOut}</MessageResponse>
                  ) : (
                    <p className="whitespace-pre-wrap">{textOut}</p>
                  )}
                </MessageContent>
              </Message>
            );
          })}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Thinking…</Shimmer>
              </MessageContent>
            </Message>
          )}

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {error.message}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <PromptInput onSubmit={onSubmit}>
            <PromptInputTextarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask the workplace assistant anything…"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={isLoading || !text.trim()} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
