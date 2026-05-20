
CREATE TABLE public.threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'New conversation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own threads select" ON public.threads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own threads insert" ON public.threads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own threads update" ON public.threads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own threads delete" ON public.threads FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX threads_user_idx ON public.threads(user_id, updated_at DESC);

CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages select" ON public.messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own messages insert" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own messages delete" ON public.messages FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX messages_thread_idx ON public.messages(thread_id, created_at);
