import { ReactNode, ButtonHTMLAttributes } from "react";

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Boton = ({ children = "Click", color, size, className = "", ...props }: BotonProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  const buttonClasses = `rounded font-medium ${getColorClasses()} ${getSizeClasses()} ${className}`;

  return <button className={buttonClasses} {...props}>{children}</button>;
};

export default Boton;
