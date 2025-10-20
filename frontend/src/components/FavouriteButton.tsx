import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../App';

interface FavouriteButtonProps {
  userId?: string;
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  url?: string;
  src?: string;
  onToggle?: (isFavourited: boolean, jobData?: {
    userId?: string;
    title?: string;
    company?: string;
    location?: string;
    salary?: string;
    url?: string;
    source?: string;
  }) => void;
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({ userId, title, company, location, salary, url, src, onToggle }) => {
  const [favourited, setFavourited] = useState(false);
  const { isAuthenticated } = React.useContext(AuthContext)!;

  useEffect(() => {
    if (!userId || !url) return;

    axios
      .get('http://localhost:8888/api/jobs/favorite/check', {
        params: { userId, url },
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;
        if (data?.favorited || data?.favourited) setFavourited(true);
      })
      .catch(() => {
      });
  }, [userId, url]);

  const toggle = async () => {
    if (!isAuthenticated) {
      toast.error("กรุณาเข้าสู่ระบบเพื่อบันทึกงาน", { position: "bottom-center", hideProgressBar: true, });
      return;
    }
    const next = !favourited;
    setFavourited(next);
    if (onToggle) {
      onToggle(next, { userId, title, company, location, salary, url, source: src });
    }
  };

  return (
    <button onClick={toggle} aria-label="favourite-button" className="p-1">
      {favourited ? <FaHeart color="red" size={18} /> : <FaRegHeart color="gray" size={18} />}
    </button>
  );
};

export default FavouriteButton;