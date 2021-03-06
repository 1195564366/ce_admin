<template>
  <div class="app-container">
    <avue-crud
      :data="data"
      :option="option"
      :table-loading="tableLoading"
      :page.sync="page"
      @current-change="currentChange"
      @refresh-change="refreshChange"
      @search-change="searchChange"
    >
      <template slot="status" slot-scope="{row: { status }}">
        <el-tag v-if="status === '5'" type="success">通过</el-tag>
        <el-tag v-else-if="status === '4'" type="danger">驳回</el-tag>
        <el-tag v-else-if="status === '3'" type="success">管理员审核通过</el-tag>
        <el-tag v-else-if="status === '2'" type="danger">管理员审核驳回</el-tag>
        <el-tag v-else>待审核</el-tag>
      </template>
      <template slot="statusForm" slot-scope="{row: { status }}">
        <el-tag v-if="status === '5'" type="success">通过</el-tag>
        <el-tag v-else-if="status === '4'" type="danger">驳回</el-tag>
        <el-tag v-else-if="status === '3'" type="success">管理员审核通过</el-tag>
        <el-tag v-else-if="status === '2'" type="danger">管理员审核驳回</el-tag>
        <el-tag v-else>待审核</el-tag>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" size="mini" @click="firstReviewedAdmin(scope.row)" icon="el-icon-s-check" v-if="scope.row.status === '1'">审核</el-button>
        <el-button type="text" size="mini" @click="firstReviewedLeader(scope.row)" icon="el-icon-s-check" v-if="['2', '3'].includes(scope.row.status)">审核</el-button>
        <!-- <el-button type="text" size="mini" @click="endReviewedAdmin(scope.row)" icon="el-icon-s-check" v-if="scope.row.status === '6'">复审审核</el-button>
        <el-button type="text" size="mini" @click="endReviewedLeader(scope.row)" icon="el-icon-s-check" v-if="['7', '8'].includes(scope.row.status)">复审审核</el-button> -->
      </template>
    </avue-crud>

    <firstReviewedAdmin ref="firstReviewedAdmin" @ok="getList" />
    <firstReviewedLeader ref="firstReviewedLeader" @ok="getList" />
    <endReviewedAdmin ref="endReviewedAdmin" @ok="getList" />
    <endReviewedLeader ref="endReviewedLeader" @ok="getList" />
  </div>
</template>

<script>
import { Dic } from "@utils";
import { Page } from "@minxin";
import firstReviewedAdmin from './firstReviewedAdmin';
import firstReviewedLeader from './firstReviewedLeader';
import endReviewedAdmin from './endReviewedAdmin';
import endReviewedLeader from './endReviewedLeader';

export default {
  components: {
    firstReviewedAdmin,
    firstReviewedLeader,
    endReviewedAdmin,
    endReviewedLeader
  },
  mixins: [Page],
  data() {
    return {
      search: {},
      tableLoading: false,
      data: [],
      option: {
        align: "center",
        menuAlign: "center",
        labelWidth: "125",
        viewBtn: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        span: 24,
        dialogWidth: '500',
        dialogClickModal: false,
        column: [
          {
            label: "产品名称",
            prop: "productName",
            search: true,
            rules: [
              {
                required: true,
                message: "输入产品名称",
              },
            ],
          },
          {
            label: "审核状态",
            prop: "status",
            type: "select",
            dicData: Dic.find('DIC009'),
            addDisplay: false,
            slot: true,
            fromSlot: true
          },
          {
            label: "国家",
            prop: "country",
            type: "select",
            search: true,
            dicData: Dic.find("DIC006"),
            rules: [
              {
                required: true,
                message: "选择国家",
              },
            ],
          },
          {
            label: "产品分类",
            prop: "productClass",
            type: "select",
            search: true,
            dicData: Dic.find("DIC007"),
            rules: [
              {
                required: true,
                message: "选择产品分类",
              },
            ],
          },
          {
            label: "产品型号",
            prop: "productModel",
            rules: [
              {
                required: true,
                message: "输入产品型号",
              },
            ],
          },
          {
            label: "证书/检测报告",
            prop: "productReport",
            hide: true,
            type: "upload",
            accept: "image/png, image/jpeg",
            listType: "picture-card",
            multiple: true,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            tip: "只能上传jpg/png图片，且不超过5M",
            action: "/common/uploadFile",
            uploadPreview: this.$onUploadPreview,
          },
          {
            label: "产品包装六面图",
            prop: "productPackingImg",
            hide: true,
            type: "upload",
            accept: "image/png, image/jpeg",
            listType: "picture-card",
            multiple: true,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            tip: "只能上传jpg/png图片，且不超过5M",
            action: "/common/uploadFile",
            uploadPreview: this.$onUploadPreview,
          },
          {
            label: "产品说明书",
            prop: "productInstructions",
            hide: true,
            type: "upload",
            accept: "image/png, image/jpeg",
            listType: "picture-card",
            multiple: true,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            tip: "只能上传jpg/png图片，且不超过5M",
            action: "/common/uploadFile",
            uploadPreview: this.$onUploadPreview,
          }
        ],
      },
      
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 列表
    async getList(cb = () => {}) {
      this.tableLoading = true;
      const result = await this.$fetchGet("/admin/product/index", {
        ...this.search,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      });
      this.tableLoading = false;
      this.data = result ? result.rows : [];
      this.page.total = result ? result.count : 0;
      cb();
    },
    // 分页
    currentChange() {
      this.getList();
    },
    // 搜索
    async searchChange(params, done) {
      this.search = params;
      this.page.currentPage = 1;
      this.getList(done);
    },
    // 重置
    refreshChange() {
      this.page.currentPage = 1;
      this.getList();
    },
    // admin初审
    firstReviewedAdmin (row) {
      this.$refs['firstReviewedAdmin'].open(row);
    },
    // leader初审
    firstReviewedLeader (row) {
      this.$refs['firstReviewedLeader'].open(row);
    },
    // admin复审
    endReviewedAdmin (row) {
      this.$refs['endReviewedAdmin'].open(row);
    },
    // leader复审
    endReviewedLeader (row) {
      this.$refs['endReviewedLeader'].open(row);
    }
  },
};
</script>

<style>
</style>