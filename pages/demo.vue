<template>
  <div>
    <h1>测试翻译: {{ $t('您好，欢迎再次使用有道智云文本翻译API接口服务') }}</h1>
    <h2>{{ $t('我是HTML翻译') }}</h2>
  </div>
</template>

<script>
export default {
  name: 'Demo',
  data () {
    return {
      msg: this.$t('Welcome to Your Vue.js App')
    }
  },
  methods: {
    handleClick () {
      console.log(this.$t('我是脚本运行的翻译'))
    }
  }
}
</script>