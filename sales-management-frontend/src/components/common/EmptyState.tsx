import React from 'react';
import { Package, ShoppingCart, FileText, Users } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: 'product' | 'cart' | 'order' | 'user' | React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'product',
  title,
  description,
  action,
}) => {
  const getIcon = () => {
    if (typeof icon !== 'string') return icon;

    const iconMap: Record<string, React.ReactNode> = {
      product: <Package size={64} />,
      cart: <ShoppingCart size={64} />,
      order: <FileText size={64} />,
      user: <Users size={64} />,
    };

    return iconMap[icon] || <Package size={64} />;
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-gray-300 mb-4">
        {getIcon()}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 text-center mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;