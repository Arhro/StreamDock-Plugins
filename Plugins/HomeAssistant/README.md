# Home Assistant StreamDock Plugin

A StreamDock plugin to display camera images and sensor data from Home Assistant.

## Features

- Display camera images from Home Assistant on your StreamDock device
- Support for authentication using long-lived access tokens
- Configurable refresh intervals
- Click action to open Home Assistant dashboard
- Support for any camera entity URL including sensor-based cameras (e.g., sensor.poslednee_dvizhenie_ezviz)

## Configuration

1. **Image URL**: Enter the full URL to fetch the camera image from Home Assistant
   - Example: `http://homeassistant.local:8123/api/camera_proxy/camera.your_camera_entity`
   - For EZVIZ cameras or sensor-based cameras, use the appropriate API endpoint

2. **Auth Token**: Optional long-lived access token for authentication

3. **Refresh Interval**: How often to refresh the image in milliseconds (default: 5000ms)

4. **Home Assistant URL**: Optional URL to open when the button is clicked

## Installation

### Install dependencies

```bash
$ pnpm i
```

### Development

```bash
$ pnpm dev
```

### Format

```bash
$ pnpm format
```

### Build

```bash
$ pnpm build
```

## Usage Example

To display an EZVIZ camera image with sensor entity `sensor.poslednee_dvizhenie_ezviz`:

1. Add the Home Assistant Camera action to your StreamDock
2. Configure the Image URL with your Home Assistant camera proxy URL
3. Add your long-lived access token if authentication is required
4. Set the refresh interval as desired

The image will automatically update at the specified interval.
