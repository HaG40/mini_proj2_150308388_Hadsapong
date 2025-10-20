import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import { removeFavourite } from '../../slices/favouritesSlice';
import { FaTrash } from 'react-icons/fa6';

const Favourite: React.FC = () => {
  const favourites = useSelector((state: RootState) => state.favourites?.items ?? []);
  const dispatch = useDispatch<AppDispatch>();

  const handleRemove = (userId?: string, url?: string) => {
    if (!url) return;
    if (!window.confirm('ต้องการลบรายการนี้ออกจากรายการที่บันทึกไว้หรือไม่?')) return;
    dispatch(removeFavourite({ userId, url }));
  };

  return (
    <div className="relative mx-auto max-w-4xl mt-10 bg-gray-200 rounded-lg shadow-lg py-6 px-10">
      <h2 className="text-2xl font-semibold mb-4">📂 รายการที่บันทึกไว้</h2>
      <div className="space-y-4">
        {!favourites.length ? 
          <>
            <div className="p-4">
              <h2 className="text-lg font-semibold">รายการที่บันทึกไว้</h2>
              <p className="mt-4">ยังไม่มีรายการที่บันทึก</p>
            </div>
          </>
        
        : 
            favourites.map((job, idx) => (
            <div key={idx} className="p-3 rounded shadow-sm flex flex-row justify-between items-start bg-white space-y-2.5">
              <div className='space-y-1.5'>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company} — {job.location}</p>
                <p className="text-gray-700 mb-5">Salary: {job.salary}</p>
                {job.url && (
                  <a href={job.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">ดูรายละเอียด</a>
                )}
              </div>
              <button
                onClick={() => handleRemove(job.userId, job.url)}
                className=" text-gray-600 hover:text-red-700 m-2.5 cursor-pointer"
                aria-label={`remove-favourite-${idx}`}
              >
                <FaTrash />
              </button>
            </div>
          ))
        }

      </div>
    </div>
  );
};

export default Favourite;