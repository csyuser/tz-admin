<template>
  <div class="dialogWrap">
    <h3>人员信息</h3>
    <el-form label-position="right" label-width="85px" :inline="true" :model="editFormInfo" size="small"
             class="addForm" :disabled="true">
      <el-form-item label="人员头像" class="avatar">
        <el-avatar :src="editFormInfo['photoPath']" shape="square"></el-avatar>
      </el-form-item>
      <el-form-item label="人员名称">
        <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
      </el-form-item>
      <el-form-item label="人员编码" prop="code">
        <el-input v-model="editFormInfo.code" suffix-icon="xxx"></el-input>
      </el-form-item>
      <el-form-item label="职务" prop="post">
        <el-select v-model="editFormInfo.post">
          <el-option :label="item['dropName']" :value="item['id']" v-for="item in postDrop"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职级" prop="rank">
        <el-select v-model="editFormInfo['rank']">
          <el-option :label="item['dropName']" :value="item['id']" v-for="item in rankDrop"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="editFormInfo['sex']">
          <el-option label="女" value="0"></el-option>
          <el-option label="男" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门" prop="departmentId" style="height: 32px">
        <SelectTree v-model="editFormInfo.departmentId" :options="treeData" :props="defaultProps" disabled/>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="editFormInfo.phone" suffix-icon="xxx"></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱" prop="email">
        <el-input v-model="editFormInfo.email" suffix-icon="xxx"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码" prop="idCard">
        <el-input v-model="editFormInfo['idCard']" suffix-icon="xxx"></el-input>
      </el-form-item>
      <el-form-item label="入职时间" prop="entryTime">
        <el-date-picker v-model="editFormInfo['entryTime']" value-format="yyyy-MM-dd" placeholder="选择日期"
                        style="width: 215px"></el-date-picker>
      </el-form-item>
      <el-form-item label="离职时间">
        <el-date-picker v-model="editFormInfo['departureTime']" value-format="yyyy-MM-dd" placeholder="选择日期"
                        style="width: 215px"></el-date-picker>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import SelectTree from '@/components/permission/SelectTree'
export default {
  name: 'StaffDialog',
  components:{SelectTree},
  data(){
    return{
      formInfo:{},
      dialogDisabled:false,
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id',
      },
    }
  },
  props:{
    editFormInfo:{
      type:Object,
    },
    postDrop:{
      type:Array,
    },
    rankDrop:{
      type:Array,
    },
    treeData:{
      type:Array,
    }
  }
}
</script>

<style scoped lang='scss'>
.dialogWrap{
  border-top: 1px solid #dcdfe6;
  margin-top: 10px;
  > h3{
    line-height: 20px;
    font-size: 18px;
    color: #303133;
    margin-top: 10px;
  }
}
.addForm {
  padding-top: 10px;
  > .el-form-item {
    margin-bottom: 18px;
    & ::v-deep{
      .el-form-item__content{height: 40px}
    }
  }

  > .avatar {
    width: 100%;
    display: flex;
    align-items: center;
  }
}
</style>