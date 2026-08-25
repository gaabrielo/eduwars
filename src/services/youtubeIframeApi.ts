export interface YouTubePlayerStateEvent {
  data: number;
}

export interface YouTubePlayerOptions {
  events: {
    onStateChange: (event: YouTubePlayerStateEvent) => void;
  };
}

export interface YouTubePlayer {
  destroy: () => void;
}

export interface YouTubeIframeApi {
  Player: new (
    element: HTMLElement,
    options: YouTubePlayerOptions
  ) => YouTubePlayer;
  PlayerState: {
    ENDED: number;
  };
}

declare global {
  interface Window {
    YT?: YouTubeIframeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YouTubeIframeApi> | null = null;

export function loadYouTubeIframeApi(): Promise<YouTubeIframeApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YouTube IFrame API requires a browser'));
  }

  if (window.YT) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<YouTubeIframeApi>((resolve, reject) => {
    const existingScript = document.getElementById('youtube-iframe-api');
    const previousReadyHandler = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();
      if (window.YT) {
        resolve(window.YT);
      } else {
        reject(new Error('YouTube IFrame API did not initialize'));
      }
    };

    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'youtube-iframe-api';
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => reject(new Error('Unable to load YouTube IFrame API'));
    document.head.appendChild(script);
  }).catch((error) => {
    apiPromise = null;
    throw error;
  });

  return apiPromise;
}
