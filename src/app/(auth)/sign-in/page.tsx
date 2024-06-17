import SignInForm from "@/components/forms/sign_in_form";

const page = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-screen-lg">
        <SignInForm />
      </div>
    </div>
  );
};

export default page;
