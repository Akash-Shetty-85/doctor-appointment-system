import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Clock, Calendar, User } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const blogs = mockStore.getBlogs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
          Health & Wellness Articles
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Medical Insights & Tips
        </h1>
        <p className="text-sm text-slate-600">
          Expert health guidance written by our senior doctors and consultants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogs.map((b) => (
          <Card key={b.id} className="overflow-hidden flex flex-col justify-between p-0">
            <div className="aspect-16/9 w-full bg-slate-200">
              <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <Badge variant="info">{b.category}</Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {b.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg leading-snug">{b.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{b.excerpt}</p>
                <p className="text-xs text-slate-500 line-clamp-3 pt-2 border-t border-slate-100">
                  {b.content}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[10px]">
                    {b.authorName.charAt(3)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{b.authorName}</p>
                    <p className="text-[10px] text-slate-400">{b.authorTitle}</p>
                  </div>
                </div>
                <span className="text-slate-400 text-[11px]">{b.publishedDate}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
