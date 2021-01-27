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
      <template slot-scope="scope" slot="menu">
        <el-button type="text" size="mini" @click="reviewedAdmin(scope.row)" icon="el-icon-s-check" v-if="scope.row.status === '1'">审核</el-button>
        <el-button type="text" size="mini" @click="reviewedLeader(scope.row)" icon="el-icon-s-check" v-if="['2', '3'].includes(scope.row.status)">审核</el-button>
      </template>
    </avue-crud>

    <reviewedAdmin ref="reviewedAdmin" @ok="getList" />
    <reviewedLeader ref="reviewedLeader" @ok="getList" />
  </div>
</template>

<script>
import { Dic } from "@utils";
import { Page } from "@minxin";
import reviewedAdmin from './reviewedAdmin';
import reviewedLeader from './reviewedLeader';

export default {
  components: {
    reviewedAdmin,
    reviewedLeader
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
            label: "店铺名称",
            prop: "shopName"
          },
          {
            label: "产品名称",
            prop: "productName"
          },
          {
            label: "国家",
            prop: "country",
            type: "select",
            dicData: Dic.find("DIC006")
          },
          {
            label: "亚马逊发货链接",
            prop: "asgl",
            type: "url"
          },
          {
            label: "品牌",
            prop: "brand",
          },
          {
            label: "ASIN",
            prop: "asin",
          },
          {
            label: "审核状态",
            prop: "status",
            type: "select",
            dicData: Dic.find('DIC012'),
            addDisplay: false
          },
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
      const result = await this.$fetchGet("/admin/certificate/index", {
        ...this.search,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      });
      this.tableLoading = false;
      this.data = result ? (result.rows.map(item => {
        const { id, status, asgl, asin, brand, product, shop, doc, ouDaiCe, rejectReason } = item;
        const { shopName } = shop;
        const { productName, country } = product;
        return {
          id,
          status,
          shopName,
          productName,
          asgl,
          asin,
          brand,
          country,
          doc,
          ouDaiCe,
          rejectReason
        }
      })) : [];
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
    // admin审核
    reviewedAdmin (row) {
      this.$refs['reviewedAdmin'].open(row);
    },
    // leader审核
    reviewedLeader (row) {
      this.$refs['reviewedLeader'].open(row);
    },
  },
};
</script>

<style>
</style>