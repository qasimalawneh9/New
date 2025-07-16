interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullPage?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export const Loading = ({
  size = "md",
  text,
  fullPage = false,
}: LoadingProps) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`animate-spin border-2 border-primary border-t-transparent rounded-full ${sizeClasses[size]}`}
      />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const LoadingButton = ({
  isLoading,
  children,
  ...props
}: {
  isLoading: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} disabled={isLoading || props.disabled}>
    {isLoading ? (
      <div className="flex items-center space-x-2">
        <Loading size="sm" />
        <span>Loading...</span>
      </div>
    ) : (
      children
    )}
  </button>
);
