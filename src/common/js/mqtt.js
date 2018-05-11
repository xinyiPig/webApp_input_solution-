export const mqtt = {
  data () {
    return {
      client: {},
      // wsUrl:'ws://202.116.162.42:8080'// 华农
      wsUrl: 'ws://202.38.194.80:8080' // 华工
    }
  },
  methods: {
    // 订阅
    subscribe (obj, cb) {
      this.client = this.mqtt.connect(this.wsUrl, { username: 'scau_mqtt', password: 'Scau_12345', clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8) })
      // username: 'scau_mqtt', password: 'Scau_12345', // 华农账号密码，华工不需要密码
      // console.log(this.client)
      this.client.subscribe(obj)
      this.client.on('message', function (topic, message) {
        // message is Buffer
        // console.log('top:', topic)
        // console.log('message:', message.toString())
        cb(message.toString())

      })

    },
    // 取消订阅
    unsubscribe (obj) {
      this.client.unsubscribe(obj)
      this.client.end()
    },
  }
}