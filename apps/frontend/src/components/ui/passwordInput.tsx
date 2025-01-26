import {InputHTMLAttributes, useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Eye, EyeOff} from 'lucide-react';

export const PasswordInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
    const [view, setView] = useState<boolean>(false);

    return (
        <div className="flex flex-center relative">
            <Input {...props} type={view ? 'text' : 'password'} />
            <Button
                type="button"
                variant="outline"
                className="absolute right-0 text-muted-foreground rounded-l-none"
                onClick={() => setView((prev) => !prev)}
            >
                {view ? <EyeOff /> : <Eye />}
            </Button>
        </div>
    );
};
