import { Star } from 'lucide-react';

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star 
            key={index} 
            className={`w-4 h-4 ${value >= index ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
          />
        ))}
      </div>
      {text && <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-1">{text}</span>}
    </div>
  );
};

export default Rating;
