<template>
  <tree-transfer :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}" check-strictly
                 @add-btn='add' @remove-btn='remove' :mode='mode' height='410px' filter>
  </tree-transfer>
</template>

<script>
import treeTransfer from 'el-tree-transfer' // 引入

export default {
name: "Tree-transfer",
  components:{treeTransfer},
  data() {
    return {
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
      mode: "transfer", // transfer addressList
      fromData: [
        {
          id: "1",
          pid: 0,
          label: "一级 1",
          children: [
            {
              id: "1-1",
              pid: "1",
              label: "二级 1-1",
              disabled: true
            },
            {
              id: "1-2",
              pid: "1",
              label: "二级 1-2",
              disabled: true
            }
          ]
        }, {
          id: "2",
          pid: 0,
          label: "一级 2",
          children: [
            {
              id: "2-1",
              pid: "1",
              label: "二级 2-1",
              disabled: true
            },
            {
              id: "2-2",
              pid: "1",
              label: "二级 2-2",
              disabled: true
            }
          ]
        }, {
          id: "3",
          pid: 0,
          label: "一级 3",
        },
      ],
      toData: [],
      oldTodata: []
    }
  },
  methods:{
    // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
    changeMode() {
      if (this.mode == "transfer") {
        this.mode = "addressList";
      } else {
        this.mode = "transfer";
      }
    },
    // 监听穿梭框组件添加
    add(fromData,toData,obj){
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的 {keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      let {nodes} = obj
      nodes.forEach(item=>{
        if (item.children && item.children.length>=1){
          this.toData =  this.toData.filter(data=> data.id !== item.id)
          this.toData.push(item)
        }
      })
      obj.nodes.forEach((item)=>{
        this.fromData =  this.fromData.filter(data=> data.id !== item.id)
      })
      console.log(this.toData)
    },
    // 监听穿梭框组件移除
    remove(fromData,toData,obj){
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      let {nodes} = obj
      nodes.forEach(item=>{
        if (item.children && item.children.length>=1){
          this.fromData =  this.fromData.filter(data=> data.id !== item.id)
          this.fromData.push(item)
        }
      })
      obj.nodes.forEach((item)=>{
        this.toData =  this.toData.filter(data=> data.id !== item.id)
      })
    }
  },

}
</script>

<style scoped lang='scss'>

</style>