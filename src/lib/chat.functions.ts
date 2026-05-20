import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { UIMessage } from "ai";

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("threads")
      .select("id, title, created_at, updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ title: z.string().max(200).optional() }).parse(input ?? {}),
  )
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("threads")
      .insert({ user_id: context.userId, title: data.title ?? "New conversation" })
      .select("id, title, created_at, updated_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ threadId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("threads")
      .delete()
      .eq("id", data.threadId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const renameThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      threadId: z.string().uuid(),
      title: z.string().min(1).max(200),
    }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("threads")
      .update({ title: data.title, updated_at: new Date().toISOString() })
      .eq("id", data.threadId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const loadMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ threadId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { data: rows, error } = await context.supabase
      .from("messages")
      .select("content")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => r.content as unknown as UIMessage);
  });
