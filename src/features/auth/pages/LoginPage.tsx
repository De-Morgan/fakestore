import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { ApiError } from "@/api/client";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "../api";
import { safeNext } from "../requireAuth";

const LoginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// A real FakeStore user (id 2), listed in their docs.
const DEMO = { username: "mor_2314", password: "83r5^_" };

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");
  const login = useLoginMutation();

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" },
    mode: "onTouched",
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    // Per-call callbacks: UI reactions that only make sense while this page is mounted.
    login.mutate(values, {
      onSuccess: () => {
        toast.success("Signed in");
        navigate(safeNext(next), { replace: true });
      },
      onError: (error) =>
        form.setError("root", {
          message:
            error instanceof ApiError && error.status === 401
              ? "Invalid username or password"
              : "Something went wrong. Please try again.",
        }),
    }),
  );

  return (
    <Container className="flex justify-center py-12">
      <title>Log in . FakeStore</title>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h1 className="text-xl font-semibold">Log in</h1>
          </CardTitle>
          <CardDescription>
            {next ? "Log in to continue." : "Welcome back to FakeStore."}
          </CardDescription>
        </CardHeader>
        {/* `contents` lets the content and footer take part in the card's own spacing. */}
        <form onSubmit={onSubmit} noValidate className="contents">
          <CardContent>
            <FieldGroup>
              {errors.root && (
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {errors.root.message}
                </p>
              )}
              <Field data-invalid={!!errors.username}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  autoComplete="username"
                  aria-invalid={!!errors.username}
                  aria-describedby={
                    errors.username ? "username-error" : undefined
                  }
                  {...form.register("username")}
                />
                <FieldError id="username-error" errors={[errors.username]} />
              </Field>
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  {...form.register("password")}
                />
                <FieldError id="password-error" errors={[errors.password]} />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2">
            <Button type="submit" size="lg" disabled={login.isPending}>
              {login.isPending && (
                <Loader2Icon
                  aria-hidden="true"
                  className="motion-safe:animate-spin"
                />
              )}
              Log in
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.reset(DEMO)}
            >
              Use demo account
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Container>
  );
}
