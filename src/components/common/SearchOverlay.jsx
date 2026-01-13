import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center p-4">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <X size={32} />
            </button>

            <form onSubmit={handleSearch} className="w-full max-w-4xl relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for Bikes, Accessories..."
                    className="w-full text-3xl md:text-5xl font-black uppercase text-center border-b-2 border-black bg-transparent py-4 focus:outline-none placeholder:text-gray-300"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-gray-400 hover:text-black transition-colors"
                >
                    <Search size={32} />
                </button>
            </form>
        </div>
    );
};

export default SearchOverlay;
