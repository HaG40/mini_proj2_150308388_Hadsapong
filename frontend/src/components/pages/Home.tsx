import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import FavouriteButton from '../FavouriteButton';
import { useDispatch } from 'react-redux';
import { addFavourite, removeFavourite } from '../../slices/favouritesSlice';

interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  url: string;
  source: string;
}

const Home: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [bkkOnly, setBkkOnly] = useState(false);
  const [source, setSource] = useState('all');
  const [results, setResults] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchResults = async (targetPage = 1, kw = keyword) => {
    setIsLoading(true);
    const params = {
      keyword: kw,
      page: String(targetPage),
      bkk: String(bkkOnly),
      source,
    };

    try {
      const res = await axios.get('http://localhost:8888/api/jobs', {
        params,
        withCredentials: true,
      });
      const data = res.data;
      setResults(data || []);
      setPage(targetPage);
    } catch (err) {
      console.error('fetchResults error:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(1);
  };

  const handleFavouriteToggle = (isFavourited: boolean, jobData?: any) => {
    if (!jobData) return;
    if (isFavourited) {
      dispatch(addFavourite(jobData));
    } else {
      dispatch(removeFavourite({ userId: jobData.userId, url: jobData.url }));
    }
  };

  return (
    <div className="relative mx-auto max-w-4xl mt-10 bg-gray-200 rounded-lg shadow-lg py-6 px-10">
      <h1 className="text-2xl font-bold mb-4">🔍 Job Search</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              className="w-full border p-2 rounded pl-10 bg-white"
              placeholder="ค้นหางาน..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={isLoading}
            />
            <FaSearch className="absolute left-3 top-2 text-gray-400 mt-1.5" />
          </div>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
          </button>
        </div>

        <div className="mt-2 flex items-center gap-4">
          <select value={source} onChange={(e) => setSource(e.target.value)} className="border p-1 rounded bg-white" disabled={isLoading}>
            <option value="all">ทั้งหมด</option>
            <option value="jobbkk">JobBKK.com</option>
            <option value="jobthai">JobThai.com</option>
            <option value="jobth">JobTH.com</option>
          </select>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={bkkOnly} onChange={() => setBkkOnly(!bkkOnly)} disabled={isLoading} />
            ภายในกทม.
          </label>
        </div>
      </form>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex flex-col items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-700 mb-3"></div>
            <p className="text-gray-700">กำลังโหลดผลลัพธ์...</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="space-y-4 mt-4">
              {results.map((job, index) => (
                <div key={index} className="pb-6 pr-5 pl-5 pt-3 border border-gray-300 rounded-lg shadow-sm bg-white flex justify-between items-start">
                  <div className='space-y-1.5'>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-gray-600">{job.company} — {job.location}</p>
                    <p className=" text-gray-700 mb-5">Salary: {job.salary}</p>
                    <a href={job.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">ดูรายละเอียด</a>
                  </div>
                  <div className='m-2.5'>
                    <FavouriteButton
                      userId={undefined}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      salary={job.salary}
                      url={job.url}
                      src={job.source}
                      onToggle={handleFavouriteToggle}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center max-w-xs mx-auto">
              <button
                onClick={() => fetchResults(Math.max(1, page - 1))}
                disabled={page <= 1 || isLoading}
                className="px-4 py-1 bg-black text-white rounded disabled:opacity-50"
              >
                &#8592;
              </button>
              <span className="px-4 text-gray-700">Page {page}</span>
              <button
                onClick={() => fetchResults(page + 1)}
                disabled={isLoading}
                className="px-4 py-1 bg-black text-white rounded disabled:opacity-50"
              >
                &#8594;
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-700 text-center my-5">ไม่พบข้อมูล</p>
        )}
      </div>
    </div>
  );
};

export default Home;
