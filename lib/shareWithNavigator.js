import { toast } from 'react-toastify';
import LocalStorage from './LocalStorage';

export default function shareWithNavigator({ url, title, text }) {
  try {
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url
      });
    } else {
      if (document.queryCommandSupported('copy')) {
        const resolveUrl = new URL(url, window.location.href);
        const textarea = document.createElement('textarea');
        textarea.textContent = resolveUrl.href;
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        toast.success('Link copied to clipboard');
      } else {
        toast.error('Your browser does not support this feature');
      }
      return false;
    }
    LocalStorage.set('navigatorShare', navigator);
  } catch (error) {
    const errors = LocalStorage.get('shareApiErrors') || [];
    errors.push(error?.stack || error?.message || error);
    LocalStorage.set('shareApiErrors', errors);
    return false;
  }
  return true;
}

export const shareVideoWithNavigator = ({ user, title, link, name, eventName, eventDate, performer, caption, authorId = null }) => {
  let text = '';
  // eslint-disable-next-line eqeqeq
  if (user && user?.id == authorId) {
    text = `${performer} - ${caption}
    Check out my music video! Make sure to vote for it often so I can win the opportunity to perform at the wePOP come together on 6 August 2023.
    
    It's Easy! Click this link, vote for me now, and you too can win amazing weekly prizes:
    THANKS!
    `;
  } else {
    // text = `Just find cool video on abracadabra Starquest. Vote ${title} by ${name} right now!`;
    text = `${name} - ${title}
    Check out my music video! Make sure to vote for it often so I can win the opportunity to perform at the ${eventName} on ${eventDate}.  
    It’s Easy! Click this link, vote for me now, and you too can win amazing weekly prizes,
    THANKS!`;
  }
  shareWithNavigator({
    text,
    url: link,
    title
  });
};



