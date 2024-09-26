import "@styles/globals.css";

export const metadata = {
  title: "MapleMedia - Sign In",
  description: "Sign in to MapleMedia to share your accomplishments.",
};

const SignInLayout = ({ children }) => {
  return (
    <div className=" bg-gray-100 flex flex-col items-center justify-center min-h-screen">
      <main>{children}</main>
    </div>
  );
};

export default SignInLayout;
