<template>
  <tree-transfer :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}" check-strictly
                 @add-btn='add' @remove-btn='remove' :mode='mode' height='410px' filter>
  </tree-transfer>
</template>

<script>
import treeTransfer from 'el-tree-transfer' // 引入

export default {
  name: 'Tree-transfer',
  components: {treeTransfer},
  props: {
    url:  {type: String},
    params: {type: Object},
  },
  data() {
    return {
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      mode: 'transfer', // transfer addressList
      fromData: [],
      toData: [],
    }
  },
  mounted() {
    this.getTransData()
  },
  methods: {
    //规范fromData和toData
    getTransData(){
      console.log('执行了')
      this.axios.get(this.url,{params:{...this.params}})
        .then(res=>{
          if (res.data.code.toString() === '200'){
            this.fromData = res.data.data.allList
            this.toData = res.data.data.checkList
            this.$emit('update:relate',this.toData)
          }
        })
        .catch()
    },
    // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
    changeMode() {
      if (this.mode == 'transfer') {
        this.mode = 'addressList'
      } else {
        this.mode = 'transfer'
      }
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的 {keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      let {nodes} = obj
      nodes.forEach(item => {
        if (item.children && item.children.length >= 1) {
          this.toData = this.toData.filter(data => data.id !== item.id)
          this.toData.push(item)
        }
      })
      obj.nodes.forEach((item) => {
        this.fromData = this.fromData.filter(data => data.id !== item.id)
      })
      this.$emit('update:relate',this.toData)
      console.log(this.toData)
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      let {nodes} = obj
      nodes.forEach(item => {
        if (item.children && item.children.length >= 1) {
          this.fromData = this.fromData.filter(data => data.id !== item.id)
          this.fromData.push(item)
        }
      })
      obj.nodes.forEach((item) => {
        this.toData = this.toData.filter(data => data.id !== item.id)
      })
      this.$emit('update:relate',this.toData)
      console.log(this.toData)
    }
  },

}
</script>

<style scoped lang='scss'>

</style>