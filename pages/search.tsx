import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '../utils/client';
import { Video } from '../utils/types';
import VideoCard from '../components/VideoCard';
import NoResults from '../components/NoResults';

interface IProps {
  videos: Video[];
}
const Search = () => {
  const router = useRouter();

  const { query } = router.query;

  const [searchResult, setSearchResult] = useState<IProps['videos']>([]);

  const getSearchData = useCallback(async () => {
    const result = `*[_type == "post" &&  caption match "${query}"]{
        _id,
             caption,
               video{
                asset->{
                  _id,
                  url
                }
              },
              slug{
                current
              },
              userId,
              postedBy->{
                _id,
                username,
                image
              },
            likes,
            comments[]{
              comment,
              _key,
              postedBy->{
              _id,
              username,
              image
            },
            }
    }`;
    const response = await client.fetch(result);
    setSearchResult(response);
  }, [query]);
  useEffect(() => {
    getSearchData();
  }, [getSearchData, query]);
  return (
    <div className="flex flex-col gap-10 videos h-full">
      {searchResult.length > 0 ? (
        searchResult.map((a) => <VideoCard key={a._id} post={a} />)
      ) : (
        <div className="no-videos">
          <NoResults text={`No Results for ${query}`} />
        </div>
      )}
    </div>
  );
};

export default Search;
