"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { ZodType } from "zod";

import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { signIn } from "next-auth/react";

interface Props<T extends FieldValues> {
  type: "SIGN_IN" | "SIGN_UP";
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<AuthActionResult>;
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const isSignIn = type === "SIGN_IN";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (values) => {
    setError("");

    startTransition(async () => {
      try {
        const data = await onSubmit(values);

        if (data?.error) {
          setError(data.error);

          return;
        }

        if (data?.success) {
          form.reset();
          router.push("/");
        }
      } catch (error: any) {
        console.log(error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm w-full">
      <h1 className="text-2xl font-semibold text-center">
        {isSignIn ? "Welcome back!" : "Create your account"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({
                field,
              }: {
                field: {
                  name: string;
                  value: string;
                  onChange: (value: any) => void;
                };
              }) => (
                <FormItem>
                  <FormLabel>
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>

                  <FormControl>
                    <Input
                      required
                      disabled={isPending}
                      type={
                        field.name === "confirmPassword"
                          ? "password"
                          : FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {error && <div className="text-destructive">{error}</div>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isSignIn ? "Login to your Account" : "Create an Account"}
            {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
          </Button>
        </form>
      </Form>

      <div className="flex items-center">
        <span className="text-sm">
          {isSignIn ? "Don't have an account? " : "Have an account? "}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className={cn(
              "font-semibold hover:underline hover:underline-offset-4",
            )}
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </span>
      </div>

      <Button variant="secondary" onClick={() => signIn("google")}>
        Sign in with Google
      </Button>
    </div>
  );
};

export default AuthForm;
