import axios from 'axios';
import { usePluginStore, useWatchEvent } from '@/hooks/plugin';

export default function (name: string) {
  const ActionID = `${window.argv[3].plugin.uuid}.${name}`;

  // 事件侦听器
  const plugin = usePluginStore();

  useWatchEvent('action', {
    ActionID,
    willAppear({ context, payload }) {
      console.log('Camera action appeared:', context);
      const action = plugin.getAction(context);
      const settings = payload.settings || {};
      
      // Start fetching images if URL is configured
      if (settings.imageUrl) {
        fetchImage(action, context, settings);
      }
    },
    willDisappear({ context }) {
      // Clear any intervals when action disappears
      plugin.Unterval(context);
    },
    sendToPlugin({ context, payload }) {
      console.log('Received from property inspector:', payload);
    },
    keyUp({ context, payload: { settings } }) {
      // Optional: open Home Assistant URL when clicked
      if (settings.homeAssistantUrl) {
        const action = plugin.getAction(context);
        action.openUrl(settings.homeAssistantUrl);
      }
    },
    didReceiveSettings({ context, payload: { settings } }) {
      console.log('Settings updated:', settings);
      const action = plugin.getAction(context);
      
      // Restart image fetching with new settings
      plugin.Unterval(context);
      if (settings.imageUrl) {
        fetchImage(action, context, settings);
      }
    }
  });

  // Function to fetch and display image
  const fetchImage = (action: any, context: any, settings: any) => {
    const imageUrl = settings.imageUrl || '';
    const refreshInterval = parseInt(settings.refreshInterval) || 5000; // Default 5 seconds
    
    if (!imageUrl) {
      action.setTitle('No URL\nConfigured');
      return;
    }

    // Function to load image
    async function updateImage() {
      try {
        // Fetch the image
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          headers: {
            'Authorization': settings.authToken ? `Bearer ${settings.authToken}` : undefined
          },
          timeout: 10000 // 10 second timeout
        });

        // Convert to base64
        const base64 = btoa(
          new Uint8Array(response.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        
        // Determine content type
        const contentType = response.headers['content-type'] || 'image/jpeg';
        const dataUrl = `data:${contentType};base64,${base64}`;

        // Create an image element to draw on canvas
        const img = new Image();
        img.onload = () => {
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          canvas.width = 144; // StreamDock button size
          canvas.height = 144;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Draw image to fit canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Set the image on the action
            action.setImage(canvas.toDataURL());
          }
        };
        img.onerror = () => {
          action.setTitle('Image\nLoad\nError');
        };
        img.src = dataUrl;

      } catch (error) {
        console.error('Error fetching image:', error);
        action.setTitle('Error\nFetching\nImage');
      }
    }

    // Initial update
    updateImage();

    // Set up periodic refresh
    plugin.Interval(context, refreshInterval, () => {
      updateImage();
    });
  };
}
