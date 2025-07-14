import React from 'react';

export default function PortfolioDetail({ portfolio }) {
  if (!portfolio) return <p className="text-center p-8 text-gray-500">Không tìm thấy portfolio.</p>;

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : 'Không rõ';

  return (
    <div className="p-4 max-h-[75vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-center mb-2">{portfolio.title}</h2>
      <p className="italic text-gray-500 text-center">{portfolio.summary}</p>

      {portfolio.coverImage?.url && (
        <img
          src={portfolio.coverImage.url}
          alt={portfolio.coverImage.altText || portfolio.title}
          className="w-full max-h-96 object-contain my-4 rounded"
        />
      )}

      <div className="space-y-4 text-gray-700 text-base">
        <div>
          <h3 className="font-semibold text-lg text-blue-700">Mô tả</h3>
          <p className="whitespace-pre-wrap">{portfolio.description}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-blue-700">Vai trò</h3>
          <p>{portfolio.myRole}</p>
        </div>

        {portfolio.lessonsLearned && (
          <div>
            <h3 className="font-semibold text-lg text-blue-700">Bài học</h3>
            <p className="whitespace-pre-wrap">{portfolio.lessonsLearned}</p>
          </div>
        )}

        {portfolio.technologies?.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg text-blue-700">Công nghệ</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {portfolio.technologies.map((tech, i) => (
                <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {portfolio.tags?.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg text-blue-700">Tags</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {portfolio.tags.map((tag, i) => (
                <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-lg text-blue-700">Thời gian</h3>
          <p>
            {formatDate(portfolio.projectStartDate)} → {formatDate(portfolio.projectEndDate)}
          </p>
        </div>

        <div className="flex gap-6 flex-wrap justify-center pt-4">
          {portfolio.liveUrl && (
            <a href={portfolio.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              🔗 Live demo
            </a>
          )}
          {portfolio.sourceCodeUrl && (
            <a href={portfolio.sourceCodeUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">
              💻 Source code
            </a>
          )}
        </div>

        {portfolio.gallery?.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg text-blue-700 mt-6">Thư viện ảnh</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {portfolio.gallery.map((img, idx) => (
                <div key={idx} className="bg-gray-50 rounded overflow-hidden">
                  <img src={img.url} alt={img.caption || `Image ${idx + 1}`} className="w-full h-32 object-cover" />
                  {img.caption && <p className="text-xs text-center text-gray-500 mt-1">{img.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
