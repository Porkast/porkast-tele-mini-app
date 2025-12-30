import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPodcastEpisodeInfo } from '../libs/Itunes';
import { removeTextColorStyles } from '../libs/Common';
import { AppProvider } from '../component/AppContext';
import Footer from '../component/Footer';
import AudioPlayButton from '../component/AudioPlayButton';
import AddListenLaterButton from '../component/AddListenLaterBtn';
import AddToPlaylistButton from '../component/AddToPlaylistBtn';
import type { FeedChannel } from '../types/FeedChannel';
import type { FeedItem } from '../types/FeedItem';

export default function PodcastEpisodePage() {
  const { channelId, itemId } = useParams<{ channelId: string; itemId: string }>();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ podcast: FeedChannel; episode: FeedItem } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEpisodeData() {
      if (!channelId || !itemId) return;
      setLoading(true);
      setError(null);
      try {
        const episodeData = await getPodcastEpisodeInfo(channelId, itemId);
        setData(episodeData);
      } catch (err) {
        setError('Failed to load episode');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEpisodeData();
    window.scrollTo(0, 0);
  }, [channelId, itemId]);

  if (loading) {
    return (
      <AppProvider>
        <div className="w-full flex justify-center min-h-screen pt-20">
          <div className="loading loading-spinner loading-lg mt-10"></div>
        </div>
        <Footer />
      </AppProvider>
    );
  }

  if (error || !data) {
    return (
      <AppProvider>
        <div className="w-full flex justify-center min-h-screen pt-20">
          <div className="text-error">{error || 'Episode not found'}</div>
        </div>
        <Footer />
      </AppProvider>
    );
  }

  const { podcast: podcastInfo, episode: episode } = data;
  const podcastChannelLink = `/podcast/${channelId}`;
  const formatDescription = removeTextColorStyles(episode.Description || '');

  const playerParams = {
    title: episode.Title || '',
    artist: episode.Author || '',
    cover: episode.ImageUrl || podcastInfo.ImageUrl,
    src: episode.EnclosureUrl || ''
  };

  return (
    <AppProvider>
      <div>
        <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
          <div className='w-full max-w-2xl pl-6 pr-6'>
            {/* item header info block */}
            <div className='w-full'>
              <div className='text-xl font-bold'>{episode.Title}</div>
              <div className="w-full flex justify-start mt-4">
                <div className="avatar">
                  <div className="w-24 rounded-xl">
                    <img src={episode.ImageUrl || podcastInfo.ImageUrl} alt={episode.Title} />
                  </div>
                </div>
                <div className="ml-3">
                  <Link to={podcastChannelLink} className="text-base font-bold mt-2 hover:underline">{podcastInfo.Title}</Link>
                  <div className="text-sm font-medium text-gray-500 mt-2">By {podcastInfo.Author}</div>
                  <div className="flex justify-start mt-4">
                    <a className="btn btn-neutral btn-sm flex items-center rounded-lg md:text-base text-xs" href={episode.FeedLink} target="_blank" rel="noopener noreferrer">
                      <svg className="md:w-4 md:h-4 w-3 h-3 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4715" width="32" height="32">
                        <path d="M128 768a128 128 0 1 0 0 256 128 128 0 0 0 0-256zM0 368v176c265.104 0 480 214.912 480 480h176c0-362.32-293.696-656-656-656zM0 0v176c468.336 0 848 379.664 848 848h176C1024 458.464 565.536 0 0 0z" fill="#bfbfbf" p-id="4716"></path>
                      </svg>
                      RSS
                    </a>
                    <a className="btn btn-neutral btn-sm flex items-center rounded-lg ml-4 md:text-base text-xs" href={episode.Link} target="_blank" rel="noopener noreferrer">
                      <svg className="md:w-5 md:h-5 w-4 h-4 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3342" width="32" height="32"><path d="M574 665.4c-3.1-3.1-8.2-3.1-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8c-3.1-3.1-8.2-3.1-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zM832.6 191.4c-84.6-84.6-221.5-84.6-306 0L410.3 307.6c-3.1 3.1-3.1 8.2 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6c-3.1 3.1-3.1 8.2 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1z" p-id="3343" fill="#bfbfbf"></path><path d="M610.1 372.3c-3.1-3.1-8.2-3.1-11.3 0L372.3 598.7c-3.1 3.1-3.1 8.2 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z" p-id="3344" fill="#bfbfbf"></path></svg>
                      Link
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-gray-500">{episode.PubDate}</div>
              <div className="md:flex md:justify-start items-center mt-3 pb-6">
                <div className="flex justify-start items-center">
                  <AudioPlayButton data={playerParams} />
                  <div className="text-base text-gray-500 w-20 ml-4">{episode.Duration}</div>
                </div>
                <div className="flex justify-start items-center md:mt-0 mt-4">
                  <AddListenLaterButton itemId={episode.GUID || itemId || ''} channelId={channelId || ''} />
                  <AddToPlaylistButton itemTitle={podcastInfo.Title} itemId={episode.GUID || itemId || ''} channelId={channelId || ''} />
                </div>
              </div>
              <p className="mt-4 text-xs">{podcastInfo.Copyright}</p>
              <div className="card w-full bg-base-100 shadow-xl overflow-auto mt-9">
                <div className="card-body">
                  <h2 className="card-title mb-9">Show Notes</h2>
                  <div className="text-base-content">
                    <div dangerouslySetInnerHTML={{ __html: formatDescription }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </AppProvider>
  );
}
