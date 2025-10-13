import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FavoriteButtonProps {
  userId?: string;
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  url?: string;
  src?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  userId,
  title,
  company,
  location,
  salary,
  url,
  src,
}) => {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (!userId || !url) return;

    fetch(`http://localhost:8888/api/jobs/favorite/check?userId=${userId}&url=${encodeURIComponent(url)}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.favorited) setFavorited(true);
      })
      .catch(err => console.log('Check favorite error:', err));
  }, [url, userId]);

  const toggleFavorite = () => {
    if (!userId) {
      toast.warning("โปรดเข้าสู่ระบบเพื่อบันทึกงานที่สนใจ!", {
        position: "top-center",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!url) return;

    const isAdding = !favorited;
    const apiUrl = isAdding
      ? 'http://localhost:8888/api/jobs/favorite/add'
      : 'http://localhost:8888/api/jobs/favorite/delete';

    fetch(apiUrl, {
      method: isAdding ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(
        isAdding
          ? { userId, title, company, location, salary, url, source: src }
          : { userId, url }
      ),
    })
      .then(res => {
        if (res.ok) setFavorited(!favorited);
        else toast.error("เกิดข้อผิดพลาด ลองอีกครั้ง!", { position: "top-center" });
      })
      .catch(err => {
        console.error('Toggle favorite error:', err);
        toast.error("เกิดข้อผิดพลาด ลองอีกครั้ง!", { position: "top-center" });
      });
  };

  return (
    <button onClick={toggleFavorite} className='cursor-pointer'>
      {favorited ? <FaHeart color="red" size={20} /> : <FaRegHeart color="gray" size={20} />}
    </button>
  );
};

export default FavoriteButton;
