import type {Metadata} from "next";
import LoginForm from "@/app/auth/_components/login.form";

export const metadata: Metadata = {
    title: "NextCover | Login",
};

const LoginPage = () => {
    return <LoginForm />;
};

export default LoginPage;
