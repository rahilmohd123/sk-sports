import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="hidden lg:flex items-center relative group">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search gear..."
        className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 focus:w-64 transition-all duration-300"
      />
      <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
};

export default SearchBox;
