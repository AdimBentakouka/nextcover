import {Button} from "@/components/ui/button";
import {ElementType, HTMLAttributes} from "react";

export interface SSOButtonProps extends HTMLAttributes<HTMLButtonElement> {
    name: string;
    icon: ElementType;
    onAuth: () => void;
}

const SSOButton = (provider: SSOButtonProps) => {
    return (
        <Button variant="outline" className="w-full" onClick={provider.onAuth}>
            <provider.icon />
            Continuer avec {provider.name}
        </Button>
    );
};

export default SSOButton;
