<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { Cache } from '@utils'
export default {
  name: 'App',
  created () {
    this.getDicData();
  },
  methods: {
    async getDicData () {
      const result = await this.$fetchPost('/common/enume');
      Cache.set('ZD_DIC', result || []);
    }
  }
}
</script>
