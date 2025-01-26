import {Check, X} from 'lucide-react';

interface PasswordRequirementsProps {
    password: string;
}

export const PasswordRequirements = ({password}: PasswordRequirementsProps) => {
    const passwordRules = [
        {
            rule: '8 caractères minimum',
            valid: password.length >= 8,
        },
        {
            rule: 'Une majuscule',
            valid: /[A-Z]/.test(password),
        },
        {
            rule: 'Une minuscule',
            valid: /[a-z]/.test(password),
        },
        {
            rule: 'Un caractère spécial',
            valid: /[!@#$%^&*(),.?":{}|<>\[\]]/.test(password),
        },
        {
            rule: 'Un chiffre',
            valid: /[0-9]/.test(password),
        },
    ];

    return (
        <>
            <p className="text-xs font-bold text-destructive">
                Exigences du mot de passe
            </p>
            <ul className="list-inside text-muted-foreground ml-2 text-xs">
                {passwordRules.map(({rule, valid}) => (
                    <li key={rule} className="flex items-center gap-2">
                        {valid ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <X className="h-4 w-4 text-destructive" />
                        )}
                        {rule}
                    </li>
                ))}
            </ul>
        </>
    );
};
