<template>
  <div class="permission-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="searchData.name" placeholder="输入名称" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" @add="add" @update="update" @postSelect="selectRow"
           :pageSize="pageSize" :page="page" @currentChange="currentChange" @delete="deleteRows" @dblclick="view">
      <el-button size="small" class="update" @click="relatedPost">
        <SvgIcon icon-name="post"></SvgIcon>
        关联岗位
      </el-button>
<!--      <el-button size="small" class="update" @click="relatedGroup">-->
<!--        <SvgIcon icon-name="group"></SvgIcon>-->
<!--        关联小组-->
<!--      </el-button>-->
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="710px" :before-close="handleClose">
      <el-form label-position="right" label-width="110px" :inline="true" :model="editFormInfo" size="small"
               class="addForm" :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-select v-model="editFormInfo.type">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in permissionTypeDrop" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="依赖菜单" prop="menuId" style="height: 32px">
          <SelectTree v-model="editFormInfo.menuId" :options="treeData" :props="defaultProps" :disabled="editDialogDisabled"/>
        </el-form-item>
        <el-form-item label="是否需要范围" prop="isNeededScope">
          <el-switch v-model="editFormInfo['isNeededScope']" active-color="#13ce66" inactive-color="#ff4949"
                     active-value="1" inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="权限描述" class="texArea">
          <el-input v-model="editFormInfo.describe" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除权限" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
    <el-dialog :title="relatedTitle" :visible.sync="relatedDialogVisible" width="700px" :before-close="handleClose">
      <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入"
          v-model="value"
          :data="transformData">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relatedDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmTransform">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/permission/Table'
import SvgIcon from '@/components/SvgIcon'
import DeleteRow from '@/components/permission/DeleteRow'
import SelectTree from '@/components/permission/SelectTree'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'Permission',
  components: {Table, SvgIcon, DeleteRow,SelectTree},
  mixins: [mixins],
  data() {
    return {
      colsHead: [{prop: 'name', label: '权限名称'}, {prop: 'typeName', label: '权限类型'}, {prop: 'describe', label: '权限描述'}],
      value: [],
    }
  },
  mounted() {
    this.getPages('/permission/page')
    this.axios.get('/menu/selectMenuTree')
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.treeData = res.data.data
          } else {this.treeData = []}
        })
        .catch()
    this.getDropList('4')
  },
  methods: {
    currentChange(val, row) {
      this.currentPageChange(val, row, '/permission/page')
    },
//表格增删改查
    selectRow(val) {
      this.selectedRows(val)
    },
    search() {
      this.searchRow('/permission/page')
    },
    add() {
      this.dialogTitle = '新增权限'
      this.addRow()
    },
    update() {
      this.dialogTitle = '编辑权限'
      this.updateRow()
    },
    confirmEdit() {
      this.confirmEditRow('/permission/save', '/permission/page')
    },
    view(row) {
      this.dialogTitle = '查看权限信息'
      this.viewRow(row)
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      this.confirmDeleteRow('/permission/delete', '/permission/page')
    },
//关联权限范围，岗位，小组
//     relatedPermission() {
//       this.relatedName = 'permission'
//       this.related('','关联权限范围',{permissionId:this.selectedRow[0] && this.selectedRow[0].id})
//     },
    relatedPost() {
      this.relatedName = 'post'
      this.related('/permission-relation/selectPermissionAndRole','关联岗位',{permissionId:this.selectedRow[0] && this.selectedRow[0].id})
    },
    // relatedGroup() {
    //   this.relatedName = 'group'
    //   this.related('/permission-relation/selectPermissionAndTeam','关联小组',{permissionId:this.selectedRow[0] && this.selectedRow[0].id})
    // },
    confirmTransform() {
      this.confirmRelate('/permission-relation/saveTeamAndPermission',{
        type: '1',
        permissionIds: [this.selectedRow[0].id],
        relationIds: this.relatedValue,
        relationType:'1'
      })
      // if (this.relatedName === 'permission'){this.confirmRelate('', {
      //   type: '1',
      //   permissionIds: [this.selectedRow[0].id],
      //   relationIds: this.relatedValue,
      //   relationType:'1'
      // })}
      // else if (this.relatedName === 'post'){}
      // else if (this.relatedName === 'group'){this.confirmRelate('/permission-relation/saveTeamAndPermission',{
      //   type: '1',
      //   permissionIds: [this.selectedRow[0].id],
      //   relationIds: this.relatedValue,
      //   relationType:'2'
      // })}
    },
  }
}
</script>


<style scoped lang='scss'>
.permission-wrap {
  padding: 20px;
  .addForm {
    > .el-form-item {
      margin-bottom: 18px;
    }
    > .texArea{
      display: block;
      &::v-deep{
        margin-bottom: 0;
        .el-form-item__content{
          width: calc(100% - 110px);
        }
      }
    }
  }
}
</style>