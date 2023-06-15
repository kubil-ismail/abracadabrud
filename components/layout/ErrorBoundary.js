import React from "react";
import { useRouter } from "next/router";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });

    const router = useRouter();

    router.replace('/');
  }

  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-gray-900">
          <div className="h-[85vh] flex items-center justify-center w-full">
            <div className="flex flex-col items-center gap-5">
              <img src="/assets/images/sp-empty.png" alt="not-found" className="w-56" />
              <div className="flex flex-col gap-3 items-center">
                <h3 className="text-slate-50 font-bold text-3xl">Redirect to home...</h3>
                <span className="text-sm md:text-lg font-light text-center w-[45%] m-auto block">
                  Loading...
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
