'use client';

import {loginSchema, loginSchemaType} from '@/schemas/login.schema';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {PasswordInput} from '@/components/ui/passwordInput';

const LoginForm = () => {
    const form = useForm<loginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    //! Todo
    const onSubmit = (data: loginSchemaType) => {

        alert('Todo: se connecter');
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
                    Se connecter
                </Button>
            </form>
        </Form>
    );
};
export default LoginForm;
