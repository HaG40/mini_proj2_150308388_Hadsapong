import React, { useState } from 'react';
import FavoriteButton from '../FavouriteButton';
import { FaSearch } from 'react-icons/fa';

interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  url: string;
  source: string;
}

interface JobSearchProps {
  userId?: string;
}

const JobSearch: React.FC<JobSearchProps> = ({ userId }) => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [bkkOnly, setBkkOnly] = useState(false);
  const [source, setSource] = useState('all');
  const [results, setResults] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResults = async (targetPage = page, kw = keyword) => {
    setIsLoading(true);
    document.body.style.cursor = 'progress';
    const params = new URLSearchParams({
      keyword: kw,
      page: targetPage.toString(),
      bkk: bkkOnly.toString(),
      source,
    });

    try {
      const res = await fetch(`http://localhost:8888/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error("Fetch error");
      const data = await res.json();
      setResults(data);
      setPage(targetPage);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setIsLoading(false);
      document.body.style.cursor = 'default';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(1);
  };

  return (
    <div className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">Job Search</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-row">
          <div className="relative w-full max-w-md mr-2">
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className={`border border-gray-400 p-2 pl-10 rounded w-full shadow ${isLoading ? 'cursor-progress' : 'cursor-text'}`}
              placeholder={!isLoading ? 'ค้นหางานที่ตามหา...' : 'กำลังค้นหางาน...'}
              disabled={isLoading}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50 shadow cursor-pointer"
            disabled={isLoading}
          >
            ค้นหา
          </button>
        </div>

        <div className="flex items-center mt-2">
          <label className="mr-2">แหล่งที่มา:</label>
          <select
            value={source}
            onChange={e => setSource(e.target.value)}
            className="border p-1 mr-4 rounded w-36 cursor-pointer shadow border-gray-400 text-black"
            disabled={isLoading}
          >
            <option value="all">ทั้งหมด</option>
            <option value="jobbkk">JobBKK.com</option>
            <option value="jobthai">JobThai.com</option>
            <option value="jobth">JobTH.com</option>
          </select>

          <input
            type="checkbox"
            checked={bkkOnly}
            onChange={() => setBkkOnly(!bkkOnly)}
            id="bkkOnly"
            disabled={isLoading}
            className="mr-2 accent-black cursor-pointer"
          />
          <label htmlFor="bkkOnly">ภายในกทม.</label>
        </div>
      </form>

      {/* Results */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-black border-2 border-gray-300 mb-2"></div>
            <p className="text-gray-700">กำลังโหลด...</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="space-y-4 mt-4">
              {results.map((job, index) => (
                <div key={index} className="pb-6 pr-5 pl-5 pt-3 border border-gray-300 rounded-lg shadow-sm bg-white">
                  <div className='flex justify-between'>
                    <h3 className="text-lg font-bold mb-3">{job.title}</h3>
                    <FavoriteButton
                      userId={userId}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      salary={job.salary}
                      url={job.url}
                      src={job.source}
                      disabled={!userId}
                    />
                  </div>
                  <div className="mx-4">
                    <p className="mt-1"><span className="font-semibold">บริษัท:</span> {job.company}</p>
                    <p className="mt-1"><span className="font-semibold">สถานที่:</span> {job.location}</p>
                    <p className="mt-1"><span className="font-semibold">เงินเดือน:</span> {job.salary}</p>
                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm text-blue-600 underline hover:text-blue-800">
                      ดูงานนี้
                    </a>
                    <p className="mt-1 float-right">
                      <span className="font-semibold">ที่มา:</span> <span className="px-2 py-0.5 rounded bg-gray-200">{job.source}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center max-w-xs mx-auto">
              <button
                onClick={() => fetchResults(page - 1)}
                disabled={page <= 1 || isLoading}
                className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
              >
                &#8592;
              </button>
              <span className="px-4 text-gray-700">Page {page}</span>
              <button
                onClick={() => fetchResults(page + 1)}
                disabled={isLoading}
                className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
              >
                &#8594;
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-700 mt-10">ไม่พบข้อมูล</p>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
