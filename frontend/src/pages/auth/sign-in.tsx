import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { httpClient } from "@/lib/http-client";
import { toast } from "sonner";
import { Link, useNavigate, Navigate } from "react-router";
import { Loading } from "@/components/loading";
import { Icons } from "@/components/icons";

const formSchema = z.object({
  email: z.email().min(2).max(50),
  password: z.string().min(4).max(50),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ["auth/profile"],
    queryFn: async () => {
      const response = await httpClient.get("/auth/profile");
      return response.data;
    },
    retry: false,
  });
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await httpClient.post("/auth/logout");
      return response;
    },
  });
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await httpClient.post("/auth/login", values);
      return response;
    },
    onSuccess: async () => {
      console.log("Login successful");
      const profileData = await query.refetch();
      if (profileData.data) {
        navigate("/dashboard/agents");
        toast.success("Login successful!");
      }
    },
    onError: (error) => {
      toast.error("Login failed. Please check your credentials and try again.");
      console.error("Login failed", error);
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  if (query.isLoading) {
    return <Loading />;
  }

  if (query.data) {
    return <Navigate to="/dashboard/agents" replace />;
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-2xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="bg-muted relative hidden md:block">
                {/* <img
                  src="/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                /> */}
                <div className="flex items-center justify-center h-full w-full">
                  <Icons.logo className="size-96 -mr-20" />
                </div>
              </div>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-6 md:p-8"
              >
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground text-balance">
                      Sign In to your account
                    </p>
                  </div>
                  <Controller
                    name="email"
                    control={form.control}
                    disabled={
                      mutation.isPending ||
                      query.isLoading ||
                      logoutMutation.isPending
                    }
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-email">Email</FieldLabel>
                        <Input
                          {...field}
                          id="form-rhf-email"
                          aria-invalid={fieldState.invalid}
                          placeholder="johnwick@example.com"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="password"
                    control={form.control}
                    disabled={
                      mutation.isPending ||
                      query.isLoading ||
                      logoutMutation.isPending
                    }
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-password">
                          Password
                        </FieldLabel>
                        <Input
                          {...field}
                          type="password"
                          id="form-rhf-password"
                          aria-invalid={fieldState.invalid}
                          placeholder="••••••••"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Field>
                    <Button
                      disabled={
                        mutation.isPending ||
                        query.isLoading ||
                        logoutMutation.isPending
                      }
                      type="submit"
                    >
                      Login
                    </Button>
                  </Field>
                  {/* <FieldDescription className="text-center">
                    Don&apos;t have an account? <a href="#">Sign up</a>
                  </FieldDescription> */}
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <Link to="#">Terms of Service</Link> and{" "}
            <Link to="#">Privacy Policy</Link>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
