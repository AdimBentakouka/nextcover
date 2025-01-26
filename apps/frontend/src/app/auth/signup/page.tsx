import type {Metadata} from "next";
import SignupForm from "@/app/auth/_components/signup.form";

export const metadata: Metadata = {
    title: "NextCover | Sign Up",
};

const SignupPage = () => {
    return <SignupForm />;
};

export default SignupPage;
