import { cn } from '@/utils/helpers';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  src: string;
  alt?: string;
  className?: string;
  // Passed through the ..used Image element; currently only consumed as a
  // duplicated generic prop to keep existing call sites working unchanged.
  onClick?: () => void;
}

export function YoutubeThumbnail({
  src: url,
  alt,
  className,
  ...props
}: Props) {
  const [thumbnailUrl, setThumbnailUrl] = useState();

  useEffect(() => {
    const videoId = extractVideoId();
    if (videoId) {
      const thumbUrl = getThumbnailUrl(videoId);
      // @ts-ignore
      setThumbnailUrl(thumbUrl);
    }
  }, [url]);

  const extractVideoId = () => {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const getThumbnailUrl = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <div>
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={alt ?? 'YouTube Video Thumbnail'}
          width={512}
          height={512}
          className={cn(className, 'aspect-video')}
          {...props}
        />
      ) : (
        <p>Invalid YouTube URL</p>
      )}
    </div>
  );
}
