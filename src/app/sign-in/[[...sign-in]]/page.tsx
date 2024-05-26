import SignInForm from "@/components/client/SignIN-Form";
import { SignIn, SignUp } from "@clerk/nextjs";
export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{background: 'url(\'/background.png\')', backgroundSize: 'cover'}}>
        {/* <SignInForm /> */}
        <SignIn/>
    </div>
);
}