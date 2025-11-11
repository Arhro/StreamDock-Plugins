<script setup lang="ts">
import { usePropertyStore, useWatchEvent, TabView } from '@/hooks/property';
import { useI18nStore } from '@/hooks/i18n';
import { FormItemRule, FormRules, darkTheme } from 'naive-ui';

// 事件侦听器
const i18n = useI18nStore();
const property = usePropertyStore();
useWatchEvent({
  didReceiveSettings(data) { },
  sendToPropertyInspector(data) { }
});

// Initialize default settings if not set
if (!property.settings.imageUrl) {
  property.settings.imageUrl = '';
}
if (!property.settings.homeAssistantUrl) {
  property.settings.homeAssistantUrl = '';
}
if (!property.settings.authToken) {
  property.settings.authToken = '';
}
if (!property.settings.refreshInterval) {
  property.settings.refreshInterval = '5000';
}

</script>

<template>
  <n-config-provider :theme="darkTheme" class="outside">
    <n-flex justify="center">
      <n-form size="small" :style="{
        marginTop: '10px'
      }" label-placement="left" :show-feedback="true" :model="property.settings">
        
        <n-form-item label="Image URL">
          <n-input 
            v-model:value="property.settings.imageUrl" 
            placeholder="e.g., http://homeassistant.local:8123/api/camera_proxy/camera.sensor_poslednee_dvizhenie_ezviz"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </n-form-item>

        <n-form-item label="Auth Token">
          <n-input 
            v-model:value="property.settings.authToken" 
            placeholder="Long-lived access token (optional)"
            type="password"
            show-password-on="click"
          />
        </n-form-item>

        <n-form-item label="Refresh Interval (ms)">
          <n-input-number 
            v-model:value="property.settings.refreshInterval" 
            :min="1000"
            :step="1000"
            placeholder="5000"
          />
        </n-form-item>

        <n-form-item label="Home Assistant URL">
          <n-input 
            v-model:value="property.settings.homeAssistantUrl" 
            placeholder="http://homeassistant.local:8123 (optional, for click action)"
          />
        </n-form-item>

      </n-form>
      <n-collapse>
        <n-collapse-item title="Help" name="1">
          <n-text>
            <p><strong>Image URL:</strong> Enter the full URL to fetch the camera image from Home Assistant.</p>
            <p>Example: <code>http://homeassistant.local:8123/api/camera_proxy/camera.your_camera_entity</code></p>
            <p><strong>Auth Token:</strong> If your Home Assistant requires authentication, provide a long-lived access token.</p>
            <p><strong>Refresh Interval:</strong> How often to refresh the image in milliseconds (default: 5000ms = 5 seconds).</p>
            <p><strong>Home Assistant URL:</strong> Optional URL to open when the button is clicked.</p>
          </n-text>
        </n-collapse-item>
      </n-collapse>
    </n-flex>
  </n-config-provider>
</template>

<style lang="scss" scoped>
.n-space {
  width: 100%;
}

.n-button{
  min-width: 300px;
}
</style>
