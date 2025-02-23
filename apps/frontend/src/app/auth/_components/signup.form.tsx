'use client';

import {useForm} from 'react-hook-form';
import {signUpSchema, SignupSchemaType} from '@/schemas/signUpSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {PasswordInput} from '@/components/ui/passwordInput';
import {PasswordRequirements} from '@/app/auth/_components/passwordRequirements';
import {useTransition} from 'react';
import {signUpAction} from '@/actions/auth.action';
import {toast} from 'sonner';
import {messages} from '@/lib/messages';
import {useRouter} from 'next/navigation';

const SignupForm = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<SignupSchemaType>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: SignupSchemaType) => {
        startTransition(() => {
            signUpAction(data).then((response) => {
                if (response.error) {
                    if (response.error === `Email '${data.email}' already used`) {
                        form.setError('email', {
                            type: 'manual',
                            message: messages.errors.signUp.emailAlreadyUsed,
                        });
                    }
                    return toast('Inscription annulée', {
                        description: messages.errors.defaultError,
                    });
                }
                toast('Inscription terminée', {
                    description: messages.success.signUp,
                });

                return router.push('/auth/login');
            }).catch(() =>
                toast('Inscription annulée', {
                    description: messages.errors.defaultError,
                }),
            );
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="uppercase font-bold text-xs">
                                Nom du compte{' '}
                                <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    autoComplete="additional-name"
                                    {...field}
                                    name="displayName"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="uppercase font-bold text-xs">
                                e-mail{' '}
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
                                mot de passe{' '}
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
                                confirmer le mot de passe{' '}
                                <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <PasswordInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className={`w-full`} disabled={isPending}>
                    {isPending ? 'Inscription en cours ...' : 'S\'inscrire'}
                </Button>
            </form>
        </Form>
    );
};

export default SignupForm;
