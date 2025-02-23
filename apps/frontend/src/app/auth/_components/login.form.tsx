'use client';

import {loginSchema, LoginSchemaType} from '@/schemas/login.schema';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {PasswordInput} from '@/components/ui/passwordInput';
import {useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {loginAction} from '@/actions/auth.action';
import {DEFAULT_APP_REDIRECT} from '@/routes';
import {toast} from 'sonner';
import {messages} from '@/lib/messages';

const LoginForm = () => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });


    const onSubmit = (data: LoginSchemaType) => {
        startTransition(() => {
            loginAction(data).then(async (response) => {
                console.log(response);
                if (response.status === 201) {
                    toast.success('Connectée', {
                        description: messages.success.login,
                    });

                    return router.push(DEFAULT_APP_REDIRECT);
                }

                if (response.status === 401) {

                    if (response.error?.toString().endsWith('not approved yet.')) {
                        return toast.error('Connexion échouée', {
                            description: messages.errors.login.notApproved,
                        });
                    }

                    return toast.error('Connexion échouée', {
                        description: messages.errors.login.credentials,
                    });
                }

                return toast.error('Connexion échouée', {
                    description: messages.errors.defaultError,
                });


            }).catch((e) => {
                    console.log(e);
                },
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
                                    placeholder={'next@cover.com'}
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
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="uppercase font-bold text-xs">
                                Mot de passe{' '}
                                <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="••••••••••••••••••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    {isPending ? 'Connexion en cours ...' : 'Se connecter'}
                </Button>
            </form>
        </Form>
    );
};
export default LoginForm;
