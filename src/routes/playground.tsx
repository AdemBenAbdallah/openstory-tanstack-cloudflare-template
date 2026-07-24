import { runPlaygroundFn } from '@/functions/playground';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useState, type FormEvent } from 'react';
import type { PlaygroundResult } from '@/lib/playground/message';

export const Route = createFileRoute('/playground')({
  component: PlaygroundPage,
});

function PlaygroundPage() {
  const runPlayground = useServerFn(runPlaygroundFn);
  const [result, setResult] = useState<PlaygroundResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const message = new FormData(form).get('message');

    if (typeof message !== 'string') return;

    setError(null);
    setIsSubmitting(true);
    try {
      setResult(await runPlayground({ data: { message } }));
      form.reset();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to run the playground.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Template playground</h1>
        <p className="text-muted-foreground">
          Submit a message to exercise a validated TanStack Start server
          function.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Server function test</CardTitle>
          <CardDescription>
            The browser sends FormData, Zod validates it on the server, and the
            server returns a typed result.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <label className="flex flex-col gap-2" htmlFor="message">
              <span>Message</span>
              <Input id="message" maxLength={280} name="message" required />
            </label>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Running…' : 'Run server function'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <section aria-live="polite" className="flex flex-col gap-3">
        {error ? <p role="alert">{error}</p> : null}
        {result ? (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p>{result.normalizedMessage}</p>
              <p>Words: {result.wordCount}</p>
              <p>Characters: {result.characterCount}</p>
              <p>
                Processed: {new Date(result.receivedAt).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </main>
  );
}
