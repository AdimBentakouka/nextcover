"use client";

import {useForm} from "react-hook-form";
import {signupSchema, signupSchemaType} from "@/schemas/signup.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {PasswordInput} from "@/components/ui/passwordInput";
import {PasswordRequirements} from "@/app/auth/_components/passwordRequirements";

const SignupForm = () => {
    const form = useForm<signupSchemaType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    //! Todo
    const onSubmit = (data: signupSchemaType) => {
        console.log(data);
        alert("#TODO Signup");
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="uppercase font-bold text-xs">
                                e-mail{" "}
                                <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    autoComplete="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel className="uppercase font-bold text-xs">
                                mot de passe{" "}
                                <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <PasswordInput {...field} />
                            </FormControl>
                            <FormMessage />
                            {fieldState.error && (
                                <PasswordRequirements password={field.value} />
                            )}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="uppercase font-bold text-xs">
                                confirmer le mot de passe{" "}
                                <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <PasswordInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    S&apos;inscrire
                </Button>
            </form>
        </Form>
    );
};

export default SignupForm;
